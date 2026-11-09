const prisma = require('../config/database');
const { todayInTimezone } = require('../utils/dateTimezone');

const brl = (valor) =>
    Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const monthKeyFromDate = (date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const shiftMonth = (mesYYYYMM, delta) => {
    const [y, m] = mesYYYYMM.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1 + delta, 1));
    return monthKeyFromDate(d);
};

const monthBounds = (mesYYYYMM) => {
    const inicio = new Date(`${mesYYYYMM}-01T00:00:00.000Z`);
    const fim = new Date(inicio);
    fim.setUTCMonth(fim.getUTCMonth() + 1);
    return { inicio, fim };
};

/**
 * Dossier financeiro determinístico do usuário para Insights.
 * @param {string} usuarioId
 * @param {string} [mesReferencia] YYYY-MM
 */
const buildInsightContext = async (usuarioId, mesReferencia) => {
    const hoje = todayInTimezone();
    const mes = mesReferencia || hoje.slice(0, 7);
    const mesAnterior = shiftMonth(mes, -1);
    const inicioJanela = new Date(`${shiftMonth(mes, -5)}-01T00:00:00.000Z`);
    const { inicio: inicioMes, fim: fimMes } = monthBounds(mes);
    const { inicio: inicioAnt, fim: fimAnt } = monthBounds(mesAnterior);

    const [txs, metas, orcamentos, config, categorias] = await Promise.all([
        prisma.transacao.findMany({
            where: {
                usuarioId,
                data: { gte: inicioJanela, lt: fimMes },
                tipo: { in: ['DESPESA', 'RECEITA'] },
            },
            select: {
                tipo: true,
                valor: true,
                descricao: true,
                data: true,
                recurso: true,
                categoriaId: true,
                categoria: { select: { id: true, nome: true } },
            },
        }),
        prisma.meta.findMany({
            where: { usuarioId, status: { in: ['ATIVA', 'PAUSADA'] } },
            take: 12,
            select: {
                id: true,
                nome: true,
                status: true,
                valorAtual: true,
                valorAlvo: true,
                prazo: true,
            },
        }),
        prisma.orcamento.findMany({
            where: { usuarioId, mesReferencia: mes },
            select: {
                limite: true,
                categoriaId: true,
                categoria: { select: { nome: true } },
            },
        }),
        prisma.configuracaoUsuario.findUnique({
            where: { usuarioId },
            select: {
                modoUso: true,
                salarioValor: true,
                vaValor: true,
                vrValor: true,
                vtValor: true,
            },
        }),
        prisma.categoria.findMany({
            where: { OR: [{ usuarioId }, { usuarioId: null }] },
            select: { id: true, nome: true },
            take: 120,
        }),
    ]);

    const catMap = new Map(categorias.map((c) => [c.id, c.nome]));

    const porMes = {};
    const catsMes = {};
    const catsAnt = {};
    const descricoesDespesa = {};
    const recursosMes = {};

    for (const t of txs) {
        const key = monthKeyFromDate(new Date(t.data));
        if (!porMes[key]) porMes[key] = { receitas: 0, despesas: 0 };
        const v = Number(t.valor);
        if (t.tipo === 'RECEITA') porMes[key].receitas += v;
        if (t.tipo === 'DESPESA') porMes[key].despesas += v;

        const data = new Date(t.data);
        if (data >= inicioMes && data < fimMes) {
            if (t.tipo === 'DESPESA') {
                const nome = t.categoria?.nome || catMap.get(t.categoriaId) || 'Sem categoria';
                catsMes[nome] = (catsMes[nome] || 0) + v;
                const desc = (t.descricao || '').trim().toLowerCase();
                if (desc) {
                    if (!descricoesDespesa[desc]) {
                        descricoesDespesa[desc] = { total: 0, qtd: 0 };
                    }
                    descricoesDespesa[desc].total += v;
                    descricoesDespesa[desc].qtd += 1;
                }
                const rec = t.recurso || 'DINHEIRO';
                if (!recursosMes[rec]) recursosMes[rec] = 0;
                recursosMes[rec] += v;
            }
        }
        if (data >= inicioAnt && data < fimAnt && t.tipo === 'DESPESA') {
            const nome = t.categoria?.nome || catMap.get(t.categoriaId) || 'Sem categoria';
            catsAnt[nome] = (catsAnt[nome] || 0) + v;
        }
    }

    const fluxoMes = porMes[mes] || { receitas: 0, despesas: 0 };
    const fluxoAnt = porMes[mesAnterior] || { receitas: 0, despesas: 0 };

    const variacaoCategorias = Object.keys({ ...catsMes, ...catsAnt })
        .map((nome) => {
            const atual = catsMes[nome] || 0;
            const anterior = catsAnt[nome] || 0;
            let percentual = 0;
            if (anterior > 0) percentual = Math.round(((atual - anterior) / anterior) * 100);
            else if (atual > 0) percentual = 100;
            return {
                categoria: nome,
                atual,
                anterior,
                percentual,
                variacao: atual - anterior,
            };
        })
        .sort((a, b) => Math.abs(b.percentual) - Math.abs(a.percentual))
        .slice(0, 8);

    const topEstabelecimentos = Object.entries(descricoesDespesa)
        .map(([descricao, info]) => ({
            descricao,
            total: info.total,
            qtd: info.qtd,
            media: info.total / info.qtd,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);

    const gastosPorCategoriaMes = Object.entries(catsMes).map(([nome, total]) => ({
        nome,
        total,
    }));

    const orcamentoStatus = orcamentos.map((o) => {
        const nome = o.categoria?.nome || 'Categoria';
        const gasto = catsMes[nome] || 0;
        const limite = Number(o.limite);
        return {
            categoria: nome,
            limite,
            gasto,
            percentualUsado: limite > 0 ? Math.round((gasto / limite) * 100) : 0,
        };
    });

    const metasCtx = metas.map((m) => {
        const atual = Number(m.valorAtual);
        const alvo = Number(m.valorAlvo);
        const progresso = alvo > 0 ? Math.round((atual / alvo) * 100) : 0;
        return {
            id: m.id,
            nome: m.nome,
            status: m.status,
            atual,
            alvo,
            restante: Math.max(0, alvo - atual),
            progresso,
            prazo: m.prazo ? m.prazo.toISOString().slice(0, 10) : null,
        };
    });

    const mesesRecent = [];
    for (let i = 5; i >= 0; i -= 1) {
        const key = shiftMonth(mes, -i);
        mesesRecent.push({
            mes: key,
            ...(porMes[key] || { receitas: 0, despesas: 0 }),
        });
    }

    const texto = [
        `Mês de referência: ${mes}`,
        `Hoje: ${hoje}`,
        `Fluxo do mês: receitas ${brl(fluxoMes.receitas)} | despesas ${brl(fluxoMes.despesas)} | saldo ${brl(fluxoMes.receitas - fluxoMes.despesas)}`,
        `Fluxo mês anterior (${mesAnterior}): receitas ${brl(fluxoAnt.receitas)} | despesas ${brl(fluxoAnt.despesas)}`,
        `Histórico 6 meses: ${mesesRecent.map((m) => `${m.mes} R${m.receitas.toFixed(0)}/D${m.despesas.toFixed(0)}`).join('; ')}`,
        `Variação categorias MoM: ${variacaoCategorias.map((c) => `${c.categoria} ${c.percentual}% (${brl(c.atual)})`).join('; ') || 'nenhuma'}`,
        `Orçamentos: ${orcamentoStatus.map((o) => `${o.categoria} ${o.percentualUsado}% de ${brl(o.limite)}`).join('; ') || 'nenhum'}`,
        `Metas: ${metasCtx.map((m) => `${m.nome} ${m.progresso}% restante ${brl(m.restante)} prazo ${m.prazo || '-'}`).join('; ') || 'nenhuma'}`,
        `Despesas por recurso no mês: ${JSON.stringify(recursosMes)}`,
        `Top descrições: ${topEstabelecimentos.map((e) => `${e.descricao} ${brl(e.total)} x${e.qtd}`).join('; ') || 'nenhuma'}`,
        `Perfil: modoUso=${config?.modoUso || '-'} salario=${brl(config?.salarioValor)} VA=${brl(config?.vaValor)} VR=${brl(config?.vrValor)}`,
    ].join('\n');

    return {
        mesReferencia: mes,
        mesAnterior,
        texto,
        fluxoMes,
        fluxoAnt,
        mesesRecent,
        variacaoCategorias,
        gastosPorCategoriaMes,
        orcamentoStatus,
        metas: metasCtx,
        recursosMes,
        topEstabelecimentos,
        config: config || {},
    };
};

module.exports = {
    buildInsightContext,
    shiftMonth,
    monthBounds,
};
