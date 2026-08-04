const expenseSplitService = require('../services/expenseSplitService');

const listarAtivas = async (req, res, next) => {
    try {
        const divisoes = await expenseSplitService.listarAtivas(req.user.id);
        res.status(200).json(divisoes);
    } catch (error) {
        next(error);
    }
};

const listarHistorico = async (req, res, next) => {
    try {
        const resultado = await expenseSplitService.listarHistorico(req.user.id, req.query);

        res.set('X-Total-Count', String(resultado.total));
        res.set('X-Total-Pages', String(resultado.paginas));
        res.set('X-Current-Page', String(resultado.pagina));

        res.status(200).json(resultado.divisoes);
    } catch (error) {
        next(error);
    }
};

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await expenseSplitService.calcularResumo(req.user.id);
        res.status(200).json(resumo);
    } catch (error) {
        next(error);
    }
};

const criar = async (req, res, next) => {
    try {
        const divisao = await expenseSplitService.criarDivisao(req.user.id, req.body);
        res.status(201).json(divisao);
    } catch (error) {
        next(error);
    }
};

const editar = async (req, res, next) => {
    try {
        const divisao = await expenseSplitService.editarDivisao(req.user.id, req.params.id, req.body);
        res.status(200).json(divisao);
    } catch (error) {
        next(error);
    }
};

const marcarPago = async (req, res, next) => {
    try {
        const divisao = await expenseSplitService.marcarParticipantePago(
            req.user.id,
            req.params.id,
            req.params.participanteId
        );
        res.status(200).json(divisao);
    } catch (error) {
        next(error);
    }
};

const desmarcarPago = async (req, res, next) => {
    try {
        const divisao = await expenseSplitService.desmarcarParticipantePago(
            req.user.id,
            req.params.id,
            req.params.participanteId
        );
        res.status(200).json(divisao);
    } catch (error) {
        next(error);
    }
};

const excluir = async (req, res, next) => {
    try {
        await expenseSplitService.excluirDivisao(req.user.id, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const criarLembrete = async (req, res, next) => {
    try {
        const { participanteIds, ...dadosLembrete } = req.body;
        const lembrete = await expenseSplitService.criarLembreteCobranca(
            req.user.id,
            req.params.id,
            participanteIds,
            dadosLembrete
        );
        res.status(201).json(lembrete);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarAtivas,
    listarHistorico,
    obterResumo,
    criar,
    editar,
    marcarPago,
    desmarcarPago,
    excluir,
    criarLembrete,
};
