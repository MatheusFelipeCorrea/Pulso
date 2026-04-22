const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');

const start = async () => {
    try {
        // Testa conexão com o banco
        await prisma.$connect();
        logger.info('🗄️  Banco de dados conectado');

        app.listen(env.PORT, () => {
            logger.info(`💜 Pulso API rodando na porta ${env.PORT}`);
            logger.info(`📚 Docs: http://localhost:${env.PORT}/api/docs`);
            logger.info(`🏥 Health: http://localhost:${env.PORT}/api/health`);
        });
    } catch (error) {
        logger.error('❌ Falha ao iniciar o servidor:');
        logger.error(error.message);
        process.exit(1);
    }
};

start();