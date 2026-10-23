const logger = require('../utils/logger');
const debtRepository = require('../repositories/debtRepository');

const runDebtCleanupJob = async () => {
    const removidas = await debtRepository.excluirQuitadasAntigas(180);
    logger.info(`🧹 Job limpeza dívidas: ${removidas} dívida(s) removida(s)`, { removidas });
    return { removidas };
};

module.exports = { runDebtCleanupJob };
