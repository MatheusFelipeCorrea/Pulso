jest.mock('../../../src/repositories/transportRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/utils/periodUtils', () => ({
    periodoAtual: jest.fn(() => '2026-01'),
    intervaloDoPeriodo: jest.fn(() => ({
        inicio: new Date('2026-01-01T00:00:00.000Z'),
        fim: new Date('2026-01-31T23:59:59.999Z'),
    })),
    calcularProximaRecarga: jest.fn(() => '2026-02-01'),
}));

const transportRepository = require('../../../src/repositories/transportRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const periodUtils = require('../../../src/utils/periodUtils');
const transportService = require('../../../src/services/transportService');

describe('transportService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        periodUtils.periodoAtual.mockReturnValue('2026-01');
        periodUtils.intervaloDoPeriodo.mockReturnValue({
            inicio: new Date('2026-01-01T00:00:00.000Z'),
            fim: new Date('2026-01-31T23:59:59.999Z'),
        });
        periodUtils.calcularProximaRecarga.mockReturnValue('2026-02-01');
    });

    it('retorna erro quando config não existe', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue(null);

        await expect(transportService.obterSaldoVt('u1')).rejects.toMatchObject({ statusCode: 404 });
    });

    it('bloqueia PJ sem VT habilitado', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'PJ', vtHabilitado: false });

        await expect(transportService.obterSaldoVt('u1')).rejects.toMatchObject({ statusCode: 403 });
    });

    it('retorna saldo com valores formatados', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({
            modoUso: 'CLT',
            valorPadraoPassagem: 4.5,
        });
        transportRepository.calcularRecebidoVt.mockResolvedValue(300);
        transportRepository.calcularUsadoVt.mockResolvedValue({ total: 90, passagens: 20 });
        transportRepository.calcularVendidoNominalVt.mockResolvedValue(10);

        const result = await transportService.obterSaldoVt('u1');
        expect(result).toEqual(
            expect.objectContaining({
                recebido: '300.00',
                usado: '90.00',
                vendidoNominal: '10.00',
                saldoRestante: '200.00',
                passagensUsadas: 20,
                proximaRecarga: '2026-02-01',
            })
        );
    });

    it('rejeita venda com saldo insuficiente', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'CLT', vtHabilitado: true });
        transportRepository.calcularRecebidoVt.mockResolvedValue(100);
        transportRepository.calcularUsadoVt.mockResolvedValue({ total: 90, passagens: 10 });
        transportRepository.calcularVendidoNominalVt.mockResolvedValue(5);

        await expect(
            transportService.registrarVendaVt('u1', {
                nomeComprador: 'João',
                dataVenda: '2026-01-10',
                valorNominal: 20,
                valorRecebido: 18,
            })
        ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('registra venda para CLT com warning', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'CLT', vtHabilitado: true });
        transportRepository.calcularRecebidoVt.mockResolvedValue(500);
        transportRepository.calcularUsadoVt.mockResolvedValue({ total: 100, passagens: 10 });
        transportRepository.calcularVendidoNominalVt.mockResolvedValue(50);
        categoryRepository.buscarPorNome.mockResolvedValue({ id: 'cat-outros' });
        transportRepository.criarVendaComTransacao.mockResolvedValue({
            id: 'v1',
            dataVenda: new Date('2026-01-10T12:00:00.000Z'),
            nomeComprador: 'João',
            valorNominal: 50,
            valorRecebido: 45,
        });

        const result = await transportService.registrarVendaVt('u1', {
            nomeComprador: ' João ',
            dataVenda: '2026-01-10',
            valorNominal: 50,
            valorRecebido: 45,
        });

        expect(result).toEqual(
            expect.objectContaining({
                id: 'v1',
                warning: expect.any(String),
                novoSaldoVt: '300.00',
            })
        );
    });

    it('lista vendas com totais e paginação', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'CLT', vtHabilitado: true });
        transportRepository.listarVendas.mockResolvedValue({
            vendas: [
                {
                    id: 'v1',
                    dataVenda: new Date('2026-01-10T12:00:00.000Z'),
                    nomeComprador: 'Ana',
                    valorNominal: 20,
                    valorRecebido: 18,
                },
            ],
            total: 1,
            todasNoPeriodo: [{ valorNominal: 20, valorRecebido: 18 }],
        });

        const result = await transportService.listarVendas('u1', { pagina: 1, limite: 10 });
        expect(result.totais).toEqual({
            totalNominal: '20.00',
            totalRecebido: '18.00',
            perdaTotal: '-2.00',
        });
        expect(result.paginacao.total).toBe(1);
    });

    it('registra uso de VT e salva valor padrão', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'CLT', vtHabilitado: true });
        transportRepository.calcularRecebidoVt.mockResolvedValue(300);
        transportRepository.calcularUsadoVt.mockResolvedValue({ total: 100, passagens: 10 });
        transportRepository.calcularVendidoNominalVt.mockResolvedValue(0);
        transportRepository.criarUsoVt.mockResolvedValue({
            id: 'uso1',
            quantidade: 2,
            valorPorPassagem: 5,
            data: new Date('2026-01-10T12:00:00.000Z'),
        });
        transportRepository.atualizarValorPadraoPassagem.mockResolvedValue({});

        const result = await transportService.registrarUsoVt('u1', {
            quantidade: 2,
            valorPorPassagem: 5,
            data: '2026-01-10',
            salvarValorPadrao: true,
        });

        expect(transportRepository.atualizarValorPadraoPassagem).toHaveBeenCalledWith('u1', 5);
        expect(result.totalUsado).toBe('10.00');
    });

    it('lista usos de VT', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'CLT', vtHabilitado: true });
        transportRepository.listarUsos.mockResolvedValue({
            usos: [
                {
                    id: 'u1',
                    data: new Date('2026-01-10T12:00:00.000Z'),
                    quantidade: 2,
                    valorPorPassagem: 5,
                },
            ],
            total: 1,
            todosNoPeriodo: [{ quantidade: 2, valorPorPassagem: 5 }],
        });

        const result = await transportService.listarUsos('u1', { pagina: 1, limite: 10 });
        expect(result.totais).toEqual({ totalPassagens: 2, totalGasto: '10.00' });
    });

    it('atualiza vtHabilitado para PJ', async () => {
        transportRepository.buscarConfiguracao.mockResolvedValue({ modoUso: 'PJ', vtHabilitado: false });
        transportRepository.atualizarVtHabilitado.mockResolvedValue(undefined);
        const result = await transportService.atualizarVtHabilitado('u1', true);
        expect(result).toEqual({ vtHabilitado: true });
    });
});
