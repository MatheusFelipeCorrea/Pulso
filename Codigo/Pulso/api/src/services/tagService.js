const tagRepository = require('../repositories/tagRepository');

const listarTags = async (usuarioId) => tagRepository.listarPorUsuario(usuarioId);

const criarTag = async (usuarioId, { nome, icone, cor }) => {
    const tag = await tagRepository.buscarOuCriar(usuarioId, nome, icone, cor);
    return tag;
};

module.exports = {
    listarTags,
    criarTag,
};
