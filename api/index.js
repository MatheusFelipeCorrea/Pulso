/**
 * Entrada serverless da Vercel — encaminha /api/* para o Express.
 * Dev local continua usando Codigo/Pulso/api/src/server.js (npm run dev).
 */
const path = require('path');
const serverless = require('serverless-http');

if (!process.env.VERCEL) {
    require('dotenv').config({
        path: path.join(__dirname, '../Codigo/Pulso/api/.env'),
    });
}

let handler;

const getHandler = () => {
    if (!handler) {
        const app = require('../Codigo/Pulso/api/src/app');
        handler = serverless(app, {
            binary: ['image/*', 'application/pdf'],
        });
    }
    return handler;
};

module.exports = (req, res) => getHandler()(req, res);
