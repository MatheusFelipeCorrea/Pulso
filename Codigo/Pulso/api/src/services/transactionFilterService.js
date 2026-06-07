const categoryService = require('./categoryService');
const tagService = require('./tagService');
const {
    RECURSOS,
    TIPOS_FILTRO,
    RECURSOS_FILTRO,
    FREQUENCIAS_RECORRENCIA,
    ATE_QUANDO_RECORRENCIA,
} = require('../constants/transactionOptions');

const mapTag = (tag) => ({
    id: tag.id,
    nome: tag.nome,
    icone: tag.icone,
    cor: tag.cor,
});

/**
 * Metadados para filtros e formulários de transações.
 * Categorias e tags vêm do que o usuário possui/declarou no banco.
 */
const obterOpcoesFiltro = async (usuarioId) => {
    const [categorias, tags] = await Promise.all([
        categoryService.listarCategorias(usuarioId),
        tagService.listarTags(usuarioId),
    ]);

    return {
        categorias,
        tags: tags.map(mapTag),
        tipos: TIPOS_FILTRO,
        recursos: RECURSOS_FILTRO,
        formulario: {
            recursos: RECURSOS,
            frequencias: FREQUENCIAS_RECORRENCIA,
            ateQuando: ATE_QUANDO_RECORRENCIA,
        },
    };
};

module.exports = {
    obterOpcoesFiltro,
};
