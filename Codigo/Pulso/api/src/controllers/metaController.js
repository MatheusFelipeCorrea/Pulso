const metaService = require('../services/metaService');

const listar = async (req, res, next) => {
    try {
        const resultado = await metaService.listarMetas(req.user.id, req.query);

        res.set('X-Total-Count', String(resultado.total));
        res.set('X-Total-Pages', String(resultado.paginas));
        res.set('X-Current-Page', String(resultado.pagina));

        res.status(200).json(resultado.metas);
    } catch (error) {
        next(error);
    }
};

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await metaService.calcularResumo(req.user.id);
        res.status(200).json(resumo);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const meta = await metaService.criarMeta(req.user.id, req.body);
        res.status(201).json(meta);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const meta = await metaService.editarMeta(req.user.id, req.params.id, req.body);
        res.status(200).json(meta);
    } catch (error) {
        next(error);
    }
};

const registrarAporte = async (req, res, next) => {
    try {
        const resultado = await metaService.registrarAporte(req.user.id, req.params.id, req.body);
        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
};

const excluirAporte = async (req, res, next) => {
    try {
        const meta = await metaService.excluirAporte(
            req.user.id,
            req.params.id,
            req.params.aporteId
        );
        res.status(200).json(meta);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await metaService.excluirMeta(req.user.id, req.params.id);
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
    registrarAporte,
    excluirAporte,
    excluir,
};
