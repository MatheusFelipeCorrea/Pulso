const {
    parseContaText,
    extractSaldoExtratoFromContaText,
    isContaStatement,
} = require('../../../src/parsers/contaPdfParser');

const SAMPLE = `
Saldo final do período
Extrato de conta
R$ 1.484,96
03 de agosto 2026
Saldo ao final do dia:
R$ 1.484,96
13:08
Pix recebido
+R$ 150,00
MATHEUS FELIPE CORREA DA SILVA
08:45
Rendimento recebido
+R$ 0,02
Rendimento de conta
02 de agosto 2026
14:58
Compra realizada
−R$ 98,57
Posto Antunes Ltda Belo Horizont Bra
Com saldo
`;

describe('contaPdfParser', () => {
    it('detecta extrato de conta PicPay', () => {
        expect(isContaStatement(SAMPLE)).toBe(true);
    });

    it('extrai saldo final do período', () => {
        expect(extractSaldoExtratoFromContaText(SAMPLE)).toBe('1484.96');
    });

    it('parseia transações com descrição correta', () => {
        const result = parseContaText(SAMPLE);

        expect(result?.linhas).toHaveLength(3);
        expect(result.saldoExtrato).toBe('1484.96');

        expect(result.linhas[0]).toMatchObject({
            valor: '150.00',
            descricao: 'MATHEUS FELIPE CORREA DA SILVA',
            tipo: 'RECEITA',
        });
        expect(result.linhas[2]).toMatchObject({
            valor: '98.57',
            descricao: 'Posto Antunes Ltda Belo Horizont Bra',
            tipo: 'DESPESA',
        });
    });
});
