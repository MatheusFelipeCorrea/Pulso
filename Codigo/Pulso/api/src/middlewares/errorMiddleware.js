const logger = require('../utils/logger');
const { isPrismaUniqueViolation, mapPrismaUniqueViolation } = require('../utils/prismaErrors');
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            message: 'Corpo da requisição inválido',
        });
    }

    if (isPrismaUniqueViolation(err)) {
        const mapped = mapPrismaUniqueViolation(err);
        logger.warn(`${mapped.statusCode} - ${mapped.message}`);
        return res.status(mapped.statusCode).json({
            status: 'error',
            message: mapped.message,
        });
    }

    // Se for AppError (erro conhecido)
    if (err.isOperational) {
        logger.warn(`${err.statusCode} - ${err.message}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

// Erro inesperado (bug)
    logger.error(`500 - ${err.message}`);
    logger.error(err.stack);

    return res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
    });
};

module.exports = errorMiddleware;