const { roundMoney } = require('./debtBalanceUtils');

const splitEqual = (valorTotal, n) => {
    if (n <= 0) return [];

    const totalCentavos = Math.round(Number(valorTotal) * 100);
    const baseCentavos = Math.floor(totalCentavos / n);
    const resto = totalCentavos - baseCentavos * n;

    return Array.from({ length: n }, (_, index) => {
        const centavos = index < resto ? baseCentavos + 1 : baseCentavos;
        return roundMoney(centavos / 100);
    });
};

const validarSomaPersonalizada = (valorTotal, valores) => {
    const somaCentavos = valores.reduce((acc, valor) => acc + Math.round(Number(valor) * 100), 0);
    const totalCentavos = Math.round(Number(valorTotal) * 100);
    return somaCentavos === totalCentavos;
};

module.exports = {
    splitEqual,
    validarSomaPersonalizada,
};
