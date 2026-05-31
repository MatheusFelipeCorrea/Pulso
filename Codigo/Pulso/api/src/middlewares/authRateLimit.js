const { rateLimit } = require('express-rate-limit');

const rateLimitResponse = {
    status: 'error',
    message: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
};

/**
 * Limite de 5 requisições/min por IP — rotas sensíveis de autenticação.
 */
const authSensitiveRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse,
});

module.exports = {
    authSensitiveRateLimit,
};
