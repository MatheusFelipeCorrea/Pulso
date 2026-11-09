const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const insightController = require('../controllers/insightController');
const { mesQuerySchema, regenerarSchema } = require('../schemas/insightSchemas');

const router = express.Router();

router.get('/', authMiddleware, validateMiddleware(mesQuerySchema), insightController.obter);

router.get('/score', authMiddleware, insightController.score);

router.post(
    '/regenerar',
    authMiddleware,
    validateMiddleware(regenerarSchema),
    insightController.regenerar
);

module.exports = router;
