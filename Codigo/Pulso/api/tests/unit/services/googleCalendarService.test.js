const mockOauthGet = jest.fn();
const mockOauth2Ctor = jest.fn(() => ({
    userinfo: { get: mockOauthGet },
}));

jest.mock('@googleapis/oauth2', () => ({
    oauth2_v2: { Oauth2: mockOauth2Ctor },
}));
jest.mock('../../../src/config/database', () => ({
    configuracaoUsuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
    },
    lembrete: { updateMany: jest.fn() },
}));
jest.mock('../../../src/utils/googleOAuth', () => ({
    createOAuthClient: jest.fn(),
}));
jest.mock('../../../src/services/googleCalendarSyncService', () => ({
    garantirCalendarioPulso: jest.fn(),
    removerCalendarioPulso: jest.fn(),
}));

const prisma = require('../../../src/config/database');
const { createOAuthClient } = require('../../../src/utils/googleOAuth');
const googleCalendarSync = require('../../../src/services/googleCalendarSyncService');
const googleCalendarService = require('../../../src/services/googleCalendarService');

describe('googleCalendarService', () => {
    const clientMock = {
        setCredentials: jest.fn(),
        generateAuthUrl: jest.fn(() => 'https://google/auth'),
        getToken: jest.fn(),
        revokeToken: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockOauth2Ctor.mockImplementation(() => ({ userinfo: { get: mockOauthGet } }));
        clientMock.generateAuthUrl.mockReturnValue('https://google/auth');
        createOAuthClient.mockReturnValue(clientMock);
    });

    it('retorna status desconectado quando não há vínculo', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue(null);

        const result = await googleCalendarService.obterStatus('u1');
        expect(result).toEqual({ conectado: false, email: null });
    });

    it('busca email da conta quando não salvo', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { access_token: 'a' },
            googleCalendarEmail: null,
        });
        mockOauthGet.mockResolvedValue({ data: { email: 'u@google.dev' } });

        const result = await googleCalendarService.obterStatus('u1');
        expect(result).toEqual({ conectado: true, email: 'u@google.dev' });
        expect(prisma.configuracaoUsuario.update).toHaveBeenCalled();
    });

    it('gera url de conexão com state do usuário', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({ usuarioId: 'u1' });

        const result = await googleCalendarService.obterUrlConexao('u1', {
            protocol: 'https',
            get: (k) => (k === 'host' ? 'pulso.dev' : null),
        });

        expect(clientMock.generateAuthUrl).toHaveBeenCalledWith(
            expect.objectContaining({ state: 'u1' })
        );
        expect(result.url).toBe('https://google/auth');
    });

    it('processa callback e persiste tokens', async () => {
        clientMock.getToken.mockResolvedValue({ tokens: { access_token: 'x' } });
        mockOauthGet.mockResolvedValue({ data: { email: 'u@google.dev' } });
        prisma.configuracaoUsuario.upsert.mockResolvedValue({});
        googleCalendarSync.garantirCalendarioPulso.mockResolvedValue('cal-1');

        const result = await googleCalendarService.processarCallback(
            'code-1',
            'u1',
            'https://pulso.dev/callback'
        );

        expect(prisma.configuracaoUsuario.upsert).toHaveBeenCalled();
        expect(googleCalendarSync.garantirCalendarioPulso).toHaveBeenCalledWith('u1');
        expect(result).toEqual({ sucesso: true });
    });

    it('desconecta limpando vínculo e lembretes', async () => {
        prisma.configuracaoUsuario.findUnique.mockResolvedValue({
            googleCalendarAtivo: true,
            tokensGoogle: { refresh_token: 'r1' },
        });
        prisma.lembrete.updateMany.mockResolvedValue({});
        prisma.configuracaoUsuario.update.mockResolvedValue({});
        googleCalendarSync.removerCalendarioPulso.mockResolvedValue(undefined);

        await googleCalendarService.desconectar('u1');

        expect(googleCalendarSync.removerCalendarioPulso).toHaveBeenCalledWith('u1');
        expect(prisma.lembrete.updateMany).toHaveBeenCalled();
        expect(clientMock.revokeToken).toHaveBeenCalledWith('r1');
        expect(prisma.configuracaoUsuario.update).toHaveBeenCalled();
    });
});
