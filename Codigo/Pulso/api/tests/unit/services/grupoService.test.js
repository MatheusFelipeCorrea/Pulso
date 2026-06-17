const {
    normalizarCodigoConvite,
    CODIGO_REGEX,
} = require('../../../src/services/grupoService');

describe('grupoService', () => {
    it('normaliza código de convite', () => {
        expect(normalizarCodigoConvite(' pulso-x7k2 ')).toBe('PULSO-X7K2');
        expect(CODIGO_REGEX.test('PULSO-X7K2')).toBe(true);
        expect(CODIGO_REGEX.test('PULSO-X7')).toBe(false);
    });
});
