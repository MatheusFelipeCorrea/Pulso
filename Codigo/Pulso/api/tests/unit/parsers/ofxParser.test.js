const { parseOfx } = require('../../../src/parsers/ofxParser');

describe('ofxParser', () => {
    it('extrai transações de OFX', () => {
        const sample = `
<OFX>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20260315</DTPOSTED>
<TRNAMT>-42.50</TRNAMT>
<MEMO>IFOOD *RESTAURANTE</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT</TRNTYPE>
<DTPOSTED>20260301</DTPOSTED>
<TRNAMT>3500.00</TRNAMT>
<NAME>SALARIO MAR</NAME>
</STMTTRN>
</OFX>`;

        const { linhas, parser } = parseOfx(Buffer.from(sample, 'utf8'));

        expect(parser).toBe('ofx');
        expect(linhas).toHaveLength(2);
        expect(linhas[0].tipo).toBe('DESPESA');
        expect(linhas[0].valor).toBe('42.50');
        expect(linhas[0].descricao).toContain('IFOOD');
        expect(linhas[1].tipo).toBe('RECEITA');
        expect(linhas[1].valor).toBe('3500.00');
    });
});
