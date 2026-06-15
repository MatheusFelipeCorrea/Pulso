const viagemService = require('../services/viagemService');

const listar = async (req, res, next) => {
    try {
        const viagens = await viagemService.listarViagens(req.user.id);
        res.status(200).json(viagens);
    } catch (error) {
        next(error);
    }
};

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await viagemService.obterResumoPagina(req.user.id);
        res.status(200).json(resumo);
    } catch (error) {
        next(error);
    }
};

const obter = async (req, res, next) => {
    try {
        const viagem = await viagemService.obterViagem(req.user.id, req.params.id);
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const viagem = await viagemService.criarViagem(req.user.id, req.body);
        res.status(201).json(viagem);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const viagem = await viagemService.editarViagem(req.user.id, req.params.id, req.body);
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await viagemService.excluirViagem(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const criarDespesa = async (req, res, next) => {
    try {
        const viagem = await viagemService.criarDespesa(req.user.id, req.params.id, req.body);
        res.status(201).json(viagem);
    } catch (error) {
        next(error);
    }
};

const editarDespesa = async (req, res, next) => {
    try {
        const viagem = await viagemService.editarDespesa(
            req.user.id,
            req.params.id,
            req.params.despesaId,
            req.body
        );
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const excluirDespesa = async (req, res, next) => {
    try {
        const viagem = await viagemService.excluirDespesa(
            req.user.id,
            req.params.id,
            req.params.despesaId
        );
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const criarObservacao = async (req, res, next) => {
    try {
        const viagem = await viagemService.criarObservacao(req.user.id, req.params.id, req.body);
        res.status(201).json(viagem);
    } catch (error) {
        next(error);
    }
};

const editarObservacao = async (req, res, next) => {
    try {
        const viagem = await viagemService.editarObservacao(
            req.user.id,
            req.params.id,
            req.params.observacaoId,
            req.body
        );
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const excluirObservacao = async (req, res, next) => {
    try {
        const viagem = await viagemService.excluirObservacao(
            req.user.id,
            req.params.id,
            req.params.observacaoId
        );
        res.status(200).json(viagem);
    } catch (error) {
        next(error);
    }
};

const obterMediaPassagem = async (req, res, next) => {
    try {
        const mediaPassagem = await viagemService.obterMediaPassagem(req.user.id, req.params.id);
        res.status(200).json(mediaPassagem);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listar,
    obter,
    obterResumo,
    obterMediaPassagem,
    criar,
    editar,
    excluir,
    criarDespesa,
    editarDespesa,
    excluirDespesa,
    criarObservacao,
    editarObservacao,
    excluirObservacao,
};
