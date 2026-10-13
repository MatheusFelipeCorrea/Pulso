const authRepository = require('../repositories/authRepository');
const logger = require('../utils/logger');

/**
 * Remove refresh tokens expirados/revogados e limpa tokens de verificação/reset expirados.
 */
const runTokenCleanup = async () => {
    const [refreshDeleted, verificationCleared, resetCleared] = await Promise.all([
        authRepository.deleteExpiredRefreshTokens(),
        authRepository.clearExpiredVerificationTokens(),
        authRepository.clearExpiredResetTokens(),
    ]);

    const summary = {
        refreshTokensRemoved: refreshDeleted.count,
        verificationTokensCleared: verificationCleared.count,
        resetTokensCleared: resetCleared.count,
    };

    if (
        summary.refreshTokensRemoved > 0 ||
        summary.verificationTokensCleared > 0 ||
        summary.resetTokensCleared > 0
    ) {
        logger.info('Limpeza de tokens concluída', summary);
    }

    return summary;
};

module.exports = {
    runTokenCleanup,
};
