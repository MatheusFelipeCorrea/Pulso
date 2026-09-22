const env = require('../config/env');

/**
 * Protege rotas /api/cron/* — Vercel envia Authorization: Bearer <CRON_SECRET>.
 */
const cronAuthMiddleware = (req, res, next) => {
    const secret = env.CRON_SECRET;

    if (!secret) {
        return res.status(503).json({
            status: 'error',
            message: 'CRON_SECRET não configurado',
        });
    }

    const header = req.headers.authorization || '';
    if (header !== `Bearer ${secret}`) {
        return res.status(401).json({
            status: 'error',
            message: 'Não autorizado',
        });
    }

    return next();
};

module.exports = cronAuthMiddleware;
