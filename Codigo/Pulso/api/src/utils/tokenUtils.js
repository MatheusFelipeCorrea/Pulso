const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const signAccessToken = (usuario) =>
    jwt.sign(
        {
            sub: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
        },
        env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_TTL }
    );

const createRefreshTokenValue = () => crypto.randomBytes(48).toString('hex');

const getRefreshTokenExpiry = (lembrarMe = false) =>
    new Date(Date.now() + (lembrarMe ? REFRESH_TOKEN_REMEMBER_TTL_MS : REFRESH_TOKEN_TTL_MS));

module.exports = {
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL_MS,
    REFRESH_TOKEN_REMEMBER_TTL_MS,
    signAccessToken,
    createRefreshTokenValue,
    getRefreshTokenExpiry,
};
