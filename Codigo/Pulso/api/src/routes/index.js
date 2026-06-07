const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const transportRoutes = require('./transportRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transacoes', transactionRoutes);
router.use('/categorias', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/transporte', transportRoutes);

module.exports = router;
