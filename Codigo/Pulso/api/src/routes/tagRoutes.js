const express = require('express');
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, tagController.listarTags);
router.post('/', authMiddleware, tagController.criarTag);

module.exports = router;
