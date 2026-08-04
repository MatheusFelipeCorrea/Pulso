const budgetService = require('./budgetService');
const logger = require('../utils/logger');

/**
 * Executa verificações leves para o usuário autenticado — complementa o cron diário
 * no plano Hobby da Vercel (1 job agendado/dia).
 */
const syncPendingJobsForUser = async (usuarioId) => {
    const budget = await budgetService.verificarLimitesUsuarioENotificar(usuarioId);

    if (budget.criadas > 0) {
        logger.info(`🔔 Sync usuário ${usuarioId}: ${budget.criadas} alerta(s) de orçamento`);
    }

    return { budget };
};

module.exports = {
    syncPendingJobsForUser,
};
