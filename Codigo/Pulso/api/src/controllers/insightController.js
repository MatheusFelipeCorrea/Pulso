const insightService = require('../services/insightService');

const obter = async (req, res, next) => {
    try {
        const data = await insightService.obterInsights(req.user.id, req.query.mes);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const regenerar = async (req, res, next) => {
    try {
        const data = await insightService.regenerarInsights(
            req.user.id,
            req.body?.mes || req.query.mes
        );
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const score = async (req, res, next) => {
    try {
        const data = await insightService.obterScore(req.user.id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obter,
    regenerar,
    score,
};
