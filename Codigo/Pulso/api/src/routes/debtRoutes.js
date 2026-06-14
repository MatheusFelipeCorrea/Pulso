const express = require('express');
const debtController = require('../controllers/debtController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarDividaSchema,
    editarDividaSchema,
    registrarPagamentoSchema,
    listarDividasQuerySchema,
    dividaIdParamSchema,
    pagamentoIdParamSchema,
} = require('../schemas/debtSchemas');

const router = express.Router();

router.get('/resumo', authMiddleware, debtController.obterResumo);

router.get(
    '/',
    authMiddleware,
    validateMiddleware(listarDividasQuerySchema),
    debtController.listar
);

router.post('/', authMiddleware, validateMiddleware(criarDividaSchema), debtController.criar);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(editarDividaSchema),
    debtController.editar
);

router.post(
    '/:id/pagamentos',
    authMiddleware,
    validateMiddleware(registrarPagamentoSchema),
    debtController.registrarPagamento
);

router.delete(
    '/:id/pagamentos/:pagamentoId',
    authMiddleware,
    validateMiddleware(pagamentoIdParamSchema),
    debtController.excluirPagamento
);

router.patch(
    '/:id/quitar',
    authMiddleware,
    validateMiddleware(dividaIdParamSchema),
    debtController.quitar
);

router.patch(
    '/:id/reabrir',
    authMiddleware,
    validateMiddleware(dividaIdParamSchema),
    debtController.reabrir
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(dividaIdParamSchema),
    debtController.excluir
);

module.exports = router;
