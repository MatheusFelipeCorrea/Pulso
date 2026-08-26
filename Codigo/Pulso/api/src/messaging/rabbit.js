const amqp = require('amqplib');
const env = require('../config/env');
const logger = require('../utils/logger');

/** Filas TI5 — mensageria acadêmica */
const QUEUES = {
    ALERTS: 'pulso.alerts',
    REMINDERS: 'pulso.reminders',
    EMAILS: 'pulso.emails',
};

let connection = null;
let channel = null;
let connecting = null;

const isConfigured = () => Boolean(env.RABBITMQ_URL);

const getChannel = async () => {
    if (!isConfigured()) return null;
    if (channel) return channel;
    if (connecting) return connecting;

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
                logger.warn('RabbitMQ connection closed');
            });

            channel = await connection.createChannel();
            await channel.assertQueue(QUEUES.ALERTS, { durable: true });
            await channel.assertQueue(QUEUES.REMINDERS, { durable: true });
            await channel.assertQueue(QUEUES.EMAILS, { durable: true });
            logger.info('🐰 RabbitMQ conectado (filas alerts + reminders + emails)');
            return channel;
        } catch (err) {
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
 * Publica job na fila. Se broker offline, executa `fallback` na hora (não quebra o app).
 * @returns {'queued' | 'direct'}
 */
const publishOrRun = async (queue, payload, fallback) => {
    const ch = await getChannel();
    if (!ch) {
        await fallback();
        return 'direct';
    }

    const body = Buffer.from(JSON.stringify({ ...payload, enqueuedAt: new Date().toISOString() }));
    ch.sendToQueue(queue, body, { persistent: true, contentType: 'application/json' });
    return 'queued';
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
};

module.exports = {
    QUEUES,
    isConfigured,
    getChannel,
    publishOrRun,
    consume,
    close,
};
