const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const env = require('../config/env');
const authRepository = require('../repositories/authRepository');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Token não fornecido ou inválido.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);

        const usuario = await authRepository.findById(decoded.sub);

        if (!usuario) {
            throw new AppError('Usuário não encontrado.', 401);
        }

        req.user = {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
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
