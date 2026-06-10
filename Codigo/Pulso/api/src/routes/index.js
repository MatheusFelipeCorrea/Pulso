const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const transportRoutes = require('./transportRoutes');
const budgetRoutes = require('./budgetRoutes');
const notificationRoutes = require('./notificationRoutes');
const reminderRoutes = require('./reminderRoutes');
const calendarRoutes = require('./calendarRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transacoes', transactionRoutes);
router.use('/categorias', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/transporte', transportRoutes);
router.use('/orcamentos', budgetRoutes);
router.use('/notificacoes', notificationRoutes);
router.use('/lembretes', reminderRoutes);
router.use('/calendario', calendarRoutes);

module.exports = router;
