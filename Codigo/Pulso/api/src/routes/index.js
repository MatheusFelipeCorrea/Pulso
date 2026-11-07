const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const cronRoutes = require('./cronRoutes');
const metaRoutes = require('./metaRoutes');
const moedaRoutes = require('./moedaRoutes');
const viagemRoutes = require('./viagemRoutes');
const budgetRoutes = require('./budgetRoutes');
const reminderRoutes = require('./reminderRoutes');
const calendarRoutes = require('./calendarRoutes');
const purchasePlanningRoutes = require('./purchasePlanningRoutes');
const debtRoutes = require('./debtRoutes');
const expenseSplitRoutes = require('./expenseSplitRoutes');
const grupoRoutes = require('./grupoRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const importRoutes = require('./importRoutes');
const chatbotRoutes = require('./chatbotRoutes');
// TEMP: demais módulos ainda não estão neste repo.
// const notificationRoutes = require('./notificationRoutes');
// const syncRoutes = require('./syncRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transacoes', transactionRoutes);
router.use('/categorias', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/cron', cronRoutes);
router.use('/metas', metaRoutes);
router.use('/moedas', moedaRoutes);
router.use('/viagens', viagemRoutes);
router.use('/orcamentos', budgetRoutes);
router.use('/lembretes', reminderRoutes);
router.use('/calendario', calendarRoutes);
router.use('/planejamento-compra', purchasePlanningRoutes);
router.use('/dividas', debtRoutes);
router.use('/divisoes', expenseSplitRoutes);
router.use('/grupos', grupoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/importacoes', importRoutes);
router.use('/chatbot', chatbotRoutes);
// router.use('/notificacoes', notificationRoutes);
// router.use('/sync', syncRoutes);

module.exports = router;
