const logger = require('../utils/logger');
const grupoRepository = require('../repositories/grupoRepository');

const DIAS_RETENCAO_MENSAGENS = 180;

const runChatCleanupJob = async () => {
    const removidas = await grupoRepository.excluirMensagensAntigas(DIAS_RETENCAO_MENSAGENS);
    logger.info(`🧹 Job limpeza chat de grupo: ${removidas} mensagem(ns) removida(s)`, { removidas });
    return { removidas };
};

module.exports = { runChatCleanupJob, DIAS_RETENCAO_MENSAGENS };
