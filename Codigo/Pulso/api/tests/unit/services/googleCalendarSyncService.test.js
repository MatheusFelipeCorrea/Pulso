const mockCalendarApi = {
    calendars: {
        get: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
    },
    calendarList: {
        list: jest.fn(),
        patch: jest.fn(),
        insert: jest.fn(),
    },
    events: {
        update: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
        list: jest.fn(),
    },
};
const mockCalendarCtor = jest.fn(() => mockCalendarApi);

jest.mock('@googleapis/calendar', () => ({
    calendar_v3: { Calendar: mockCalendarCtor },
}));
jest.mock('../../../src/config/database', () => ({
    configuracaoUsuario: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    lembrete: {
        count: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
    },
}));
jest.mock('../../../src/utils/googleOAuth', () => ({
    createOAuthClient: jest.fn(),
}));

const prisma = require('../../../src/config/database');
const { createOAuthClient } = require('../../../src/utils/googleOAuth');
const googleCalendarSync = require('../../../src/services/googleCalendarSyncService');

describe('googleCalendarSyncService', () => {
    const clientMock = {
        setCredentials: jest.fn(),
        on: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockCalendarCtor.mockReturnValue(mockCalendarApi);
        createOAuthClient.mockReturnValue(clientMock);
    });

    it('indica quando está conectado ao Google Calendar', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValueOnce(null);
        expect(await googleCalendarSync.estaConectado('u1')).toBe(false);

        prisma.configuracaoUsuario.findUnique.mockResolvedValueOnce({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
        });
        expect(await googleCalendarSync.estaConectado('u1')).toBe(true);
    });

    it('conta pendências de sincronização', async () => {
        prisma.lembrete.count
            .mockResolvedValueOnce(1)
            .mockResolvedValueOnce(2)
            .mockResolvedValueOnce(3)
            .mockResolvedValueOnce(4);

        const result = await googleCalendarSync.contarPendentesSync('u1');
        expect(result).toEqual({ futuros: 1, todos: 2, futurosNaoPagos: 3, todosNaoPagos: 4 });
    });

    it('sincronizarPendentes falha quando usuário não conectado', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: false,
            tokensGoogle: null,
        });

        await expect(googleCalendarSync.sincronizarPendentes('u1')).rejects.toMatchObject({
            statusCode: 400,
        });
    });

    it('sincronizarPendentes retorna zero quando nada pendente', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarId: 'cal-1',
        });
        prisma.lembrete.findMany.mockResolvedValue([]);

        const result = await googleCalendarSync.sincronizarPendentes('u1', 'futuros');
        expect(result).toEqual({ sincronizados: 0, total: 0, escopo: 'futuros' });
    });

    it('sincroniza lembrete criando evento quando não existe', async () => {
        prisma.configuracaoUsuario.findUnique
            .mockResolvedValueOnce({
                googleCalendarAtivo: true,
                tokensGoogle: { access_token: 'a' },
                googleCalendarId: null,
            })
            .mockResolvedValueOnce({
                googleCalendarAtivo: true,
                tokensGoogle: { access_token: 'a' },
                googleCalendarId: 'cal-1',
            });
        mockCalendarApi.calendarList.list.mockResolvedValue({ data: { items: [] } });
        mockCalendarApi.calendars.insert.mockResolvedValue({ data: { id: 'cal-1' } });
        prisma.configuracaoUsuario.update.mockResolvedValue({});
        mockCalendarApi.calendarList.patch.mockResolvedValue({});
        mockCalendarApi.events.insert.mockResolvedValue({ data: { id: 'evt-1' } });

        const result = await googleCalendarSync.sincronizarLembrete('u1', {
            titulo: 'Conta',
            categoria: 'OUTRO',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            valor: 50,
        });

        expect(result).toEqual({ googleEventId: 'evt-1' });
    });

    it('importarAlteracoesDoGoogle retorna zero quando desconectado', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: false,
            tokensGoogle: null,
        });
        const result = await googleCalendarSync.importarAlteracoesDoGoogle('u1');
        expect(result).toEqual({ atualizados: 0, verificados: 0 });
    });

    it('garante calendário existente sem recriar', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarId: 'cal-existing',
        });
        mockCalendarApi.calendars.get.mockResolvedValue({});
        mockCalendarApi.calendarList.patch.mockResolvedValue({});

        const result = await googleCalendarSync.garantirCalendarioPulso('u1');
        expect(result).toBe('cal-existing');
        expect(mockCalendarApi.calendars.insert).not.toHaveBeenCalled();
    });

    it('sincroniza pendentes e persiste googleEventId', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarId: 'cal-1',
        });
        prisma.lembrete.findMany.mockResolvedValue([
            {
                id: 'l1',
                titulo: 'Conta',
                categoria: 'OUTRO',
                antecedencia: 'UM_DIA',
                valor: 10,
                dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
                googleEventId: null,
            },
        ]);
        mockCalendarApi.calendars.get.mockResolvedValue({});
        mockCalendarApi.calendarList.patch.mockResolvedValue({});
        mockCalendarApi.events.insert.mockResolvedValue({ data: { id: 'evt-99' } });
        prisma.lembrete.update.mockResolvedValue({});

        const result = await googleCalendarSync.sincronizarPendentes('u1');
        expect(result.sincronizados).toBe(1);
        expect(prisma.lembrete.update).toHaveBeenCalledWith({
            where: { id: 'l1' },
            data: { googleEventId: 'evt-99', sincronizado: true },
        });
    });

    it('remove evento ignora 404 do Google', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarId: 'cal-1',
        });
        const err = new Error('not found');
        err.code = 404;
        mockCalendarApi.events.delete.mockRejectedValue(err);

        await expect(googleCalendarSync.removerEventoLembrete('u1', 'evt-1')).resolves.toBeUndefined();
    });

    it('remove calendário pulso quando existe', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarId: 'cal-1',
        });
        mockCalendarApi.calendars.delete.mockResolvedValue({});

        await expect(googleCalendarSync.removerCalendarioPulso('u1')).resolves.toBeUndefined();
        expect(mockCalendarApi.calendars.delete).toHaveBeenCalledWith({ calendarId: 'cal-1' });
    });
});
