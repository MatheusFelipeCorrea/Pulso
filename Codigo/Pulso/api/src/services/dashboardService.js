const prisma = require('../config/database');
const transactionRepository = require('../repositories/transactionRepository');
const metaRepository = require('../repositories/metaRepository');
const transactionService = require('./transactionService');
const budgetService = require('./budgetService');
const { mapTransacao } = require('../utils/transactionMapper');
const { mapMeta } = require('../utils/metaMapper');
const {
    mesReferenciaFromQuery,
    intervaloDoMes,
    mesAnterior,
    mesReferenciaToQuery,
} = require('../utils/monthUtils');
const {
    RECURSOS_DASHBOARD,
    calcularSaldosPorRecurso,
    saldoTotalDisponivel,
    diasUteisRestantesNoMes,
} = require('../utils/resourceBalanceUtils');
const {
    mergeWhere,
    whereExcluiAjusteSaldoImportacao,
} = require('../repositories/transactionRepository');

const round2 = (n) => Math.round(Number(n) * 100) / 100;

const buildVariacaoPercentual = (atual, anterior) => {
    if (atual === anterior) return { tipo: 'igual', valor: 0 };
    if (anterior === 0) {
        return atual === 0 ? { tipo: 'sem_base', valor: 0 } : { tipo: 'valor_novo', valor: round2(atual) };
    }
    return {
        tipo: 'percentual',
        valor: round2(((atual - anterior) / Math.abs(anterior)) * 100),
    };
};

const obterSerieReceitasDespesas = async (usuarioId, inicio, fim) => {
    const transacoes = await prisma.transacao.findMany({
        where: mergeWhere(
            {
                usuarioId,
                data: { gte: inicio, lte: fim },
                tipo: { in: ['RECEITA', 'DESPESA'] },
            },
            whereExcluiAjusteSaldoImportacao
        ),
        select: { data: true, tipo: true, valor: true },
        orderBy: { data: 'asc' },
    });

    const porDia = {};
    for (const tx of transacoes) {
        const key = tx.data.toISOString().slice(0, 10);
        if (!porDia[key]) porDia[key] = { dia: key, receitas: 0, despesas: 0 };
        const valor = Number(tx.valor);
        if (tx.tipo === 'RECEITA') porDia[key].receitas += valor;
        else porDia[key].despesas += valor;
    }

    return Object.values(porDia).map((item) => ({
        dia: item.dia,
        receitas: round2(item.receitas),
        despesas: round2(item.despesas),
    }));
};

const obterGastosPorCategoria = async (usuarioId, inicio, fim) => {
    const rows = await prisma.transacao.groupBy({
        by: ['categoriaId'],
        where: mergeWhere(
            {
                usuarioId,
                tipo: 'DESPESA',
                data: { gte: inicio, lte: fim },
                categoriaId: { not: null },
            },
            whereExcluiAjusteSaldoImportacao
        ),
        _sum: { valor: true },
    });

    if (!rows.length) return [];

    const categoriaIds = rows.map((r) => r.categoriaId);
    const categorias = await prisma.categoria.findMany({
        where: { id: { in: categoriaIds } },
    });
    const catMap = Object.fromEntries(categorias.map((c) => [c.id, c]));

    const total = rows.reduce((acc, r) => acc + Number(r._sum.valor ?? 0), 0);

    return rows
        .map((row) => {
            const cat = catMap[row.categoriaId];
            const valor = Number(row._sum.valor ?? 0);
            return {
                categoriaId: row.categoriaId,
                nome: cat?.nome ?? 'Outros',
                icone: cat?.icone ?? 'Tag',
                cor: cat?.cor ?? '#7C3AED',
                total: round2(valor),
                percentual: total > 0 ? round2((valor / total) * 100) : 0,
            };
        })
        .sort((a, b) => b.total - a.total);
};

const obterSaldosRecursos = async (usuarioId, mesReferencia) => {
    const transacoes = await prisma.transacao.findMany({
        where: { usuarioId },
        select: { tipo: true, recurso: true, recursoDestino: true, valor: true },
    });

    const saldos = calcularSaldosPorRecurso(transacoes);

    const diasUteis = diasUteisRestantesNoMes(mesReferencia);
    const sugestaoVr =
        saldos.VR > 0 ? round2(saldos.VR / diasUteis) : null;

    return RECURSOS_DASHBOARD.map((tipo) => ({
        tipo,
        saldo: round2(saldos[tipo] ?? 0),
        sugestaoDiaria: tipo === 'VR' && sugestaoVr != null ? sugestaoVr : null,
    }));
};

