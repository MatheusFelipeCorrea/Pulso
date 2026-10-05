const express = require('express');
const purchasePlanningController = require('../controllers/purchasePlanningController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarItemSchema,
    editarItemSchema,
    itemIdParamSchema,
    vincularMetaSchema,
    comprarItemSchema,
    resolverImagemSchema,
} = require('../schemas/purchasePlanningSchemas');
const { handlePurchaseItemImageUpload } = require('../middlewares/purchaseItemImageUploadMiddleware');

const router = express.Router();

router.get('/', authMiddleware, purchasePlanningController.listar);

router.post(
    '/resolver-imagem',
    authMiddleware,
    validateMiddleware(resolverImagemSchema),
    purchasePlanningController.resolverImagem
);

router.post('/', authMiddleware, validateMiddleware(criarItemSchema), purchasePlanningController.criar);

router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(editarItemSchema),
    purchasePlanningController.editar
);

router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(itemIdParamSchema),
    purchasePlanningController.excluir
);

router.post(
    '/:id/vincular-meta',
    authMiddleware,
    validateMiddleware(vincularMetaSchema),
    purchasePlanningController.vincularMeta
);

router.delete(
    '/:id/vincular-meta',
    authMiddleware,
    validateMiddleware(itemIdParamSchema),
    purchasePlanningController.desvincularMeta
);

router.post(
    '/:id/comprar',
    authMiddleware,
    validateMiddleware(comprarItemSchema),
    purchasePlanningController.comprar
);

router.post(
    '/:id/imagem',
    authMiddleware,
    validateMiddleware(itemIdParamSchema),
    handlePurchaseItemImageUpload,
    purchasePlanningController.enviarImagem
);

module.exports = router;
