const express = require('express');
const expenseSplitController = require('../controllers/expenseSplitController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarDivisaoSchema,
    editarDivisaoSchema,
    listarHistoricoQuerySchema,
    divisaoIdParamSchema,
    participanteIdParamSchema,
    criarLembreteCobrancaSchema,
} = require('../schemas/expenseSplitSchemas');

const router = express.Router();

router.get('/resumo', authMiddleware, expenseSplitController.obterResumo);

router.get('/ativas', authMiddleware, expenseSplitController.listarAtivas);

router.get(
    '/historico',
    authMiddleware,
    validateMiddleware(listarHistoricoQuerySchema),
    expenseSplitController.listarHistorico
);

router.post(
    '/',
    authMiddleware,
    validateMiddleware(criarDivisaoSchema),
    expenseSplitController.criar
);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(editarDivisaoSchema),
    expenseSplitController.editar
);

router.patch(
    '/:id/participantes/:participanteId/pagar',
    authMiddleware,
    validateMiddleware(participanteIdParamSchema),
    expenseSplitController.marcarPago
);

router.patch(
    '/:id/participantes/:participanteId/despagar',
    authMiddleware,
    validateMiddleware(participanteIdParamSchema),
    expenseSplitController.desmarcarPago
);

router.post(
    '/:id/lembrete',
    authMiddleware,
    validateMiddleware(criarLembreteCobrancaSchema),
    expenseSplitController.criarLembrete
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(divisaoIdParamSchema),
    expenseSplitController.excluir
);

module.exports = router;