const calcularSaudeFinanceira = ({ resumoMes, alertasOrcamento, metasAtivas }) => {
    const receitas = Number(resumoMes.receitas?.total ?? 0);
    const despesas = Number(resumoMes.despesas?.total ?? 0);
    const saldoPositivo = receitas >= despesas;

    let score = 45;
    if (saldoPositivo) score += 25;
    if (receitas > 0 && despesas / receitas <= 0.7) score += 10;

    const estourados = alertasOrcamento.filter((a) => a.percentualUsado >= 100).length;
    if (estourados === 0) score += 15;
    else score -= estourados * 5;

    const progressoMedio =
        metasAtivas.length > 0
            ? metasAtivas.reduce((acc, m) => acc + m.progresso, 0) / metasAtivas.length
            : 0;
    if (progressoMedio >= 30) score += 10;

    score = Math.max(0, Math.min(100, Math.round(score)));

    let label = 'Regular';
    if (score >= 81) label = 'Excelente';
    else if (score >= 61) label = 'Bom';
    else if (score <= 40) label = 'Atenção';

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
            ok: metasAtivas.length === 0 || progressoMedio >= 20,
            texto:
                metasAtivas.length === 0
                    ? 'Crie metas para acompanhar objetivos financeiros'
                    : `Progresso médio das metas ativas: ${round2(progressoMedio)}%`,
        },
    ];

    const mensagem =
        score >= 81
            ? 'Parabéns! Sua saúde financeira está excelente.'
            : score >= 61
              ? 'Você mantém um bom controle financeiro. Continue assim!'
              : 'Há oportunidades para melhorar seu equilíbrio financeiro este mês.';

    return { score, label, mensagem, checklist };
};

const obterDashboard = async (usuarioId, query = {}) => {
    const mesReferencia = mesReferenciaFromQuery(query.mes);
    const { inicio, fim } = intervaloDoMes(mesReferencia);
    const mesAnteriorRef = mesAnterior(mesReferencia);
    const { inicio: inicioAnterior, fim: fimAnterior } = intervaloDoMes(mesAnteriorRef);

    const [
        resumoMes,
        resumoAnterior,
        serie,
        categorias,
        ultimas,
        transacoesSaldo,
        metasRaw,
        statusOrcamento,
    ] = await Promise.all([
        transactionService.calcularResumo(usuarioId, { periodo: mesReferenciaToQuery(mesReferencia) }),
        transactionService.calcularResumo(usuarioId, {
            periodo: mesReferenciaToQuery(mesAnteriorRef),
        }),
        obterSerieReceitasDespesas(usuarioId, inicio, fim),
        obterGastosPorCategoria(usuarioId, inicio, fim),
        transactionRepository.listarPorUsuario(usuarioId, { periodo: mesReferenciaToQuery(mesReferencia) }, {
            pagina: 1,
            limite: 25,
        }),
        prisma.transacao.findMany({
            where: { usuarioId },
            select: { tipo: true, recurso: true, recursoDestino: true, valor: true },
        }),
        metaRepository.listarPorUsuario(usuarioId, { status: 'ATIVA' }, { pagina: 1, limite: 4 }),
        budgetService.obterStatusOrcamento(usuarioId, { mes: mesReferenciaToQuery(mesReferencia) }),
    ]);

    const saldosMap = calcularSaldosPorRecurso(transacoesSaldo);
    const saldoTotal = round2(saldoTotalDisponivel(saldosMap));
    const saldoTotalAnterior = round2(
        saldoTotalDisponivel(saldosMap) -
            (Number(resumoMes.saldo) - Number(resumoAnterior.saldo))
    );

    const recursos = await obterSaldosRecursos(usuarioId, mesReferencia);

    const metasAtivas = metasRaw.metas.map((meta) => {
        const mapped = mapMeta(meta);
        return {
            ...mapped,
            progresso: Number(mapped.percentual),
        };
    });

    const alertasOrcamento = (statusOrcamento.categorias ?? [])
        .filter((c) => c.percentualUsado >= 80)
        .map((c) => ({
            categoriaId: c.categoriaId,
            categoriaNome: c.categoriaNome,
            categoriaIcone: c.categoriaIcone,
            categoriaCor: c.categoriaCor,
            limiteValor: Number(c.limiteValor ?? 0),
            gastoValor: Number(c.gastoValor ?? 0),
            restanteValor: Number(c.restanteValor ?? 0),
            percentualUsado: c.percentualUsado,
            status: c.status,
        }));

    const saudeFinanceira = calcularSaudeFinanceira({
        resumoMes,
        alertasOrcamento: statusOrcamento.categorias ?? [],
        metasAtivas,
    });

    return {
        mes: mesReferenciaToQuery(mesReferencia),
        saldoTotal: {
            valor: saldoTotal.toFixed(2),
            variacao: buildVariacaoPercentual(saldoTotal, saldoTotalAnterior),
        },
        resumoMes,
        recursos: recursos.map((r) => ({
            ...r,
            saldo: r.saldo.toFixed(2),
            sugestaoDiaria: r.sugestaoDiaria != null ? r.sugestaoDiaria.toFixed(2) : null,
        })),
        receitasDespesas: {
            receitasTotal: resumoMes.receitas?.total ?? '0.00',
            despesasTotal: resumoMes.despesas?.total ?? '0.00',
            serie,
        },
        gastosPorCategoria: categorias,
        ultimasTransacoes: ultimas.transacoes.map(mapTransacao),
        alertasOrcamento,
        metasAtivas,
        saudeFinanceira,
    };
};

module.exports = {
    obterDashboard,
};
