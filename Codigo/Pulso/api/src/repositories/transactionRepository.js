const prisma = require('../config/database');

const includeRelacionamentos = {
    categoria: true,
    tags: { include: { tag: true } },
};

const buildWhere = (usuarioId, filtros = {}) => {
    const where = { usuarioId };

    if (filtros.periodo) {
        const [year, month] = filtros.periodo.split('-').map(Number);
        const inicio = new Date(year, month - 1, 1);
        const fim = new Date(year, month, 0, 23, 59, 59, 999);
        where.data = { gte: inicio, lte: fim };
    }

    if (filtros.categoria) {
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
    const where = buildWhere(usuarioId, filtros);
    const pageNum = Number(pagina) || 1;
    const limitNum = Number(limite) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [transacoes, total] = await Promise.all([
        prisma.transacao.findMany({
            where,
            include: includeRelacionamentos,
            orderBy: { data: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma.transacao.count({ where }),
    ]);

    return { transacoes, total };
};

const calcularAgregados = async (usuarioId, filtros) => {
    const where = buildWhere(usuarioId, filtros);

    return prisma.transacao.groupBy({
        by: ['tipo'],
        where,
        _sum: { valor: true },
        _count: { id: true },
    });
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

const excluirRecorrentesFilhas = async (paiId) => {
    await prisma.transacao.deleteMany({ where: { paiId } });
};

const listarRecorrentesMae = async () =>
    prisma.transacao.findMany({
        where: {
            recorrente: true,
            paiId: null,
            regraRecorrencia: { not: null },
        },
        include: includeRelacionamentos,
    });

module.exports = {
    buildWhere,
    listarPorUsuario,
    calcularAgregados,
    criar,
    vincularTags,
    desvincularTags,
    buscarPorId,
    atualizar,
    excluir,
    excluirRecorrentesFilhas,
    listarRecorrentesMae,
};
