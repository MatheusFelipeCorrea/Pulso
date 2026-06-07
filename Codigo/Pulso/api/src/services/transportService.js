const AppError = require('../utils/appError');
const transportRepository = require('../repositories/transportRepository');
const categoryRepository = require('../repositories/categoryRepository');
const {
    periodoAtual,
    intervaloDoPeriodo,
    calcularProximaRecarga,
} = require('../utils/periodUtils');

const MODOS_VT_AUTOMATICOS = new Set(['ESTAGIARIO', 'CLT']);
const MSG_BLOQUEIO =
    'Vale Transporte não está disponível para o seu perfil ou não foi habilitado.';
const MSG_BLOQUEIO_PJ =
    'Habilite o Vale Transporte na tela de VT para usar esta funcionalidade.';
const MSG_CLT_WARNING =
    'CLT: VT é descontado em folha (6%). Venda pode gerar irregularidades.';

const formatBRL = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const toPositiveInt = (value, fallback) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};

const podeUsarVt = (config) => {
    if (MODOS_VT_AUTOMATICOS.has(config.modoUso)) return true;
    if (config.modoUso === 'PJ') return config.vtHabilitado === true;
    return false;
};

const assertModoPermitido = (config) => {
    if (podeUsarVt(config)) return;

    const message =
        config.modoUso === 'PJ' && config.vtHabilitado !== true
            ? MSG_BLOQUEIO_PJ
            : MSG_BLOQUEIO;
    throw new AppError(message, 403);
};

const obterSaldoVt = async (usuarioId, periodo) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }

    assertModoPermitido(config);

    const ref = periodo ?? periodoAtual();
    const { inicio, fim } = intervaloDoPeriodo(ref);

    const [recebido, usadoInfo, vendidoNominal] = await Promise.all([
        transportRepository.calcularRecebidoVt(usuarioId, inicio, fim),
        transportRepository.calcularUsadoVt(usuarioId, inicio, fim),
        transportRepository.calcularVendidoNominalVt(usuarioId, inicio, fim),
    ]);

    const saldoRestante = recebido - usadoInfo.total - vendidoNominal;
    const proximaRecarga = calcularProximaRecarga(ref);

    return {
        recebido: recebido.toFixed(2),
        usado: usadoInfo.total.toFixed(2),
        passagensUsadas: usadoInfo.passagens,
        vendidoNominal: vendidoNominal.toFixed(2),
        saldoRestante: saldoRestante.toFixed(2),
        valorPadraoPassagem: config.valorPadraoPassagem
            ? Number(config.valorPadraoPassagem).toFixed(2)
            : null,
        proximaRecarga,
    };
};

const mapVenda = (venda) => {
    const nominal = Number(venda.valorNominal);
    const recebido = Number(venda.valorRecebido);
    return {
        id: venda.id,
        dataVenda: venda.dataVenda.toISOString(),
        nomeComprador: venda.nomeComprador,
        valorNominal: nominal.toFixed(2),
        valorRecebido: recebido.toFixed(2),
        diferenca: (recebido - nominal).toFixed(2),
    };
};

const registrarVendaVt = async (usuarioId, dados) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }

    assertModoPermitido(config);

    const dataVenda =
        dados.dataVenda instanceof Date ? dados.dataVenda : new Date(dados.dataVenda);
    if (Number.isNaN(dataVenda.getTime())) {
        throw new AppError('Data da venda inválida', 400);
    }

    const saldoAtual = await obterSaldoVt(usuarioId, periodoAtual());
    const saldoNum = Number(saldoAtual.saldoRestante);

    if (dados.valorNominal > saldoNum + 0.001) {
        throw new AppError(
            `Saldo insuficiente. Você tem apenas ${formatBRL(saldoNum)} disponível.`,
            400
        );
    }

    const categoriaOutros = await categoryRepository.buscarPorNome(
        usuarioId,
        'Outros',
        'RECEITA'
    );
    if (!categoriaOutros) {
        throw new AppError('Categoria "Outros" (receita) não encontrada', 500);
    }

    const venda = await transportRepository.criarVendaComTransacao({
        vendaData: {
            usuarioId,
            nomeComprador: dados.nomeComprador.trim(),
            dataVenda,
            valorNominal: dados.valorNominal,
            valorRecebido: dados.valorRecebido,
        },
        transacaoData: {
            usuarioId,
            categoriaId: categoriaOutros.id,
            tipo: 'RECEITA',
            recurso: 'DINHEIRO',
            valor: dados.valorRecebido,
            descricao: `Venda de VT para ${dados.nomeComprador.trim()}`,
            data: dataVenda,
            recorrente: false,
        },
    });

    const diferenca = dados.valorRecebido - dados.valorNominal;
    const novoSaldoVt = saldoNum - dados.valorNominal;

    const resposta = {
        ...mapVenda(venda),
        diferenca: diferenca.toFixed(2),
        novoSaldoVt: novoSaldoVt.toFixed(2),
    };

    if (config.modoUso === 'CLT') {
        resposta.warning = MSG_CLT_WARNING;
    }

    return resposta;
};

