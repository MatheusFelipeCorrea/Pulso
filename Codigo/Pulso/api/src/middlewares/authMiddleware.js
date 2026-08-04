const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const env = require('../config/env');
const { getAccessTokenFromRequest } = require('../utils/authCookies');

const authMiddleware = async (req, res, next) => {
    try {
        const token = getAccessTokenFromRequest(req);

        if (!token) {
            throw new AppError('Token não fornecido ou inválido.', 401);
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);

        if (!decoded.sub) {
            throw new AppError('Token inválido.', 401);
        }

        // Claims já vêm do JWT — evita query ao banco em toda requisição autenticada
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            nome: decoded.nome,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expirado.', 401));
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Token inválido.', 401));
        }

        next(error);
    }
};

module.exports = authMiddleware;
