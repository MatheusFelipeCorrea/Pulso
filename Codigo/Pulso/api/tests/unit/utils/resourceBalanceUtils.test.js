const {
    RECURSOS_DASHBOARD,
    calcularSaldosPorRecurso,
    diasUteisRestantesNoMes,
    saldoTotalDisponivel,
} = require('../../../src/utils/resourceBalanceUtils');

describe('resourceBalanceUtils', () => {
    it('acumula receita, despesa e transferência', () => {
        const saldos = calcularSaldosPorRecurso([
            { tipo: 'RECEITA', recurso: 'DINHEIRO', valor: 100 },
            { tipo: 'DESPESA', recurso: 'VA', valor: 20 },
            { tipo: 'TRANSFERENCIA', recurso: 'DINHEIRO', recursoDestino: 'POUPANCA', valor: 30 },
            { tipo: 'RECEITA', recurso: 'NOVO', valor: 5 },
        ]);
        expect(saldos.DINHEIRO).toBe(70);
        expect(saldos.VA).toBe(-20);
        expect(saldos.POUPANCA).toBe(30);
        expect(saldos.NOVO).toBe(5);
        expect(saldoTotalDisponivel(saldos)).toBe(50);
        expect(RECURSOS_DASHBOARD).toContain('DINHEIRO');
    });

    it('conta dias úteis restantes', () => {
        const ref = new Date();
        expect(diasUteisRestantesNoMes(ref)).toBeGreaterThanOrEqual(1);
    });
});
