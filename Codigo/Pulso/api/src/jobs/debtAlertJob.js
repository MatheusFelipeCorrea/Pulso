const logger = require('../utils/logger');
const { verificarDividasENotificar } = require('../services/debtAlertService');

const runDebtAlertJob = async () => {
    const resultado = await verificarDividasENotificar();
    logger.info(
        `🔔 Job alertas dívidas: ${resultado.criadas} notificação(ões) criadas (${resultado.verificadas} dívidas verificadas)`,
        resultado
    );
    return resultado;
};

module.exports = { runDebtAlertJob };
