const {
    calcProgressoMeta,
    calcValorMensalSugerido,
    diffMesesAte,
    metaEstaVencida,
} = require('./metaBalanceUtils');

const mapAporte = (aporte) => ({
    id: aporte.id,
    valor: Number(aporte.valor).toFixed(2),
    data: aporte.data.toISOString(),
    criadoEm: aporte.criadoEm.toISOString(),
});

const mapMeta = (meta) => {
    const progresso = calcProgressoMeta(meta);
    const mesesRestantes = diffMesesAte(meta.prazo);

    return {
        id: meta.id,
        nome: meta.nome,
        valorAlvo: progresso.valorAlvo.toFixed(2),
        valorAtual: progresso.valorAtual.toFixed(2),
        valorRestante: progresso.valorRestante.toFixed(2),
        percentual: progresso.percentual.toFixed(1),
        prazo: meta.prazo.toISOString(),
        tipo: meta.tipo,
        status: meta.status,
        prioridade: meta.prioridade ?? null,
        descricao: meta.descricao ?? null,
        concluidaEm: meta.concluidaEm ? meta.concluidaEm.toISOString() : null,
        criadoEm: meta.criadoEm.toISOString(),
        atualizadoEm: meta.atualizadoEm.toISOString(),
        valorMensalSugerido: calcValorMensalSugerido(meta).toFixed(2),
        mesesRestantes,
        vencida: metaEstaVencida(meta),
        aportes: (meta.aportes ?? []).map(mapAporte),
        quantidadeAportes: meta.aportes?.length ?? 0,
    };
};

module.exports = { mapMeta, mapAporte };
