const { runTokenCleanup } = require('../jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('../jobs/recurringTransactions');
const { runUnverifiedAccountCleanup } = require('../jobs/unverifiedAccountCleanupJob');
const logger = require('../utils/logger');

// Jobs de orçamento/dívida/chat ficam comentados — módulos ainda não estão neste repo.
const tick = async (req, res, next) => {
    try {
        const cleanup = await runTokenCleanup();
        res.status(200).json({
            status: 'ok',
            cleanup,
        });
    } catch (error) {
        logger.error(`Falha no cron tick: ${error.message}`);
        next(error);
    }
};

const daily = async (req, res, next) => {
    try {
        const cleanup = await runTokenCleanup();
        await runRecurringTransactions();
        const contas = await runUnverifiedAccountCleanup();
        res.status(200).json({
            status: 'ok',
            cleanup,
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
