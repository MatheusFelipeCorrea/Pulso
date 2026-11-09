/**
 * Engines determinísticos de Insights (score, projeções, alertas).
 * A IA só interpreta/enriquece — números base saem daqui.
 */

const round2 = (n) => Math.round(Number(n || 0) * 100) / 100;

const labelScore = (score) => {
    if (score >= 81) return 'Excelente';
    if (score >= 61) return 'Bom';
    if (score >= 41) return 'Regular';
    return 'Atenção';
};

const calcularScore = (ctx) => {
    const receitas = Number(ctx.fluxoMes.receitas || 0);
    const despesas = Number(ctx.fluxoMes.despesas || 0);
    const saldoPositivo = receitas >= despesas;

    let score = 45;
    if (saldoPositivo) score += 25;
    if (receitas > 0 && despesas / receitas <= 0.7) score += 10;

    const estourados = (ctx.orcamentoStatus || []).filter((a) => a.percentualUsado >= 100).length;
    if (estourados === 0) score += 15;
    else score -= estourados * 5;

    const metas = ctx.metas || [];
    const progressoMedio =
        metas.length > 0
            ? metas.reduce((acc, m) => acc + Number(m.progresso || 0), 0) / metas.length
            : 0;
    if (progressoMedio >= 30) score += 10;

    score = Math.max(0, Math.min(100, Math.round(score)));

    const checklist = [
        {
            id: 'fluxo',
            ok: saldoPositivo,
            texto: saldoPositivo
                ? 'Receitas cobrem as despesas do mês'
                : 'Despesas superaram receitas neste mês',
        },
        {
            id: 'orcamento',
            ok: estourados === 0,
            texto:
                estourados === 0
                    ? 'Nenhuma categoria de orçamento estourou o limite'
                    : `${estourados} categoria(s) acima do limite de orçamento`,
        },
        {
            id: 'metas',
            ok: metas.length > 0 && progressoMedio >= 20,
            texto:
                metas.length === 0
                    ? 'Nenhuma meta ativa'
                    : progressoMedio >= 20
                      ? 'Há progresso nas metas ativas'
                      : 'Metas com pouco avanço no período',
        },
        {
            id: 'registro',
            ok: despesas > 0 || receitas > 0,
            texto:
                despesas > 0 || receitas > 0
                    ? 'Há lançamentos registrados no mês'
                    : 'Poucos lançamentos neste mês',
        },
    ];

    return {
        valor: score,
        label: labelScore(score),
        checklist,
        fatores: {
            saldoPositivo,
            estourados,
            progressoMedio: Math.round(progressoMedio),
        },
    };
};

const mediaUltimosMeses = (mesesRecent, campo, qtd = 3) => {
    const slice = (mesesRecent || []).slice(-qtd);
    if (!slice.length) return 0;
    const soma = slice.reduce((acc, m) => acc + Number(m[campo] || 0), 0);
    return soma / slice.length;
};

const calcularProjecoes = (ctx) => {
    const mediaReceitas = mediaUltimosMeses(ctx.mesesRecent, 'receitas', 3);
    const mediaDespesas = mediaUltimosMeses(ctx.mesesRecent, 'despesas', 3);
    const saldoMensalAtual = mediaReceitas - mediaDespesas;

    const cenarios = [
        {
            id: 'otimista',
            label: 'Otimista',
            descricao: 'Se você economizar 15% a mais nas despesas',
            fatorDespesa: 0.85,
        },
        {
            id: 'atual',
            label: 'Atual',
            descricao: 'Mantendo o ritmo atual',
            fatorDespesa: 1,
        },
        {
            id: 'pessimista',
            label: 'Pessimista',
            descricao: 'Se os gastos subirem 10%',
            fatorDespesa: 1.1,
        },
    ];

    const horizontes = [3, 6, 12];
    const projecoes = cenarios.map((c) => {
        const saldoMes = mediaReceitas - mediaDespesas * c.fatorDespesa;
        const pontos = {};
        for (const h of horizontes) {
            pontos[String(h)] = round2(saldoMes * h);
        }
        return {
            ...c,
            saldoMensalEstimado: round2(saldoMes),
            acumulado: pontos,
        };
    });

    let diasAteNegativo = null;
    if (saldoMensalAtual < 0) {
        const perdaDiaria = Math.abs(saldoMensalAtual) / 30;
        const reserva = Math.max(0, Number(ctx.fluxoMes.receitas || 0) * 0.1);
        diasAteNegativo = perdaDiaria > 0 ? Math.max(1, Math.round(reserva / perdaDiaria)) : null;
        if (Number(ctx.fluxoMes.receitas || 0) - Number(ctx.fluxoMes.despesas || 0) < 0) {
            diasAteNegativo = Math.max(1, Math.round(30 / 2));
        }
    }

    return { projecoes, diasAteNegativo, mediaReceitas, mediaDespesas };
};

