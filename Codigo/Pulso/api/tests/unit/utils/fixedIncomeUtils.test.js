const {
    obterRecebimentosFixosConfig,
    recebimentosFixosNoDia,
    aplicarMarcadoresRecebimentoFixo,
    clampDiaMes,
    diasNoMes,
} = require('../../../src/utils/fixedIncomeUtils');

describe('fixedIncomeUtils', () => {
    it('diasNoMes retorna total de dias do mês', () => {
        expect(diasNoMes(2024, 2)).toBe(29);
        expect(diasNoMes(2026, 2)).toBe(28);
    });

    it('clampDiaMes limita dia ao intervalo do mês', () => {
        expect(clampDiaMes(31, 2026, 2)).toBe(28);
        expect(clampDiaMes(15.9, 2026, 6)).toBe(15);
        expect(clampDiaMes(0, 2026, 6)).toBeNull();
        expect(clampDiaMes('abc', 2026, 6)).toBeNull();
    });

    it('obterRecebimentosFixosConfig inclui salário, VA/VR e VT para CLT', () => {
        const config = {
            modoUso: 'CLT',
            valorSalario: 5000,
            diaSalario: 5,
            valorVa: 800,
            diaVa: 10,
            valorVr: 700,
            diaVr: 12,
            valorVt: 300,
            diaVt: 15,
        };

        expect(obterRecebimentosFixosConfig(config)).toEqual([
            { tipo: 'SALARIO', label: 'Salário', valor: 5000, dia: 5 },
            { tipo: 'VA', label: 'Vale Alimentação', valor: 800, dia: 10 },
            { tipo: 'VR', label: 'Vale Refeição', valor: 700, dia: 12 },
            { tipo: 'VT', label: 'Vale Transporte', valor: 300, dia: 15 },
        ]);
    });

    it('obterRecebimentosFixosConfig respeita regras de PJ e ignora valores inválidos', () => {
        const config = {
            modoUso: 'PJ',
            vtHabilitado: true,
            valorSalario: 0,
            diaSalario: 5,
            valorVt: 250,
            diaVt: 31,
            valorVa: 100,
            diaVa: 10,
            valorVr: 100,
            diaVr: 10,
        };

        expect(obterRecebimentosFixosConfig(config)).toEqual([
            { tipo: 'VT', label: 'Vale Transporte', valor: 250, dia: 31 },
        ]);
    });

    it('recebimentosFixosNoDia considera clamp do fim do mês', () => {
        const recebimentos = [
            { tipo: 'SALARIO', dia: 31 },
            { tipo: 'VA', dia: 10 },
        ];

        const result = recebimentosFixosNoDia(recebimentos, 2026, 2, 28);

        expect(result).toEqual([{ tipo: 'SALARIO', dia: 31 }]);
    });

    it('aplicarMarcadoresRecebimentoFixo cria marcador e deduplica tipos', () => {
        const dias = {};
        const recebimentos = [
            { tipo: 'VA', dia: 10 },
            { tipo: 'VA', dia: 10 },
            { tipo: 'VT', dia: 31 },
        ];

        aplicarMarcadoresRecebimentoFixo(dias, recebimentos, 2026, 2);

        expect(dias['2026-02-10']).toMatchObject({
            temRecebimentoFixo: true,
            recebimentosFixos: ['VA'],
        });
        expect(dias['2026-02-28']).toMatchObject({
            temRecebimentoFixo: true,
            recebimentosFixos: ['VT'],
        });
    });

    it('PESSOA_FISICA não inclui VA, VR nem VT', () => {
        const config = obterRecebimentosFixosConfig({
            modoUso: 'PESSOA_FISICA',
            valorSalario: 1000,
            diaSalario: 1,
            valorVa: 100,
            diaVa: 5,
            valorVt: 200,
            diaVt: 1,
        });
        expect(config).toEqual([{ tipo: 'SALARIO', label: 'Salário', valor: 1000, dia: 1 }]);
    });

    it('PJ sem vtHabilitado não inclui VT', () => {
        const config = obterRecebimentosFixosConfig({
            modoUso: 'PJ',
            vtHabilitado: false,
            valorSalario: 8000,
            diaSalario: 5,
            valorVt: 300,
            diaVt: 1,
        });
        expect(config.some((item) => item.tipo === 'VT')).toBe(false);
    });
});
