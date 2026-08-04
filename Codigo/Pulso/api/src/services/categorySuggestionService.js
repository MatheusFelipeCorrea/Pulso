const transactionRepository = require('../repositories/transactionRepository');
const { sugerirCategoriaId } = require('../utils/categorySuggestionUtils');

/**
 * RF-141 — sugere a categoria mais provável para uma nova transação com base
 * no histórico de descrições semelhantes do próprio usuário (mesmo tipo).
 */
const sugerirCategoria = async (usuarioId, { tipo, descricao }) => {
    const historico = await transactionRepository.listarDescricoesPorTipo(usuarioId, tipo);
    const categoriaId = sugerirCategoriaId(descricao, historico);
    return { categoriaId };
};

module.exports = { sugerirCategoria };
