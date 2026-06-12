jest.mock('../../../src/repositories/reminderRepository');
jest.mock('../../../src/services/googleCalendarSyncService', () => ({
    estaConectado: jest.fn(),
    sincronizarLembrete: jest.fn(),
    removerEventoLembrete: jest.fn(),
}));

const reminderRepository = require('../../../src/repositories/reminderRepository');
const googleCalendarSync = require('../../../src/services/googleCalendarSyncService');
const reminderService = require('../../../src/services/reminderService');

describe('reminderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista lembretes do mês', async () => {
        reminderRepository.listarPorUsuario.mockResolvedValue([
            {
                id: 'l1',
                titulo: 'Conta',
                dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                valor: 100,
                sincronizado: false,
                googleEventId: null,
                repetirMensal: false,
                diaRecorrencia: null,
                pago: false,
                criadoEm: new Date('2026-01-01T12:00:00.000Z'),
                atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
            },
        ]);

        const result = await reminderService.listarLembretes('u1', { mes: '2026-01' });
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expect.objectContaining({ id: 'l1', titulo: 'Conta' }));
    });

    it('cria lembrete sem sincronizar Google', async () => {
        reminderRepository.criar.mockResolvedValue({
            id: 'l1',
            titulo: 'Conta',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'OUTRO',
            valor: null,
            sincronizado: false,
            googleEventId: null,
            repetirMensal: false,
            diaRecorrencia: null,
            pago: false,
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
        });

        const result = await reminderService.criarLembrete('u1', {
            titulo: ' Conta ',
            dataVencimento: '2026-01-12',
        });

        expect(googleCalendarSync.sincronizarLembrete).not.toHaveBeenCalled();
        expect(result.titulo).toBe('Conta');
    });

    it('remove lembrete criado quando sync falha', async () => {
        reminderRepository.criar.mockResolvedValue({
            id: 'l2',
            titulo: 'Conta',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'OUTRO',
            valor: null,
            sincronizado: false,
            googleEventId: null,
            repetirMensal: false,
            diaRecorrencia: null,
            pago: false,
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
        });
        googleCalendarSync.estaConectado.mockResolvedValue(true);
        googleCalendarSync.sincronizarLembrete.mockRejectedValue(new Error('sync'));
        reminderRepository.deletar.mockResolvedValue(undefined);

        await expect(
            reminderService.criarLembrete('u1', {
                titulo: 'Conta',
                dataVencimento: '2026-01-12',
                sincronizarGoogle: true,
            })
        ).rejects.toThrow('sync');

        expect(reminderRepository.deletar).toHaveBeenCalledWith('l2');
    });

    it('rejeita atualização para lembrete inexistente', async () => {
        reminderRepository.buscarPorId.mockResolvedValue(null);

        await expect(reminderService.atualizarLembrete('u1', 'l404', {})).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('remove lembrete e evento google quando vinculado', async () => {
        reminderRepository.buscarPorId.mockResolvedValue({
            id: 'l3',
            googleEventId: 'evt-1',
        });
        reminderRepository.deletar.mockResolvedValue(undefined);

        await reminderService.removerLembrete('u1', 'l3');

        expect(googleCalendarSync.removerEventoLembrete).toHaveBeenCalledWith('u1', 'evt-1');
        expect(reminderRepository.deletar).toHaveBeenCalledWith('l3');
    });

    it('atualiza lembrete e remove sync ao desativar sincronização', async () => {
        reminderRepository.buscarPorId.mockResolvedValue({
            id: 'l4',
            titulo: 'Conta',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            sincronizado: true,
            googleEventId: 'evt-4',
            repetirMensal: false,
            diaRecorrencia: null,
        });
        reminderRepository.atualizar
            .mockResolvedValueOnce({
                id: 'l4',
                titulo: 'Conta Atualizada',
                dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
                sincronizado: true,
                googleEventId: 'evt-4',
            })
            .mockResolvedValueOnce({
                id: 'l4',
                titulo: 'Conta Atualizada',
                dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
                sincronizado: false,
                googleEventId: null,
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                valor: null,
                repetirMensal: false,
                diaRecorrencia: null,
                pago: false,
                criadoEm: new Date('2026-01-01T12:00:00.000Z'),
                atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
            });

        const result = await reminderService.atualizarLembrete('u1', 'l4', {
            titulo: 'Conta Atualizada',
            sincronizarGoogle: false,
        });

        expect(googleCalendarSync.removerEventoLembrete).toHaveBeenCalledWith('u1', 'evt-4');
        expect(result.googleEventId).toBe(null);
    });

    it('lista próximos vencimentos', async () => {
        reminderRepository.listarProximos.mockResolvedValue([
            {
                id: 'l5',
                titulo: 'Próximo',
                dataVencimento: new Date('2026-01-20T12:00:00.000Z'),
                antecedencia: 'UM_DIA',
                categoria: 'OUTRO',
                valor: null,
                sincronizado: false,
                googleEventId: null,
                repetirMensal: false,
                diaRecorrencia: null,
                pago: false,
                criadoEm: new Date('2026-01-01T12:00:00.000Z'),
                atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
            },
        ]);
        const result = await reminderService.listarProximosVencimentos('u1', 5);
        expect(reminderRepository.listarProximos).toHaveBeenCalledWith('u1', { limite: 5 });
        expect(result).toHaveLength(1);
    });

    it('marca lembrete como pago removendo evento google', async () => {
        reminderRepository.buscarPorId.mockResolvedValue({
            id: 'l6',
            googleEventId: 'evt-6',
        });
        reminderRepository.atualizar.mockResolvedValue({
            id: 'l6',
            titulo: 'Pago',
            dataVencimento: new Date('2026-01-20T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'OUTRO',
            valor: null,
            sincronizado: false,
            googleEventId: null,
            repetirMensal: false,
            diaRecorrencia: null,
            pago: true,
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
        });

        const result = await reminderService.marcarComoPago('u1', 'l6');
        expect(googleCalendarSync.removerEventoLembrete).toHaveBeenCalledWith('u1', 'evt-6');
        expect(result.pago).toBe(true);
    });

    it('rejeita sync quando Google não está conectado', async () => {
        reminderRepository.criar.mockResolvedValue({
            id: 'l7',
            titulo: 'Conta',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'OUTRO',
            valor: null,
            sincronizado: false,
            googleEventId: null,
            repetirMensal: false,
            diaRecorrencia: null,
            pago: false,
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
        });
        googleCalendarSync.estaConectado.mockResolvedValue(false);
        reminderRepository.deletar.mockResolvedValue(undefined);

        await expect(
            reminderService.criarLembrete('u1', {
                titulo: 'Conta',
                dataVencimento: '2026-01-12',
                sincronizarGoogle: true,
            })
        ).rejects.toMatchObject({ statusCode: 400 });

        expect(reminderRepository.deletar).toHaveBeenCalledWith('l7');
    });

    it('normaliza recorrência mensal com dia informado', async () => {
        reminderRepository.criar.mockResolvedValue({
            id: 'l8',
            titulo: 'Aluguel',
            dataVencimento: new Date('2026-01-05T12:00:00.000Z'),
            antecedencia: 'UM_DIA',
            categoria: 'OUTRO',
            valor: 1200,
            sincronizado: false,
            googleEventId: null,
            repetirMensal: true,
            diaRecorrencia: 15,
            pago: false,
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
        });

        await reminderService.criarLembrete('u1', {
            titulo: 'Aluguel',
            dataVencimento: '2026-01-05',
            repetirMensal: true,
            diaRecorrencia: 15,
        });

        expect(reminderRepository.criar).toHaveBeenCalledWith(
            expect.objectContaining({
                repetirMensal: true,
                diaRecorrencia: 15,
            })
        );
    });

    it('reverte sync parcial quando atualização com Google falha', async () => {
        reminderRepository.buscarPorId.mockResolvedValue({
            id: 'l9',
            titulo: 'Conta',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            sincronizado: true,
            googleEventId: 'evt-9',
            repetirMensal: false,
            diaRecorrencia: null,
        });
        reminderRepository.atualizar.mockResolvedValueOnce({
            id: 'l9',
            titulo: 'Conta Nova',
            dataVencimento: new Date('2026-01-12T12:00:00.000Z'),
            sincronizado: false,
            googleEventId: 'evt-9',
        });
        googleCalendarSync.estaConectado.mockResolvedValue(true);
        googleCalendarSync.sincronizarLembrete.mockRejectedValue(new Error('sync fail'));

        await expect(
            reminderService.atualizarLembrete('u1', 'l9', { titulo: 'Conta Nova', sincronizarGoogle: true })
        ).rejects.toThrow('sync fail');

        expect(reminderRepository.atualizar).toHaveBeenCalledWith('l9', { sincronizado: false });
    });
});
