jest.mock('../../../src/messaging/rabbit', () => ({
    QUEUES: { ALERTS: 'pulso.alerts', REMINDERS: 'pulso.reminders', EMAILS: 'pulso.emails' },
    isBrokerEnabled: jest.fn(),
    getChannel: jest.fn(),
    consume: jest.fn().mockResolvedValue(undefined),
    publishOrRun: jest.fn(),
}));

jest.mock('../../../src/messaging/emailBridge', () => ({
    startEmailConsumers: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../src/jobs/budgetAlertJob', () => ({ runBudgetAlertJob: jest.fn() }));
jest.mock('../../../src/jobs/reminderAlertJob', () => ({ runReminderAlertJob: jest.fn() }));
jest.mock('../../../src/jobs/reminderRecurrenceJob', () => ({
    runReminderRecurrenceJob: jest.fn(),
}));
jest.mock('../../../src/jobs/debtAlertJob', () => ({ runDebtAlertJob: jest.fn() }));

const messaging = require('../../../src/messaging/rabbit');
const { startEmailConsumers } = require('../../../src/messaging/emailBridge');
const { runBudgetAlertJob } = require('../../../src/jobs/budgetAlertJob');
const { runReminderAlertJob } = require('../../../src/jobs/reminderAlertJob');
const { runReminderRecurrenceJob } = require('../../../src/jobs/reminderRecurrenceJob');
const { runDebtAlertJob } = require('../../../src/jobs/debtAlertJob');
const {
    startMessagingWorkers,
    enqueueBudgetAlert,
    enqueueDebtAlert,
    enqueueReminderAlert,
    enqueueReminderRecurrence,
} = require('../../../src/messaging/jobBridge');
const logger = require('../../../src/utils/logger');

describe('jobBridge', () => {
    const originalVercel = process.env.VERCEL;

    afterEach(() => {
        if (originalVercel === undefined) {
            delete process.env.VERCEL;
        } else {
            process.env.VERCEL = originalVercel;
        }
    });

    it('não sobe worker sem broker habilitado', async () => {
        messaging.isBrokerEnabled.mockReturnValue(false);

        await startMessagingWorkers();

        expect(messaging.getChannel).not.toHaveBeenCalled();
        expect(startEmailConsumers).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();
    });

    it('não sobe worker na Vercel', async () => {
        process.env.VERCEL = '1';
        messaging.isBrokerEnabled.mockReturnValue(false);

        await startMessagingWorkers();

        expect(startEmailConsumers).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Vercel'));
    });

    it('não sobe worker se o broker estiver configurado mas caído', async () => {
        messaging.isBrokerEnabled.mockReturnValue(true);
        messaging.getChannel.mockResolvedValue(null);

        await startMessagingWorkers();

        expect(startEmailConsumers).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalled();
    });

    it('sobe consumer de email quando o canal existe', async () => {
        messaging.isBrokerEnabled.mockReturnValue(true);
        messaging.getChannel.mockResolvedValue({ sendToQueue: jest.fn() });

        await startMessagingWorkers();

        expect(startEmailConsumers).toHaveBeenCalled();
        expect(messaging.consume).toHaveBeenCalledWith('pulso.alerts', expect.any(Function));
        expect(messaging.consume).toHaveBeenCalledWith('pulso.reminders', expect.any(Function));
    });

    it('consumer de lembretes roda o job conforme o tipo da mensagem', async () => {
        messaging.isBrokerEnabled.mockReturnValue(true);
        messaging.getChannel.mockResolvedValue({ sendToQueue: jest.fn() });
        messaging.consume.mockClear();

        await startMessagingWorkers();

        const reminderHandler = messaging.consume.mock.calls.find(
            ([q]) => q === 'pulso.reminders'
        )[1];
        await reminderHandler({ type: 'reminder_recurrence' });
        await reminderHandler({ type: 'reminder_alert' });
        const alertHandler = messaging.consume.mock.calls.find(([q]) => q === 'pulso.alerts')[1];
        await alertHandler({ type: 'budget_alert' });
        await alertHandler({ type: 'debt_alert' });

        expect(runReminderRecurrenceJob).toHaveBeenCalledTimes(1);
        expect(runReminderAlertJob).toHaveBeenCalledTimes(1);
        expect(runBudgetAlertJob).toHaveBeenCalledTimes(1);
        expect(runDebtAlertJob).toHaveBeenCalledTimes(1);
    });

    it('enfileira alertas de orçamento e lembretes nas filas certas', async () => {
        messaging.publishOrRun.mockResolvedValue('queued');

        await enqueueBudgetAlert();
        await enqueueDebtAlert();
        await enqueueReminderAlert();
        await enqueueReminderRecurrence();

        expect(messaging.publishOrRun).toHaveBeenCalledWith(
            'pulso.alerts',
            { type: 'budget_alert' },
            runBudgetAlertJob
        );
        expect(messaging.publishOrRun).toHaveBeenCalledWith(
            'pulso.alerts',
            { type: 'debt_alert' },
            runDebtAlertJob
        );
        expect(messaging.publishOrRun).toHaveBeenCalledWith(
            'pulso.reminders',
            { type: 'reminder_alert' },
            runReminderAlertJob
        );
        expect(messaging.publishOrRun).toHaveBeenCalledWith(
            'pulso.reminders',
            { type: 'reminder_recurrence' },
            runReminderRecurrenceJob
        );
    });
});
