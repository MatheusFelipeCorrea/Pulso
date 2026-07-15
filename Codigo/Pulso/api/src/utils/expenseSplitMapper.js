const { formatPersonName } = require('./personName');

const mapParticipante = (participante) => ({
    id: participante.id,
    nome: participante.ehOrganizador ? 'Você' : formatPersonName(participante.nome),
    valor: Number(participante.valor),
    ehOrganizador: Boolean(participante.ehOrganizador),
    pagouAConta: Boolean(participante.pagouAConta),
    status: participante.status,
    dataPagamento: participante.dataPagamento ? participante.dataPagamento.toISOString() : null,
});

const mapDivisao = (divisao) => {
    const participantes = (divisao.participantes ?? []).map(mapParticipante);
    const pagador = participantes.find((p) => p.pagouAConta) ?? null;

    return {
        id: divisao.id,
        titulo: divisao.titulo,
        valorTotal: Number(divisao.valorTotal),
        tipo: divisao.tipo,
        status: divisao.status,
        data: divisao.data.toISOString(),
        icone: divisao.icone ?? null,
        cor: divisao.cor ?? null,
        observacao: divisao.observacao ?? null,
        quitadaEm: divisao.quitadaEm ? divisao.quitadaEm.toISOString() : null,
        criadoEm: divisao.criadoEm.toISOString(),
        atualizadoEm: divisao.atualizadoEm.toISOString(),
        participantes,
        pagador,
    };
};

module.exports = { mapDivisao, mapParticipante };
