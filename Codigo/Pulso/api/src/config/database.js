const { PrismaClient } = require('@prisma/client');

const KEEPALIVE_INTERVAL_MS = 4 * 60 * 1000;

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

const reconnectClient = async (client) => {
    await client.$disconnect().catch(() => {});
    await client.$connect();
};

const startConnectionKeepAlive = (client) => {
    if (process.env.NODE_ENV === 'test' || process.env.VERCEL) {
        return;
    }

    const timer = setInterval(async () => {
        try {
            await client.$queryRaw`SELECT 1`;
        } catch (error) {
            if (isTransientConnectionError(error)) {
                await reconnectClient(client);
            }
        }
    }, KEEPALIVE_INTERVAL_MS);

    if (typeof timer.unref === 'function') {
        timer.unref();
    }
};

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

                        await reconnectClient(baseClient);

                        return query(args);
                    }
                },
            },
        },
    });
};

const globalForPrisma = globalThis;

const getPrisma = () => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
        startConnectionKeepAlive(globalForPrisma.prisma);
    }
    return globalForPrisma.prisma;
};

module.exports = new Proxy(
    {},
    {
        get(_target, prop) {
            const prisma = getPrisma();
            const value = prisma[prop];
            return typeof value === 'function' ? value.bind(prisma) : value;
        },
    }
);
