const categoryService = require('../services/categoryService');

const listarCategorias = async (req, res, next) => {
    try {
        const tipo = req.query.tipo || undefined;
        const categorias = await categoryService.listarCategorias(req.user.id, tipo);
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};

const listarIcones = async (req, res, next) => {
    try {
        res.status(200).json(categoryService.listarIconesDisponiveis());
    } catch (error) {
        next(error);
    }
};

const criarCategoria = async (req, res, next) => {
    try {
        const categoria = await categoryService.criarCategoria(req.user.id, req.body);
        res.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
};

const atualizarCategoria = async (req, res, next) => {
    try {
        const categoria = await categoryService.atualizarCategoria(
            req.user.id,
            req.params.id,
            req.body
        );
        res.status(200).json(categoria);
    } catch (error) {
        next(error);
    }
};

const removerCategoria = async (req, res, next) => {
    try {
        await categoryService.removerCategoria(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarCategorias,
    listarIcones,
    criarCategoria,
    atualizarCategoria,
    removerCategoria,
};
