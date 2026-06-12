const { runBudgetAlertJob } = require('../jobs/budgetAlertJob');
const { runReminderAlertJob } = require('../jobs/reminderAlertJob');
const { runReminderRecurrenceJob } = require('../jobs/reminderRecurrenceJob');
const { runDebtAlertJob } = require('../jobs/debtAlertJob');
const { runDebtCleanupJob } = require('../jobs/debtCleanupJob');
const { runTokenCleanup } = require('../jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('../jobs/recurringTransactions');
const logger = require('../utils/logger');

const tick = async (req, res, next) => {
    try {
        const [budget, cleanup] = await Promise.all([
            runBudgetAlertJob(),
            runTokenCleanup(),
        ]);

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

/** Hobby Vercel: 1×/dia — roda todos os jobs agendados (10:00 BRT). */
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
        await runRecurringTransactions();

        res.status(200).json({
            status: 'ok',
            budget,
            cleanup,
            reminders,
            debts,
            debtCleanup,
            recurringReminders,
            recurring: true,
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
