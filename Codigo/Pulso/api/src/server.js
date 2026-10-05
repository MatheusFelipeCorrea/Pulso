const app = require('./app');
const http = require('http');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');
const cron = require('node-cron');
// TEMP Sprint-2: deps ainda ausentes no repo — desligados para a API subir (Auth).
// const { initSocket } = require('./socket/groupChat');
const { runTokenCleanup } = require('./jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('./jobs/recurringTransactions');
const {
    startMessagingWorkers,
    enqueueBudgetAlert,
    enqueueReminderAlert,
    enqueueReminderRecurrence,
} = require('./messaging/jobBridge');
const { runUnverifiedAccountCleanup } = require('./jobs/unverifiedAccountCleanupJob');
// const { runDebtCleanupJob } = require('./jobs/debtCleanupJob');
// const { runNotificationCleanup } = require('./jobs/notificationCleanupJob');
// const { runChatCleanupJob } = require('./jobs/chatCleanupJob');
// const { runExpenseSplitCleanupJob } = require('./jobs/expenseSplitCleanupJob');

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

const startUnverifiedAccountCleanupScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule('20 3 * * *', async () => {
        try {
            await runUnverifiedAccountCleanup();
        } catch (error) {
            logger.error(`Falha na limpeza de contas não verificadas: ${error.message}`);
        }
    });

    logger.info('🧹 Agendador de contas não verificadas ativo (diário 03:20)');
};

const startBudgetAlertScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule('*/20 * * * *', async () => {
        try {
            await enqueueBudgetAlert();
        } catch (error) {
            logger.error(`Falha no job de alertas de orçamento: ${error.message}`);
        }
    });

    logger.info('📊 Agendador de alertas de orçamento ativo (a cada 20 min)');
};

const startReminderAlertScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule(
        '0 10 * * *',
        async () => {
            try {
                await enqueueReminderAlert();
            } catch (error) {
                logger.error(`Falha no job de lembretes: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🔔 Agendador de lembretes ativo (diário 10:00 BRT)');
};

const startReminderRecurrenceScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule(
        '5 0 * * *',
        async () => {
            try {
                await enqueueReminderRecurrence();
            } catch (error) {
                logger.error(`Falha no job de recorrência de lembretes: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🔁 Agendador de recorrência de lembretes ativo (diário 00:05 BRT)');
};

// TEMP: módulos de dívidas, notificações, chat e divisão ainda não estão neste repo.
// const startDebtCleanupScheduler = () => { ... };
// const startDebtAlertScheduler = () => { ... };
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
            await startMessagingWorkers();
            startTokenCleanupScheduler();
            startRecurringTransactionsScheduler();
            startUnverifiedAccountCleanupScheduler();
            startBudgetAlertScheduler();
            startReminderAlertScheduler();
            startReminderRecurrenceScheduler();
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
