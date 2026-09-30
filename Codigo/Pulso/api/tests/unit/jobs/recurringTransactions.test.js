const prisma = require('../../../src/config/database');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const { runRecurringTransactions, isOccurrenceToday } = require('../../../src/jobs/recurringTransactions');

jest.mock('../../../src/config/database', () => ({
    $transaction: jest.fn(),
}));
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn(), warn: jest.fn() }));

describe('recurringTransactions job', () => {
    const tx = {
        transacao: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        transacaoTag: {
            createMany: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers().setSystemTime(new Date('2026-01-10T12:00:00.000Z'));
        prisma.$transaction.mockImplementation(async (fn) => fn(tx));
        tx.transacao.findFirst.mockResolvedValue(null);
        tx.transacao.create.mockResolvedValue({ id: 'f1' });
        tx.transacaoTag.createMany.mockResolvedValue({ count: 0 });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('cria transação filha para ocorrência do dia e copia tags', async () => {
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

        await runRecurringTransactions();

        expect(tx.transacao.create).toHaveBeenCalled();
        expect(tx.transacaoTag.createMany).toHaveBeenCalledWith({
            data: [{ transacaoId: 'f1', tagId: 'tag-1' }],
            skipDuplicates: true,
        });
    });

    it('copia recursoDestino em transferência recorrente', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                usuarioId: 'u1',
                categoriaId: null,
                tipo: 'TRANSFERENCIA',
                recurso: 'DINHEIRO',
                recursoDestino: 'POUPANCA',
                valor: 50,
                descricao: 'reserva',
                data: new Date('2026-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=MONTHLY',
                tags: [],
            },
        ]);

        await runRecurringTransactions();

        expect(tx.transacao.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    tipo: 'TRANSFERENCIA',
                    recurso: 'DINHEIRO',
                    recursoDestino: 'POUPANCA',
                }),
            })
        );
    });

    it('não cria filha quando já existe transação do dia', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                data: new Date('2026-01-10T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=MONTHLY',
            },
        ]);
        tx.transacao.findFirst.mockResolvedValue({ id: 'f1' });

        await runRecurringTransactions();
        expect(tx.transacao.create).not.toHaveBeenCalled();
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
        expect(tx.transacao.create).not.toHaveBeenCalled();
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

        await runRecurringTransactions();
        expect(tx.transacao.create).toHaveBeenCalled();
        expect(tx.transacaoTag.createMany).not.toHaveBeenCalled();
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
        expect(tx.transacao.create).not.toHaveBeenCalled();
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

        await runRecurringTransactions();
        expect(tx.transacao.create).toHaveBeenCalled();
    });

    it('cria filha para FREQ=DAILY', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            {
                id: 'm1',
                usuarioId: 'u1',
                categoriaId: 'c1',
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 5,
                data: new Date('2026-01-01T12:00:00.000Z'),
                regraRecorrencia: 'FREQ=DAILY',
                tags: [],
            },
        ]);

        await runRecurringTransactions();
        expect(tx.transacao.create).toHaveBeenCalled();
    });

    it('FREQ=MONTHLY no dia 31 dispara no último dia de meses curtos', () => {
        jest.setSystemTime(new Date('2026-02-28T15:00:00.000Z'));
        expect(isOccurrenceToday('FREQ=MONTHLY', new Date('2026-01-31T12:00:00.000Z'))).toBe(true);
        jest.setSystemTime(new Date('2026-02-27T15:00:00.000Z'));
        expect(isOccurrenceToday('FREQ=MONTHLY', new Date('2026-01-31T12:00:00.000Z'))).toBe(false);
    });

    it('ignora regra desconhecida ou ausente', async () => {
        transactionRepository.listarRecorrentesMae.mockResolvedValue([
            { id: 'm1', data: new Date('2026-01-10T12:00:00.000Z'), regraRecorrencia: null },
            { id: 'm2', data: new Date('2026-01-10T12:00:00.000Z'), regraRecorrencia: 'FREQ=HOURLY' },
        ]);

        await runRecurringTransactions();
        expect(tx.transacao.create).not.toHaveBeenCalled();
    });
});
