const prisma = require('../config/database');
const AppError = require('../utils/appError');
const budgetRepository = require('../repositories/budgetRepository');
const categoryRepository = require('../repositories/categoryRepository');
const notificationService = require('./notificationService');
const { mapOrcamento, calcularStatusCategoria } = require('../utils/budgetMapper');
const {
    mesReferenciaFromQuery,
    mesReferenciaFromBody,
    mesReferenciaToQuery,
    mesReferenciaIso,
    mesAnterior,
    mesAtualString,
} = require('../utils/monthUtils');

const formatCurrency = (value) =>
    Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const obterRendaMensalPlanejada = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({
        where: { usuarioId },
        select: { rendaMensalPlanejada: true, valorSalario: true },
    });

    if (!config) return 0;
    const renda = config.rendaMensalPlanejada ?? config.valorSalario;
    return Number(renda ?? 0);
};

const listarOrcamentos = async (usuarioId, query) => {
    const mesReferencia = mesReferenciaFromQuery(query.mes);
    const orcamentos = await budgetRepository.buscarPorUsuarioEMes(usuarioId, mesReferencia);
    return orcamentos.map(mapOrcamento);
};

const obterStatusOrcamento = async (usuarioId, query) => {
    const mesReferencia = mesReferenciaFromQuery(query.mes);
    const [orcamentos, gastosMap, rendaMensalPlanejada, categoriasDespesa] = await Promise.all([
        budgetRepository.buscarPorUsuarioEMes(usuarioId, mesReferencia),
        budgetRepository.calcularGastosPorCategoria(usuarioId, mesReferencia),
        obterRendaMensalPlanejada(usuarioId),
        categoryRepository.listarPorUsuario(usuarioId, 'DESPESA'),
    ]);

    const categoriasComOrcamento = orcamentos.map((orcamento) => {
        const limiteValor = Number(orcamento.limiteValor);
        const gastoValor = gastosMap[orcamento.categoriaId] ?? 0;
        const percentualUsado = limiteValor > 0 ? (gastoValor / limiteValor) * 100 : 0;
        const restanteValor = limiteValor - gastoValor;

        return {
            categoriaId: orcamento.categoriaId,
            categoriaNome: orcamento.categoria.nome,
            categoriaIcone: orcamento.categoria.icone,
            categoriaCor: orcamento.categoria.cor,
            limiteValor,
            gastoValor,
            restanteValor,
            percentualUsado: Math.round(percentualUsado * 10) / 10,
            status: calcularStatusCategoria(percentualUsado),
        };
    });

    categoriasComOrcamento.sort((a, b) => b.percentualUsado - a.percentualUsado);

    const orcamentoTotal = categoriasComOrcamento.reduce((sum, item) => sum + item.limiteValor, 0);
    const gastoTotal = categoriasComOrcamento.reduce((sum, item) => sum + item.gastoValor, 0);
    const restanteTotal = orcamentoTotal - gastoTotal;
    const percentualUsado =
        orcamentoTotal > 0 ? Math.round((gastoTotal / orcamentoTotal) * 1000) / 10 : 0;

    const idsComOrcamento = new Set(orcamentos.map((item) => item.categoriaId));
    const categoriasSemOrcamento = categoriasDespesa
        .filter((categoria) => !idsComOrcamento.has(categoria.id))
        .map((categoria) => ({
            id: categoria.id,
            nome: categoria.nome,
            icone: categoria.icone,
            cor: categoria.cor,
        }));

    return {
        mesReferencia: mesReferenciaIso(mesReferencia),
        mesQuery: mesReferenciaToQuery(mesReferencia),
        rendaMensalPlanejada,
        resumo: {
            orcamentoTotal,
            gastoTotal,
            restanteTotal,
            percentualUsado,
        },
        categorias: categoriasComOrcamento,
        categoriasSemOrcamento,
    };
};

const validarCategoriasDoUsuario = async (usuarioId, categoriaIds) => {
    const categorias = await prisma.categoria.findMany({
        where: {
            id: { in: categoriaIds },
            usuarioId,
            tipo: 'DESPESA',
        },
    });

    if (categorias.length !== categoriaIds.length) {
        throw new AppError('Categoria não pertence ao usuário ou não é de despesa', 403);
    }

    return categorias;
};

const salvarOrcamentos = async (usuarioId, body) => {
    const mesReferencia = mesReferenciaFromBody(body.mesReferencia);
    const limites = body.limites ?? [];

    if (limites.length === 0) {
        await budgetRepository.deletarForaDaLista(usuarioId, mesReferencia, []);
        return { mesReferencia: mesReferenciaIso(mesReferencia), orcamentos: [] };
    }

    const categoriaIds = limites.map((item) => item.categoriaId);
    await validarCategoriasDoUsuario(usuarioId, categoriaIds);

    const orcamentos = [];
    for (const item of limites) {
        const orcamento = await budgetRepository.upsert({
            usuarioId,
            categoriaId: item.categoriaId,
            mesReferencia,
            limiteValor: item.limiteValor,
        });
        orcamentos.push(mapOrcamento(orcamento));
    }

    await budgetRepository.deletarForaDaLista(usuarioId, mesReferencia, categoriaIds);

    return {
        mesReferencia: mesReferenciaIso(mesReferencia),
        orcamentos,
    };
};

