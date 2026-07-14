const { formatDateOnly, startOfDayInTimezone, todayInTimezone } = require('./dateTimezone');

const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const diffMesesAte = (prazo) => {
    const hoje = formatDateOnly(new Date());
    const alvo = formatDateOnly(prazo);
    const [y1, m1, d1] = hoje.split('-').map(Number);
    const [y2, m2, d2] = alvo.split('-').map(Number);
    let meses = (y2 - y1) * 12 + (m2 - m1);
    if (d2 < d1) meses -= 1;
    return Math.max(1, meses);
};

const inferirTipoMeta = (prazo) => (diffMesesAte(prazo) <= 6 ? 'CURTO_PRAZO' : 'LONGO_PRAZO');

const calcProgressoMeta = (meta) => {
    const valorAlvo = roundMoney(meta.valorAlvo);
    const valorAtual = roundMoney(meta.valorAtual);
    const valorRestante = Math.max(0, roundMoney(valorAlvo - valorAtual));
    const percentual = valorAlvo > 0 ? Math.min(100, roundMoney((valorAtual / valorAlvo) * 100)) : 0;

    return { valorAlvo, valorAtual, valorRestante, percentual };
};

const calcValorMensalSugerido = (meta) => {
    const { valorRestante } = calcProgressoMeta(meta);
    if (valorRestante <= 0) return 0;
    return roundMoney(valorRestante / diffMesesAte(meta.prazo));
};

const MESES_RESERVA_EMERGENCIA_PADRAO = 6;

const calcSugestaoReservaEmergencia = (mediaGastoMensal, meses = MESES_RESERVA_EMERGENCIA_PADRAO) => {
    const media = Math.max(0, Number(mediaGastoMensal) || 0);
    const mesesNum = Math.max(1, Number(meses) || MESES_RESERVA_EMERGENCIA_PADRAO);
    return roundMoney(media * mesesNum);
};

const metaEstaVencida = (meta) => {
    if (meta.status === 'CONCLUIDA' || meta.status === 'CANCELADA') return false;
    const hoje = todayInTimezone();
    const prazo = formatDateOnly(meta.prazo);
    return prazo < hoje;
};

const podeReceberAporte = (meta) => meta.status === 'ATIVA';

const estaConcluida = (meta) => meta.status === 'CONCLUIDA' || calcProgressoMeta(meta).valorRestante <= 0;

module.exports = {
    roundMoney,
    diffMesesAte,
    inferirTipoMeta,
    calcProgressoMeta,
    calcValorMensalSugerido,
    calcSugestaoReservaEmergencia,
    MESES_RESERVA_EMERGENCIA_PADRAO,
    metaEstaVencida,
    podeReceberAporte,
    estaConcluida,
};
