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

const isHealthRequest = (req) => {
    const url = req.url || '';
    return url === '/api/health' || url.startsWith('/api/health?');
};

module.exports = (req, res) => {
    if (isHealthRequest(req)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok', message: '💜 Pulso API rodando!' }));
        return;
    }

    return getHandler()(req, res);
};
