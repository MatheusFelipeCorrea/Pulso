const messaging = require('./rabbit');
const { runBudgetAlertJob } = require('../jobs/budgetAlertJob');
const { runReminderAlertJob } = require('../jobs/reminderAlertJob');
const { runReminderRecurrenceJob } = require('../jobs/reminderRecurrenceJob');
const { runDebtAlertJob } = require('../jobs/debtAlertJob');
const logger = require('../utils/logger');

const enqueueBudgetAlert = async () => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.ALERTS,
        { type: 'budget_alert' },
        runBudgetAlertJob
    );
    if (mode === 'queued') logger.info('📤 Orçamento: job enfileirado em pulso.alerts');
};

const enqueueReminderAlert = async () => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.REMINDERS,
        { type: 'reminder_alert' },
        runReminderAlertJob
    );
    if (mode === 'queued') logger.info('📤 Lembretes: job enfileirado em pulso.reminders');
};

const enqueueDebtAlert = async () => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.ALERTS,
        { type: 'debt_alert' },
        runDebtAlertJob
    );
    if (mode === 'queued') logger.info('📤 Dívidas: job enfileirado em pulso.alerts');
};

const enqueueReminderRecurrence = async () => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.REMINDERS,
        { type: 'reminder_recurrence' },
        runReminderRecurrenceJob
    );
    if (mode === 'queued')
        logger.info('📤 Recorrência lembretes: job enfileirado em pulso.reminders');
};

const startAlertConsumers = async () => {
    await messaging.consume(messaging.QUEUES.ALERTS, async (payload) => {
        if (payload.type === 'debt_alert') {
            await runDebtAlertJob();
            return;
        }
        await runBudgetAlertJob();
    });
};

const startReminderConsumers = async () => {
    await messaging.consume(messaging.QUEUES.REMINDERS, async (payload) => {
        if (payload.type === 'reminder_recurrence') {
            await runReminderRecurrenceJob();
            return;
        }
        await runReminderAlertJob();
    });
};

/**
 * Sobe consumers AMQP no processo long-running (alertas, lembretes e emails).
 * Sem URL, na Vercel, ou com broker caído: não sobe worker; publishOrRun já executa direto.
 */
const startMessagingWorkers = async () => {
    if (!messaging.isBrokerEnabled()) {
        if (process.env.VERCEL) {
            logger.info(
                '⏭️  RabbitMQ desativado na Vercel (serverless) — jobs e emails em modo direto'
            );
            return;
        }
        logger.info('⏭️  RabbitMQ não configurado (RABBITMQ_URL) — jobs e emails em modo direto');
        return;
    }

    const ch = await messaging.getChannel();
    if (!ch) {
        logger.warn(
            '⏭️  RabbitMQ configurado mas indisponível — jobs e emails em modo direto até o broker voltar'
        );
        return;
    }

    await startAlertConsumers();
    await startReminderConsumers();
    const { startEmailConsumers } = require('./emailBridge');
    await startEmailConsumers();
};

module.exports = {
    enqueueBudgetAlert,
    enqueueDebtAlert,
    enqueueReminderAlert,
    enqueueReminderRecurrence,
    startMessagingWorkers,
};
