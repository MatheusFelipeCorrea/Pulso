/** Variáveis mínimas para carregar módulos da API nos testes. */
const testEnv = {
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    DIRECT_URL: 'postgresql://test:test@localhost:5432/test',
    JWT_SECRET: 'test-jwt-secret-min-32-chars-long!!',
    JWT_REFRESH_SECRET: 'test-jwt-refresh-secret-key!!!',
    GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
    GOOGLE_CALLBACK_URL: 'http://localhost:3333/api/auth/google/callback',
    GEMINI_API_KEY: 'test-gemini-key',
    SMTP_HOST: 'smtp.test.local',
    SMTP_PORT: '587',
    SMTP_USER: 'test-user',
    SMTP_PASS: 'test-pass',
    CORS_ORIGIN: 'http://localhost:5173',
    FRONTEND_URL: 'http://localhost:5173',
    NODE_ENV: 'test',
};

Object.assign(process.env, testEnv);

jest.mock('../src/repositories/authRepository');
jest.mock('../src/providers/emailProvider');
jest.mock('../src/utils/logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));
