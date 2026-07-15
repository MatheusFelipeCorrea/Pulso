const logger = require('../utils/logger');
const expenseSplitRepository = require('../repositories/expenseSplitRepository');

const DIAS_RETENCAO_QUITADAS = 180;

const runExpenseSplitCleanupJob = async () => {
    const removidas = await expenseSplitRepository.excluirQuitadasAntigas(DIAS_RETENCAO_QUITADAS);
    logger.info(`🧹 Job limpeza divisões de despesas: ${removidas} divisão(ões) removida(s)`, {
        removidas,
    });
    return { removidas };
};

module.exports = { runExpenseSplitCleanupJob, DIAS_RETENCAO_QUITADAS };
