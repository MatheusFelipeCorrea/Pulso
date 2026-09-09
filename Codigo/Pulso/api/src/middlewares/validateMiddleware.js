const AppError = require('../utils/appError');

/**
 * Valida req.body, req.params e req.query com schema Zod.
 * @param {import('zod').ZodType} schema
 */
const validateMiddleware = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (!result.success) {
        const firstIssue = result.error.issues[0];
        const message = firstIssue?.message || 'Dados inválidos';
        return next(new AppError(message, 400));
    }

    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
};

module.exports = validateMiddleware;
