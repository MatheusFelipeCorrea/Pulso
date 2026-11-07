const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const chatbotRateLimit = require('../middlewares/chatbotRateLimit');
const chatbotController = require('../controllers/chatbotController');
const {
    enviarMensagemSchema,
    confirmarTransacaoSchema,
    conversaIdParamSchema,
    criarConversaSchema,
} = require('../schemas/chatbotSchemas');

const router = express.Router();

router.get('/sugestoes', authMiddleware, chatbotController.listarSugestoes);

router.get('/conversas', authMiddleware, chatbotController.listarConversas);

router.post(
    '/conversas',
    authMiddleware,
    validateMiddleware(criarConversaSchema),
    chatbotController.criarConversa
);

router.get(
    '/conversas/:id',
    authMiddleware,
    validateMiddleware(conversaIdParamSchema),
    chatbotController.obterConversa
);

router.delete(
    '/conversas/:id',
    authMiddleware,
    validateMiddleware(conversaIdParamSchema),
    chatbotController.excluirConversa
);

router.post(
    '/mensagem',
    authMiddleware,
    chatbotRateLimit,
    validateMiddleware(enviarMensagemSchema),
    chatbotController.enviarMensagem
);

router.post(
    '/confirmar-transacao',
    authMiddleware,
    chatbotRateLimit,
    validateMiddleware(confirmarTransacaoSchema),
    chatbotController.confirmarTransacao
);

module.exports = router;
