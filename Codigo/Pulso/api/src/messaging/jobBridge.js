const messaging = require('./rabbit');
const logger = require('../utils/logger');

/**
 * Sobe consumers AMQP no processo long-running.
 * Hoje só emails (verificação / reset) — jobs de alerta/lembrete ainda não existem no repo.
 * Sem URL, na Vercel, ou com broker caído: não sobe worker; publishOrRun já executa SMTP direto.
 */
const startMessagingWorkers = async () => {
    if (!messaging.isBrokerEnabled()) {
        if (process.env.VERCEL) {
            logger.info('⏭️  RabbitMQ desativado na Vercel (serverless) — emails em modo direto');
            return;
        }
        logger.info('⏭️  RabbitMQ não configurado (RABBITMQ_URL) — emails em modo direto');
        return;
    }

    const ch = await messaging.getChannel();
    if (!ch) {
        logger.warn(
            '⏭️  RabbitMQ configurado mas indisponível — emails em modo direto até o broker voltar'
        );
        return;
    }

    const { startEmailConsumers } = require('./emailBridge');
    await startEmailConsumers();
};

module.exports = {
    startMessagingWorkers,
};
