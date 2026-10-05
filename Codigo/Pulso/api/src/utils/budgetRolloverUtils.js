const calcularValorRollover = (orcamentoAnterior, gastoAnterior) => {
    if (!orcamentoAnterior || !orcamentoAnterior.rolloverAtivo) return 0;

    const sobra = Number(orcamentoAnterior.limiteValor) - Number(gastoAnterior ?? 0);
    return sobra > 0 ? sobra : 0;
};

module.exports = {
    calcularValorRollover,
};
