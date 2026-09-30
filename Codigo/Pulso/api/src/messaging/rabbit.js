const amqp = require('amqplib');
const env = require('../config/env');
const logger = require('../utils/logger');

/** Filas TI5 — mensageria acadêmica */
const QUEUES = {
    ALERTS: 'pulso.alerts',
    REMINDERS: 'pulso.reminders',
    EMAILS: 'pulso.emails',
};

const RETRY_MS = 15_000;

let connection = null;
let channel = null;
let connecting = null;
let lastConnectFailAt = 0;

/** Credencial preenchida (`RABBITMQ_URL`). Não implica que o broker esteja no ar. */
const isConfigured = () => Boolean(env.RABBITMQ_URL);

/**
 * Broker pode ser usado neste processo: URL presente e não-serverless.
 * Na Vercel o AMQP não tem consumer estável — emails vão direto (SMTP).
 */
const isBrokerEnabled = () => isConfigured() && !process.env.VERCEL;

const getChannel = async () => {
    if (!isBrokerEnabled()) return null;
    if (channel) return channel;
    if (connecting) return connecting;
    if (lastConnectFailAt && Date.now() - lastConnectFailAt < RETRY_MS) {
        return null;
    }

    connecting = (async () => {
        try {
            connection = await amqp.connect(env.RABBITMQ_URL);
            connection.on('error', (err) => {
                logger.error(`RabbitMQ connection error: ${err.message}`);
                channel = null;
                connection = null;
            });
            connection.on('close', () => {
                channel = null;
                connection = null;
                logger.warn('RabbitMQ connection closed — emails/jobs seguem em modo direto');
            });

            channel = await connection.createChannel();
            await channel.assertQueue(QUEUES.ALERTS, { durable: true });
            await channel.assertQueue(QUEUES.REMINDERS, { durable: true });
            await channel.assertQueue(QUEUES.EMAILS, { durable: true });
            lastConnectFailAt = 0;
            logger.info('🐰 RabbitMQ conectado (filas alerts + reminders + emails)');
            return channel;
        } catch (err) {
            lastConnectFailAt = Date.now();
            logger.warn(`RabbitMQ indisponível — jobs rodam em modo direto: ${err.message}`);
            channel = null;
            connection = null;
            return null;
        } finally {
            connecting = null;
        }
    })();

    return connecting;
};

/**
 * Publica job na fila. Se o broker estiver offline, cair no meio do caminho
 * ou recusar o publish, executa `fallback` na hora (não quebra o app).
 * @returns {'queued' | 'direct'}
 */
const publishOrRun = async (queue, payload, fallback) => {
    const ch = await getChannel();
    if (!ch) {
        await fallback();
        return 'direct';
    }

    const body = Buffer.from(JSON.stringify({ ...payload, enqueuedAt: new Date().toISOString() }));
    try {
        const ok = ch.sendToQueue(queue, body, {
            persistent: true,
            contentType: 'application/json',
        });
        if (!ok) {
            logger.warn('RabbitMQ buffer cheio — executando direto');
            await fallback();
            return 'direct';
        }
        return 'queued';
    } catch (err) {
        logger.warn(`RabbitMQ publish falhou — executando direto: ${err.message}`);
        channel = null;
        connection = null;
        await fallback();
        return 'direct';
    }
};

const consume = async (queue, handler) => {
    const ch = await getChannel();
    if (!ch) return false;

    await ch.consume(queue, async (msg) => {
        if (!msg) return;
        try {
            const payload = JSON.parse(msg.content.toString());
            await handler(payload);
            ch.ack(msg);
        } catch (err) {
            logger.error(`RabbitMQ consumer [${queue}]: ${err.message}`);
            ch.nack(msg, false, false);
        }
    });

    logger.info(`🐰 Consumer ativo: ${queue}`);
    return true;
};

const close = async () => {
    try {
        await channel?.close();
        await connection?.close();
    } catch {
        /* ignore */
    }
    channel = null;
    connection = null;
    connecting = null;
    lastConnectFailAt = 0;
};

module.exports = {
    QUEUES,
    isConfigured,
    isBrokerEnabled,
    getChannel,
    publishOrRun,
    consume,
    close,
};
