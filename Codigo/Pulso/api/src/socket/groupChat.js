const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../utils/logger');
const prisma = require('../config/database');
const { ACCESS_COOKIE } = require('../utils/authCookies');

/** @type {import('socket.io').Server | null} */
let io = null;

const roomName = (grupoId) => `grupo:${grupoId}`;

const parseCookieValue = (cookieHeader, name) => {
    if (!cookieHeader) return null;
    const parts = String(cookieHeader).split(';');
    for (const part of parts) {
        const [k, ...rest] = part.trim().split('=');
        if (k === name) return decodeURIComponent(rest.join('=') || '');
    }
    return null;
};

const extractToken = (socket) => {
    const authToken = socket.handshake.auth?.token;
    if (authToken) return authToken;

    const header = socket.handshake.headers?.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);

    return parseCookieValue(socket.handshake.headers?.cookie, ACCESS_COOKIE);
};

/**
 * Socket.IO no path /api/socket.io para reaproveitar cookie httpOnly (path=/api).
 * Chat REST continua funcionando se o socket falhar.
 */
const initSocket = (httpServer) => {
    const corsOrigins = (env.CORS_ORIGIN || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    io = new Server(httpServer, {
        path: '/api/socket.io',
        cors: {
            origin: corsOrigins.length <= 1 ? corsOrigins[0] : corsOrigins,
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = extractToken(socket);
            if (!token) return next(new Error('Não autenticado'));

            const decoded = jwt.verify(token, env.JWT_SECRET);
            if (!decoded.sub) return next(new Error('Token inválido'));

            socket.user = {
                id: decoded.sub,
                email: decoded.email,
                nome: decoded.nome,
            };
            next();
        } catch {
            next(new Error('Não autenticado'));
        }
    });

    io.on('connection', async (socket) => {
        try {
            const membros = await prisma.membroGrupo.findMany({
                where: { usuarioId: socket.user.id },
                select: { grupoId: true },
            });
            for (const m of membros) {
                socket.join(roomName(m.grupoId));
            }
            logger.info(`🔌 Socket conectado: ${socket.user.id} (${membros.length} salas)`);
        } catch (err) {
            logger.warn(`Socket join falhou: ${err.message}`);
        }

        socket.on('grupo:join', async (grupoId, ack) => {
            try {
                const membro = await prisma.membroGrupo.findFirst({
                    where: { grupoId, usuarioId: socket.user.id },
                });
                if (!membro) {
                    ack?.({ ok: false, error: 'Sem acesso ao grupo' });
                    return;
                }
                socket.join(roomName(grupoId));
                ack?.({ ok: true });
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });
    });

    logger.info('🔌 Socket.IO ativo em /api/socket.io');
    return io;
};

const emitGrupoMensagem = (grupoId, mensagem) => {
    if (!io) return;
    io.to(roomName(grupoId)).emit('grupo:mensagem', { grupoId, mensagem });
};

const getIo = () => io;

module.exports = {
    initSocket,
    emitGrupoMensagem,
    getIo,
    roomName,
};
