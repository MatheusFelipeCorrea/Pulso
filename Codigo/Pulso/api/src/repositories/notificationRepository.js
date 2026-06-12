const prisma = require('../config/database');

const criar = async (data) => prisma.notificacao.create({ data });

const buscarPorId = async (id, usuarioId) =>
    prisma.notificacao.findFirst({
        where: { id, usuarioId },
    });

const listar = async (usuarioId, { lida, limite = 10, pagina = 1 } = {}) => {
    const where = { usuarioId };
    if (lida === true || lida === false) {
        where.lida = lida;
    }

    const take = Math.min(Number(limite) || 10, 50);
    const skip = (Math.max(Number(pagina) || 1, 1) - 1) * take;

    const [items, total] = await Promise.all([
        prisma.notificacao.findMany({
            where,
            orderBy: { criadoEm: 'desc' },
            skip,
            take,
        }),
        prisma.notificacao.count({ where }),
    ]);

    return {
        items,
        total,
        paginas: Math.ceil(total / take) || 1,
        pagina: Number(pagina) || 1,
    };
};

const atualizar = async (id, data) =>
    prisma.notificacao.update({
        where: { id },
        data,
    });

const marcarComoLida = async (id, usuarioId) => {
    const resultado = await prisma.notificacao.updateMany({
        where: { id, usuarioId },
        data: { lida: true },
    });

    if (resultado.count === 0) {
        return null;
    }

    return prisma.notificacao.findFirst({
        where: { id, usuarioId },
    });
};

const marcarTodasLidas = async (usuarioId) =>
    prisma.notificacao.updateMany({
        where: { usuarioId, lida: false },
        data: { lida: true },
    });

const contarNaoLidas = async (usuarioId) =>
    prisma.notificacao.count({
        where: { usuarioId, lida: false },
    });

const buscarDuplicadaLembrete = async (usuarioId, tipo, lembreteId, dataAlerta) => {
    const items = await prisma.notificacao.findMany({
        where: {
            usuarioId,
            tipo,
        },
        orderBy: { criadoEm: 'desc' },
        take: 200,
    });

    return items.find((item) => {
        const meta = item.metadados;
        if (!meta || typeof meta !== 'object') return false;
        return meta.lembreteId === lembreteId && meta.dataAlerta === dataAlerta;
    });
};

const buscarDuplicadaDivida = async (usuarioId, tipo, dividaId, dataAlerta) => {
    const items = await prisma.notificacao.findMany({
        where: {
            usuarioId,
            tipo,
        },
        orderBy: { criadoEm: 'desc' },
        take: 200,
    });

    return items.find((item) => {
        const meta = item.metadados;
        if (!meta || typeof meta !== 'object') return false;
        return meta.dividaId === dividaId && meta.dataAlerta === dataAlerta;
    });
};

const buscarDuplicadaOrcamento = async (usuarioId, tipo, categoriaId, mesReferencia) => {
    const items = await prisma.notificacao.findMany({
        where: {
            usuarioId,
            tipo,
        },
        orderBy: { criadoEm: 'desc' },
        take: 200,
    });

    return items.find((item) => {
        const meta = item.metadados;
        if (!meta || typeof meta !== 'object') return false;
        return meta.categoriaId === categoriaId && meta.mesReferencia === mesReferencia;
    });
};

module.exports = {
    criar,
    buscarPorId,
    listar,
    atualizar,
    marcarComoLida,
    marcarTodasLidas,
    contarNaoLidas,
    buscarDuplicadaLembrete,
    buscarDuplicadaDivida,
    buscarDuplicadaOrcamento,
};