const removerOrcamento = async (usuarioId, orcamentoId) => {
    const orcamento = await budgetRepository.buscarPorId(orcamentoId, usuarioId);
    if (!orcamento) {
        throw new AppError('Orçamento não encontrado', 404);
    }
    await budgetRepository.deletar(orcamentoId);
};

const copiarOrcamento = async (usuarioId, body) => {
    const mesOrigem = mesReferenciaFromBody(body.mesOrigem);
    const mesDestino = mesReferenciaFromBody(body.mesDestino);

    const totalDestino = await budgetRepository.contarPorUsuarioEMes(usuarioId, mesDestino);
    if (totalDestino > 0) {
        throw new AppError(
            'Mês de destino já possui orçamentos. Edite-os ou remova antes de copiar.',
            409
        );
    }

    const totalOrigem = await budgetRepository.contarPorUsuarioEMes(usuarioId, mesOrigem);
    if (totalOrigem === 0) {
        throw new AppError('Nenhum orçamento encontrado no mês de origem', 404);
    }

    const copiados = await budgetRepository.copiarParaMes(usuarioId, mesOrigem, mesDestino);

    return {
        mesDestino: mesReferenciaIso(mesDestino),
        orcamentos: copiados.map(mapOrcamento),
        quantidadeCopiada: copiados.length,
    };
};

const criarNotificacaoOrcamento = async ({
    usuarioId,
    tipo,
    categoriaNome,
    gastoValor,
    limiteValor,
    categoriaId,
    mesReferencia,
    percentual,
}) => {
    const mesIso = mesReferenciaIso(mesReferencia);
    const metadados = { categoriaId, mesReferencia: mesIso, percentual };

    const duplicada = await notificationService.verificarNotificacaoDuplicada(
        usuarioId,
        tipo,
        metadados
    );
    if (duplicada) return null;

    const titulo =
        tipo === 'ALERTA_ORCAMENTO'
            ? `Orçamento de ${categoriaNome} atingiu 80%`
            : `Orçamento de ${categoriaNome} estourou!`;

    const mensagem =
        tipo === 'ALERTA_ORCAMENTO'
            ? `Você gastou ${formatCurrency(gastoValor)} de ${formatCurrency(limiteValor)} planejados.`
            : `Você gastou ${formatCurrency(gastoValor)} de ${formatCurrency(limiteValor)} planejados.`;

    return notificationService.criarNotificacao(usuarioId, {
        tipo,
        titulo,
        mensagem,
        linkAcao: '/budget',
        metadados,
    });
};

const verificarLimitesENotificar = async () => {
    const mesReferencia = mesReferenciaFromQuery(mesAtualString());
    const usuarioIds = await budgetRepository.buscarUsuariosComOrcamentoNoMes(mesReferencia);
    let criadas = 0;

    for (const usuarioId of usuarioIds) {
        const status = await obterStatusOrcamento(usuarioId, { mes: mesReferenciaToQuery(mesReferencia) });

        for (const categoria of status.categorias) {
            if (categoria.percentualUsado >= 100) {
                const notif = await criarNotificacaoOrcamento({
                    usuarioId,
                    tipo: 'ORCAMENTO_ESTOURADO',
                    categoriaNome: categoria.categoriaNome,
                    gastoValor: categoria.gastoValor,
                    limiteValor: categoria.limiteValor,
                    categoriaId: categoria.categoriaId,
                    mesReferencia,
                    percentual: Math.round(categoria.percentualUsado),
                });
                if (notif) criadas += 1;
            } else if (categoria.percentualUsado >= 80) {
                const notif = await criarNotificacaoOrcamento({
                    usuarioId,
                    tipo: 'ALERTA_ORCAMENTO',
                    categoriaNome: categoria.categoriaNome,
                    gastoValor: categoria.gastoValor,
                    limiteValor: categoria.limiteValor,
                    categoriaId: categoria.categoriaId,
                    mesReferencia,
                    percentual: Math.round(categoria.percentualUsado),
                });
                if (notif) criadas += 1;
            }
        }
    }

    return { criadas, usuariosVerificados: usuarioIds.length };
};

module.exports = {
    listarOrcamentos,
    obterStatusOrcamento,
    salvarOrcamentos,
    removerOrcamento,
    copiarOrcamento,
    verificarLimitesENotificar,
};
