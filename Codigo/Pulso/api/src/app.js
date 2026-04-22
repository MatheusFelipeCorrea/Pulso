const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '💜 Pulso API rodando!' });
});

// TODO: Registrar rotas aqui
// app.use('/api', routes);

// Error handler (sempre por último)
app.use(errorMiddleware);

module.exports = app;