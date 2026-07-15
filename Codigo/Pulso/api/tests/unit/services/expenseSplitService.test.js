jest.mock('../../../src/repositories/expenseSplitRepository');
jest.mock('../../../src/services/reminderService', () => ({
    criarLembrete: jest.fn(),
}));

const expenseSplitRepository = require('../../../src/repositories/expenseSplitRepository');
const reminderService = require('../../../src/services/reminderService');
const expenseSplitService = require('../../../src/services/expenseSplitService');

const organizador = (overrides = {}) => ({
    id: 'p-voce',
    nome: 'Você',
    valor: 40,
    ehOrganizador: true,
    pagouAConta: false,
    status: 'PENDENTE',
    dataPagamento: null,
    ...overrides,
});

const participante = (overrides = {}) => ({
    id: 'p1',
    nome: 'João',
    valor: 40,
    ehOrganizador: false,
    pagouAConta: false,
    status: 'PENDENTE',
    dataPagamento: null,
    ...overrides,
});

const divisaoBase = (overrides = {}) => ({
    id: 'd1',
    usuarioId: 'u1',
    titulo: 'Jantar no Outback',
    valorTotal: 120,
    tipo: 'IGUAL',
    status: 'ATIVA',
    data: new Date('2026-04-20T00:00:00.000Z'),
    icone: null,
    cor: null,
    observacao: null,
    quitadaEm: null,
    criadoEm: new Date('2026-04-20T10:00:00.000Z'),
    atualizadoEm: new Date('2026-04-20T10:00:00.000Z'),
    participantes: [],
    ...overrides,
});

