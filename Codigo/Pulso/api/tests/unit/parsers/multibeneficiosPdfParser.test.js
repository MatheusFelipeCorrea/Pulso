const {
    parseMultibeneficiosText,
    extractSaldoExtratoFromText,
} = require('../../../src/parsers/multibeneficiosPdfParser');
const { inferTipoFromDescricaoBeneficio } = require('../../../src/parsers/importParseUtils');

const SAMPLE_TEXT = `
Multibenefícios
Saldo total das carteiras R$ 871,93
sábado, 1 agosto
00:00 Saldo liberado
DISPONIBILIZACAO DE VALOR R$ 623,00
quarta-feira, 1 julho
00:00 Saldo liberado
DISPONIBILIZACAO DE VALOR R$ 623,00
Hoje, 4 agosto
13:06 Compra no Refeição
CHINA IN BOX R$ 53,80
segunda-feira, 3 agosto
17:49 Compra no Refeição
ULTRA COFFEE PUC BELO R$ 20,90
`;

const PLUXEE_SAMPLE_TEXT = `
Pluxee
Multibenefits
Total balance
R$712.23
Statement updated on 05/08/2026 10:18
4 August 2026
Boca Do Forno
Purchase on Meal • 18:55
-R$29.00
1 August 2026
Disponibilizacao De Valor
Meal • 00:00
+R$798.34
`;

describe('multibeneficiosPdfParser', () => {
    it('classifica créditos como RECEITA e compras como DESPESA', () => {
        const result = parseMultibeneficiosText(SAMPLE_TEXT, new Date('2026-08-05T12:00:00'));

        expect(result?.linhas).toHaveLength(4);

        const creditos = result.linhas.filter((linha) => linha.tipo === 'RECEITA');
        const compras = result.linhas.filter((linha) => linha.tipo === 'DESPESA');

        expect(creditos).toHaveLength(2);
        expect(compras).toHaveLength(2);
        expect(result.saldoExtrato).toBe('871.93');
        expect(creditos.every((linha) => linha.valor === '623.00')).toBe(true);
    });

    it('calcula saldo líquido do extrato parcial', () => {
        const result = parseMultibeneficiosText(SAMPLE_TEXT, new Date('2026-08-05T12:00:00'));
        const saldo = result.linhas.reduce((acc, linha) => {
            const valor = Number(linha.valor);
            return linha.tipo === 'RECEITA' ? acc + valor : acc - valor;
        }, 0);

        expect(saldo).toBeCloseTo(1171.3, 2);
    });

    it('infere tipo por descrição', () => {
        expect(inferTipoFromDescricaoBeneficio('DISPONIBILIZACAO DE VALOR', 'Saldo liberado')).toBe(
            'RECEITA'
        );
        expect(inferTipoFromDescricaoBeneficio('CHINA IN BOX', 'Compra no Refeição')).toBe('DESPESA');
    });

    it('extrai saldo do cabeçalho mesmo sem transações parseadas', () => {
        const text = 'Multibenefícios\nSaldo total das carteiras R$ 871,93\n';
        expect(extractSaldoExtratoFromText(text)).toBe('871.93');
    });

    it('parseia extrato Pluxee em inglês (saldo em linha separada e valores com sinal)', () => {
        const result = parseMultibeneficiosText(PLUXEE_SAMPLE_TEXT, new Date('2026-08-05T12:00:00'));

        expect(result?.linhas).toHaveLength(2);
        expect(result.saldoExtrato).toBe('712.23');

        const credito = result.linhas.find((linha) => linha.tipo === 'RECEITA');
        const compra = result.linhas.find((linha) => linha.tipo === 'DESPESA');

        expect(credito?.valor).toBe('798.34');
        expect(credito?.descricao).toBe('Disponibilizacao De Valor');
        expect(compra?.valor).toBe('29.00');
        expect(compra?.descricao).toBe('Boca Do Forno');
    });

    it('extrai saldo de cabeçalho em inglês (Total balance)', () => {
        const text = 'Total balance\nR$712.23\n';
        expect(extractSaldoExtratoFromText(text)).toBe('712.23');
    });
});
