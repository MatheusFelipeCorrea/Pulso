const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('./config/passport');
const env = require('./config/env');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Vercel (e outros proxies) enviam X-Forwarded-For — necessário para rate-limit e IP real
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middlewares globais
app.use(
    helmet({
        // API é chamada pelo Flutter web em outra origem (ex.: :8080 → :3333).
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);
const corsOrigins = (env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

const isLocalDevOrigin = (origin) =>
    Boolean(origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin));

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || corsOrigins.includes(origin) || isLocalDevOrigin(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS bloqueado para origem: ${origin}`));
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Pulso-Client'],
        exposedHeaders: ['X-Total-Count', 'X-Total-Pages', 'X-Current-Page'],
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// Uploads locais (dev) — produção usa Vercel Blob
if (!process.env.VERCEL) {
    app.use(
        '/api/uploads/grupos',
        express.static(path.join(__dirname, '../uploads/grupos'), {
            maxAge: '7d',
            immutable: true,
        })
    );
    app.use(
        '/api/uploads/compras',
        express.static(path.join(__dirname, '../uploads/compras'), {
            maxAge: '7d',
            immutable: true,
        })
    );
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '💜 Pulso API rodando!' });
});

// Rotas da API
const routes = require('./routes');
app.use('/api', routes);

// Error handler (sempre por último)
app.use(errorMiddleware);

module.exports = app;
