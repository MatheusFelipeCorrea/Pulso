const prisma = require('../config/database');
const { DEFAULT_CATEGORIES } = require('../constants/defaultCategories');

const listarPorUsuario = async (usuarioId, tipo) => {
    const where = { usuarioId };
    if (tipo) where.tipo = tipo;

    return prisma.categoria.findMany({
        where,
        orderBy: [{ tipo: 'asc' }, { nome: 'asc' }],
    });
};

const buscarPorId = async (categoriaId, usuarioId) =>
    prisma.categoria.findFirst({
        where: { id: categoriaId, usuarioId },
    });

const buscarPorNome = async (usuarioId, nome, tipo) =>
    prisma.categoria.findFirst({
        where: { usuarioId, nome, tipo },
    });

const criarPadrao = async (usuarioId) => {
    const data = DEFAULT_CATEGORIES.map((categoria) => ({
        ...categoria,
        padrao: true,
        usuarioId,
    }));

    return prisma.categoria.createMany({ data, skipDuplicates: true });
};

module.exports = {
    listarPorUsuario,
    buscarPorId,
    buscarPorNome,
    criarPadrao,
};
