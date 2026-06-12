const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
    criarCategoriaSchema,
    atualizarCategoriaSchema,
    removerCategoriaSchema,
} = require('../schemas/categorySchemas');

const router = express.Router();

router.get('/', authMiddleware, categoryController.listarCategorias);
router.get('/icones', authMiddleware, categoryController.listarIcones);
router.post('/', authMiddleware, validateMiddleware(criarCategoriaSchema), categoryController.criarCategoria);
router.patch(
    '/:id',
    authMiddleware,
    validateMiddleware(atualizarCategoriaSchema),
    categoryController.atualizarCategoria
);
router.delete(
    '/:id',
    authMiddleware,
    validateMiddleware(removerCategoriaSchema),
    categoryController.removerCategoria
);

module.exports = router;
