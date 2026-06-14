const AppError = require('../utils/appError');
const debtRepository = require('../repositories/debtRepository');
const { mapDivida } = require('../utils/debtMapper');
const { mapPagamento } = require('../utils/debtPaymentMapper');
const { formatPersonName } = require('../utils/personName');
const { calcSaldoDivida, estaTotalmentePaga, isDividaQuitada, roundMoney } = require('../utils/debtBalanceUtils');
const {
    formatDateOnly,
    parseVencimentoDate,
    startOfDayInTimezone,
    todayInTimezone,
} = require('../utils/dateTimezone');

const parseDate = (input) => {
    if (input instanceof Date) return input;
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return parseVencimentoDate(input);
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        throw new AppError('Data inválida', 400);
    }
    return parsed;
};

const validarDataEmprestimo = (dataEmprestimo) => {
    const parsed = parseDate(dataEmprestimo);
    const hoje = todayInTimezone();
    const dataOnly = formatDateOnly(parsed);

    if (dataOnly > hoje) {
        throw new AppError('Data do empréstimo não pode ser futura', 400);
    }

    return parsed;
};

const validarDataPagamento = (dataPagamento) => {
    const parsed = parseDate(dataPagamento);
    const hoje = todayInTimezone();
    const dataOnly = formatDateOnly(parsed);

    if (dataOnly > hoje) {
        throw new AppError('Data do pagamento não pode ser futura', 400);
    }

    return parsed;
};

const validarPrazoDevolucao = (prazoDevolucao, dataEmprestimo) => {
    if (prazoDevolucao == null || prazoDevolucao === '') return null;

    const prazo = parseDate(prazoDevolucao);
    const emprestimo = parseDate(dataEmprestimo);

    if (startOfDayInTimezone(prazo) <= startOfDayInTimezone(emprestimo)) {
        throw new AppError('Prazo de devolução deve ser posterior à data do empréstimo', 400);
    }

    return prazo;
};

const validarObservacao = (observacao, max = 250) => {
    if (observacao == null || observacao === '') return null;
    const texto = String(observacao).trim();
    if (texto.length > max) {
        throw new AppError(`Observação deve ter no máximo ${max} caracteres`, 400);
    }
    return texto || null;
};

const buscarDividaComPagamentos = async (dividaId, usuarioId) => {
    const divida = await debtRepository.buscarPorId(dividaId, usuarioId, { comPagamentos: true });
    if (!divida) {
        throw new AppError('Dívida não encontrada', 404);
    }
    return divida;
};

const sincronizarQuitacao = async (divida) => {
    const pagamentos = divida.pagamentos ?? [];
    const totalmentePaga = estaTotalmentePaga(divida, pagamentos);

    if (totalmentePaga) {
        if (!divida.quitada) {
            const atualizada = await debtRepository.quitar(divida.id, divida.usuarioId);
            return { ...atualizada, pagamentos };
        }
        return divida;
    }

    if (divida.quitada && pagamentos.length > 0) {
        const reaberta = await debtRepository.reabrir(divida.id, divida.usuarioId);
        return { ...reaberta, pagamentos };
    }

    return divida;
};

const montarResumo = (dividas) => {
    const resumo = {
        meDevem: { total: '0.00', quantidade: 0 },
        euDevo: { total: '0.00', quantidade: 0 },
    };

    for (const divida of dividas) {
        const { valorRestante } = calcSaldoDivida(divida, divida.pagamentos);
        if (valorRestante <= 0) continue;

        const restante = valorRestante.toFixed(2);
        if (divida.direcao === 'ME_DEVEM') {
            resumo.meDevem.total = (Number(resumo.meDevem.total) + valorRestante).toFixed(2);
            resumo.meDevem.quantidade += 1;
        } else if (divida.direcao === 'EU_DEVO') {
            resumo.euDevo.total = (Number(resumo.euDevo.total) + valorRestante).toFixed(2);
            resumo.euDevo.quantidade += 1;
        }
    }

    return resumo;
};

const listarDividas = async (usuarioId, filtros) => {
    const pagina = Number(filtros.pagina) || 1;
    const limite = Number(filtros.limite) || 10;

    const { dividas, total } = await debtRepository.listarPorUsuario(usuarioId, filtros, {
        pagina,
        limite,
    });

    const dividasSincronizadas = await Promise.all(dividas.map(sincronizarQuitacao));
    const dividasFiltradas = dividasSincronizadas.filter((divida) => {
        const pagamentos = divida.pagamentos ?? [];
        const quitada = isDividaQuitada(divida, pagamentos);

        if (filtros.quitada === true) return quitada;
        if (filtros.quitada === false) {
            if (quitada) return false;
            if (filtros.direcao && divida.direcao !== filtros.direcao) return false;
        }
        return true;
    });

    const paginas = Math.max(1, Math.ceil(total / limite));

    return {
        dividas: dividasFiltradas.map(mapDivida),
        total,
        paginas,
        pagina,
    };
};

const calcularResumo = async (usuarioId) => {
    const [dividasRaw, contadores] = await Promise.all([
        debtRepository.listarAtivasComPagamentos(usuarioId),
        debtRepository.contarPorAba(usuarioId),
    ]);

    const dividas = await Promise.all(dividasRaw.map(sincronizarQuitacao));

    return {
        ...montarResumo(dividas.filter((divida) => !divida.quitada)),
        contadores,
    };
};

const criarDivida = async (usuarioId, dados) => {
    const dataEmprestimo = validarDataEmprestimo(dados.dataEmprestimo);
    const prazoDevolucao = validarPrazoDevolucao(dados.prazoDevolucao, dataEmprestimo);
    const observacao = validarObservacao(dados.observacao);

    const divida = await debtRepository.criar({
        usuarioId,
        direcao: dados.direcao,
        nomePessoa: formatPersonName(dados.nomePessoa),
        valor: dados.valor,
        dataEmprestimo,
        prazoDevolucao,
        observacao,
    });

    return mapDivida({ ...divida, pagamentos: [] });
};

