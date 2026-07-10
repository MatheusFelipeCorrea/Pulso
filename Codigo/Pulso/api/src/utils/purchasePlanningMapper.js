const { calcProgressoMeta } = require('./metaBalanceUtils');
const {
    calcComprometimento,
    calcMesesParaComprar,
    roundMoney,
    CATEGORIA_LABELS,
} = require('./purchasePlanningUtils');
const { RECURSOS } = require('../constants/transactionOptions');

const RECURSO_LABELS = Object.fromEntries(RECURSOS.map((r) => [r.value, r.label]));

const toMoneyString = (value) => roundMoney(value).toFixed(2);

const diasEntre = (inicio, fim) => {
    if (!inicio || !fim) return null;
    const ms = new Date(fim).getTime() - new Date(inicio).getTime();
    return Math.max(0, Math.round(ms / 86400000));
};

const mapTransacaoResumo = (transacao) => {
    if (!transacao) return null;
    return {
        id: transacao.id,
        valor: toMoneyString(transacao.valor),
        data: transacao.data?.toISOString?.() ?? transacao.data,
        recurso: transacao.recurso,
        recursoLabel: RECURSO_LABELS[transacao.recurso] ?? transacao.recurso,
        descricao: transacao.descricao ?? null,
    };
};

const mapSimulacaoParcelas = (valor, rendaMensal, parcelasLista = [12, 6]) => {
    const valorNum = Number(valor ?? 0);
    return parcelasLista.map((parcelas) => ({
        parcelas,
        ...calcComprometimento(valorNum, parcelas, rendaMensal),
        parcela: toMoneyString(calcComprometimento(valorNum, parcelas, rendaMensal).parcela),
    }));
};

const mapMetaVinculada = (meta) => {
    if (!meta) return null;
    const progresso = calcProgressoMeta(meta);
    return {
        id: meta.id,
        nome: meta.nome,
        valorAlvo: toMoneyString(progresso.valorAlvo),
        valorAtual: toMoneyString(progresso.valorAtual),
        valorRestante: toMoneyString(progresso.valorRestante),
        percentual: progresso.percentual,
        status: meta.status,
        compativel: true,
    };
};

const mapItem = (item, contexto = {}) => {
    const { rendaMensal = 0, sobraMensal = 0 } = contexto;
    const valor = Number(item.valorEstimado ?? 0);
    const meta = item.meta ?? null;
    const progressoMeta = meta ? calcProgressoMeta(meta) : null;
    const valorRestante = progressoMeta
        ? Math.max(0, progressoMeta.valorRestante)
        : valor;
    const mesesParaComprar = calcMesesParaComprar(valorRestante, sobraMensal);
    const parcelasConfig = item.simularParcelas ? [item.parcelas || 12, 6] : [];
    const simulacoesUnicas = [...new Set(parcelasConfig.filter(Boolean))];

    return {
        id: item.id,
        nome: item.nome,
        valorEstimado: toMoneyString(valor),
        prioridade: item.prioridade,
        categoria: item.categoria,
        categoriaLabel: CATEGORIA_LABELS[item.categoria] ?? item.categoria,
        observacoes: item.observacoes ?? null,
        linkProduto: item.linkProduto ?? null,
        imagemUrl: item.imagemUrl ?? null,
        simularParcelas: item.simularParcelas,
        parcelas: item.parcelas,
        status: item.status,
        compradoEm: item.compradoEm?.toISOString?.() ?? item.compradoEm ?? null,
        transacaoId: item.transacaoId ?? null,
        criadoEm: item.criadoEm?.toISOString?.() ?? item.criadoEm,
        meta: mapMetaVinculada(meta),
        mesesParaComprar,
        simulacoes: simulacoesUnicas.length
            ? mapSimulacaoParcelas(valor, rendaMensal, simulacoesUnicas)
            : [],
        comprometimentoPrincipal: item.simularParcelas
            ? calcComprometimento(valor, item.parcelas || 12, rendaMensal)
            : null,
    };
};

const mapItemComprado = (item) => ({
    id: item.id,
    nome: item.nome,
    valorEstimado: toMoneyString(item.valorEstimado),
    prioridade: item.prioridade,
    categoria: item.categoria,
    categoriaLabel: CATEGORIA_LABELS[item.categoria] ?? item.categoria,
    observacoes: item.observacoes ?? null,
    linkProduto: item.linkProduto ?? null,
    imagemUrl: item.imagemUrl ?? null,
    criadoEm: item.criadoEm?.toISOString?.() ?? item.criadoEm,
    compradoEm: item.compradoEm?.toISOString?.() ?? item.compradoEm,
    diasNaLista: diasEntre(item.criadoEm, item.compradoEm),
    meta: mapMetaVinculada(item.meta ?? null),
    transacao: mapTransacaoResumo(item.transacao ?? null),
});

module.exports = {
    mapItem,
    mapItemComprado,
    mapSimulacaoParcelas,
};
