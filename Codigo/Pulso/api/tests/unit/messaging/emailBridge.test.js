const emailProvider = require('../../../src/providers/emailProvider');

jest.mock('../../../src/messaging/rabbit', () => ({
    QUEUES: { EMAILS: 'pulso.emails' },
    publishOrRun: jest.fn(),
    consume: jest.fn(),
}));

const messaging = require('../../../src/messaging/rabbit');
const {
    enqueueVerificationEmail,
    enqueuePasswordResetEmail,
    startEmailConsumers,
} = require('../../../src/messaging/emailBridge');

describe('emailBridge', () => {
    beforeEach(() => {
        messaging.publishOrRun.mockReset();
        messaging.consume.mockReset();
        emailProvider.sendVerificationEmail.mockReset();
        emailProvider.sendPasswordResetEmail.mockReset();
        messaging.publishOrRun.mockImplementation(async (_queue, _payload, fallback) => {
            await fallback();
            return 'direct';
        });
    });

    it('enfileira verificação e cai no SMTP direto no fallback', async () => {
        messaging.publishOrRun.mockResolvedValue('queued');

        await enqueueVerificationEmail('a@b.com', 'tok');

        expect(messaging.publishOrRun).toHaveBeenCalledWith(
            'pulso.emails',
            { type: 'verification', email: 'a@b.com', token: 'tok' },
            expect.any(Function)
        );
        const fallback = messaging.publishOrRun.mock.calls[0][2];
        await fallback();
        expect(emailProvider.sendVerificationEmail).toHaveBeenCalledWith('a@b.com', 'tok');
    });

    it('enfileira reset e cai no SMTP direto no fallback', async () => {
        messaging.publishOrRun.mockResolvedValue('queued');

        await enqueuePasswordResetEmail('a@b.com', 'tok');

        const fallback = messaging.publishOrRun.mock.calls[0][2];
        await fallback();
        expect(emailProvider.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.com', 'tok');
    });

    it('consumer de verificação chama o provider', async () => {
        let handler;
        messaging.consume.mockImplementation(async (_queue, fn) => {
            handler = fn;
            return true;
        });

        await startEmailConsumers();
        await handler({ type: 'verification', email: 'a@b.com', token: 't' });

        expect(emailProvider.sendVerificationEmail).toHaveBeenCalledWith('a@b.com', 't');
    });

    it('consumer de reset chama o provider', async () => {
        let handler;
        messaging.consume.mockImplementation(async (_queue, fn) => {
            handler = fn;
            return true;
        });

        await startEmailConsumers();
        await handler({ type: 'password_reset', email: 'a@b.com', token: 't' });

        expect(emailProvider.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.com', 't');
    });
});
