const RECURSOS_DASHBOARD = ['DINHEIRO', 'VA', 'VR'];

/**
 * Calcula saldo acumulado por recurso a partir de todas as transações.
 * RECEITA soma, DESPESA subtrai, TRANSFERENCIA move entre recursos.
 */
const calcularSaldosPorRecurso = (transacoes) => {
    const saldos = {
        DINHEIRO: 0,
        VA: 0,
        VR: 0,
        VT: 0,
        POUPANCA: 0,
    };

    for (const tx of transacoes) {
        const valor = Number(tx.valor ?? 0);
        if (tx.tipo === 'RECEITA') {
            saldos[tx.recurso] = (saldos[tx.recurso] ?? 0) + valor;
        } else if (tx.tipo === 'DESPESA') {
            saldos[tx.recurso] = (saldos[tx.recurso] ?? 0) - valor;
        } else if (tx.tipo === 'TRANSFERENCIA') {
            saldos[tx.recurso] = (saldos[tx.recurso] ?? 0) - valor;
            if (tx.recursoDestino) {
                saldos[tx.recursoDestino] = (saldos[tx.recursoDestino] ?? 0) + valor;
            }
        }
    }

    return saldos;
};

const saldoTotalDisponivel = (saldos) =>
    RECURSOS_DASHBOARD.reduce((acc, key) => acc + (saldos[key] ?? 0), 0);

const diasUteisRestantesNoMes = (referencia) => {
    const hoje = new Date();
    const ultimoDia = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
    let dias = 0;
    for (let d = hoje.getDate(); d <= ultimoDia.getDate(); d++) {
        const date = new Date(referencia.getFullYear(), referencia.getMonth(), d);
        const dow = date.getDay();
        if (dow !== 0 && dow !== 6) dias += 1;
    }
    return Math.max(dias, 1);
};

module.exports = {
    RECURSOS_DASHBOARD,
    calcularSaldosPorRecurso,
    saldoTotalDisponivel,
    diasUteisRestantesNoMes,
};
