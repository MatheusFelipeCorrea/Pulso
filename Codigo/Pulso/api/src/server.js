const app = require('./app');
const http = require('http');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');
const cron = require('node-cron');
// TEMP Sprint-2: deps ainda ausentes no repo — desligados para a API subir (Auth).
// const { initSocket } = require('./socket/groupChat');
const { runTokenCleanup } = require('./jobs/tokenCleanupJob');
// const { runRecurringTransactions } = require('./jobs/recurringTransactions');
// const { runDebtCleanupJob } = require('./jobs/debtCleanupJob');
// const { runNotificationCleanup } = require('./jobs/notificationCleanupJob');
// const { runChatCleanupJob } = require('./jobs/chatCleanupJob');
// const { runExpenseSplitCleanupJob } = require('./jobs/expenseSplitCleanupJob');
// const {
//     enqueueBudgetAlert,
//     enqueueDebtAlert,
//     enqueueReminderAlert,
//     enqueueReminderRecurrence,
//     startMessagingWorkers,
// } = require('./messaging/jobBridge');

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

// const startRecurringTransactionsScheduler = () => { ... };
// const startBudgetAlertScheduler = () => { ... };
// const startReminderAlertScheduler = () => { ... };
// const startDebtCleanupScheduler = () => { ... };
// const startDebtAlertScheduler = () => { ... };
// const startReminderRecurrenceScheduler = () => { ... };
// const startNotificationCleanupScheduler = () => { ... };
// const startChatCleanupScheduler = () => { ... };
// const startExpenseSplitCleanupScheduler = () => { ... };

const start = async () => {
    try {
        // Testa conexão com o banco
        await prisma.$connect();
        logger.info('🗄️  Banco de dados conectado');

        // Na Vercel os jobs rodam via /api/cron/* (vercel.json crons)
        if (!process.env.VERCEL) {
            // await startMessagingWorkers();
            startTokenCleanupScheduler();
            // startRecurringTransactionsScheduler();
            // startBudgetAlertScheduler();
            // startReminderAlertScheduler();
            // startReminderRecurrenceScheduler();
            // startDebtCleanupScheduler();
            // startDebtAlertScheduler();
            // startNotificationCleanupScheduler();
            // startChatCleanupScheduler();
            // startExpenseSplitCleanupScheduler();
            logger.info('⏭️  Cron extra desativado (TEMP Sprint-2 — módulos ausentes)');
        } else {
            logger.info('⏭️  Cron local desativado (ambiente Vercel)');
        }

        const server = http.createServer(app);
        if (!process.env.VERCEL) {
            // initSocket(server);
            logger.info('⏭️  Socket.IO desativado (TEMP Sprint-2 — módulo ausente)');
        } else {
            logger.info('⏭️  Socket.IO desativado (ambiente Vercel serverless)');
        }

        server.listen(env.PORT, () => {
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
