/**
 * Entrada serverless da Vercel — exporta o Express diretamente.
 * Dev local continua usando Codigo/Pulso/api/src/server.js (npm run dev).
 */
const path = require('path');

if (!process.env.VERCEL) {
    require('dotenv').config({
        path: path.join(__dirname, '../Codigo/Pulso/api/.env'),
    });
}

module.exports = require('../Codigo/Pulso/api/src/app');
