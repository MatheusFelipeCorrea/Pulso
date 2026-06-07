const mapTag = (transacaoTag) => ({
    id: transacaoTag.tag.id,
    nome: transacaoTag.tag.nome,
    icone: transacaoTag.tag.icone,
    cor: transacaoTag.tag.cor,
});

const mapCategoria = (categoria) => ({
    id: categoria.id,
    nome: categoria.nome,
    icone: categoria.icone,
    cor: categoria.cor,
    tipo: categoria.tipo,
});

const mapTransacao = (transacao) => ({
    id: transacao.id,
    tipo: transacao.tipo,
    recurso: transacao.recurso,
    valor: Number(transacao.valor).toFixed(2),
    descricao: transacao.descricao,
    data: transacao.data.toISOString(),
    recorrente: transacao.recorrente,
    regraRecorrencia: transacao.regraRecorrencia,
    paiId: transacao.paiId,
    categoria: transacao.categoria ? mapCategoria(transacao.categoria) : undefined,
    tags: transacao.tags?.map(mapTag) ?? [],
});

module.exports = { mapTransacao, mapCategoria };
