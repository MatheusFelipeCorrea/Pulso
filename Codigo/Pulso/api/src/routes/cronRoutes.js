const express = require('express');
const cronController = require('../controllers/cronController');
const cronAuthMiddleware = require('../middlewares/cronAuthMiddleware');

const router = express.Router();

router.get('/tick', cronAuthMiddleware, cronController.tick);
router.get('/daily', cronAuthMiddleware, cronController.daily);

module.exports = router;