const listarVendas = async (usuarioId, { periodo, pagina = 1, limite = 10 }) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }
    assertModoPermitido(config);

    const paginaNum = toPositiveInt(pagina, 1);
    const limiteNum = toPositiveInt(limite, 10);

    const ref = periodo ?? periodoAtual();
    const { inicio, fim } = intervaloDoPeriodo(ref);
    const skip = (paginaNum - 1) * limiteNum;

    const { vendas, total, todasNoPeriodo } = await transportRepository.listarVendas(
        usuarioId,
        inicio,
        fim,
        skip,
        limiteNum
    );

    const vendasMapeadas = vendas.map(mapVenda);
    let totalNominal = 0;
    let totalRecebido = 0;
    for (const v of todasNoPeriodo) {
        totalNominal += Number(v.valorNominal);
        totalRecebido += Number(v.valorRecebido);
    }

    return {
        vendas: vendasMapeadas,
        totais: {
            totalNominal: totalNominal.toFixed(2),
            totalRecebido: totalRecebido.toFixed(2),
            perdaTotal: (totalRecebido - totalNominal).toFixed(2),
        },
        paginacao: {
            total,
            paginas: Math.max(1, Math.ceil(total / limiteNum)),
            paginaAtual: paginaNum,
        },
    };
};

const registrarUsoVt = async (usuarioId, dados) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }
    assertModoPermitido(config);

    const data = dados.data instanceof Date ? dados.data : new Date(dados.data);
    if (Number.isNaN(data.getTime())) {
        throw new AppError('Data inválida', 400);
    }

    const totalUsado = dados.quantidade * dados.valorPorPassagem;
    const saldoAtual = await obterSaldoVt(usuarioId, periodoAtual());
    const saldoNum = Number(saldoAtual.saldoRestante);

    if (totalUsado > saldoNum + 0.001) {
        throw new AppError(
            `Saldo insuficiente. Você tem apenas ${formatBRL(saldoNum)} disponível.`,
            400
        );
    }

    const uso = await transportRepository.criarUsoVt({
        usuarioId,
        quantidade: dados.quantidade,
        valorPorPassagem: dados.valorPorPassagem,
        data,
    });

    if (dados.salvarValorPadrao) {
        await transportRepository.atualizarValorPadraoPassagem(
            usuarioId,
            dados.valorPorPassagem
        );
    }

    return {
        id: uso.id,
        quantidade: uso.quantidade,
        valorPorPassagem: Number(uso.valorPorPassagem).toFixed(2),
        data: uso.data.toISOString(),
        totalUsado: totalUsado.toFixed(2),
        novoSaldoVt: (saldoNum - totalUsado).toFixed(2),
    };
};

const listarUsos = async (usuarioId, { periodo, pagina = 1, limite = 10 }) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }
    assertModoPermitido(config);

    const paginaNum = toPositiveInt(pagina, 1);
    const limiteNum = toPositiveInt(limite, 10);

    const ref = periodo ?? periodoAtual();
    const { inicio, fim } = intervaloDoPeriodo(ref);
    const skip = (paginaNum - 1) * limiteNum;

    const { usos, total, todosNoPeriodo } = await transportRepository.listarUsos(
        usuarioId,
        inicio,
        fim,
        skip,
        limiteNum
    );

    const usosMapeados = usos.map((uso) => {
        const valor = Number(uso.valorPorPassagem);
        const totalLinha = uso.quantidade * valor;
        return {
            id: uso.id,
            data: uso.data.toISOString(),
            quantidade: uso.quantidade,
            valorPorPassagem: valor.toFixed(2),
            total: totalLinha.toFixed(2),
        };
    });

    let totalPassagens = 0;
    let totalGasto = 0;
    for (const u of todosNoPeriodo) {
        totalPassagens += u.quantidade;
        totalGasto += u.quantidade * Number(u.valorPorPassagem);
    }

    return {
        usos: usosMapeados,
        totais: {
            totalPassagens,
            totalGasto: totalGasto.toFixed(2),
        },
        paginacao: {
            total,
            paginas: Math.max(1, Math.ceil(total / limiteNum)),
            paginaAtual: paginaNum,
        },
    };
};

const atualizarVtHabilitado = async (usuarioId, vtHabilitado) => {
    const config = await transportRepository.buscarConfiguracao(usuarioId);
    if (!config) {
        throw new AppError('Configuração do usuário não encontrada', 404);
    }

    if (config.modoUso !== 'PJ') {
        throw new AppError(
            'Preferência de Vale Transporte só pode ser alterada por usuários PJ.',
            400
        );
    }

    await transportRepository.atualizarVtHabilitado(usuarioId, vtHabilitado);

    return { vtHabilitado };
};

module.exports = {
    obterSaldoVt,
    registrarVendaVt,
    listarVendas,
    registrarUsoVt,
    listarUsos,
    atualizarVtHabilitado,
    MSG_BLOQUEIO,
    MSG_BLOQUEIO_PJ,
};
