const express = require('express');
const debtController = require('../controllers/debtController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarDividaSchema,
    editarDividaSchema,
    listarDividasQuerySchema,
    dividaIdParamSchema,
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

router.patch(
    '/:id/quitar',
    authMiddleware,
    validateMiddleware(dividaIdParamSchema),
    debtController.quitar
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(dividaIdParamSchema),
    debtController.excluir
);

module.exports = router;
