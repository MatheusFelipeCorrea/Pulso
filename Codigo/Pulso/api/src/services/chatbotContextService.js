const prisma = require('../config/database');
const { todayInTimezone } = require('../utils/dateTimezone');

const brl = (valor) =>
    Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const startOfMonth = (isoDay) => `${isoDay.slice(0, 7)}-01T00:00:00.000Z`;

const monthKeyFromDate = (date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

/**
 * Agrega dados financeiros só do usuário autenticado para o prompt do chatbot.
 * Inclui resumo do mês atual + totais dos últimos 12 meses.
 */
const buildUserFinanceContext = async (usuarioId) => {
    const hoje = todayInTimezone();
    const inicioMes = new Date(startOfMonth(hoje));
    const inicio30d = new Date(`${hoje}T12:00:00.000Z`);
    inicio30d.setUTCDate(inicio30d.getUTCDate() - 30);

    const inicio12m = new Date(startOfMonth(hoje));
    inicio12m.setUTCMonth(inicio12m.getUTCMonth() - 11);

    const [transacoesMes, topCategorias, metas, categorias, saldosAgg, txs12m] =
        await Promise.all([
            prisma.transacao.findMany({
                where: {
                    usuarioId,
                    data: { gte: inicioMes },
                    tipo: { in: ['DESPESA', 'RECEITA'] },
                },
                orderBy: { data: 'desc' },
                take: 40,
                select: {
                    tipo: true,
                    valor: true,
                    descricao: true,
                    data: true,
                    recurso: true,
                    categoria: { select: { nome: true } },
                },
            }),
            prisma.transacao.groupBy({
                by: ['categoriaId'],
                where: {
                    usuarioId,
                    tipo: 'DESPESA',
                    data: { gte: inicioMes },
                    categoriaId: { not: null },
                },
                _sum: { valor: true },
                orderBy: { _sum: { valor: 'desc' } },
                take: 5,
            }),
            prisma.meta.findMany({
                where: { usuarioId, status: { in: ['ATIVA', 'PAUSADA'] } },
                take: 8,
                select: {
                    nome: true,
                    status: true,
                    valorAtual: true,
                    valorAlvo: true,
                    prazo: true,
                },
            }),
            prisma.categoria.findMany({
                where: { OR: [{ usuarioId }, { usuarioId: null }] },
                select: { id: true, nome: true, tipo: true },
                take: 80,
            }),
            prisma.transacao.groupBy({
                by: ['recurso', 'tipo'],
                where: { usuarioId, data: { gte: inicio30d } },
                _sum: { valor: true },
            }),
            prisma.transacao.findMany({
                where: {
                    usuarioId,
                    data: { gte: inicio12m },
                    tipo: { in: ['DESPESA', 'RECEITA'] },
                },
                select: { tipo: true, valor: true, data: true },
            }),
        ]);

    const catMap = new Map(categorias.map((c) => [c.id, c.nome]));

    let receitasMes = 0;
    let despesasMes = 0;
    for (const t of transacoesMes) {
        const v = Number(t.valor);
        if (t.tipo === 'RECEITA') receitasMes += v;
        if (t.tipo === 'DESPESA') despesasMes += v;
    }

    const saldosPorRecurso = {};
    for (const row of saldosAgg) {
        const key = row.recurso;
        if (!saldosPorRecurso[key]) saldosPorRecurso[key] = 0;
        const v = Number(row._sum.valor || 0);
        if (row.tipo === 'RECEITA') saldosPorRecurso[key] += v;
        if (row.tipo === 'DESPESA') saldosPorRecurso[key] -= v;
    }

    const topCats = topCategorias.map((row) => ({
        nome: catMap.get(row.categoriaId) || 'Sem categoria',
        total: Number(row._sum.valor || 0),
    }));

    const porMes = new Map();
    for (let i = 0; i < 12; i += 1) {
        const d = new Date(inicio12m);
        d.setUTCMonth(inicio12m.getUTCMonth() + i);
        const key = monthKeyFromDate(d);
        porMes.set(key, { receitas: 0, despesas: 0 });
    }
    for (const t of txs12m) {
        const key = monthKeyFromDate(new Date(t.data));
        const bucket = porMes.get(key);
        if (!bucket) continue;
        const v = Number(t.valor);
        if (t.tipo === 'RECEITA') bucket.receitas += v;
        if (t.tipo === 'DESPESA') bucket.despesas += v;
    }
    const linhasMensais = [...porMes.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
            ([mes, v]) =>
                `${mes}: receitas ${brl(v.receitas)} | despesas ${brl(v.despesas)} | saldo ${brl(v.receitas - v.despesas)}`
        );

    const linhasTx = transacoesMes.slice(0, 25).map((t) => {
        const data = t.data?.toISOString?.()?.slice(0, 10) || '';
        return `- ${data} | ${t.tipo} | ${brl(t.valor)} | ${t.recurso} | ${t.categoria?.nome || '-'} | ${t.descricao || ''}`;
    });

    const linhasMetas = metas.map((m) => {
        const atual = Number(m.valorAtual);
        const alvo = Number(m.valorAlvo);
        const pct = alvo > 0 ? Math.round((atual / alvo) * 100) : 0;
        return `- ${m.nome} (${m.status}): ${brl(atual)} / ${brl(alvo)} (${pct}%)`;
    });

    const texto = [
        `Hoje (fuso app): ${hoje}`,
        `Resumo do mês atual (${hoje.slice(0, 7)}): receitas ${brl(receitasMes)} | despesas ${brl(despesasMes)} | saldo ${brl(receitasMes - despesasMes)}`,
        `Resumos mensais (últimos 12 meses):`,
        ...linhasMensais.map((l) => `- ${l}`),
        `Movimento recente por recurso (30d): ${JSON.stringify(saldosPorRecurso)}`,
        `Top categorias de despesa do mês atual: ${topCats.map((c) => `${c.nome} ${brl(c.total)}`).join('; ') || 'nenhuma'}`,
        `Metas:`,
        ...(linhasMetas.length ? linhasMetas : ['- nenhuma meta']),
        `Últimas transações do mês atual:`,
        ...(linhasTx.length ? linhasTx : ['- nenhuma']),
        `Categorias disponíveis (nome|tipo|id): ${categorias
            .slice(0, 40)
            .map((c) => `${c.nome}|${c.tipo}|${c.id}`)
            .join('; ')}`,
    ].join('\n');

    return {
        texto,
        categorias,
        resumo: {
            receitasMes,
            despesasMes,
            topCategorias: topCats,
            porMes: Object.fromEntries(porMes),
        },
    };
};

module.exports = {
    buildUserFinanceContext,
};
