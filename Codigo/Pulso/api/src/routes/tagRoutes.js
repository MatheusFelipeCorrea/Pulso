const express = require('express');
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, tagController.listarTags);
router.post('/', authMiddleware, tagController.criarTag);
router.patch('/:id', authMiddleware, tagController.editarTag);
router.delete('/:id', authMiddleware, tagController.excluirTag);

module.exports = router;
