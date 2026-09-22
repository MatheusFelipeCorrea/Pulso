const prisma = require('../config/database');
const { startOfDayInTimezone, endOfDayInTimezone } = require('../utils/dateTimezone');
const { AJUSTE_SALDO_IMPORTACAO_DESCRICAO } = require('../utils/importBeneficioUtils');

const whereExcluiAjusteSaldoImportacao = {
    NOT: { descricao: AJUSTE_SALDO_IMPORTACAO_DESCRICAO },
};

const mergeWhere = (base, extra) => {
    if (!extra || !Object.keys(extra).length) return base;
    return { AND: [base, extra] };
};

const includeRelacionamentos = {
    categoria: true,
    tags: { include: { tag: true } },
};

const buildWhere = (usuarioId, filtros = {}) => {
    const where = { usuarioId };

    if (filtros.dataInicio || filtros.dataFim) {
        where.data = {};
        if (filtros.dataInicio) {
            where.data.gte = startOfDayInTimezone(filtros.dataInicio);
        }
        if (filtros.dataFim) {
            where.data.lte = endOfDayInTimezone(filtros.dataFim);
        }
    } else if (filtros.periodo) {
        const [year, month] = filtros.periodo.split('-').map(Number);
        const inicio = new Date(year, month - 1, 1);
        const fim = new Date(year, month, 0, 23, 59, 59, 999);
        where.data = { gte: inicio, lte: fim };
    }

    if (filtros.categoriaNome) {
        where.categoria = { nome: filtros.categoriaNome, usuarioId };
    } else if (filtros.categoria) {
        where.categoriaId = filtros.categoria;
    }

    if (filtros.tipo && filtros.tipo !== 'TODOS') {
        where.tipo = filtros.tipo;
    }

    if (filtros.recurso && filtros.recurso !== 'TODOS') {
        where.recurso = filtros.recurso;
    }

    if (filtros.busca?.trim()) {
        const busca = filtros.busca.trim();
        where.OR = [
            { descricao: { contains: busca, mode: 'insensitive' } },
            {
                tags: {
                    some: {
                        tag: { nome: { contains: busca, mode: 'insensitive' } },
                    },
                },
            },
        ];
    }

    return where;
};

const listarPorUsuario = async (usuarioId, filtros, { pagina = 1, limite = 10 } = {}) => {
    const where = mergeWhere(buildWhere(usuarioId, filtros), whereExcluiAjusteSaldoImportacao);
    const pageNum = Number(pagina) || 1;
    const limitNum = Number(limite) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [transacoes, total] = await Promise.all([
        prisma.transacao.findMany({
            where,
            include: includeRelacionamentos,
            // desempate por criadoEm/id: várias transações no mesmo dia têm `data` idêntica
            // (mesmo timestamp), e sem um critério de desempate estável a paginação
            // duplicava/pulava linhas entre páginas
            orderBy: [{ data: 'desc' }, { criadoEm: 'desc' }, { id: 'desc' }],
            skip,
            take: limitNum,
        }),
        prisma.transacao.count({ where }),
    ]);

    return { transacoes, total };
};

const calcularAgregados = async (usuarioId, filtros) => {
    const where = mergeWhere(buildWhere(usuarioId, filtros), whereExcluiAjusteSaldoImportacao);

    return prisma.transacao.groupBy({
        by: ['tipo'],
        where,
        _sum: { valor: true },
        _count: { id: true },
    });
};

const listarRecursosDistintos = async (usuarioId, filtros) => {
    const where = mergeWhere(buildWhere(usuarioId, filtros), whereExcluiAjusteSaldoImportacao);

    const rows = await prisma.transacao.findMany({
        where,
        select: { recurso: true },
        distinct: ['recurso'],
    });

    return rows.map((row) => row.recurso);
};

const criar = async (dados) =>
    prisma.transacao.create({
        data: dados,
        include: includeRelacionamentos,
    });

const vincularTags = async (transacaoId, tagIds) => {
    if (!tagIds?.length) return;

    await prisma.transacaoTag.createMany({
        data: tagIds.map((tagId) => ({ transacaoId, tagId })),
        skipDuplicates: true,
    });
};

const desvincularTags = async (transacaoId) => {
    await prisma.transacaoTag.deleteMany({ where: { transacaoId } });
};

const buscarPorId = async (transacaoId, usuarioId) =>
    prisma.transacao.findFirst({
        where: { id: transacaoId, usuarioId },
        include: includeRelacionamentos,
    });

const atualizar = async (transacaoId, dados) =>
    prisma.transacao.update({
        where: { id: transacaoId },
        data: dados,
        include: includeRelacionamentos,
    });

const excluir = async (transacaoId) => {
    await prisma.transacao.delete({ where: { id: transacaoId } });
};

const excluirRecorrentesFilhasAPartirDe = async (paiId, dataCorte) => {
    const cutoff = new Date(dataCorte);
    cutoff.setHours(0, 0, 0, 0);

    await prisma.transacao.deleteMany({
        where: {
            paiId,
            data: { gte: cutoff },
        },
    });
};

const encerrarRecorrencia = async (transacaoId, regraRecorrencia) =>
    prisma.transacao.update({
        where: { id: transacaoId },
        data: {
            recorrente: false,
            regraRecorrencia,
        },
    });

const listarRecorrentesMae = async () =>
    prisma.transacao.findMany({
        where: {
            recorrente: true,
            paiId: null,
            regraRecorrencia: { not: null },
        },
        include: includeRelacionamentos,
    });

const listarDescricoesPorTipo = async (usuarioId, tipo, limite = 300) =>
    prisma.transacao.findMany({
        where: { usuarioId, tipo, descricao: { not: null }, categoriaId: { not: null } },
        select: { descricao: true, categoriaId: true },
        orderBy: { data: 'desc' },
        take: limite,
    });

const listarParaDedupeImportacao = async (usuarioId, limite = 5000) =>
    prisma.transacao.findMany({
        where: { usuarioId, tipo: { in: ['RECEITA', 'DESPESA'] } },
        select: { data: true, valor: true, descricao: true },
        orderBy: { data: 'desc' },
        take: limite,
    });

const listarTransacoesRecurso = async (usuarioId, recurso, { ate, antesDe } = {}) => {
    const where = {
        usuarioId,
        OR: [{ recurso }, { recursoDestino: recurso }],
    };

    if (ate || antesDe) {
        where.data = {};
        if (ate) {
            where.data.lte = endOfDayInTimezone(ate);
        }
        if (antesDe) {
            where.data.lt = startOfDayInTimezone(antesDe);
        }
    }

    return prisma.transacao.findMany({
        where,
        select: {
            tipo: true,
            valor: true,
            recurso: true,
            recursoDestino: true,
        },
    });
};

const listarPorRecurso = async (usuarioId, recurso) => listarTransacoesRecurso(usuarioId, recurso);

module.exports = {
    buildWhere,
    mergeWhere,
    whereExcluiAjusteSaldoImportacao,
    listarPorUsuario,
    calcularAgregados,
    listarRecursosDistintos,
    criar,
    vincularTags,
    desvincularTags,
    buscarPorId,
    atualizar,
    excluir,
    excluirRecorrentesFilhasAPartirDe,
    encerrarRecorrencia,
    listarRecorrentesMae,
    listarDescricoesPorTipo,
    listarParaDedupeImportacao,
    listarPorRecurso,
    listarTransacoesRecurso,
};
