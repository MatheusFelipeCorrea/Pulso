const prisma = require('../config/database');

const includeMeta = {
    meta: {
        include: {
            aportes: true,
        },
    },
};

const listarDesejados = async (usuarioId) =>
    prisma.itemPlanejamentoCompra.findMany({
        where: { usuarioId, status: 'DESEJADO' },
        include: includeMeta,
        orderBy: [{ prioridade: 'asc' }, { criadoEm: 'desc' }],
    });

const listarComprados = async (usuarioId, limite = 5) =>
    prisma.itemPlanejamentoCompra.findMany({
        where: { usuarioId, status: 'COMPRADO' },
        orderBy: { compradoEm: 'desc' },
        take: limite,
    });

const buscarPorId = async (id, usuarioId) =>
    prisma.itemPlanejamentoCompra.findFirst({
        where: { id, usuarioId },
        include: includeMeta,
    });

const criar = async (data) =>
    prisma.itemPlanejamentoCompra.create({
        data,
        include: includeMeta,
    });

const atualizar = async (id, data) =>
    prisma.itemPlanejamentoCompra.update({
        where: { id },
        data,
        include: includeMeta,
    });

const excluir = async (id) => prisma.itemPlanejamentoCompra.delete({ where: { id } });

const contarPorCategoria = async (usuarioId) =>
    prisma.itemPlanejamentoCompra.groupBy({
        by: ['categoria'],
        where: { usuarioId, status: 'DESEJADO' },
        _count: { id: true },
        _sum: { valorEstimado: true },
    });

module.exports = {
    listarDesejados,
    listarComprados,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    contarPorCategoria,
};
