/**
 * Entrada serverless da Vercel — encaminha /api/* para o Express.
 * Dev local continua usando Codigo/Pulso/api/src/server.js (npm run dev).
 */
const path = require('path');
const serverless = require('serverless-http');

require('dotenv').config({
    path: path.join(__dirname, '../Codigo/Pulso/api/.env'),
});

const app = require('../Codigo/Pulso/api/src/app');

module.exports = serverless(app, {
    binary: ['image/*', 'application/pdf'],
});
