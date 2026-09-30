const moedaService = require('../../../src/services/moedaService');

jest.mock('../../../src/repositories/moedaFavoritaRepository', () => ({
    listarPorUsuario: jest.fn(),
    criar: jest.fn(),
    excluir: jest.fn(),
    contarPorUsuario: jest.fn(),
}));

jest.mock('../../../src/providers/awesomeApiProvider', () => ({
    fetchPairs: jest.fn(),
    fetchHistory: jest.fn(),
    fetchHistoryForCurrency: jest.fn(),
    getRatesForCodes: jest.fn(),
    getRateForCode: jest.fn(),
}));

const moedaFavoritaRepository = require('../../../src/repositories/moedaFavoritaRepository');
const awesomeApiProvider = require('../../../src/providers/awesomeApiProvider');

describe('moedaService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('converte BRL para USD', async () => {
        awesomeApiProvider.getRatesForCodes.mockResolvedValue({
            BRL: { code: 'BRL', bid: 1, pctChange: 0, updatedAt: '2026-06-16T12:00:00.000Z' },
            USD: { code: 'USD', bid: 5.6, pctChange: 0.1, updatedAt: '2026-06-16T12:00:00.000Z' },
        });

        const result = await moedaService.converter({ valor: 1000, de: 'BRL', para: 'USD' });

        expect(result.valorConvertido).toBe('178.57');
        expect(result.de).toBe('BRL');
        expect(result.para).toBe('USD');
    });

    it('garante favoritas padrão quando usuário não tem nenhuma', async () => {
        moedaFavoritaRepository.listarPorUsuario.mockResolvedValue([]);
        moedaFavoritaRepository.criar.mockResolvedValue({});
        awesomeApiProvider.getRatesForCodes.mockResolvedValue({
            USD: { code: 'USD', bid: 5.6, pctChange: 0.2, updatedAt: '2026-06-16T12:00:00.000Z' },
        });

        const result = await moedaService.garantirFavoritasPadrao('user-1');

        expect(moedaFavoritaRepository.criar).toHaveBeenCalled();
        expect(result.favoritas.length).toBeGreaterThan(0);
    });

    it('lista cotações quando codigos vem como string da query', async () => {
        awesomeApiProvider.getRatesForCodes.mockResolvedValue({
            JPY: { code: 'JPY', bid: 0.035, pctChange: 0.1, updatedAt: '2026-06-16T12:00:00.000Z' },
        });

        const result = await moedaService.listarCotacoes('JPY');

        expect(awesomeApiProvider.getRatesForCodes).toHaveBeenCalledWith(['JPY']);
        expect(result.cotacoes).toHaveLength(1);
        expect(result.cotacoes[0].code).toBe('JPY');
    });

    it('monta histórico com pontos vindos apenas com timestamp', async () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-06-14T12:00:00.000Z'));

        try {
            awesomeApiProvider.fetchHistoryForCurrency.mockResolvedValue([
                { date: '2026-05-11', bid: 4.9, ask: 4.91 },
                { date: '2026-05-12', bid: 5.0, ask: 5.01 },
                { date: '2026-06-14', bid: 5.05, ask: 5.06 },
            ]);
            awesomeApiProvider.getRateForCode.mockResolvedValue({
                code: 'USD',
                bid: 5.0565,
                ask: 5.0665,
                updatedAt: '2026-06-14T18:00:00.000Z',
            });

            const result = await moedaService.obterHistorico('USD', 30);

            expect(result.pontos).toHaveLength(3);
            expect(result.resumo.atual).toBe('5.0565');
            expect(result.atualizadoEm).toBe('2026-06-14T18:00:00.000Z');
        } finally {
            jest.useRealTimers();
        }
    });
});
