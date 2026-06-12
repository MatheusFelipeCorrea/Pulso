const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');
const cron = require('node-cron');
const { runTokenCleanup } = require('./jobs/tokenCleanupJob');
const { runRecurringTransactions } = require('./jobs/recurringTransactions');
const { runBudgetAlertJob } = require('./jobs/budgetAlertJob');
const { runReminderAlertJob } = require('./jobs/reminderAlertJob');
const { runReminderRecurrenceJob } = require('./jobs/reminderRecurrenceJob');
const { runDebtAlertJob } = require('./jobs/debtAlertJob');
const { runDebtCleanupJob } = require('./jobs/debtCleanupJob');

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

const startBudgetAlertScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule('*/20 * * * *', async () => {
        try {
            await runBudgetAlertJob();
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
                await runReminderAlertJob();
            } catch (error) {
                logger.error(`Falha no job de lembretes: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🔔 Agendador de lembretes ativo (diário 10:00 BRT)');
};

const startDebtCleanupScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule(
        '0 2 * * *',
        async () => {
            try {
                await runDebtCleanupJob();
            } catch (error) {
                logger.error(`Falha no job de limpeza de dívidas: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🧹 Agendador de limpeza de dívidas ativo (diário 02:00 BRT)');
};

const startDebtAlertScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule(
        '0 8 * * *',
        async () => {
            try {
                await runDebtAlertJob();
            } catch (error) {
                logger.error(`Falha no job de alertas de dívidas: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🔔 Agendador de alertas de dívidas ativo (diário 08:00 BRT)');
};

const startReminderRecurrenceScheduler = () => {
    if (env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule(
        '5 0 * * *',
        async () => {
            try {
                await runReminderRecurrenceJob();
            } catch (error) {
                logger.error(`Falha no job de recorrência de lembretes: ${error.message}`);
            }
        },
        { timezone: 'America/Sao_Paulo' }
    );

    logger.info('🔁 Agendador de recorrência de lembretes ativo (diário 00:05 BRT)');
};

const start = async () => {
    try {
        // Testa conexão com o banco
        await prisma.$connect();
        logger.info('🗄️  Banco de dados conectado');

        // Na Vercel os jobs rodam via /api/cron/* (vercel.json crons)
        if (!process.env.VERCEL) {
            startTokenCleanupScheduler();
            startRecurringTransactionsScheduler();
            startBudgetAlertScheduler();
            startReminderAlertScheduler();
            startReminderRecurrenceScheduler();
            startDebtCleanupScheduler();
            startDebtAlertScheduler();
        } else {
            logger.info('⏭️  Cron local desativado (ambiente Vercel)');
        }

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