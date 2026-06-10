const reminderService = require('../services/reminderService');

const listar = async (req, res, next) => {
    try {
        const lembretes = await reminderService.listarLembretes(req.user.id, req.query);
        res.status(200).json(lembretes);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const lembrete = await reminderService.criarLembrete(req.user.id, req.body);
        res.status(201).json(lembrete);
    } catch (error) {
        next(error);
    }
};

const atualizar = async (req, res, next) => {
    try {
        const lembrete = await reminderService.atualizarLembrete(req.user.id, req.params.id, req.body);
        res.status(200).json(lembrete);
    } catch (error) {
        next(error);
    }
};

const remover = async (req, res, next) => {
    try {
        await reminderService.removerLembrete(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const marcarPago = async (req, res, next) => {
    try {
        const lembrete = await reminderService.marcarComoPago(req.user.id, req.params.id);
        res.status(200).json(lembrete);
    } catch (error) {
        next(error);
    }
};

module.exports = { listar, criar, atualizar, remover, marcarPago };
