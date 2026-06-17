const grupoService = require('../services/grupoService');

const listar = async (req, res, next) => {
    try {
        const grupos = await grupoService.listarGrupos(req.user.id);
        res.status(200).json(grupos);
    } catch (error) {
        next(error);
    }
};

const obter = async (req, res, next) => {
    try {
        const grupo = await grupoService.obterGrupo(req.user.id, req.params.id);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const grupo = await grupoService.criarGrupo(req.user.id, req.body);
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const grupo = await grupoService.editarGrupo(req.user.id, req.params.id, req.body);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await grupoService.excluirGrupo(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const sair = async (req, res, next) => {
    try {
        await grupoService.sairDoGrupo(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const preview = async (req, res, next) => {
    try {
        const previewData = await grupoService.previewPorCodigo(req.user.id, req.query.codigo);
        res.status(200).json(previewData);
    } catch (error) {
        next(error);
    }
};

const entrar = async (req, res, next) => {
    try {
        const grupo = await grupoService.entrarPorCodigo(req.user.id, req.body.codigoConvite);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const criarViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.criarViagemGrupo(req.user.id, req.params.id, req.body);
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const obterMediaPassagemViagem = async (req, res, next) => {
    try {
        const mediaPassagem = await grupoService.obterMediaPassagemViagemGrupo(
            req.user.id,
            req.params.id,
            req.query.origem
        );
        res.status(200).json(mediaPassagem);
    } catch (error) {
        next(error);
    }
};

const criarDespesaViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.criarDespesaViagemGrupo(req.user.id, req.params.id, req.body);
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const editarDespesaViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.editarDespesaViagemGrupo(
            req.user.id,
            req.params.id,
            req.params.despesaId,
            req.body
        );
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const excluirDespesaViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.excluirDespesaViagemGrupo(
            req.user.id,
            req.params.id,
            req.params.despesaId
        );
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const criarMetas = async (req, res, next) => {
    try {
        const grupo = await grupoService.criarMetasGrupo(req.user.id, req.params.id, req.body.metas);
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const registrarAporte = async (req, res, next) => {
    try {
        const grupo = await grupoService.registrarAporteGrupo(
            req.user.id,
            req.params.id,
            req.params.metaId,
            req.body
        );
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const enviarMensagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.enviarMensagemGrupo(req.user.id, req.params.id, req.body);
        res.status(201).json(grupo);
    } catch (error) {
        next(error);
    }
};

const listarMensagens = async (req, res, next) => {
    try {
        const resultado = await grupoService.listarMensagensGrupo(req.user.id, req.params.id, req.query);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

const removerMembro = async (req, res, next) => {
    try {
        await grupoService.removerMembroGrupo(req.user.id, req.params.id, req.params.usuarioId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const alterarPapelMembro = async (req, res, next) => {
    try {
        const grupo = await grupoService.alterarPapelMembro(
            req.user.id,
            req.params.id,
            req.params.usuarioId,
            req.body.papel
        );
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const renovarCodigo = async (req, res, next) => {
    try {
        const grupo = await grupoService.renovarCodigoConvite(req.user.id, req.params.id);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const editarViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.editarViagemGrupo(req.user.id, req.params.id, req.body);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

const desvincularViagem = async (req, res, next) => {
    try {
        const grupo = await grupoService.desvincularViagemGrupo(req.user.id, req.params.id);
        res.status(200).json(grupo);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    obter,
    criar,
    editar,
    excluir,
    sair,
    preview,
    entrar,
    criarViagem,
    obterMediaPassagemViagem,
    criarDespesaViagem,
    editarDespesaViagem,
    excluirDespesaViagem,
    criarMetas,
    registrarAporte,
    enviarMensagem,
    listarMensagens,
    removerMembro,
    alterarPapelMembro,
    renovarCodigo,
    editarViagem,
    desvincularViagem,
};
