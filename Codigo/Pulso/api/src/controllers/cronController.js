const { runTokenCleanup } = require('../jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('../jobs/recurringTransactions');
const { runUnverifiedAccountCleanup } = require('../jobs/unverifiedAccountCleanupJob');
const { runBudgetAlertJob } = require('../jobs/budgetAlertJob');
const { runReminderAlertJob } = require('../jobs/reminderAlertJob');
const { runReminderRecurrenceJob } = require('../jobs/reminderRecurrenceJob');
const { runDebtAlertJob } = require('../jobs/debtAlertJob');
const { runDebtCleanupJob } = require('../jobs/debtCleanupJob');
const { runExpenseSplitCleanupJob } = require('../jobs/expenseSplitCleanupJob');
const logger = require('../utils/logger');

// Jobs de notificação e chat ficam comentados — módulos ainda não estão neste repo.
const tick = async (req, res, next) => {
    try {
        const [budget, cleanup] = await Promise.all([runBudgetAlertJob(), runTokenCleanup()]);
        res.status(200).json({
            status: 'ok',
            budget,
            cleanup,
        });
    } catch (error) {
        logger.error(`Falha no cron tick: ${error.message}`);
        next(error);
    }
};

const daily = async (req, res, next) => {
    try {
        const [budget, cleanup, reminders, debts] = await Promise.all([
            runBudgetAlertJob(),
            runTokenCleanup(),
            runReminderAlertJob(),
            runDebtAlertJob(),
        ]);
        const recurringReminders = await runReminderRecurrenceJob();
        const debtCleanup = await runDebtCleanupJob();
        const expenseSplitCleanup = await runExpenseSplitCleanupJob();
        await runRecurringTransactions();
        const contas = await runUnverifiedAccountCleanup();
        res.status(200).json({
            status: 'ok',
            budget,
            cleanup,
            reminders,
            debts,
            debtCleanup,
            expenseSplitCleanup,
            recurringReminders,
            recurring: true,
            contasNaoVerificadas: contas,
        });
    } catch (error) {
        logger.error(`Falha no cron daily: ${error.message}`);
        next(error);
    }
};

module.exports = {
    tick,
    daily,
};
