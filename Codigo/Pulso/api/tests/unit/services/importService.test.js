jest.mock('../../../src/parsers', () => ({
    parseStatementFile: jest.fn(),
}));
jest.mock('../../../src/repositories/transactionRepository');
jest.mock('../../../src/repositories/categoryRepository');
jest.mock('../../../src/config/database', () => ({
    $transaction: jest.fn(),
}));

const { parseStatementFile } = require('../../../src/parsers');
const transactionRepository = require('../../../src/repositories/transactionRepository');
const categoryRepository = require('../../../src/repositories/categoryRepository');
const prisma = require('../../../src/config/database');
const AppError = require('../../../src/utils/appError');
const { buildImportHash } = require('../../../src/utils/importHashUtils');
const importService = require('../../../src/services/importService');

describe('importService', () => {
    const categorias = [
        { id: 'cat-sal', nome: 'Salário', tipo: 'RECEITA' },
        { id: 'cat-outros', nome: 'Outros', tipo: 'DESPESA' },
        { id: 'cat-alim', nome: 'Alimentação', tipo: 'DESPESA', grupoBeneficio: 'ALIMENTACAO' },
        { id: 'cat-transp', nome: 'Transporte', tipo: 'DESPESA', grupoBeneficio: 'TRANSPORTE' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        transactionRepository.listarParaDedupeImportacao.mockResolvedValue([]);
        transactionRepository.listarDescricoesPorTipo.mockResolvedValue([]);
        transactionRepository.listarPorRecurso.mockResolvedValue([]);
        categoryRepository.listarPorUsuario.mockResolvedValue(categorias);
        prisma.$transaction.mockImplementation(async (fn) => {
            const tx = { transacao: { create: jest.fn().mockResolvedValue({}) } };
            await fn(tx);
            return tx;
        });
    });

    describe('analisarArquivo', () => {
        it('rejeita origem inválida', async () => {
            await expect(
                importService.analisarArquivo('u1', {
                    buffer: Buffer.from('x'),
                    filename: 'a.csv',
                    origem: 'CARTAO',
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('retorna mapeamento quando o parser pede', async () => {
            parseStatementFile.mockResolvedValue({
                precisaMapeamento: true,
                colunasDisponiveis: ['Data', 'Valor'],
                amostraLinhas: [{ Data: '01/01' }],
                parser: 'csv',
            });

            const result = await importService.analisarArquivo('u1', {
                buffer: Buffer.from('x'),
                filename: 'extrato.csv',
                origem: 'CONTA',
            });

            expect(result.precisaMapeamento).toBe(true);
            expect(result.recurso).toBe('DINHEIRO');
            expect(result.colunasDisponiveis).toEqual(['Data', 'Valor']);
        });

        it('marca duplicatas e sugere categorias', async () => {
            const data = new Date(2026, 0, 10);
            const hash = buildImportHash(data, 50, 'Padaria');
            transactionRepository.listarParaDedupeImportacao.mockResolvedValue([
                { data, valor: 50, descricao: 'Padaria' },
            ]);
            parseStatementFile.mockResolvedValue({
                precisaMapeamento: false,
                parser: 'ofx',
                saldoExtrato: 100,
                linhas: [
                    {
                        data,
                        valor: 50,
                        descricao: 'Padaria',
                        tipo: 'DESPESA',
                    },
                    {
                        data: new Date(2026, 0, 11),
                        valor: 2000,
                        descricao: 'Salário',
                        tipo: 'RECEITA',
                    },
                ],
            });

            const result = await importService.analisarArquivo('u1', {
                buffer: Buffer.from('x'),
                filename: 'extrato.ofx',
                origem: 'CONTA',
            });

            expect(result.totalDetectadas).toBe(2);
            expect(result.duplicatas).toBe(1);
            expect(result.linhas[0].duplicata).toBe(true);
            expect(result.linhas[0].hash ?? hash).toBeTruthy();
            expect(result.linhas[1].duplicata).toBe(false);
            expect(result.saldoExtrato).toBe(100);
        });

        it('força categoria de ajuste em origem benefício incompatível', async () => {
            parseStatementFile.mockResolvedValue({
                precisaMapeamento: false,
                parser: 'csv',
                linhas: [
                    {
                        data: new Date(2026, 0, 10),
                        valor: 30,
                        descricao: 'Loja qualquer',
                        tipo: 'DESPESA',
                    },
                ],
            });

            const result = await importService.analisarArquivo('u1', {
                buffer: Buffer.from('x'),
                filename: 'vr.csv',
                origem: 'VR',
            });

            expect(result.recurso).toBe('VR');
            expect(result.linhas[0].categoriaId).toBe('cat-alim');
        });
    });

    describe('confirmarImportacao', () => {
        it('rejeita origem inválida', async () => {
            await expect(
                importService.confirmarImportacao('u1', { origem: 'XYZ', linhas: [] })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('exige ao menos uma linha ou saldo', async () => {
            await expect(
                importService.confirmarImportacao('u1', { origem: 'CONTA', linhas: [] })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('importa linhas novas e ignora duplicatas', async () => {
            const data = new Date(2026, 0, 10);
            transactionRepository.listarParaDedupeImportacao.mockResolvedValue([
                { data, valor: 10, descricao: 'Dup' },
            ]);

            const result = await importService.confirmarImportacao('u1', {
                origem: 'CONTA',
                linhas: [
                    {
                        data,
                        valor: 10,
                        descricao: 'Dup',
                        tipo: 'DESPESA',
                        categoriaId: 'cat-outros',
                        incluir: true,
                    },
                    {
                        data: new Date(2026, 0, 11),
                        valor: 20,
                        descricao: 'Nova',
                        tipo: 'DESPESA',
                        categoriaId: 'cat-outros',
                        incluir: true,
                    },
                    {
                        data: new Date(2026, 0, 12),
                        valor: 5,
                        descricao: 'Ignorada',
                        tipo: 'DESPESA',
                        categoriaId: 'cat-outros',
                        incluir: false,
                    },
                ],
            });

            expect(result.importadas).toBe(1);
            expect(result.duplicatasIgnoradas).toBe(1);
            expect(prisma.$transaction).toHaveBeenCalled();
        });

        it('rejeita categoria inválida ou incompatível', async () => {
            await expect(
                importService.confirmarImportacao('u1', {
                    origem: 'CONTA',
                    linhas: [
                        {
                            data: new Date(2026, 0, 11),
                            valor: 20,
                            descricao: 'X',
                            tipo: 'DESPESA',
                            categoriaId: 'inexistente',
                            incluir: true,
                        },
                    ],
                })
            ).rejects.toBeInstanceOf(AppError);

            await expect(
                importService.confirmarImportacao('u1', {
                    origem: 'CONTA',
                    linhas: [
                        {
                            data: new Date(2026, 0, 11),
                            valor: 20,
                            descricao: 'X',
                            tipo: 'DESPESA',
                            categoriaId: 'cat-sal',
                            incluir: true,
                        },
                    ],
                })
            ).rejects.toMatchObject({ statusCode: 400 });
        });

        it('retorna 409 quando todas são duplicatas e sem ajuste', async () => {
            const data = new Date(2026, 0, 10);
            transactionRepository.listarParaDedupeImportacao.mockResolvedValue([
                { data, valor: 10, descricao: 'Dup' },
            ]);

            await expect(
                importService.confirmarImportacao('u1', {
                    origem: 'CONTA',
                    linhas: [
                        {
                            data,
                            valor: 10,
                            descricao: 'Dup',
                            tipo: 'DESPESA',
                            categoriaId: 'cat-outros',
                            incluir: true,
                        },
                    ],
                })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it('aplica ajuste de saldo quando saldoExtrato diverge', async () => {
            transactionRepository.listarPorRecurso.mockResolvedValue([]);

            const result = await importService.confirmarImportacao('u1', {
                origem: 'CONTA',
                saldoExtrato: 100,
                linhas: [
                    {
                        data: new Date(2026, 0, 11),
                        valor: 40,
                        descricao: 'Compra',
                        tipo: 'DESPESA',
                        categoriaId: 'cat-outros',
                        incluir: true,
                    },
                ],
            });

            // saldoAntes 0 - 40 = -40; saldo alvo 100 → ajuste RECEITA de 140
            expect(result.importadas).toBe(1);
            expect(result.ajusteSaldo).toBe(1);
            expect(result.saldoExtrato).toBe(100);
        });

        it('permite só ajuste de saldo sem linhas novas', async () => {
            transactionRepository.listarPorRecurso.mockResolvedValue([
                { tipo: 'RECEITA', recurso: 'DINHEIRO', valor: 50 },
            ]);

            const result = await importService.confirmarImportacao('u1', {
                origem: 'CONTA',
                saldoExtrato: 80,
                linhas: [],
            });

            expect(result.importadas).toBe(0);
            expect(result.ajusteSaldo).toBe(1);
        });

        it('não aplica ajuste quando delta é zero', async () => {
            transactionRepository.listarPorRecurso.mockResolvedValue([
                { tipo: 'RECEITA', recurso: 'DINHEIRO', valor: 100 },
            ]);

            const result = await importService.confirmarImportacao('u1', {
                origem: 'CONTA',
                saldoExtrato: 100,
                linhas: [],
            });

            expect(result.ajusteSaldo).toBe(0);
            expect(prisma.$transaction).toHaveBeenCalled();
        });
    });
});
