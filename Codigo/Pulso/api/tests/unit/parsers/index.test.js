jest.mock('../../../src/parsers/pdfParser', () => ({
    parsePdf: jest.fn(),
}));

const { parsePdf } = require('../../../src/parsers/pdfParser');
const { parseStatementFile } = require('../../../src/parsers/index');

describe('parseStatementFile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('aceita PDF com saldo e sem transações', async () => {
        parsePdf.mockResolvedValue({
            linhas: [],
            saldoExtrato: '120.50',
            parser: 'pdf-beneficio',
        });

        const result = await parseStatementFile({
            buffer: Buffer.from('pdf'),
            filename: 'vt.pdf',
        });

        expect(result.linhas).toEqual([]);
        expect(result.saldoExtrato).toBe('120.50');
    });

    it('rejeita arquivo sem transações nem saldo', async () => {
        parsePdf.mockResolvedValue({ linhas: [], parser: 'pdf-beneficio' });

        await expect(
            parseStatementFile({
                buffer: Buffer.from('pdf'),
                filename: 'vazio.pdf',
            })
        ).rejects.toMatchObject({ statusCode: 422 });
    });
});
