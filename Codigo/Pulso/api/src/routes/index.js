const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const categoryRoutes = require('./categoryRoutes');
const tagRoutes = require('./tagRoutes');
const cronRoutes = require('./cronRoutes');
const metaRoutes = require('./metaRoutes');
const moedaRoutes = require('./moedaRoutes');
const viagemRoutes = require('./viagemRoutes');
// TEMP: demais módulos ainda não estão neste repo.
// const budgetRoutes = require('./budgetRoutes');
// const notificationRoutes = require('./notificationRoutes');
// const reminderRoutes = require('./reminderRoutes');
// const calendarRoutes = require('./calendarRoutes');
// const debtRoutes = require('./debtRoutes');
// const expenseSplitRoutes = require('./expenseSplitRoutes');
// const grupoRoutes = require('./grupoRoutes');
// const purchasePlanningRoutes = require('./purchasePlanningRoutes');
// const syncRoutes = require('./syncRoutes');
// const dashboardRoutes = require('./dashboardRoutes');
// const importRoutes = require('./importRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transacoes', transactionRoutes);
router.use('/categorias', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/cron', cronRoutes);
router.use('/metas', metaRoutes);
router.use('/moedas', moedaRoutes);
router.use('/viagens', viagemRoutes);
// router.use('/orcamentos', budgetRoutes);
// router.use('/notificacoes', notificationRoutes);
// router.use('/lembretes', reminderRoutes);
// router.use('/calendario', calendarRoutes);
// router.use('/dividas', debtRoutes);
// router.use('/divisoes', expenseSplitRoutes);
// router.use('/grupos', grupoRoutes);
// router.use('/planejamento-compra', purchasePlanningRoutes);
// router.use('/sync', syncRoutes);
// router.use('/dashboard', dashboardRoutes);
// router.use('/importacoes', importRoutes);

module.exports = router;
