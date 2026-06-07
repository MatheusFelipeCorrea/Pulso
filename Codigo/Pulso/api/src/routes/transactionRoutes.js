const express = require('express');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarTransacaoSchema,
    editarTransacaoSchema,
    listarTransacoesQuerySchema,
    excluirTransacaoSchema,
} = require('../schemas/transactionSchemas');

const router = express.Router();

router.get(
    '/filtros',
    authMiddleware,
    transactionController.obterOpcoesFiltro
);

router.get(
    '/resumo',
    authMiddleware,
    validateMiddleware(listarTransacoesQuerySchema),
    transactionController.obterResumo
);

router.get(
    '/',
    authMiddleware,
    validateMiddleware(listarTransacoesQuerySchema),
    transactionController.listarTransacoes
);

router.post(
    '/',
    authMiddleware,
    validateMiddleware(criarTransacaoSchema),
    transactionController.criarTransacao
);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(editarTransacaoSchema),
    transactionController.editarTransacao
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(excluirTransacaoSchema),
    transactionController.excluirTransacao
);

module.exports = router;
