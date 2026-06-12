/**
 * Entrada serverless da Vercel — exporta o Express diretamente.
 * Dev local continua usando Codigo/Pulso/api/src/server.js (npm run dev).
 */
const path = require('path');

const isVercelRuntime = process.env.VERCEL === '1' && Boolean(process.env.VERCEL_ENV);

if (!isVercelRuntime) {
    require('dotenv').config({
        path: path.join(__dirname, '../Codigo/Pulso/api/.env'),
    });
}

module.exports = require('../Codigo/Pulso/api/src/app');