describe('expenseSplitService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('criarDivisao', () => {
        it('rejeita divisão sem outros participantes (RN-081)', async () => {
            await expect(
                expenseSplitService.criarDivisao('u1', {
                    titulo: 'Teste',
                    valorTotal: 100,
                    tipo: 'IGUAL',
                    data: '2026-04-20',
                    participantes: [],
                    pagoPor: 'VOCE',
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('divide igualmente entre participantes + organizador (RN-082), organizador paga', async () => {
            expenseSplitRepository.criar.mockResolvedValueOnce(
                divisaoBase({
                    participantes: [
                        participante({ valor: 60, pagouAConta: false, status: 'PENDENTE' }),
                        organizador({ valor: 60, pagouAConta: true, status: 'PAGO' }),
                    ],
                })
            );

            await expenseSplitService.criarDivisao('u1', {
                titulo: 'Jantar no Outback',
                valorTotal: 120,
                tipo: 'IGUAL',
                data: '2026-04-20',
                participantes: [{ nome: 'joão' }],
                pagoPor: 'VOCE',
            });

            const chamada = expenseSplitRepository.criar.mock.calls[0][0];
            expect(chamada.status).toBe('ATIVA');
            expect(chamada.participantes.create).toHaveLength(2);

            const linhaJoao = chamada.participantes.create.find((p) => p.nome === 'João');
            const linhaVoce = chamada.participantes.create.find((p) => p.ehOrganizador);

            expect(linhaJoao.valor).toBe(60);
            expect(linhaJoao.status).toBe('PENDENTE');
            expect(linhaVoce.valor).toBe(60);
            expect(linhaVoce.pagouAConta).toBe(true);
            expect(linhaVoce.status).toBe('PAGO');
        });

        it('marca o participante correto como pagador quando não foi o organizador', async () => {
            expenseSplitRepository.criar.mockResolvedValueOnce(divisaoBase());

            await expenseSplitService.criarDivisao('u1', {
                titulo: 'Happy Hour',
                valorTotal: 90,
                tipo: 'IGUAL',
                data: '2026-04-15',
                participantes: [{ nome: 'joão' }, { nome: 'maria' }, { nome: 'pedro' }],
                pagoPor: 'Pedro',
            });

            const chamada = expenseSplitRepository.criar.mock.calls[0][0];
            const linhaPedro = chamada.participantes.create.find((p) => p.nome === 'Pedro');
            const linhaVoce = chamada.participantes.create.find((p) => p.ehOrganizador);

            expect(linhaPedro.pagouAConta).toBe(true);
            expect(linhaPedro.status).toBe('PAGO');
            expect(linhaVoce.pagouAConta).toBe(false);
            expect(linhaVoce.status).toBe('PENDENTE');
        });

        it('rejeita quando "pagoPor" não corresponde a nenhum participante', async () => {
            await expect(
                expenseSplitService.criarDivisao('u1', {
                    titulo: 'Teste',
                    valorTotal: 100,
                    tipo: 'IGUAL',
                    data: '2026-04-20',
                    participantes: [{ nome: 'João' }],
                    pagoPor: 'Alguém Inexistente',
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('valida a soma da divisão personalizada (RN-083)', async () => {
            await expect(
                expenseSplitService.criarDivisao('u1', {
                    titulo: 'Teste',
                    valorTotal: 100,
                    tipo: 'PERSONALIZADA',
                    data: '2026-04-20',
                    participantes: [{ nome: 'João', valor: 50 }],
                    valorOrganizador: 40,
                    pagoPor: 'VOCE',
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('aceita divisão personalizada quando a soma bate com o total', async () => {
            expenseSplitRepository.criar.mockResolvedValueOnce(divisaoBase({ tipo: 'PERSONALIZADA' }));

            await expenseSplitService.criarDivisao('u1', {
                titulo: 'Teste',
                valorTotal: 100,
                tipo: 'PERSONALIZADA',
                data: '2026-04-20',
                participantes: [{ nome: 'João', valor: 60 }],
                valorOrganizador: 40,
                pagoPor: 'VOCE',
            });

            const chamada = expenseSplitRepository.criar.mock.calls[0][0];
            expect(chamada.tipo).toBe('PERSONALIZADA');
        });
    });

    describe('marcarParticipantePago / desmarcarParticipantePago', () => {
        it('marca participante pendente como pago e quita a divisão quando todos ficam pagos (RN-085)', async () => {
            const divisaoPendente = divisaoBase({
                participantes: [
                    participante({ status: 'PENDENTE' }),
                    organizador({ pagouAConta: true, status: 'PAGO' }),
                ],
            });
            const divisaoTudoPago = divisaoBase({
                participantes: [
                    participante({ status: 'PAGO' }),
                    organizador({ pagouAConta: true, status: 'PAGO' }),
                ],
            });
            const divisaoQuitadaPeloRepo = divisaoBase({ status: 'QUITADA', quitadaEm: new Date() });

            expenseSplitRepository.buscarPorId
                .mockResolvedValueOnce(divisaoPendente)
                .mockResolvedValueOnce(divisaoTudoPago);
            expenseSplitRepository.atualizarParticipante.mockResolvedValueOnce({});
            expenseSplitRepository.quitar.mockResolvedValueOnce(divisaoQuitadaPeloRepo);

            const resultado = await expenseSplitService.marcarParticipantePago('u1', 'd1', 'p1');

            expect(expenseSplitRepository.atualizarParticipante).toHaveBeenCalledWith(
                'p1',
                expect.objectContaining({ status: 'PAGO' })
            );
            expect(expenseSplitRepository.quitar).toHaveBeenCalledWith('d1', 'u1');
            expect(resultado.status).toBe('QUITADA');
        });

        it('rejeita marcar como pago quem já pagou a conta', async () => {
            const divisao = divisaoBase({
                participantes: [organizador({ id: 'p-voce', pagouAConta: true, status: 'PAGO' })],
            });
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisao);

            await expect(
                expenseSplitService.marcarParticipantePago('u1', 'd1', 'p-voce')
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('desmarcar pagamento reabre a divisão quitada (RN-085, via inversa)', async () => {
            const divisaoQuitada = divisaoBase({
                status: 'QUITADA',
                quitadaEm: new Date(),
                participantes: [
                    participante({ status: 'PAGO' }),
                    organizador({ pagouAConta: true, status: 'PAGO' }),
                ],
            });
            // Refetch logo após atualizar o participante: a coluna status da Divisão
            // ainda não mudou (só o reabrir() faz isso), só o participante já reflete PENDENTE.
            const divisaoAindaMarcadaQuitada = divisaoBase({
                status: 'QUITADA',
                quitadaEm: new Date(),
                participantes: [
                    participante({ status: 'PENDENTE' }),
                    organizador({ pagouAConta: true, status: 'PAGO' }),
                ],
            });
            const divisaoReaberta = divisaoBase({
                status: 'ATIVA',
                quitadaEm: null,
                participantes: [
                    participante({ status: 'PENDENTE' }),
                    organizador({ pagouAConta: true, status: 'PAGO' }),
                ],
            });

            expenseSplitRepository.buscarPorId
                .mockResolvedValueOnce(divisaoQuitada)
                .mockResolvedValueOnce(divisaoAindaMarcadaQuitada);
            expenseSplitRepository.atualizarParticipante.mockResolvedValueOnce({});
            expenseSplitRepository.reabrir.mockResolvedValueOnce(divisaoReaberta);

            const resultado = await expenseSplitService.desmarcarParticipantePago('u1', 'd1', 'p1');

            expect(expenseSplitRepository.reabrir).toHaveBeenCalledWith('d1', 'u1');
            expect(resultado.status).toBe('ATIVA');
        });
    });

    describe('excluirDivisao / editarDivisao', () => {
        it('bloqueia excluir divisão quitada', async () => {
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisaoBase({ status: 'QUITADA' }));

            await expect(expenseSplitService.excluirDivisao('u1', 'd1')).rejects.toMatchObject({
                statusCode: 400,
            });
        });

        it('bloqueia editar divisão quitada', async () => {
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisaoBase({ status: 'QUITADA' }));

            await expect(
                expenseSplitService.editarDivisao('u1', 'd1', { titulo: 'Novo título' })
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });

    describe('calcularResumo', () => {
        it('calcula meDevem e euDevo cruzando quem pagou cada divisão', async () => {
            expenseSplitRepository.listarAtivasComParticipantes.mockResolvedValueOnce([
                // Você pagou esta: João ainda deve 40 -> meDevem
                divisaoBase({
                    id: 'd1',
                    participantes: [
                        participante({ id: 'p1', valor: 40, status: 'PENDENTE' }),
                        organizador({ id: 'p2', valor: 40, pagouAConta: true, status: 'PAGO' }),
                    ],
                }),
                // Pedro pagou esta: Você ainda deve 30 -> euDevo
                divisaoBase({
                    id: 'd2',
                    participantes: [
                        participante({ id: 'p3', nome: 'Pedro', valor: 30, pagouAConta: true, status: 'PAGO' }),
                        organizador({ id: 'p4', valor: 30, pagouAConta: false, status: 'PENDENTE' }),
                    ],
                }),
            ]);
            expenseSplitRepository.contarTodasCriadas.mockResolvedValueOnce(5);

            const resumo = await expenseSplitService.calcularResumo('u1');

            expect(resumo.meDevem).toBe(40);
            expect(resumo.euDevo).toBe(30);
            expect(resumo.saldo).toBe(10);
            expect(resumo.possuiDivisoes).toBe(true);
        });

        it('possuiDivisoes é falso quando o usuário nunca criou nenhuma', async () => {
            expenseSplitRepository.listarAtivasComParticipantes.mockResolvedValueOnce([]);
            expenseSplitRepository.contarTodasCriadas.mockResolvedValueOnce(0);

            const resumo = await expenseSplitService.calcularResumo('u1');

            expect(resumo.possuiDivisoes).toBe(false);
            expect(resumo.meDevem).toBe(0);
            expect(resumo.euDevo).toBe(0);
        });
    });

    describe('criarLembreteCobranca', () => {
        it('cria um único Lembrete combinando vários participantes pendentes (RN-086)', async () => {
            const divisao = divisaoBase({
                participantes: [
                    participante({ id: 'p1', nome: 'maria', valor: 40, status: 'PENDENTE' }),
                    participante({ id: 'p2', nome: 'pedro', valor: 40, status: 'PENDENTE' }),
                ],
            });
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisao);
            reminderService.criarLembrete.mockResolvedValueOnce({ id: 'lembrete-1' });

            const resultado = await expenseSplitService.criarLembreteCobranca('u1', 'd1', ['p1', 'p2'], {});

            expect(reminderService.criarLembrete).toHaveBeenCalledWith(
                'u1',
                expect.objectContaining({ valor: 80, titulo: expect.stringContaining('Maria e Pedro') })
            );
            expect(expenseSplitRepository.vincularLembreteAParticipantes).toHaveBeenCalledWith('lembrete-1', [
                'p1',
                'p2',
            ]);
            expect(resultado).toEqual({ id: 'lembrete-1' });
        });

        it('rejeita quando nenhum participante é selecionado', async () => {
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisaoBase());

            await expect(
                expenseSplitService.criarLembreteCobranca('u1', 'd1', [], {})
            ).rejects.toMatchObject({ statusCode: 400 });
            expect(reminderService.criarLembrete).not.toHaveBeenCalled();
        });

        it('rejeita lembrete para participante que já pagou', async () => {
            const divisao = divisaoBase({
                participantes: [participante({ id: 'p1', status: 'PAGO' })],
            });
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisao);

            await expect(
                expenseSplitService.criarLembreteCobranca('u1', 'd1', ['p1'], {})
            ).rejects.toMatchObject({ statusCode: 400 });
            expect(reminderService.criarLembrete).not.toHaveBeenCalled();
        });

        it('rejeita lembrete para quem pagou a conta', async () => {
            const divisao = divisaoBase({
                participantes: [organizador({ id: 'p-voce', pagouAConta: true, status: 'PAGO' })],
            });
            expenseSplitRepository.buscarPorId.mockResolvedValueOnce(divisao);

            await expect(
                expenseSplitService.criarLembreteCobranca('u1', 'd1', ['p-voce'], {})
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });
});