const editarDivida = async (usuarioId, dividaId, dados) => {
    const divida = await buscarDividaComPagamentos(dividaId, usuarioId);
    if (divida.quitada) {
        throw new AppError('Não é possível editar uma dívida já quitada', 400);
    }

    const payload = {};

    if (dados.direcao !== undefined) {
        payload.direcao = dados.direcao;
    }
    if (dados.nomePessoa !== undefined) {
        payload.nomePessoa = formatPersonName(dados.nomePessoa);
    }
    if (dados.valor !== undefined) {
        const { valorPago } = calcSaldoDivida(divida, divida.pagamentos);
        if (roundMoney(dados.valor) < valorPago) {
            throw new AppError('Valor total não pode ser menor que o valor já pago', 400);
        }
        payload.valor = dados.valor;
    }
    if (dados.observacao !== undefined) {
        payload.observacao = validarObservacao(dados.observacao);
    }

    const dataEmprestimo =
        dados.dataEmprestimo !== undefined
            ? validarDataEmprestimo(dados.dataEmprestimo)
            : divida.dataEmprestimo;

    if (dados.dataEmprestimo !== undefined) {
        payload.dataEmprestimo = dataEmprestimo;
    }

    if (dados.prazoDevolucao !== undefined) {
        payload.prazoDevolucao = validarPrazoDevolucao(dados.prazoDevolucao, dataEmprestimo);
    }

    const atualizada = await debtRepository.atualizar(dividaId, usuarioId, payload);
    return mapDivida({ ...atualizada, pagamentos: divida.pagamentos });
};

const registrarPagamento = async (usuarioId, dividaId, dados) => {
    const divida = await buscarDividaComPagamentos(dividaId, usuarioId);
    if (divida.quitada) {
        throw new AppError('Dívida já está quitada', 400);
    }

    const valorPagamento = roundMoney(dados.valor);
    if (valorPagamento <= 0) {
        throw new AppError('Valor do pagamento deve ser maior que zero', 400);
    }

    const { valorRestante } = calcSaldoDivida(divida, divida.pagamentos);
    if (valorPagamento > valorRestante) {
        throw new AppError('Valor do pagamento não pode ser maior que o saldo restante', 400);
    }

    const pagamento = await debtRepository.criarPagamento({
        dividaId,
        valor: valorPagamento,
        dataPagamento: validarDataPagamento(dados.dataPagamento),
        observacao: validarObservacao(dados.observacao),
    });

    const pagamentos = [pagamento, ...divida.pagamentos];
    const dividaAtualizada = await sincronizarQuitacao({ ...divida, pagamentos });
    const mapeada = mapDivida(dividaAtualizada);

    return {
        divida: mapeada,
        pagamento: mapPagamento(pagamento),
    };
};

const excluirPagamento = async (usuarioId, dividaId, pagamentoId) => {
    const divida = await buscarDividaComPagamentos(dividaId, usuarioId);
    const pagamento = await debtRepository.buscarPagamento(pagamentoId, dividaId, usuarioId);
    if (!pagamento) {
        throw new AppError('Pagamento não encontrado', 404);
    }

    await debtRepository.excluirPagamento(pagamentoId);
    const pagamentos = divida.pagamentos.filter((item) => item.id !== pagamentoId);
    const dividaAtualizada = await sincronizarQuitacao({ ...divida, pagamentos });
    return mapDivida(dividaAtualizada);
};

const quitarDivida = async (usuarioId, dividaId) => {
    const divida = await buscarDividaComPagamentos(dividaId, usuarioId);
    if (divida.quitada) {
        throw new AppError('Dívida já está quitada', 400);
    }

    const { valorRestante } = calcSaldoDivida(divida, divida.pagamentos);

    if (valorRestante > 0) {
        return registrarPagamento(usuarioId, dividaId, {
            valor: valorRestante,
            dataPagamento: new Date().toISOString(),
            observacao: 'Quitação do saldo restante',
        }).then((result) => result.divida);
    }

    const sincronizada = await sincronizarQuitacao(divida);
    return mapDivida(sincronizada);
};

const reabrirDivida = async (usuarioId, dividaId) => {
    const divida = await buscarDividaComPagamentos(dividaId, usuarioId);
    if (!divida.quitada) {
        throw new AppError('Dívida já está em aberto', 400);
    }

    const { valorPago, valorTotal } = calcSaldoDivida(divida, divida.pagamentos);
    if (valorPago >= valorTotal && divida.pagamentos.length > 0) {
        throw new AppError(
            'Dívida quitada por pagamentos parciais. Remova um pagamento para reabrir',
            400
        );
    }

    const reaberta = await debtRepository.reabrir(dividaId, usuarioId);
    return mapDivida({ ...reaberta, pagamentos: divida.pagamentos });
};

const excluirDivida = async (usuarioId, dividaId) => {
    const divida = await debtRepository.buscarPorId(dividaId, usuarioId);
    if (!divida) {
        throw new AppError('Dívida não encontrada', 404);
    }
    if (divida.quitada) {
        throw new AppError(
            'Não é possível deletar uma dívida quitada. A limpeza é automática após 180 dias',
            400
        );
    }

    await debtRepository.excluir(dividaId, usuarioId);
};

module.exports = {
    listarDividas,
    calcularResumo,
    criarDivida,
    editarDivida,
    registrarPagamento,
    excluirPagamento,
    quitarDivida,
    reabrirDivida,
    excluirDivida,
};
