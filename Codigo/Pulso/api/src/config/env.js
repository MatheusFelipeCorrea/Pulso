if (!process.env.VERCEL) {
    require('dotenv').config();
}

const requiredVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'CORS_ORIGIN',
    'FRONTEND_URL',
];

const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
    const message = `Variáveis de ambiente faltando: ${missing.join(', ')}`;
    // Não usar process.exit no load do módulo — quebra bundle/build serverless na Vercel.
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
        console.error(`❌ ${message}`);
    } else {
        console.error('❌ Variáveis de ambiente faltando:');
        missing.forEach((key) => console.error(`   - ${key}`));
        process.exit(1);
    }
}

module.exports = {
    PORT: process.env.PORT || 3333,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CALENDAR_CALLBACK_URL:
        process.env.GOOGLE_CALENDAR_CALLBACK_URL ||
        (process.env.GOOGLE_CALLBACK_URL
            ? process.env.GOOGLE_CALLBACK_URL.replace(
                  '/api/auth/google/callback',
                  '/api/calendario/google/callback'
              )
            : undefined),
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CRON_SECRET: process.env.CRON_SECRET,
};