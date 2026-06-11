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

const createBaseClient = () =>
    new PrismaClient({
        log: logConfig,
    });

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
