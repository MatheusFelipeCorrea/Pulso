describe('rabbit', () => {
    const mockConnect = jest.fn();

    const mockChannel = (overrides = {}) => ({
        assertQueue: jest.fn().mockResolvedValue({}),
        sendToQueue: jest.fn().mockReturnValue(true),
        consume: jest.fn().mockResolvedValue({}),
        ack: jest.fn(),
        nack: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    const mockConnection = (channel) => ({
        createChannel: jest.fn().mockResolvedValue(channel),
        on: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
    });

    const loadRabbit = (url = 'amqp://pulso:pulso@localhost:5672', vercel) => {
        jest.resetModules();
        process.env.RABBITMQ_URL = url;
        if (vercel) {
            process.env.VERCEL = vercel;
        } else {
            delete process.env.VERCEL;
        }
        jest.doMock('amqplib', () => ({
            connect: (...args) => mockConnect(...args),
        }));
        return require('../../../src/messaging/rabbit');
    };

    afterEach(async () => {
        process.env.RABBITMQ_URL = '';
        delete process.env.VERCEL;
        mockConnect.mockReset();
    });

    it('sem URL executa fallback direto e não conecta', async () => {
        const rabbit = loadRabbit('');
        const fallback = jest.fn().mockResolvedValue(undefined);

        expect(rabbit.isConfigured()).toBe(false);
        expect(rabbit.isBrokerEnabled()).toBe(false);

        const mode = await rabbit.publishOrRun(rabbit.QUEUES.EMAILS, { type: 'verification' }, fallback);

        expect(mode).toBe('direct');
        expect(fallback).toHaveBeenCalled();
        expect(mockConnect).not.toHaveBeenCalled();
    });

    it('na Vercel ignora a URL e executa direto', async () => {
        const rabbit = loadRabbit('amqp://pulso:pulso@localhost:5672', '1');
        const fallback = jest.fn().mockResolvedValue(undefined);

        expect(rabbit.isConfigured()).toBe(true);
        expect(rabbit.isBrokerEnabled()).toBe(false);

        const mode = await rabbit.publishOrRun(rabbit.QUEUES.EMAILS, { type: 'x' }, fallback);

        expect(mode).toBe('direct');
        expect(fallback).toHaveBeenCalled();
        expect(mockConnect).not.toHaveBeenCalled();
    });

    it('enfileira quando o broker está no ar', async () => {
        const channel = mockChannel();
        mockConnect.mockResolvedValue(mockConnection(channel));
        const rabbit = loadRabbit();
        const fallback = jest.fn();

        const mode = await rabbit.publishOrRun(
            rabbit.QUEUES.EMAILS,
            { type: 'verification', email: 'a@b.com' },
            fallback
        );

        expect(mode).toBe('queued');
        expect(fallback).not.toHaveBeenCalled();
        expect(channel.assertQueue).toHaveBeenCalledTimes(3);
        expect(channel.sendToQueue).toHaveBeenCalledWith(
            rabbit.QUEUES.EMAILS,
            expect.any(Buffer),
            { persistent: true, contentType: 'application/json' }
        );
        await rabbit.close();
    });

    it('cai no fallback se o broker recusar a conexão', async () => {
        mockConnect.mockRejectedValue(new Error('ECONNREFUSED'));
        const rabbit = loadRabbit();
        const fallback = jest.fn().mockResolvedValue(undefined);

        const mode = await rabbit.publishOrRun(rabbit.QUEUES.EMAILS, { type: 'x' }, fallback);

        expect(mode).toBe('direct');
        expect(fallback).toHaveBeenCalled();
        await rabbit.close();
    });

    it('cai no fallback se o publish lançar (broker caiu no meio)', async () => {
        const channel = mockChannel({
            sendToQueue: jest.fn(() => {
                throw new Error('Channel closed');
            }),
        });
        mockConnect.mockResolvedValue(mockConnection(channel));
        const rabbit = loadRabbit();
        const fallback = jest.fn().mockResolvedValue(undefined);

        const mode = await rabbit.publishOrRun(rabbit.QUEUES.EMAILS, { type: 'x' }, fallback);

        expect(mode).toBe('direct');
        expect(fallback).toHaveBeenCalled();
        await rabbit.close();
    });

    it('cai no fallback se o buffer do canal estiver cheio', async () => {
        const channel = mockChannel({
            sendToQueue: jest.fn().mockReturnValue(false),
        });
        mockConnect.mockResolvedValue(mockConnection(channel));
        const rabbit = loadRabbit();
        const fallback = jest.fn().mockResolvedValue(undefined);

        const mode = await rabbit.publishOrRun(rabbit.QUEUES.EMAILS, { type: 'x' }, fallback);

        expect(mode).toBe('direct');
        expect(fallback).toHaveBeenCalled();
        await rabbit.close();
    });

    it('não inicia consumer sem canal', async () => {
        const rabbit = loadRabbit('');

        await expect(rabbit.consume(rabbit.QUEUES.EMAILS, jest.fn())).resolves.toBe(false);
    });

    it('ack na mensagem quando o handler resolve', async () => {
        const channel = mockChannel();
        let onMessage;
        channel.consume.mockImplementation(async (_queue, handler) => {
            onMessage = handler;
        });
        mockConnect.mockResolvedValue(mockConnection(channel));
        const rabbit = loadRabbit();
        const handler = jest.fn().mockResolvedValue(undefined);

        const started = await rabbit.consume(rabbit.QUEUES.EMAILS, handler);
        expect(started).toBe(true);

        const msg = { content: Buffer.from(JSON.stringify({ type: 'verification' })) };
        await onMessage(msg);

        expect(handler).toHaveBeenCalledWith({ type: 'verification' });
        expect(channel.ack).toHaveBeenCalledWith(msg);
        await rabbit.close();
    });

    it('nack sem requeue quando o handler falha', async () => {
        const channel = mockChannel();
        let onMessage;
        channel.consume.mockImplementation(async (_queue, handler) => {
            onMessage = handler;
        });
        mockConnect.mockResolvedValue(mockConnection(channel));
        const rabbit = loadRabbit();

        await rabbit.consume(rabbit.QUEUES.EMAILS, async () => {
            throw new Error('smtp down');
        });

        const msg = { content: Buffer.from(JSON.stringify({ type: 'verification' })) };
        await onMessage(msg);

        expect(channel.nack).toHaveBeenCalledWith(msg, false, false);
        expect(channel.ack).not.toHaveBeenCalled();
        await rabbit.close();
    });
});
