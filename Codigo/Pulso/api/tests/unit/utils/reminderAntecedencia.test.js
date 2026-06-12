const {
    ANTECEDENCIA_LABELS,
    ANTECEDENCIA_DIAS,
    ANTECEDENCIA_MINUTOS,
    HORA_PADRAO_LEMBRETE,
} = require('../../../src/utils/reminderAntecedencia');

describe('reminderAntecedencia', () => {
    it('expõe labels esperados', () => {
        expect(ANTECEDENCIA_LABELS).toEqual({
            NO_DIA: 'No dia',
            UM_DIA: '1 dia antes',
            TRES_DIAS: '3 dias antes',
            CINCO_DIAS: '5 dias antes',
            UMA_SEMANA: '1 semana antes',
        });
    });

    it('expõe dias de antecedência corretos', () => {
        expect(ANTECEDENCIA_DIAS.NO_DIA).toBe(0);
        expect(ANTECEDENCIA_DIAS.UM_DIA).toBe(1);
        expect(ANTECEDENCIA_DIAS.TRES_DIAS).toBe(3);
        expect(ANTECEDENCIA_DIAS.CINCO_DIAS).toBe(5);
        expect(ANTECEDENCIA_DIAS.UMA_SEMANA).toBe(7);
    });

    it('expõe minutos de antecedência corretos', () => {
        expect(ANTECEDENCIA_MINUTOS.NO_DIA).toBe(0);
        expect(ANTECEDENCIA_MINUTOS.UM_DIA).toBe(24 * 60);
        expect(ANTECEDENCIA_MINUTOS.TRES_DIAS).toBe(3 * 24 * 60);
        expect(ANTECEDENCIA_MINUTOS.CINCO_DIAS).toBe(5 * 24 * 60);
        expect(ANTECEDENCIA_MINUTOS.UMA_SEMANA).toBe(7 * 24 * 60);
    });

    it('reexporta HORA_PADRAO_LEMBRETE', () => {
        expect(HORA_PADRAO_LEMBRETE).toBe(10);
    });
});
