const { runBudgetAlertJob } = require('../jobs/budgetAlertJob');
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

/** Hobby Vercel: 1×/dia — roda todos os jobs agendados. */
const daily = async (req, res, next) => {
    try {
        const [budget, cleanup] = await Promise.all([
            runBudgetAlertJob(),
            runTokenCleanup(),
        ]);
        await runRecurringTransactions();

        res.status(200).json({
            status: 'ok',
            budget,
            cleanup,
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
