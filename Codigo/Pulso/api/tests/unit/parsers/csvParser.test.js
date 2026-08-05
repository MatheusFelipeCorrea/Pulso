const { parseCsv } = require('../../../src/parsers/csvParser');

describe('csvParser', () => {
    it('detecta colunas padrão em CSV com ponto e vírgula', () => {
        const sample = `Data;Valor;Descrição
10/03/2026;-15,90;UBER TRIP
01/03/2026;2500,00;PIX RECEBIDO`;

        const result = parseCsv(Buffer.from(sample, 'utf8'));

        expect(result.parser).toBe('csv');
        expect(result.linhas).toHaveLength(2);
        expect(result.linhas[0].tipo).toBe('DESPESA');
        expect(result.linhas[0].valor).toBe('15.90');
        expect(result.linhas[1].tipo).toBe('RECEITA');
    });

    it('solicita mapeamento quando cabeçalho é desconhecido', () => {
        const sample = `col_a;col_b;col_c
10/03/2026;-15,90;UBER TRIP`;

        const result = parseCsv(Buffer.from(sample, 'utf8'));

        expect(result.precisaMapeamento).toBe(true);
        expect(result.colunasDisponiveis).toEqual(['col_a', 'col_b', 'col_c']);
    });
});
