const debtService = require('../services/debtService');

const listar = async (req, res, next) => {
    try {
        const resultado = await debtService.listarDividas(req.user.id, req.query);

        res.set('X-Total-Count', String(resultado.total));
        res.set('X-Total-Pages', String(resultado.paginas));
        res.set('X-Current-Page', String(resultado.pagina));

        res.status(200).json(resultado.dividas);
    } catch (error) {
        next(error);
    }
};

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await debtService.calcularResumo(req.user.id);
        res.status(200).json(resumo);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const divida = await debtService.criarDivida(req.user.id, req.body);
        res.status(201).json(divida);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const divida = await debtService.editarDivida(req.user.id, req.params.id, req.body);
        res.status(200).json(divida);
    } catch (error) {
        next(error);
    }
};

const quitar = async (req, res, next) => {
    try {
        const divida = await debtService.quitarDivida(req.user.id, req.params.id);
        res.status(200).json(divida);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await debtService.excluirDivida(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    obterResumo,
    criar,
    editar,
    quitar,
    excluir,
};
