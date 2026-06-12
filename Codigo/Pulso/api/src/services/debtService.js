const AppError = require('../utils/appError');
const debtRepository = require('../repositories/debtRepository');
const { mapDivida } = require('../utils/debtMapper');
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

const validarPrazoDevolucao = (prazoDevolucao, dataEmprestimo) => {
    if (prazoDevolucao == null || prazoDevolucao === '') return null;

    const prazo = parseDate(prazoDevolucao);
    const emprestimo = parseDate(dataEmprestimo);

    if (startOfDayInTimezone(prazo) <= startOfDayInTimezone(emprestimo)) {
        throw new AppError('Prazo de devolução deve ser posterior à data do empréstimo', 400);
    }

    return prazo;
};

const validarObservacao = (observacao) => {
    if (observacao == null || observacao === '') return null;
    const texto = String(observacao).trim();
    if (texto.length > 250) {
        throw new AppError('Observação deve ter no máximo 250 caracteres', 400);
    }
    return texto || null;
};

const montarResumo = (agregados) => {
    const resumo = {
        meDevem: { total: '0.00', quantidade: 0 },
        euDevo: { total: '0.00', quantidade: 0 },
    };

    for (const item of agregados) {
        const total = Number(item._sum.valor ?? 0).toFixed(2);
        const quantidade = item._count.id;
        if (item.direcao === 'ME_DEVEM') {
            resumo.meDevem = { total, quantidade };
        } else if (item.direcao === 'EU_DEVO') {
            resumo.euDevo = { total, quantidade };
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

    const paginas = Math.max(1, Math.ceil(total / limite));

    return {
        dividas: dividas.map(mapDivida),
        total,
        paginas,
        pagina,
    };
};

const calcularResumo = async (usuarioId) => {
    const agregados = await debtRepository.calcularAgregados(usuarioId);
    return montarResumo(agregados);
};

const criarDivida = async (usuarioId, dados) => {
    const dataEmprestimo = validarDataEmprestimo(dados.dataEmprestimo);
    const prazoDevolucao = validarPrazoDevolucao(dados.prazoDevolucao, dataEmprestimo);
    const observacao = validarObservacao(dados.observacao);

    const divida = await debtRepository.criar({
        usuarioId,
        direcao: dados.direcao,
        nomePessoa: dados.nomePessoa.trim(),
        valor: dados.valor,
        dataEmprestimo,
        prazoDevolucao,
        observacao,
    });

    return mapDivida(divida);
};

const editarDivida = async (usuarioId, dividaId, dados) => {
    const divida = await debtRepository.buscarPorId(dividaId, usuarioId);
    if (!divida) {
        throw new AppError('Dívida não encontrada', 404);
    }
    if (divida.quitada) {
        throw new AppError('Não é possível editar uma dívida já quitada', 400);
    }

    const payload = {};

    if (dados.nomePessoa !== undefined) {
        payload.nomePessoa = dados.nomePessoa.trim();
    }
    if (dados.valor !== undefined) {
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
    return mapDivida(atualizada);
};

const quitarDivida = async (usuarioId, dividaId) => {
    const divida = await debtRepository.buscarPorId(dividaId, usuarioId);
    if (!divida) {
        throw new AppError('Dívida não encontrada', 404);
    }
    if (divida.quitada) {
        throw new AppError('Dívida já está quitada', 400);
    }

    const atualizada = await debtRepository.quitar(dividaId, usuarioId);
    return mapDivida(atualizada);
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
    quitarDivida,
    excluirDivida,
};
