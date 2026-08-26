const messaging = require('./rabbit');
const emailProvider = require('../providers/emailProvider');
const logger = require('../utils/logger');

const enqueueVerificationEmail = async (email, token) => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.EMAILS,
        { type: 'verification', email, token },
        () => emailProvider.sendVerificationEmail(email, token)
    );
    if (mode === 'queued') logger.info('📤 Email verificação enfileirado em pulso.emails');
};

const enqueuePasswordResetEmail = async (email, token) => {
    const mode = await messaging.publishOrRun(
        messaging.QUEUES.EMAILS,
        { type: 'password_reset', email, token },
        () => emailProvider.sendPasswordResetEmail(email, token)
    );
    if (mode === 'queued') logger.info('📤 Email reset enfileirado em pulso.emails');
};

const startEmailConsumers = async () => {
    await messaging.consume(messaging.QUEUES.EMAILS, async (payload) => {
        if (payload.type === 'password_reset') {
            await emailProvider.sendPasswordResetEmail(payload.email, payload.token);
            return;
        }
        await emailProvider.sendVerificationEmail(payload.email, payload.token);
    });
};

module.exports = {
    enqueueVerificationEmail,
    enqueuePasswordResetEmail,
    startEmailConsumers,
};
