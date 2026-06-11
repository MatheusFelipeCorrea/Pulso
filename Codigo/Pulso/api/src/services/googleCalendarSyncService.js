const { calendar_v3 } = require('@googleapis/calendar');
const prisma = require('../config/database');
const AppError = require('../utils/appError');
const env = require('../config/env');
const { createOAuthClient } = require('../utils/googleOAuth');
const { ANTECEDENCIA_MINUTOS } = require('../utils/reminderAntecedencia');
const { CATEGORIA_LABELS } = require('../constants/reminderCategories');

const PULSO_CALENDAR_SUMMARY = 'Pulso';
const TIMEZONE = 'America/Sao_Paulo';

const getRedirectUri = () =>
    env.GOOGLE_CALENDAR_CALLBACK_URL || 'http://localhost:3333/api/calendario/google/callback';

const getOAuthClient = () => createOAuthClient(getRedirectUri());

const parseTokens = (tokensGoogle) =>
    typeof tokensGoogle === 'string' ? JSON.parse(tokensGoogle) : tokensGoogle;

const formatDateOnly = (date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date(date));

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const mapGoogleError = (error) => {
    if (error instanceof AppError) return error;

    const message = error?.message || '';
    const status = error?.code ?? error?.response?.status;

    if (message.includes('insufficient authentication scopes')) {
        return new AppError(
            'Reconecte o Google Agenda para autorizar a sincronização com o calendário Pulso.',
            400
        );
    }

    if (status === 401 || message.includes('invalid_grant')) {
        return new AppError('Sessão do Google expirada. Reconecte o Google Agenda.', 401);
    }

    if (status === 403) {
        return new AppError('Sem permissão no Google Agenda. Reconecte sua conta Google.', 403);
    }

    return error;
};

const withGoogleHandling = async (fn) => {
    try {
        return await fn();
    } catch (error) {
        throw mapGoogleError(error);
    }
};

const pendenteSyncWhere = (usuarioId, { apenasFuturos = false } = {}) => {
    const where = {
        usuarioId,
        pago: false,
        OR: [{ googleEventId: null }, { sincronizado: false }],
    };

    if (apenasFuturos) {
        where.dataVencimento = { gte: startOfDay(new Date()) };
    }

    return where;
};

const estaConectado = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });
    return Boolean(config?.googleCalendarAtivo && config?.tokensGoogle);
};

const getCalendarApi = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });

    if (!config?.googleCalendarAtivo || !config.tokensGoogle) {
        throw new AppError('Conecte o Google Agenda para sincronizar lembretes.', 400);
    }

    const client = getOAuthClient();
    client.setCredentials(parseTokens(config.tokensGoogle));

    client.on('tokens', async (tokens) => {
        const merged = { ...parseTokens(config.tokensGoogle), ...tokens };
        await prisma.configuracaoUsuario.update({
            where: { usuarioId },
            data: { tokensGoogle: merged },
        });
    });

    return {
        calendar: new calendar_v3.Calendar({ auth: client }),
        config,
    };
};

const tornarCalendarioVisivel = async (calendar, calendarId) => {
    try {
        await calendar.calendarList.patch({
            calendarId,
            requestBody: {
                selected: true,
                hidden: false,
                summaryOverride: PULSO_CALENDAR_SUMMARY,
            },
        });
    } catch (error) {
        const status = error?.code ?? error?.response?.status;
        if (status !== 404) throw error;

        await calendar.calendarList.insert({
            requestBody: { id: calendarId },
        });
        await calendar.calendarList.patch({
            calendarId,
            requestBody: {
                selected: true,
                hidden: false,
                summaryOverride: PULSO_CALENDAR_SUMMARY,
            },
        });
    }
};

const garantirCalendarioPulso = async (usuarioId) =>
    withGoogleHandling(async () => {
        const { calendar, config } = await getCalendarApi(usuarioId);
        let calendarId = config.googleCalendarId;

        if (calendarId) {
            try {
                await calendar.calendars.get({ calendarId });
            } catch {
                calendarId = null;
            }
        }

        if (!calendarId) {
            const { data: list } = await calendar.calendarList.list();
            const existente = (list.items || []).find(
                (item) => item.summary === PULSO_CALENDAR_SUMMARY && item.accessRole === 'owner'
            );

            if (existente?.id) {
                calendarId = existente.id;
            } else {
                const { data: criado } = await calendar.calendars.insert({
                    requestBody: {
                        summary: PULSO_CALENDAR_SUMMARY,
                        description: 'Lembretes financeiros sincronizados pelo Pulso',
                        timeZone: TIMEZONE,
                    },
                });
                calendarId = criado.id;
            }

            await prisma.configuracaoUsuario.update({
                where: { usuarioId },
                data: { googleCalendarId: calendarId },
            });
        }

        try {
            await tornarCalendarioVisivel(calendar, calendarId);
        } catch (visibilityError) {
            console.warn(
                '[googleCalendar] Não foi possível marcar calendário Pulso como visível:',
                visibilityError?.message
            );
        }

        return calendarId;
    });

