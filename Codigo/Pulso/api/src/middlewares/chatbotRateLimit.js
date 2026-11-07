const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const chatbotRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
    message: {
        status: 'error',
        message: 'Muitas mensagens ao chatbot. Aguarde um minuto e tente novamente.',
    },
});

module.exports = chatbotRateLimit;
