const { rateLimit } = require('express-rate-limit');

const rateLimitResponse = {
    status: 'error',
    message: 'Muitas tentativas com código de convite. Aguarde um minuto e tente novamente.',
};

/** Limite compartilhado por usuário autenticado (preview + entrar). */
const grupoInviteCodeRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id ?? req.ip,
    message: rateLimitResponse,
});

module.exports = {
    grupoInviteCodeRateLimit,
};
