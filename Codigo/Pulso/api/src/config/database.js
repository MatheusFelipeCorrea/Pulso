const { PrismaClient } = require('@prisma/client');

const isTransientConnectionError = (error) => {
    const message = error?.message ?? '';
    return (
        error?.code === 'P1001' ||
        error?.code === 'P1017' ||
        message.includes('Closed') ||
        message.includes('Connection terminated') ||
        message.includes('connection was closed')
    );
};

const logConfig = ['error', 'warn'];

const createBaseClient = () => {
    if (process.env.VERCEL) {
        const { PrismaNeon } = require('@prisma/adapter-neon');
        const { Pool, neonConfig } = require('@neondatabase/serverless');
        const ws = require('ws');

        neonConfig.webSocketConstructor = ws;

        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaNeon(pool);

        return new PrismaClient({ adapter, log: logConfig });
    }

    return new PrismaClient({ log: logConfig });
};

/**
 * Evita múltiplas instâncias no nodemon (dev) e reconecta se o Neon fechar conexão idle.
 */
const createPrismaClient = () => {
    const baseClient = createBaseClient();

    return baseClient.$extends({
        query: {
            $allModels: {
                async $allOperations({ args, query }) {
                    try {
                        return await query(args);
                    } catch (error) {
                        if (!isTransientConnectionError(error)) {
                            throw error;
                        }

                        await baseClient.$disconnect().catch(() => {});
                        await baseClient.$connect();

                        return query(args);
                    }
                },
            },
        },
    });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;
