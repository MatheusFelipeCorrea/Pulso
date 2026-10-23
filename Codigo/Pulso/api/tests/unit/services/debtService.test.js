jest.mock('../../../src/repositories/debtRepository');

const debtRepository = require('../../../src/repositories/debtRepository');
const debtService = require('../../../src/services/debtService');

const dividaBase = (overrides = {}) => ({
    id: 'div-1',
    usuarioId: 'usr-1',
    direcao: 'ME_DEVEM',
    nomePessoa: 'Carlos',
    valor: 100,
    dataEmprestimo: new Date('2026-01-09T12:00:00.000Z'),
    prazoDevolucao: new Date('2026-01-15T12:00:00.000Z'),
    observacao: 'Pagamento combinado',
    quitada: false,
    dataQuitacao: null,
    criadoEm: new Date('2026-01-09T13:00:00.000Z'),
    atualizadoEm: new Date('2026-01-09T13:00:00.000Z'),
    pagamentos: [],
    ...overrides,
});

describe('debtService', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rejeita dívida com data de empréstimo futura', async () => {
        await expect(
            debtService.criarDivida('usr-1', {
                direcao: 'ME_DEVEM',
                nomePessoa: 'João',
                valor: 120.5,
                dataEmprestimo: '2099-12-31',
                prazoDevolucao: null,
                observacao: null,
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Data do empréstimo não pode ser futura',
        });

        expect(debtRepository.criar).not.toHaveBeenCalled();
    });

    it('rejeita prazo de devolução no mesmo dia do empréstimo', async () => {
        await expect(
            debtService.criarDivida('usr-1', {
                direcao: 'EU_DEVO',
                nomePessoa: 'Maria',
                valor: 89.9,
                dataEmprestimo: '2026-01-09',
                prazoDevolucao: '2026-01-09',
                observacao: '',
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Prazo de devolução deve ser posterior à data do empréstimo',
        });
    });

    it('cria dívida com payload validado e retorna objeto mapeado', async () => {
        debtRepository.criar.mockResolvedValue(dividaBase());

        const result = await debtService.criarDivida('usr-1', {
            direcao: 'ME_DEVEM',
            nomePessoa: '  Carlos  ',
            valor: 100,
            dataEmprestimo: '2026-01-09',
            prazoDevolucao: '2026-01-15',
            observacao: '  Pagamento combinado  ',
        });

        const payload = debtRepository.criar.mock.calls[0][0];
        expect(payload).toMatchObject({
            usuarioId: 'usr-1',
            direcao: 'ME_DEVEM',
            nomePessoa: 'Carlos',
            valor: 100,
            observacao: 'Pagamento combinado',
        });
        expect(result).toMatchObject({
            id: 'div-1',
            nomePessoa: 'Carlos',
            valor: '100.00',
            valorPago: '0.00',
            valorRestante: '100.00',
            pagamentos: [],
        });
    });

    it('retorna erro ao editar dívida inexistente', async () => {
        debtRepository.buscarPorId.mockResolvedValue(null);

        await expect(
            debtService.editarDivida('usr-1', 'div-404', {
                nomePessoa: 'Novo Nome',
            })
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Dívida não encontrada',
        });
    });

    it('calcula resumo com saldo restante e contadores', async () => {
        debtRepository.listarAtivasComPagamentos.mockResolvedValue([
            dividaBase({ direcao: 'ME_DEVEM', valor: 100, pagamentos: [] }),
            dividaBase({
                id: 'div-2',
                direcao: 'EU_DEVO',
                valor: 50,
                pagamentos: [
                    {
                        id: 'p1',
                        valor: 20,
                        dataPagamento: new Date('2026-01-09T12:00:00.000Z'),
                        observacao: null,
                        criadoEm: new Date('2026-01-09T12:00:00.000Z'),
                    },
                ],
            }),
        ]);
        debtRepository.contarPorAba.mockResolvedValue({ meDevem: 1, euDevo: 1, quitadas: 3 });

        const result = await debtService.calcularResumo('usr-1');

        expect(result).toEqual({
            meDevem: { total: '100.00', quantidade: 1 },
            euDevo: { total: '30.00', quantidade: 1 },
            contadores: { meDevem: 1, euDevo: 1, quitadas: 3 },
        });
    });

    it('lista dívidas com paginação e mapeamento', async () => {
        debtRepository.listarPorUsuario.mockResolvedValue({
            dividas: [dividaBase({ id: 'd-1', nomePessoa: 'Lia', valor: 50, prazoDevolucao: null, observacao: null })],
            total: 1,
        });

        const result = await debtService.listarDividas('usr-1', { pagina: '2', limite: '1' });

        expect(debtRepository.listarPorUsuario).toHaveBeenCalledWith(
            'usr-1',
            { pagina: '2', limite: '1' },
            { pagina: 2, limite: 1 }
        );
        expect(result.total).toBe(1);
        expect(result.dividas[0].valor).toBe('50.00');
        expect(result.dividas[0].valorRestante).toBe('50.00');
    });

    it('edita dívida com campos opcionais', async () => {
        debtRepository.buscarPorId.mockResolvedValue(dividaBase());
        debtRepository.atualizar.mockResolvedValue(
            dividaBase({
                direcao: 'EU_DEVO',
                nomePessoa: 'Novo Nome',
                valor: 99.9,
                prazoDevolucao: new Date('2026-01-13T12:00:00.000Z'),
                observacao: 'ok',
            })
        );

        const result = await debtService.editarDivida('usr-1', 'div-1', {
            nomePessoa: '  Novo Nome ',
            valor: 99.9,
            prazoDevolucao: '2026-01-13',
            observacao: ' ok ',
        });

        expect(debtRepository.atualizar).toHaveBeenCalledWith(
            'div-1',
            'usr-1',
            expect.objectContaining({
                nomePessoa: 'Novo Nome',
                valor: 99.9,
                observacao: 'ok',
                prazoDevolucao: expect.any(Date),
            })
        );
        expect(result.nomePessoa).toBe('Novo Nome');
    });

    it('bloqueia quitação de dívida já quitada', async () => {
        debtRepository.buscarPorId.mockResolvedValue(dividaBase({ quitada: true }));

        await expect(debtService.quitarDivida('usr-1', 'div-1')).rejects.toMatchObject({
            statusCode: 400,
            message: 'Dívida já está quitada',
        });
    });

    it('quita dívida registrando pagamento do saldo restante', async () => {
        debtRepository.buscarPorId.mockResolvedValue(dividaBase({ valor: 100 }));
        debtRepository.criarPagamento.mockResolvedValue({
            id: 'p-quit',
            valor: 100,
            dataPagamento: new Date('2026-01-10T12:00:00.000Z'),
            observacao: 'Quitação do saldo restante',
            criadoEm: new Date('2026-01-10T12:00:00.000Z'),
        });
        debtRepository.quitar.mockResolvedValue(
            dividaBase({ quitada: true, dataQuitacao: new Date('2026-01-10T12:00:00.000Z') })
        );

        const result = await debtService.quitarDivida('usr-1', 'div-1');

        expect(debtRepository.criarPagamento).toHaveBeenCalledWith(
            expect.objectContaining({
                dividaId: 'div-1',
                valor: 100,
                observacao: 'Quitação do saldo restante',
            })
        );
        expect(debtRepository.quitar).toHaveBeenCalledWith('div-1', 'usr-1');
        expect(result.quitada).toBe(true);
        expect(result.valorPago).toBe('100.00');
    });

    it('registra pagamento parcial e retorna saldo atualizado sem quitar', async () => {
        debtRepository.buscarPorId.mockResolvedValue(dividaBase({ valor: 100 }));
        debtRepository.criarPagamento.mockResolvedValue({
            id: 'p1',
            valor: 30,
            dataPagamento: new Date('2026-01-10T12:00:00.000Z'),
            observacao: null,
            criadoEm: new Date('2026-01-10T12:00:00.000Z'),
        });

        const result = await debtService.registrarPagamento('usr-1', 'div-1', {
            valor: 30,
            dataPagamento: '2026-01-10',
        });

        expect(debtRepository.quitar).not.toHaveBeenCalled();
        expect(result.divida.quitada).toBe(false);
        expect(result.divida.valorPago).toBe('30.00');
        expect(result.divida.valorRestante).toBe('70.00');
        expect(result.pagamento.valor).toBe('30.00');
    });

    it('bloqueia exclusão de dívida quitada', async () => {
        debtRepository.buscarPorId.mockResolvedValue({ id: 'div-2', quitada: true });

        await expect(debtService.excluirDivida('usr-1', 'div-2')).rejects.toMatchObject({
            statusCode: 400,
        });
        expect(debtRepository.excluir).not.toHaveBeenCalled();
    });

    it('exclui dívida em aberto', async () => {
        debtRepository.buscarPorId.mockResolvedValue({ id: 'div-3', quitada: false });
        debtRepository.excluir.mockResolvedValue(undefined);

        await debtService.excluirDivida('usr-1', 'div-3');

        expect(debtRepository.excluir).toHaveBeenCalledWith('div-3', 'usr-1');
    });

    it('reabre dívida quitada ao excluir o último pagamento (RF-NOVO-O1)', async () => {
        const pagamento = {
            id: 'p1',
            valor: 100,
            dataPagamento: new Date('2026-01-10T12:00:00.000Z'),
            observacao: null,
            criadoEm: new Date('2026-01-10T12:00:00.000Z'),
        };
        debtRepository.buscarPorId.mockResolvedValue(
            dividaBase({ quitada: true, pagamentos: [pagamento] })
        );
        debtRepository.buscarPagamento.mockResolvedValue(pagamento);
        debtRepository.reabrir.mockResolvedValue(dividaBase({ quitada: false, pagamentos: [] }));

        const result = await debtService.excluirPagamento('usr-1', 'div-1', 'p1');

        expect(debtRepository.reabrir).toHaveBeenCalledWith('div-1', 'usr-1');
        expect(result.quitada).toBe(false);
        expect(result.valorPago).toBe('0.00');
        expect(result.valorRestante).toBe('100.00');
    });
});
