const purchasePlanningService = require('../services/purchasePlanningService');

const listar = async (req, res, next) => {
    try {
        const painel = await purchasePlanningService.listarPainel(req.user.id);
        res.status(200).json(painel);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.criarItem(req.user.id, req.body);
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.editarItem(req.user.id, req.params.id, req.body);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await purchasePlanningService.excluirItem(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const vincularMeta = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.vincularMeta(req.user.id, req.params.id, req.body);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

const desvincularMeta = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.desvincularMeta(req.user.id, req.params.id);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

const comprar = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.marcarComprado(req.user.id, req.params.id, req.body);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

const resolverImagem = async (req, res, next) => {
    try {
        const resultado = await purchasePlanningService.resolverImagemPreview(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const enviarImagem = async (req, res, next) => {
    try {
        const item = await purchasePlanningService.enviarImagemItem(
            req.user.id,
            req.params.id,
            req.file
        );
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    criar,
    editar,
    excluir,
    vincularMeta,
    desvincularMeta,
    comprar,
    resolverImagem,
    enviarImagem,
};
