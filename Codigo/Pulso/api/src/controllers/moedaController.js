const moedaService = require('../services/moedaService');

const obterCatalogo = async (_req, res, next) => {
    try {
        const data = await moedaService.obterCatalogo();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const listarCotacoes = async (req, res, next) => {
    try {
        const data = await moedaService.listarCotacoes(req.query.codigos);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const converter = async (req, res, next) => {
    try {
        const data = await moedaService.converter(req.query);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const obterHistorico = async (req, res, next) => {
    try {
        const data = await moedaService.obterHistorico(req.query.codigo, req.query.dias);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const listarFavoritas = async (req, res, next) => {
    try {
        const data = await moedaService.garantirFavoritasPadrao(req.user.id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const adicionarFavorita = async (req, res, next) => {
    try {
        const data = await moedaService.adicionarFavorita(req.user.id, req.body.codigo);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

const removerFavorita = async (req, res, next) => {
    try {
        const data = await moedaService.removerFavorita(req.user.id, req.params.codigo);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterCatalogo,
    listarCotacoes,
    converter,
    obterHistorico,
    listarFavoritas,
    adicionarFavorita,
    removerFavorita,
};
