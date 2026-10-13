const {
    aplicarMarcadoresRecebimentoFixo,
    clampDiaMes,
    diasNoMes,
    obterRecebimentosFixosConfig,
    recebimentosFixosNoDia,
} = require('../../../src/utils/fixedIncomeUtils');

describe('fixedIncomeUtils', () => {
    it('calcula dias do mês e clamp', () => {
        expect(diasNoMes(2026, 2)).toBe(28);
        expect(clampDiaMes(31, 2026, 2)).toBe(28);
        expect(clampDiaMes(0, 2026, 1)).toBeNull();
        expect(clampDiaMes('x', 2026, 1)).toBeNull();
    });

    it('só inclui VA/VR para CLT/estagiário com valor e dia válidos', () => {
        expect(obterRecebimentosFixosConfig(null)).toEqual([]);
        expect(obterRecebimentosFixosConfig({ valorSalario: 0, diaSalario: 5 })).toEqual([]);
        const clt = obterRecebimentosFixosConfig({
            modoUso: 'CLT',
            valorSalario: 3000,
            diaSalario: 5,
            valorVa: 800,
            diaVa: 1,
            valorVr: 500,
            diaVr: 1,
        });
        expect(clt.map((i) => i.tipo)).toEqual(['SALARIO', 'VA', 'VR']);
        const pj = obterRecebimentosFixosConfig({
            modoUso: 'PJ',
            valorSalario: 3000,
            diaSalario: 5,
            valorVa: 800,
            diaVa: 1,
        });
        expect(pj.map((i) => i.tipo)).toEqual(['SALARIO']);
        const estagio = obterRecebimentosFixosConfig({
            modoUso: 'ESTAGIARIO',
            valorSalario: 1500,
            diaSalario: 5,
            valorVa: 400,
            diaVa: 2,
        });
        expect(estagio.map((i) => i.tipo)).toEqual(['SALARIO', 'VA']);
    });

    it('marca dias do calendário', () => {
        const rec = obterRecebimentosFixosConfig({
            modoUso: 'CLT',
            valorSalario: 1000,
            diaSalario: 31,
        });
        expect(recebimentosFixosNoDia(rec, 2026, 2, 28)).toHaveLength(1);
        const dias = {};
        aplicarMarcadoresRecebimentoFixo(dias, rec, 2026, 2);
        expect(dias['2026-02-28'].temRecebimentoFixo).toBe(true);
        aplicarMarcadoresRecebimentoFixo(dias, rec, 2026, 2);
        expect(dias['2026-02-28'].recebimentosFixos).toEqual(['SALARIO']);
        aplicarMarcadoresRecebimentoFixo(dias, [{ tipo: 'VA', dia: 0 }], 2026, 1);
    });
});
