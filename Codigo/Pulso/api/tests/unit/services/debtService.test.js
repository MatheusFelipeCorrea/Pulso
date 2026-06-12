jest.mock('../../../src/repositories/debtRepository');

const debtRepository = require('../../../src/repositories/debtRepository');
const debtService = require('../../../src/services/debtService');

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
        debtRepository.criar.mockResolvedValue({
            id: 'div-1',
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
        });

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
        expect(payload.dataEmprestimo).toBeInstanceOf(Date);
        expect(payload.prazoDevolucao).toBeInstanceOf(Date);
        expect(payload.prazoDevolucao.getTime()).toBeGreaterThan(payload.dataEmprestimo.getTime());
        expect(result).toEqual({
            id: 'div-1',
            direcao: 'ME_DEVEM',
            nomePessoa: 'Carlos',
            valor: '100.00',
            dataEmprestimo: '2026-01-09T12:00:00.000Z',
            prazoDevolucao: '2026-01-15T12:00:00.000Z',
            observacao: 'Pagamento combinado',
            quitada: false,
            dataQuitacao: null,
            criadoEm: '2026-01-09T13:00:00.000Z',
            atualizadoEm: '2026-01-09T13:00:00.000Z',
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

    it('calcula resumo com totais e quantidades formatados', async () => {
        debtRepository.calcularAgregados.mockResolvedValue([
            { direcao: 'ME_DEVEM', _sum: { valor: 125.5 }, _count: { id: 2 } },
            { direcao: 'EU_DEVO', _sum: { valor: 20 }, _count: { id: 1 } },
        ]);

        const result = await debtService.calcularResumo('usr-1');

        expect(result).toEqual({
            meDevem: { total: '125.50', quantidade: 2 },
            euDevo: { total: '20.00', quantidade: 1 },
        });
    });

    it('lista dívidas com paginação e mapeamento', async () => {
        debtRepository.listarPorUsuario.mockResolvedValue({
            dividas: [
                {
                    id: 'd-1',
                    direcao: 'ME_DEVEM',
                    nomePessoa: 'Lia',
                    valor: 50,
                    dataEmprestimo: new Date('2026-01-08T12:00:00.000Z'),
                    prazoDevolucao: null,
                    observacao: null,
                    quitada: false,
                    dataQuitacao: null,
                    criadoEm: new Date('2026-01-08T13:00:00.000Z'),
                    atualizadoEm: new Date('2026-01-08T13:00:00.000Z'),
                },
            ],
            total: 1,
        });

        const result = await debtService.listarDividas('usr-1', { pagina: '2', limite: '1' });

        expect(debtRepository.listarPorUsuario).toHaveBeenCalledWith(
            'usr-1',
            { pagina: '2', limite: '1' },
            { pagina: 2, limite: 1 }
        );
        expect(result.total).toBe(1);
        expect(result.paginas).toBe(1);
        expect(result.pagina).toBe(2);
        expect(result.dividas[0].valor).toBe('50.00');
    });

    it('edita dívida com campos opcionais', async () => {
        debtRepository.buscarPorId.mockResolvedValue({
            id: 'div-1',
            quitada: false,
            dataEmprestimo: new Date('2026-01-08T12:00:00.000Z'),
        });
        debtRepository.atualizar.mockResolvedValue({
            id: 'div-1',
            direcao: 'EU_DEVO',
            nomePessoa: 'Novo Nome',
            valor: 99.9,
            dataEmprestimo: new Date('2026-01-08T12:00:00.000Z'),
            prazoDevolucao: new Date('2026-01-13T12:00:00.000Z'),
            observacao: 'ok',
            quitada: false,
            dataQuitacao: null,
            criadoEm: new Date('2026-01-08T13:00:00.000Z'),
            atualizadoEm: new Date('2026-01-09T13:00:00.000Z'),
        });

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
        debtRepository.buscarPorId.mockResolvedValue({ id: 'div-1', quitada: true });

        await expect(debtService.quitarDivida('usr-1', 'div-1')).rejects.toMatchObject({
            statusCode: 400,
            message: 'Dívida já está quitada',
        });
    });

    it('quita dívida existente', async () => {
        debtRepository.buscarPorId.mockResolvedValue({ id: 'div-1', quitada: false });
        debtRepository.quitar.mockResolvedValue({
            id: 'div-1',
            direcao: 'EU_DEVO',
            nomePessoa: 'Paulo',
            valor: 30,
            dataEmprestimo: new Date('2026-01-01T12:00:00.000Z'),
            prazoDevolucao: null,
            observacao: null,
            quitada: true,
            dataQuitacao: new Date('2026-01-10T12:00:00.000Z'),
            criadoEm: new Date('2026-01-01T12:00:00.000Z'),
            atualizadoEm: new Date('2026-01-10T12:00:00.000Z'),
        });

        const result = await debtService.quitarDivida('usr-1', 'div-1');

        expect(debtRepository.quitar).toHaveBeenCalledWith('div-1', 'usr-1');
        expect(result.quitada).toBe(true);
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
});
