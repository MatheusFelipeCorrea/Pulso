const budgetService = require('../services/budgetService');

const listarOrcamentos = async (req, res, next) => {
    try {
        const orcamentos = await budgetService.listarOrcamentos(req.user.id, req.query);
        res.status(200).json(orcamentos);
    } catch (error) {
        next(error);
    }
};

const obterStatusOrcamento = async (req, res, next) => {
    try {
        const status = await budgetService.obterStatusOrcamento(req.user.id, req.query);
        res.status(200).json(status);
    } catch (error) {
        next(error);
    }
};

const salvarOrcamentos = async (req, res, next) => {
    try {
        const resultado = await budgetService.salvarOrcamentos(req.user.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const removerOrcamento = async (req, res, next) => {
    try {
        await budgetService.removerOrcamento(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const copiarOrcamento = async (req, res, next) => {
    try {
        const resultado = await budgetService.copiarOrcamento(req.user.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarOrcamentos,
    obterStatusOrcamento,
    salvarOrcamentos,
    removerOrcamento,
    copiarOrcamento,
};
