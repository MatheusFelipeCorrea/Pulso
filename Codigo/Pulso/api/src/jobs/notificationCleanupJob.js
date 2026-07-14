const notificationRepository = require('../repositories/notificationRepository');
const logger = require('../utils/logger');

const DIAS_RETENCAO_LIDAS = 30;

/**
 * Remove notificações com mais de 30 dias, lidas ou não.
 */
const runNotificationCleanup = async () => {
    const resultado = await notificationRepository.excluirAntigas(DIAS_RETENCAO_LIDAS);

    const summary = {
        diasRetencao: DIAS_RETENCAO_LIDAS,
        removidas: resultado.count,
    };

    if (summary.removidas > 0) {
        logger.info('Limpeza de notificações concluída', summary);
    }

    return summary;
};

module.exports = {
    runNotificationCleanup,
    DIAS_RETENCAO_LIDAS,
};
