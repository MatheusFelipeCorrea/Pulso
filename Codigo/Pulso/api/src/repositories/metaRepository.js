const prisma = require('../config/database');
const { startOfDayInTimezone, endOfDayInTimezone } = require('../utils/dateTimezone');

const includeAportes = {
    aportes: {
        orderBy: { data: 'desc' },
    },
};

const buildWhere = (usuarioId, filtros = {}) => {
    const where = { usuarioId };

    if (filtros.status) {
        where.status = filtros.status;
    }

    if (filtros.tipo) {
        where.tipo = filtros.tipo;
    }

    if (filtros.busca?.trim()) {
        where.nome = { contains: filtros.busca.trim(), mode: 'insensitive' };
    }

    if (filtros.prazoInicio || filtros.prazoFim) {
        where.prazo = {};
        if (filtros.prazoInicio) {
            where.prazo.gte = startOfDayInTimezone(filtros.prazoInicio);
        }
        if (filtros.prazoFim) {
            where.prazo.lte = endOfDayInTimezone(filtros.prazoFim);
        }
    }

    return where;
};

const listarPorUsuario = async (usuarioId, filtros, { pagina = 1, limite = 10 } = {}) => {
    const where = buildWhere(usuarioId, filtros);
    const pageNum = Math.max(Number(pagina) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limite) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const orderBy = { prazo: 'asc' };

    const [metas, total] = await Promise.all([
        prisma.meta.findMany({
            where,
            include: includeAportes,
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.meta.count({ where }),
    ]);

    return { metas, total };
};

const listarTodasComAportes = async (usuarioId) =>
    prisma.meta.findMany({
        where: { usuarioId },
        include: includeAportes,
        orderBy: { prazo: 'asc' },
    });

const contarPorStatus = async (usuarioId) => {
    const [ativas, pausadas, concluidas, canceladas] = await Promise.all([
        prisma.meta.count({ where: { usuarioId, status: 'ATIVA' } }),
        prisma.meta.count({ where: { usuarioId, status: 'PAUSADA' } }),
        prisma.meta.count({ where: { usuarioId, status: 'CONCLUIDA' } }),
        prisma.meta.count({ where: { usuarioId, status: 'CANCELADA' } }),
    ]);

    return {
        todas: ativas + pausadas + concluidas,
        ativas,
        pausadas,
        concluidas,
        canceladas,
    };
};

const listarAtividadeRecente = async (usuarioId, limite = 5) =>
    prisma.aporteMeta.findMany({
        where: { meta: { usuarioId } },
        include: { meta: { select: { id: true, nome: true, status: true } } },
        orderBy: { data: 'desc' },
        take: limite,
    });

const listarConclusoesRecentes = async (usuarioId, limite = 5) =>
    prisma.meta.findMany({
        where: {
            usuarioId,
            status: 'CONCLUIDA',
            concluidaEm: { not: null },
        },
        select: {
            id: true,
            nome: true,
            valorAlvo: true,
            concluidaEm: true,
        },
        orderBy: { concluidaEm: 'desc' },
        take: limite,
    });

const criar = async (dados) => prisma.meta.create({ data: dados });

const buscarPorId = async (metaId, usuarioId, { comAportes = false } = {}) =>
    prisma.meta.findFirst({
        where: { id: metaId, usuarioId },
        include: comAportes ? includeAportes : undefined,
    });

const atualizar = async (metaId, usuarioId, dados) =>
    prisma.meta.update({
        where: { id: metaId, usuarioId },
        data: dados,
    });

const excluir = async (metaId, usuarioId) =>
    prisma.meta.delete({
        where: { id: metaId, usuarioId },
    });

const criarAporte = async (dados) => prisma.aporteMeta.create({ data: dados });

const buscarAporte = async (aporteId, metaId, usuarioId) =>
    prisma.aporteMeta.findFirst({
        where: {
            id: aporteId,
            metaId,
            meta: { usuarioId },
        },
    });

const excluirAporte = async (aporteId) =>
    prisma.aporteMeta.delete({
        where: { id: aporteId },
    });

module.exports = {
    listarPorUsuario,
    listarTodasComAportes,
    contarPorStatus,
    listarAtividadeRecente,
    listarConclusoesRecentes,
    criar,
    buscarPorId,
    atualizar,
    excluir,
    criarAporte,
    buscarAporte,
    excluirAporte,
};
