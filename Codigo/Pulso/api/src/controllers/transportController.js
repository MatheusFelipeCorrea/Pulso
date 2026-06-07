const transportService = require('../services/transportService');

const obterSaldoVt = async (req, res, next) => {
    try {
        const saldo = await transportService.obterSaldoVt(req.user.id, req.query.periodo);
        res.status(200).json(saldo);
    } catch (error) {
        next(error);
    }
};

const registrarVendaVt = async (req, res, next) => {
    try {
        const venda = await transportService.registrarVendaVt(req.user.id, req.body);
        res.status(201).json(venda);
    } catch (error) {
        next(error);
    }
};

const listarVendas = async (req, res, next) => {
    try {
        const resultado = await transportService.listarVendas(req.user.id, req.query);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const registrarUsoVt = async (req, res, next) => {
    try {
        const uso = await transportService.registrarUsoVt(req.user.id, req.body);
        res.status(201).json(uso);
    } catch (error) {
        next(error);
    }
};

const listarUsos = async (req, res, next) => {
    try {
        const resultado = await transportService.listarUsos(req.user.id, req.query);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const atualizarVtHabilitado = async (req, res, next) => {
    try {
        const resultado = await transportService.atualizarVtHabilitado(
            req.user.id,
            req.body.vtHabilitado
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterSaldoVt,
    registrarVendaVt,
    listarVendas,
    registrarUsoVt,
    listarUsos,
    atualizarVtHabilitado,
};
