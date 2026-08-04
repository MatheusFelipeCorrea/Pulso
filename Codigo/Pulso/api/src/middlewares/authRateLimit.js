const { rateLimit } = require('express-rate-limit');

const rateLimitResponse = {
    status: 'error',
    message: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
};

const baseAuthRateLimitOptions = {
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitResponse,
};

/**
 * Cada rota sensível tem contador próprio por IP (instâncias separadas).
 */
const createAuthRouteRateLimit = () => rateLimit({ ...baseAuthRateLimitOptions });

const authRegisterRateLimit = createAuthRouteRateLimit();
const authLoginRateLimit = createAuthRouteRateLimit();
const authOAuthExchangeRateLimit = createAuthRouteRateLimit();
const authRefreshRateLimit = createAuthRouteRateLimit();
const authLogoutRateLimit = createAuthRouteRateLimit();
const authForgotPasswordRateLimit = createAuthRouteRateLimit();
const authResetPasswordRateLimit = createAuthRouteRateLimit();
const authVerifyEmailRateLimit = createAuthRouteRateLimit();
const authResendVerificationRateLimit = createAuthRouteRateLimit();

/** @deprecated Use limitadores por rota — mantido para compatibilidade de imports antigos */
const authSensitiveRateLimit = authLoginRateLimit;

module.exports = {
    authSensitiveRateLimit,
    authRegisterRateLimit,
    authLoginRateLimit,
    authOAuthExchangeRateLimit,
    authRefreshRateLimit,
    authLogoutRateLimit,
    authForgotPasswordRateLimit,
    authResetPasswordRateLimit,
    authVerifyEmailRateLimit,
    authResendVerificationRateLimit,
};
