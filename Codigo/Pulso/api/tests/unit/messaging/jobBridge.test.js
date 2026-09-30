jest.mock('../../../src/messaging/rabbit', () => ({
    isBrokerEnabled: jest.fn(),
    getChannel: jest.fn(),
}));

jest.mock('../../../src/messaging/emailBridge', () => ({
    startEmailConsumers: jest.fn().mockResolvedValue(undefined),
}));

const messaging = require('../../../src/messaging/rabbit');
const { startEmailConsumers } = require('../../../src/messaging/emailBridge');
const { startMessagingWorkers } = require('../../../src/messaging/jobBridge');
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
        expect(logger.info).toHaveBeenCalledWith(
            expect.stringContaining('Vercel')
        );
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
    });
});
