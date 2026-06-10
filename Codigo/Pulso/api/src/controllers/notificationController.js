const notificationService = require('../services/notificationService');

const listar = async (req, res, next) => {
    try {
        const resultado = await notificationService.listarNotificacoes(req.user.id, req.query);
        res.set('X-Total-Count', String(resultado.total));
        res.set('X-Total-Pages', String(resultado.paginas));
        res.set('X-Current-Page', String(resultado.pagina));
        res.status(200).json(resultado.notificacoes);
    } catch (error) {
        next(error);
    }
};

const contarNaoLidas = async (req, res, next) => {
    try {
        const resultado = await notificationService.contarNaoLidas(req.user.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const marcarComoLida = async (req, res, next) => {
    try {
        const notificacao = await notificationService.marcarComoLida(req.user.id, req.params.id);
        res.status(200).json(notificacao);
    } catch (error) {
        next(error);
    }
};

const marcarTodasLidas = async (req, res, next) => {
    try {
        const resultado = await notificationService.marcarTodasLidas(req.user.id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasLidas,
};