const calcularAlertas = (ctx) => {
    const alertas = [];
    const hoje = new Date();
    const dia = hoje.getUTCDate();
    const diasNoMes = 30;
    const despesas = Number(ctx.fluxoMes.despesas || 0);

    const vaGasto = Number(ctx.recursosMes?.VA || 0);
    const vaPlanejado = Number(ctx.config?.vaValor || 0);
    if (vaPlanejado > 0 && vaGasto > 0) {
        const ritmoDia = vaGasto / Math.max(1, dia);
        const diasRestantesVa = Math.floor((vaPlanejado - vaGasto) / Math.max(ritmoDia, 0.01));
        if (diasRestantesVa >= 0 && diasRestantesVa + dia <= diasNoMes) {
            const diaFim = Math.min(diasNoMes, dia + diasRestantesVa);
            alertas.push({
                tipo: 'cobertura_va',
                severidade: 'aviso',
                mensagem: `No ritmo atual, seu VA pode acabar por volta do dia ${diaFim}.`,
            });
        }
    }

    for (const o of ctx.orcamentoStatus || []) {
        if (o.percentualUsado >= 100) {
            alertas.push({
                tipo: 'orcamento',
                severidade: 'critico',
                mensagem: `Orçamento de ${o.categoria} estourou (${o.percentualUsado}%).`,
                entidadeId: o.categoria,
            });
        } else if (o.percentualUsado >= 85) {
            alertas.push({
                tipo: 'orcamento',
                severidade: 'aviso',
                mensagem: `${o.categoria} já usou ${o.percentualUsado}% do limite do mês.`,
                entidadeId: o.categoria,
            });
        }
    }

    const topUp = (ctx.variacaoCategorias || []).find((c) => c.percentual >= 25);
    if (topUp) {
        alertas.push({
            tipo: 'variacao',
            severidade: 'critico',
            mensagem: `Gasto em ${topUp.categoria} subiu ${topUp.percentual}% vs mês anterior.`,
            entidadeId: topUp.categoria,
        });
    }

    for (const m of ctx.metas || []) {
        if (!m.prazo) continue;
        const prazo = new Date(`${m.prazo}T12:00:00.000Z`);
        const dias = Math.ceil((prazo - hoje) / (1000 * 60 * 60 * 24));
        if (dias < 0 && m.progresso < 100) {
            alertas.push({
                tipo: 'meta',
                severidade: 'aviso',
                mensagem: `Meta "${m.nome}" passou do prazo com ${m.progresso}% concluído.`,
                entidadeId: m.id,
            });
        } else if (dias >= 0 && dias <= 45 && m.progresso >= 40) {
            alertas.push({
                tipo: 'meta',
                severidade: 'info',
                mensagem: `Meta "${m.nome}" está no caminho (${m.progresso}%).`,
                entidadeId: m.id,
            });
        }
    }

    if (despesas === 0 && Number(ctx.fluxoMes.receitas || 0) === 0) {
        alertas.push({
            tipo: 'dados',
            severidade: 'info',
            mensagem: 'Ainda há poucos lançamentos neste mês para análises mais precisas.',
        });
    }

    return alertas.slice(0, 6);
};

const resumoFallback = (ctx) => {
    const { receitas, despesas } = ctx.fluxoMes;
    const top = [...(ctx.variacaoCategorias || [])].sort((a, b) => b.atual - a.atual)[0];
    const partes = [
        `Em ${ctx.mesReferencia}, suas receitas somaram R$ ${Number(receitas).toFixed(2).replace('.', ',')} e as despesas R$ ${Number(despesas).toFixed(2).replace('.', ',')}.`,
    ];
    if (top?.atual > 0) {
        partes.push(
            `A maior fatia de gastos foi ${top.categoria}${top.percentual ? ` (${top.percentual > 0 ? '+' : ''}${top.percentual}% vs mês anterior)` : ''}.`
        );
    }
    if ((ctx.metas || []).length) {
        const m = ctx.metas[0];
        partes.push(`Na meta "${m.nome}" você está com ${m.progresso}% do objetivo.`);
    }
    return partes.join(' ');
};

module.exports = {
    calcularScore,
    calcularProjecoes,
    calcularAlertas,
    resumoFallback,
    labelScore,
};
