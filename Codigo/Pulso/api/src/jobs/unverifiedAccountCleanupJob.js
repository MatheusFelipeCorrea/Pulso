const authRepository = require('../repositories/authRepository');
const logger = require('../utils/logger');

const UNVERIFIED_ACCOUNT_MAX_AGE_DAYS = 30;

/**
 * Remove contas email/senha criadas há mais de 30 dias e nunca verificadas.
 * Contas Google já nascem verificadas e não entram neste critério.
 */
const runUnverifiedAccountCleanup = async (
    maxAgeDays = UNVERIFIED_ACCOUNT_MAX_AGE_DAYS
) => {
    const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000);
    const result = await authRepository.deleteUnverifiedEmailAccountsOlderThan(cutoff);

    if (result.count > 0) {
        logger.info('Limpeza de contas não verificadas concluída', {
            removidas: result.count,
            maxAgeDays,
        });
    }

    return { removidas: result.count, maxAgeDays };
};

module.exports = {
    UNVERIFIED_ACCOUNT_MAX_AGE_DAYS,
    runUnverifiedAccountCleanup,
};
