const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const calcSaldoFromPagamentos = (divida, pagamentos = []) => {
    const valorTotal = roundMoney(divida.valor);
    const valorPago = roundMoney(
        pagamentos.reduce((acc, item) => acc + Number(item.valor), 0)
    );
    const valorRestante = Math.max(0, roundMoney(valorTotal - valorPago));

    return {
        valorTotal,
        valorPago,
        valorRestante,
    };
};

const isDividaQuitada = (divida, pagamentos = []) => {
    const { valorRestante } = calcSaldoFromPagamentos(divida, pagamentos);
    if (valorRestante <= 0) return true;
    return Boolean(divida.quitada) && pagamentos.length === 0;
};

const calcSaldoDivida = (divida, pagamentos = []) => {
    if (isDividaQuitada(divida, pagamentos)) {
        const { valorTotal, valorPago } = calcSaldoFromPagamentos(divida, pagamentos);
        return {
            valorTotal,
            valorPago: valorPago > 0 ? valorPago : valorTotal,
            valorRestante: 0,
        };
    }

    return calcSaldoFromPagamentos(divida, pagamentos);
};

const estaTotalmentePaga = (divida, pagamentos = []) =>
    calcSaldoFromPagamentos(divida, pagamentos).valorRestante <= 0;

module.exports = {
    roundMoney,
    calcSaldoFromPagamentos,
    calcSaldoDivida,
    estaTotalmentePaga,
    isDividaQuitada,
};
