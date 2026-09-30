const { mapNotificacao } = require('../../../src/utils/notificationMapper');

describe('notificationMapper', () => {
    it('mapNotificacao converte criadoEm para ISO quando Date', () => {
        const notificacao = {
            id: 'not-1',
            tipo: 'LEMBRETE',
            titulo: 'Título',
            mensagem: 'Mensagem',
            lida: false,
            linkAcao: '/rota',
            metadados: { id: 'x' },
            criadoEm: new Date('2026-06-01T12:00:00.000Z'),
        };

        expect(mapNotificacao(notificacao)).toEqual({
            id: 'not-1',
            tipo: 'LEMBRETE',
            titulo: 'Título',
            mensagem: 'Mensagem',
            lida: false,
            linkAcao: '/rota',
            metadados: { id: 'x' },
            criadoEm: '2026-06-01T12:00:00.000Z',
        });
    });

    it('mapNotificacao mantém criadoEm original quando não é Date', () => {
        const criadoEm = '2026-06-01T12:00:00.000Z';
        const result = mapNotificacao({
            id: 'not-2',
            tipo: 'LEMBRETE',
            titulo: 'Título',
            mensagem: 'Mensagem',
            lida: true,
            linkAcao: null,
            metadados: null,
            criadoEm,
        });

        expect(result.criadoEm).toBe(criadoEm);
    });
});
