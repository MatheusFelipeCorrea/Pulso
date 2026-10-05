const express = require('express');
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    queryMesSchema,
    salvarOrcamentosSchema,
    copiarOrcamentoSchema,
    removerOrcamentoSchema,
} = require('../schemas/budgetSchemas');

const router = express.Router();

router.get(
    '/status',
    authMiddleware,
    validateMiddleware(queryMesSchema),
    budgetController.obterStatusOrcamento
);

router.get(
    '/',
    authMiddleware,
    validateMiddleware(queryMesSchema),
    budgetController.listarOrcamentos
);

router.post(
    '/',
    authMiddleware,
    validateMiddleware(salvarOrcamentosSchema),
    budgetController.salvarOrcamentos
);

router.post(
    '/copiar',
    authMiddleware,
    validateMiddleware(copiarOrcamentoSchema),
    budgetController.copiarOrcamento
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(removerOrcamentoSchema),
    budgetController.removerOrcamento
);

module.exports = router;
