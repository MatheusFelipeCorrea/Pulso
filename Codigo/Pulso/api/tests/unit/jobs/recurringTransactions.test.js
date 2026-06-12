jest.mock('../../../src/config/database', () => ({
    transacao: { findFirst: jest.fn() },
}));
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const prisma = require('../../../src/config/database');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const { runRecurringTransactions } = require('../../../src/jobs/recurringTransactions');

describe('recurringTransactions job', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date('2026-01-10T12:00:00.000Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('cria transação filha para ocorrência do dia', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                usuarioId: 'u1',
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 20,
                descricao: 'assinatura',
                data: new Date('2026-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=MONTHLY',
                tags: [{ tagId: 'tag-1' }],
            },
        ]);
        prisma.transacao.findFirst.mockResolvedValue(null);
        transactionRepository.criar.mockResolvedValue({ id: 'f1' });
        transactionRepository.vincularTags.mockResolvedValue(undefined);

        await runRecurringTransactions();

        expect(transactionRepository.criar).toHaveBeenCalled();
        expect(transactionRepository.vincularTags).toHaveBeenCalledWith('f1', ['tag-1']);
    });

    it('não cria filha quando já existe transação do dia', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                data: new Date('2026-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=MONTHLY',
            },
        ]);
        prisma.transacao.findFirst.mockResolvedValue({ id: 'f1' });

        await runRecurringTransactions();
        expect(transactionRepository.criar).not.toHaveBeenCalled();
    });

    it('ignora ocorrência quando regra UNTIL já passou', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                data: new Date('2025-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=MONTHLY;UNTIL=20251231',
            },
        ]);

        await runRecurringTransactions();
        expect(transactionRepository.criar).not.toHaveBeenCalled();
    });

    it('cria filha para FREQ=WEEKLY no mesmo dia da semana', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                usuarioId: 'u1',
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 20,
                data: new Date('2026-01-03T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=WEEKLY',
                tags: [],
            },
        ]);
        prisma.transacao.findFirst.mockResolvedValue(null);
        transactionRepository.criar.mockResolvedValue({ id: 'f1' });

        await runRecurringTransactions();
        expect(transactionRepository.criar).toHaveBeenCalled();
        expect(transactionRepository.vincularTags).not.toHaveBeenCalled();
    });

    it('ignora FREQ=WEEKLY quando dia da semana não coincide', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                data: new Date('2026-01-05T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=WEEKLY',
            },
        ]);

        await runRecurringTransactions();
        expect(transactionRepository.criar).not.toHaveBeenCalled();
    });

    it('cria filha para FREQ=YEARLY na mesma data', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                usuarioId: 'u1',
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 20,
                data: new Date('2025-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=YEARLY',
                tags: [],
            },
        ]);
        prisma.transacao.findFirst.mockResolvedValue(null);
        transactionRepository.criar.mockResolvedValue({ id: 'f1' });

        await runRecurringTransactions();
        expect(transactionRepository.criar).toHaveBeenCalled();
    });

    it('ignora regra desconhecida ou ausente', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            { id: 'm1', data: new Date('2026-01-10T12:00:00.000Z'), regraRecorrencia: null },
            { id: 'm2', data: new Date('2026-01-10T12:00:00.000Z'), regraRecorrencia: 'FREQ=DAILY' },
        ]);

        await runRecurringTransactions();
        expect(transactionRepository.criar).not.toHaveBeenCalled();
    });
});
