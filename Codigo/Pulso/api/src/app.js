const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('./config/passport');
const env = require('./config/env');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares globais
app.use(helmet());
const corsOrigins = (env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: corsOrigins.length <= 1 ? corsOrigins[0] : corsOrigins,
    exposedHeaders: ['X-Total-Count', 'X-Total-Pages', 'X-Current-Page'],
}));
app.use(express.json());
app.use(passport.initialize());

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