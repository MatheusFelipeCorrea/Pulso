const tagService = require('../services/tagService');
const AppError = require('../utils/appError');

const listarTags = async (req, res, next) => {
    try {
        const tags = await tagService.listarTags(req.user.id);
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
};

const criarTag = async (req, res, next) => {
    try {
        const { nome, icone, cor } = req.body;
        if (!nome?.trim()) {
            throw new AppError('Nome da tag é obrigatório', 400);
        }
        const tag = await tagService.criarTag(req.user.id, {
            nome: nome.trim(),
            icone,
            cor,
        });
        res.status(201).json(tag);
    } catch (error) {
        next(error);
    }
};

const editarTag = async (req, res, next) => {
    try {
        const tag = await tagService.editarTag(req.user.id, req.params.id, req.body);
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};

const excluirTag = async (req, res, next) => {
    try {
        await tagService.excluirTag(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { listarTags, criarTag, editarTag, excluirTag };
