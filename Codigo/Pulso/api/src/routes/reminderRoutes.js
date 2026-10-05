const express = require('express');
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    queryMesSchema,
    criarLembreteSchema,
    atualizarLembreteSchema,
    marcarPagoSchema,
    removerLembreteSchema,
} = require('../schemas/reminderSchemas');

const router = express.Router();

router.get('/', authMiddleware, validateMiddleware(queryMesSchema), reminderController.listar);

router.post('/', authMiddleware, validateMiddleware(criarLembreteSchema), reminderController.criar);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(atualizarLembreteSchema),
    reminderController.atualizar
);

router.post(
    '/:id/pagar',
    authMiddleware,
    validateMiddleware(marcarPagoSchema),
    reminderController.marcarPago
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(removerLembreteSchema),
    reminderController.remover
);

module.exports = router;
