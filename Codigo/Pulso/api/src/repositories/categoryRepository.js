const prisma = require('../config/database');
const { DEFAULT_CATEGORIES } = require('../constants/defaultCategories');

const OUTROS = 'Outros';

const ordenarCategorias = (categorias) =>
    [...categorias].sort((a, b) => {
        if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo);

        const aOutros = a.nome === OUTROS;
        const bOutros = b.nome === OUTROS;
        if (aOutros !== bOutros) return aOutros ? 1 : -1;

        return a.nome.localeCompare(b.nome, 'pt-BR');
    });

const listarPorUsuario = async (usuarioId, tipo) => {
    const where = { usuarioId };
    if (tipo) where.tipo = tipo;

    const categorias = await prisma.categoria.findMany({ where });
    return ordenarCategorias(categorias);
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
