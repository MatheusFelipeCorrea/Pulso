#!/usr/bin/env node
/**
 * Sobe só o cliente AMQP contra o broker do docker-compose.
 * Não carrega a API (env/Prisma) — só prova que a imagem aceita as filas do Pulso.
 */
const amqp = require('amqplib');

const url = process.env.RABBITMQ_URL || 'amqp://pulso:pulso@localhost:5672';
const queues = ['pulso.alerts', 'pulso.reminders', 'pulso.emails'];

const main = async () => {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    for (const queue of queues) {
        await channel.assertQueue(queue, { durable: true });
    }
    await channel.close();
    await connection.close();
    console.log(`RabbitMQ OK (${url}) — filas: ${queues.join(', ')}`);
};

main().catch((err) => {
    console.error(`RabbitMQ falhou: ${err.message}`);
    process.exit(1);
});
