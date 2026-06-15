const { calcProgressoMeta } = require('./metaBalanceUtils');

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const calcTotalDespesas = (despesas = []) =>
    roundMoney(
        despesas.reduce((acc, item) => acc + Number(item.valorEstimado ?? 0), 0)
    );

const mapMetaResumo = (meta) => {
    if (!meta) return null;
    const progresso = calcProgressoMeta(meta);
    return {
        id: meta.id,
        nome: meta.nome,
        valorAlvo: progresso.valorAlvo.toFixed(2),
        valorAtual: progresso.valorAtual.toFixed(2),
        percentual: progresso.percentual.toFixed(1),
        status: meta.status,
    };
};

const mapDespesa = (despesa) => ({
    id: despesa.id,
    categoria: despesa.categoria,
    descricao: despesa.descricao,
    valorEstimado: Number(despesa.valorEstimado).toFixed(2),
    criadoEm: despesa.criadoEm?.toISOString?.() ?? despesa.criadoEm,
});

const mapChecklistItem = (item) => ({
    id: item.id,
    texto: item.texto,
    concluido: Boolean(item.concluido),
});

const mapObservacao = (observacao) => ({
    id: observacao.id,
    titulo: observacao.titulo,
    conteudo: observacao.conteudo,
    tipo: observacao.tipo ?? 'GERAL',
    linkUrl: observacao.linkUrl,
    checklist: Array.isArray(observacao.checklist)
        ? observacao.checklist.map(mapChecklistItem)
        : [],
    criadoEm: observacao.criadoEm?.toISOString?.() ?? observacao.criadoEm,
    atualizadoEm: observacao.atualizadoEm?.toISOString?.() ?? observacao.atualizadoEm,
});

const mapViagem = (viagem) => {
    const despesas = (viagem.despesas ?? []).map(mapDespesa);
    const observacoes = (viagem.observacoes ?? []).map(mapObservacao);
    const totalBrl = calcTotalDespesas(viagem.despesas);

    return {
        id: viagem.id,
        destino: viagem.destino,
        moeda: viagem.moeda,
        dataPrevista: viagem.dataPrevista?.toISOString?.() ?? viagem.dataPrevista,
        metaId: viagem.metaId,
        meta: mapMetaResumo(viagem.meta),
        despesas,
        observacoes,
        totalBrl: totalBrl.toFixed(2),
        quantidadeDespesas: despesas.length,
        quantidadeObservacoes: observacoes.length,
        criadoEm: viagem.criadoEm?.toISOString?.() ?? viagem.criadoEm,
        atualizadoEm: viagem.atualizadoEm?.toISOString?.() ?? viagem.atualizadoEm,
    };
};

module.exports = {
    mapViagem,
    mapDespesa,
    mapObservacao,
    calcTotalDespesas,
};