const buildEventBody = (lembrete) => {
    const startDate = formatDateOnly(lembrete.dataVencimento);
    const endDate = formatDateOnly(addDays(lembrete.dataVencimento, 1));
    const categoriaLabel = CATEGORIA_LABELS[lembrete.categoria] ?? lembrete.categoria;
    const valorTexto =
        lembrete.valor != null && Number(lembrete.valor) > 0
            ? `Valor: R$ ${Number(lembrete.valor).toFixed(2).replace('.', ',')}`
            : null;

    const linhas = ['Lembrete financeiro do Pulso', `Categoria: ${categoriaLabel}`];
    if (valorTexto) linhas.push(valorTexto);

    const minutos = ANTECEDENCIA_MINUTOS[lembrete.antecedencia] ?? ANTECEDENCIA_MINUTOS.UM_DIA;

    return {
        summary: lembrete.titulo,
        description: linhas.join('\n'),
        start: { date: startDate, timeZone: TIMEZONE },
        end: { date: endDate, timeZone: TIMEZONE },
        reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: minutos }],
        },
    };
};

const sincronizarLembrete = async (usuarioId, lembrete) =>
    withGoogleHandling(async () => {
        const calendarId = await garantirCalendarioPulso(usuarioId);
        const { calendar } = await getCalendarApi(usuarioId);
        const requestBody = buildEventBody(lembrete);

        if (lembrete.googleEventId) {
            try {
                const { data } = await calendar.events.update({
                    calendarId,
                    eventId: lembrete.googleEventId,
                    requestBody,
                });
                return { googleEventId: data.id };
            } catch (error) {
                const status = error?.code ?? error?.response?.status;
                if (status !== 404 && status !== 410) throw error;
            }
        }

        const { data } = await calendar.events.insert({
            calendarId,
            requestBody,
        });

        return { googleEventId: data.id };
    });

const contarPendentesSync = async (usuarioId) => {
    const hoje = startOfDay(new Date());
    const [futuros, todos, futurosNaoPagos, todosNaoPagos] = await Promise.all([
        prisma.lembrete.count({ where: pendenteSyncWhere(usuarioId, { apenasFuturos: true }) }),
        prisma.lembrete.count({ where: pendenteSyncWhere(usuarioId) }),
        prisma.lembrete.count({
            where: { usuarioId, pago: false, dataVencimento: { gte: hoje } },
        }),
        prisma.lembrete.count({ where: { usuarioId, pago: false } }),
    ]);

    return { futuros, todos, futurosNaoPagos, todosNaoPagos };
};

const sincronizarPendentes = async (usuarioId, escopo = 'futuros') => {
    const conectado = await estaConectado(usuarioId);
    if (!conectado) {
        throw new AppError('Conecte o Google Agenda para sincronizar lembretes.', 400);
    }

    const hoje = startOfDay(new Date());
    let where;

    if (escopo === 'todos') {
        // Todos os não sincronizados (inclui vencidos) — lembretes criados antes do vínculo
        where = pendenteSyncWhere(usuarioId);
    } else if (escopo === 'futuros_nao_pagos') {
        where = { usuarioId, pago: false, dataVencimento: { gte: hoje } };
    } else {
        // Apenas pendentes com vencimento futuro
        where = pendenteSyncWhere(usuarioId, { apenasFuturos: true });
    }

    const lembretes = await prisma.lembrete.findMany({
        where,
        orderBy: { dataVencimento: 'asc' },
    });

    if (lembretes.length === 0) {
        return { sincronizados: 0, total: 0, escopo };
    }

    let sincronizados = 0;
    const erros = [];

    for (const lembrete of lembretes) {
        try {
            const { googleEventId } = await sincronizarLembrete(usuarioId, lembrete);
            await prisma.lembrete.update({
                where: { id: lembrete.id },
                data: { googleEventId, sincronizado: true },
            });
            sincronizados += 1;
        } catch (error) {
            const mapped = mapGoogleError(error);
            erros.push({
                lembreteId: lembrete.id,
                titulo: lembrete.titulo,
                message: mapped?.message ?? error?.message ?? 'Erro desconhecido',
            });
        }
    }

    if (sincronizados === 0 && erros.length > 0) {
        throw new AppError(`Não foi possível sincronizar os lembretes: ${erros[0].message}`, 400);
    }

    return {
        sincronizados,
        total: lembretes.length,
        escopo,
        erros: erros.length > 0 ? erros : undefined,
    };
};

const removerEventoLembrete = async (usuarioId, googleEventId) => {
    if (!googleEventId) return;

    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });
    if (!config?.googleCalendarAtivo || !config.tokensGoogle || !config.googleCalendarId) return;

    try {
        const { calendar } = await getCalendarApi(usuarioId);
        await calendar.events.delete({
            calendarId: config.googleCalendarId,
            eventId: googleEventId,
        });
    } catch (error) {
        const status = error?.code || error?.response?.status;
        if (status !== 404 && status !== 410) throw error;
    }
};

const removerCalendarioPulso = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({ where: { usuarioId } });
    if (!config?.googleCalendarId || !config.tokensGoogle) return;

    try {
        const { calendar } = await getCalendarApi(usuarioId);
        await calendar.calendars.delete({ calendarId: config.googleCalendarId });
    } catch (error) {
        const status = error?.code || error?.response?.status;
        if (status !== 404 && status !== 410) throw error;
    }
};

module.exports = {
    estaConectado,
    garantirCalendarioPulso,
    sincronizarLembrete,
    contarPendentesSync,
    sincronizarPendentes,
    removerEventoLembrete,
    removerCalendarioPulso,
};
