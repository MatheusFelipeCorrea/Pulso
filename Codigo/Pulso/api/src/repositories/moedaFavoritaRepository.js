const prisma = require('../config/database');

const listarPorUsuario = async (usuarioId) =>
    prisma.moedaFavorita.findMany({
        where: { usuarioId },
        orderBy: { criadoEm: 'asc' },
    });

const criar = async (usuarioId, codigo) =>
    prisma.moedaFavorita.create({
        data: { usuarioId, codigo },
    });

const excluir = async (usuarioId, codigo) =>
    prisma.moedaFavorita.deleteMany({
        where: { usuarioId, codigo },
    });

const contarPorUsuario = async (usuarioId) =>
    prisma.moedaFavorita.count({
        where: { usuarioId },
    });

module.exports = {
    listarPorUsuario,
    criar,
    excluir,
    contarPorUsuario,
};
