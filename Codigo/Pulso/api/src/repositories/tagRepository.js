const prisma = require('../config/database');

const listarPorUsuario = async (usuarioId) =>
    prisma.tag.findMany({
        where: { usuarioId },
        orderBy: { nome: 'asc' },
    });

const buscarPorIds = async (tagIds, usuarioId) => {
    if (!tagIds?.length) return [];

    return prisma.tag.findMany({
        where: {
            id: { in: tagIds },
            usuarioId,
        },
    });
};

const criar = async (usuarioId, dados) =>
    prisma.tag.create({
        data: {
            usuarioId,
            nome: dados.nome,
            icone: dados.icone ?? 'Tag',
            cor: dados.cor ?? '#71717A',
        },
    });

const buscarOuCriar = async (usuarioId, nome, icone = 'Tag', cor = '#71717A') => {
    const existente = await prisma.tag.findFirst({
        where: {
            usuarioId,
            nome: { equals: nome, mode: 'insensitive' },
        },
    });

    if (existente) return existente;

    return criar(usuarioId, { nome, icone, cor });
};

module.exports = {
    listarPorUsuario,
    buscarPorIds,
    criar,
    buscarOuCriar,
};
