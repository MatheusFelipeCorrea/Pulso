const reminderAlertService = require('../services/reminderAlertService');
const logger = require('../utils/logger');

const runReminderAlertJob = async () => {
    const resultado = await reminderAlertService.verificarLembretesENotificar();
    logger.info(
        `🔔 Job lembretes: ${resultado.criadas} notificação(ões) criadas (${resultado.verificados} lembretes verificados)`
    );
    return resultado;
};

module.exports = {
    runReminderAlertJob,
};
