const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    queryNotificacoesSchema,
    marcarLidaSchema,
} = require('../schemas/notificationSchemas');

const router = express.Router();

router.get(
    '/contador',
    authMiddleware,
    notificationController.contarNaoLidas
);

router.patch(
    '/marcar-todas-lidas',
    authMiddleware,
    notificationController.marcarTodasLidas
);

router.get(
    '/',
    authMiddleware,
    validateMiddleware(queryNotificacoesSchema),
    notificationController.listar
);

router.patch(
    '/:id/marcar-lida',
    authMiddleware,
    validateMiddleware(marcarLidaSchema),
    notificationController.marcarComoLida
);

module.exports = router;
