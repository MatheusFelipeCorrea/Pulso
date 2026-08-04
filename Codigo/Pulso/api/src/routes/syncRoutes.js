const express = require('express');
const syncController = require('../controllers/syncController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, syncController.sync);

module.exports = router;
