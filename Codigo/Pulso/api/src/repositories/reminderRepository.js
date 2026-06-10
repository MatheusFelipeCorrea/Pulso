const prisma = require('../config/database');

const criar = async (data) => prisma.lembrete.create({ data });

const atualizar = async (id, data) =>
    prisma.lembrete.update({
        where: { id },
        data,
    });

const deletar = async (id) => prisma.lembrete.delete({ where: { id } });

const buscarPorId = async (id, usuarioId) =>
    prisma.lembrete.findFirst({
        where: { id, usuarioId },
    });

const listarPorUsuario = async (usuarioId, { inicio, fim } = {}) => {
    const where = { usuarioId };
    if (inicio && fim) {
        where.dataVencimento = { gte: inicio, lte: fim };
    }
    return prisma.lembrete.findMany({
        where,
        orderBy: { dataVencimento: 'asc' },
    });
};

const listarProximos = async (usuarioId, { limite = 10 } = {}) => {
    return prisma.lembrete.findMany({
        where: {
            usuarioId,
            pago: false,
        },
        orderBy: { dataVencimento: 'asc' },
        take: Math.min(Number(limite) || 10, 50),
    });
};

module.exports = {
    criar,
    atualizar,
    deletar,
    buscarPorId,
    listarPorUsuario,
    listarProximos,
};
