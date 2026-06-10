const { google } = require('googleapis');
const prisma = require('../config/database');
const AppError = require('../utils/appError');
const env = require('../config/env');

const googleCalendarSync = require('./googleCalendarSyncService');

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
];

const CALLBACK_PATH = '/api/calendario/google/callback';

const buildRedirectUri = (req) => {
    if (env.GOOGLE_CALENDAR_CALLBACK_URL) {
        return env.GOOGLE_CALENDAR_CALLBACK_URL;
    }

    const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
    const host = req.get('host');
    return `${proto}://${host}${CALLBACK_PATH}`;
};

const getOAuthClient = (redirectUri) =>
    new google.auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);

const parseTokens = (tokensGoogle) =>
    typeof tokensGoogle === 'string' ? JSON.parse(tokensGoogle) : tokensGoogle;

const obterEmailContaGoogle = async (tokensGoogle) => {
    if (!tokensGoogle) return null;

    const client = getOAuthClient(
        env.GOOGLE_CALENDAR_CALLBACK_URL || 'http://localhost:3333/api/calendario/google/callback'
    );
    client.setCredentials(parseTokens(tokensGoogle));

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();
    return data.email ?? null;
};

const ensureConfig = async (usuarioId) => {
    const existente = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });
    if (existente) return existente;
    return prisma.configuracaoUsuario.create({ data: { usuarioId } });
};

const obterStatus = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });

    const conectado = Boolean(config?.googleCalendarAtivo && config?.tokensGoogle);
    if (!conectado) {
        return { conectado: false, email: null };
    }

    let email = config.googleCalendarEmail ?? null;

    if (!email) {
        try {
            email = await obterEmailContaGoogle(config.tokensGoogle);
            if (email) {
                await prisma.configuracaoUsuario.update({
                    where: { usuarioId },
                    data: { googleCalendarEmail: email },
                });
            }
        } catch {
            email = null;
        }
    }

    return { conectado: true, email };
};

const obterUrlConexao = async (usuarioId, req) => {
    await ensureConfig(usuarioId);
    const redirectUri = buildRedirectUri(req);
    const client = getOAuthClient(redirectUri);

    const url = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
        state: usuarioId,
    });

    return { url, redirectUri };
};

const processarCallback = async (code, usuarioId, redirectUri) => {
    if (!code || !usuarioId) {
        throw new AppError('Autorização do Google inválida', 400);
    }

    const client = getOAuthClient(redirectUri);
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    let googleCalendarEmail = null;
    try {
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const { data } = await oauth2.userinfo.get();
        googleCalendarEmail = data.email ?? null;
    } catch {
        googleCalendarEmail = null;
    }

    await prisma.configuracaoUsuario.upsert({
        where: { usuarioId },
        create: {
            usuarioId,
            googleCalendarAtivo: true,
            tokensGoogle: tokens,
            googleCalendarEmail,
        },
        update: {
            googleCalendarAtivo: true,
            tokensGoogle: tokens,
            googleCalendarEmail,
        },
    });

    await googleCalendarSync.garantirCalendarioPulso(usuarioId);

    return { sucesso: true };
};

const revogarTokensNoGoogle = async (tokensGoogle) => {
    if (!tokensGoogle) return;

    const tokens = parseTokens(tokensGoogle);
    const token = tokens.refresh_token || tokens.access_token;

    if (!token) return;

    const client = getOAuthClient(
        env.GOOGLE_CALENDAR_CALLBACK_URL || 'http://localhost:3333/api/calendario/google/callback'
    );

    try {
        await client.revokeToken(token);
    } catch {
        // Token pode já estar expirado/revogado — o vínculo local ainda é desativado.
    }
};

/**
 * Corta o vínculo OAuth com o Google Calendar.
 * Remove o calendário "Pulso" do Google (some do app do celular).
 * Lembretes do Pulso permanecem no banco — apenas perdem o vínculo de sync.
 */
const desconectar = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });

    if (!config?.googleCalendarAtivo) return;

    await googleCalendarSync.removerCalendarioPulso(usuarioId);

    await prisma.lembrete.updateMany({
        where: { usuarioId },
        data: { sincronizado: false, googleEventId: null },
    });

    if (config.tokensGoogle) {
        await revogarTokensNoGoogle(config.tokensGoogle);
    }

    await prisma.configuracaoUsuario.update({
        where: { usuarioId },
        data: {
            googleCalendarAtivo: false,
            googleCalendarId: null,
            googleCalendarEmail: null,
        },
    });
};

module.exports = {
    obterStatus,
    obterUrlConexao,
    processarCallback,
    desconectar,
    buildRedirectUri,
};
