const chatbotService = require('../services/chatbotService');

const enviarMensagem = async (req, res, next) => {
    try {
        const resultado = await chatbotService.enviarMensagem(req.user.id, req.body);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const confirmarTransacao = async (req, res, next) => {
    try {
        const transacao = await chatbotService.confirmarTransacao(req.user.id, req.body);
        res.status(201).json(transacao);
    } catch (error) {
        next(error);
    }
};

const listarSugestoes = async (req, res, next) => {
    try {
        res.status(200).json(chatbotService.listarSugestoes());
    } catch (error) {
        next(error);
    }
};

const listarConversas = async (req, res, next) => {
    try {
        const conversas = await chatbotService.listarConversas(req.user.id);
        res.status(200).json(conversas);
    } catch (error) {
        next(error);
    }
};

const criarConversa = async (req, res, next) => {
    try {
        const conversa = await chatbotService.criarConversa(req.user.id, req.body || {});
        res.status(201).json(conversa);
    } catch (error) {
        next(error);
    }
};

const obterConversa = async (req, res, next) => {
    try {
        const conversa = await chatbotService.obterConversa(req.user.id, req.params.id);
        res.status(200).json(conversa);
    } catch (error) {
        next(error);
    }
};

const excluirConversa = async (req, res, next) => {
    try {
        const result = await chatbotService.excluirConversa(req.user.id, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    enviarMensagem,
    confirmarTransacao,
    listarSugestoes,
    listarConversas,
    criarConversa,
    obterConversa,
    excluirConversa,
};
