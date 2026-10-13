const budgetService = require('../services/budgetService');
const logger = require('../utils/logger');

const runBudgetAlertJob = async () => {
    const resultado = await budgetService.verificarLimitesENotificar();
    logger.info(
        `🔔 Job orçamento: ${resultado.criadas} notificação(ões) criadas (${resultado.usuariosVerificados} usuários)`
    );
    return resultado;
};

module.exports = {
    runBudgetAlertJob,
};
