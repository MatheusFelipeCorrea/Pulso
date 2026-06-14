const { formatPersonName } = require('./personName');
const { calcSaldoDivida } = require('./debtBalanceUtils');
const { mapPagamento } = require('./debtPaymentMapper');

const mapDivida = (divida) => {
    const pagamentos = divida.pagamentos ?? [];
    const saldo = calcSaldoDivida(divida, pagamentos);

    return {
        id: divida.id,
        direcao: divida.direcao,
        nomePessoa: formatPersonName(divida.nomePessoa),
        valor: saldo.valorTotal.toFixed(2),
        valorPago: saldo.valorPago.toFixed(2),
        valorRestante: saldo.valorRestante.toFixed(2),
        dataEmprestimo: divida.dataEmprestimo.toISOString(),
        prazoDevolucao: divida.prazoDevolucao ? divida.prazoDevolucao.toISOString() : null,
        observacao: divida.observacao ?? null,
        quitada: Boolean(divida.quitada),
        dataQuitacao: divida.dataQuitacao ? divida.dataQuitacao.toISOString() : null,
        criadoEm: divida.criadoEm.toISOString(),
        atualizadoEm: divida.atualizadoEm.toISOString(),
        pagamentos: pagamentos.map(mapPagamento),
        quantidadePagamentos: pagamentos.length,
    };
};

module.exports = { mapDivida };
