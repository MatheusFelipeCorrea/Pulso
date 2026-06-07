const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');
const cron = require('node-cron');
const { runTokenCleanup } = require('./jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('./jobs/recurringTransactions');

const startTokenCleanupScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    // A cada hora — remove tokens expirados/revogados
    cron.schedule('0 * * * *', async () => {
        try {
            await runTokenCleanup();
        } catch (error) {
            logger.error(`Falha na limpeza de tokens: ${error.message}`);
        }
    });

    logger.info('🧹 Agendador de limpeza de tokens ativo (hourly)');
};

const startRecurringTransactionsScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule('5 0 * * *', async () => {
        try {
            await runRecurringTransactions();
        } catch (error) {
            logger.error(`Falha no job de transações recorrentes: ${error.message}`);
        }
    });

    logger.info('🔄 Agendador de transações recorrentes ativo (diário 00:05)');
};

const start = async () => {
    try {
        // Testa conexão com o banco
        await prisma.$connect();
        logger.info('🗄️  Banco de dados conectado');

        startTokenCleanupScheduler();
        startRecurringTransactionsScheduler();

        app.listen(env.PORT, () => {
            logger.info(`💜 Pulso API rodando na porta ${env.PORT}`);
            logger.info(`📚 Docs: http://localhost:${env.PORT}/api/docs`);
            logger.info(`🏥 Health: http://localhost:${env.PORT}/api/health`);
        });
    } catch (error) {
        logger.error('❌ Falha ao iniciar o servidor:');
        logger.error(error.message);
        process.exit(1);
    }
};

start();