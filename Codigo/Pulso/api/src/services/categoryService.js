const categoryRepository = require('../repositories/categoryRepository');
const { mapCategoria } = require('../utils/transactionMapper');

const listarCategorias = async (usuarioId, tipo) => {
    await categoryRepository.criarPadrao(usuarioId);
    const categorias = await categoryRepository.listarPorUsuario(usuarioId, tipo);
    return categorias.map(mapCategoria);
};

const seedCategoriasPadrao = async (usuarioId) => {
    await categoryRepository.criarPadrao(usuarioId);
};

module.exports = {
    listarCategorias,
    seedCategoriasPadrao,
};
