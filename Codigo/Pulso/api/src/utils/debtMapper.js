const mapDivida = (divida) => ({
    id: divida.id,
    direcao: divida.direcao,
    nomePessoa: divida.nomePessoa,
    valor: Number(divida.valor).toFixed(2),
    dataEmprestimo: divida.dataEmprestimo.toISOString(),
    prazoDevolucao: divida.prazoDevolucao ? divida.prazoDevolucao.toISOString() : null,
    observacao: divida.observacao ?? null,
    quitada: Boolean(divida.quitada),
    dataQuitacao: divida.dataQuitacao ? divida.dataQuitacao.toISOString() : null,
    criadoEm: divida.criadoEm.toISOString(),
    atualizadoEm: divida.atualizadoEm.toISOString(),
});

module.exports = { mapDivida };
