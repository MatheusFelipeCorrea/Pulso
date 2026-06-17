const AppError = require('../utils/appError');
const tagRepository = require('../repositories/tagRepository');

const listarTags = async (usuarioId) => tagRepository.listarPorUsuario(usuarioId);

const criarTag = async (usuarioId, { nome, icone, cor }) => {
    const tag = await tagRepository.buscarOuCriar(usuarioId, nome, icone, cor);
    return tag;
};

const editarTag = async (usuarioId, tagId, dados) => {
    const tag = await tagRepository.buscarPorId(tagId, usuarioId);
    if (!tag) {
        throw new AppError('Tag não encontrada', 404);
    }

    const payload = {};
    if (dados.nome !== undefined) payload.nome = String(dados.nome).trim();
    if (dados.icone !== undefined) payload.icone = dados.icone;
    if (dados.cor !== undefined) payload.cor = dados.cor;

    if (!Object.keys(payload).length) {
        throw new AppError('Informe ao menos um campo para atualizar', 400);
    }

    return tagRepository.atualizar(tagId, usuarioId, payload);
};

const excluirTag = async (usuarioId, tagId) => {
    const tag = await tagRepository.buscarPorId(tagId, usuarioId);
    if (!tag) {
        throw new AppError('Tag não encontrada', 404);
    }

    const resultado = await tagRepository.excluir(tagId, usuarioId);
    if (!resultado.count) {
        throw new AppError('Tag não encontrada', 404);
    }
};

module.exports = {
    listarTags,
    criarTag,
    editarTag,
    excluirTag,
};
