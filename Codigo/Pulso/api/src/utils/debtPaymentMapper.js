const mapPagamento = (pagamento) => ({
    id: pagamento.id,
    valor: Number(pagamento.valor).toFixed(2),
    dataPagamento: pagamento.dataPagamento.toISOString(),
    observacao: pagamento.observacao ?? null,
    criadoEm: pagamento.criadoEm.toISOString(),
});

module.exports = { mapPagamento };
