const transactionService = require('../services/transactionService');
const transactionFilterService = require('../services/transactionFilterService');

const listarTransacoes = async (req, res, next) => {
    try {
        const resultado = await transactionService.listarTransacoes(req.user.id, req.query);

        res.set('X-Total-Count', String(resultado.total));
        res.set('X-Total-Pages', String(resultado.paginas));
        res.set('X-Current-Page', String(resultado.pagina));

        res.status(200).json(resultado.transacoes);
    } catch (error) {
        next(error);
    }
};

const obterResumo = async (req, res, next) => {
    try {
        const resumo = await transactionService.calcularResumo(req.user.id, req.query);
        res.status(200).json(resumo);
    } catch (error) {
        next(error);
    }
};

const obterOpcoesFiltro = async (req, res, next) => {
    try {
        const opcoes = await transactionFilterService.obterOpcoesFiltro(req.user.id);
        res.status(200).json(opcoes);
    } catch (error) {
        next(error);
    }
};

const criarTransacao = async (req, res, next) => {
    try {
        const transacao = await transactionService.criarTransacao(req.user.id, req.body);
        res.status(201).json(transacao);
    } catch (error) {
        next(error);
    }
};

const editarTransacao = async (req, res, next) => {
    try {
        const transacao = await transactionService.editarTransacao(
            req.user.id,
            req.params.id,
            req.body
        );
        res.status(200).json(transacao);
    } catch (error) {
        next(error);
    }
};

const excluirTransacao = async (req, res, next) => {
    try {
        await transactionService.excluirTransacao(
            req.user.id,
            req.params.id,
            req.query.excluirFuturas
        );
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarTransacoes,
    obterResumo,
    obterOpcoesFiltro,
    criarTransacao,
    editarTransacao,
    excluirTransacao,
};
