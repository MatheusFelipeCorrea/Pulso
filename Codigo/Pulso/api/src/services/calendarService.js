const prisma = require('../config/database');
const AppError = require('../utils/appError');
const { mapTransacao } = require('../utils/transactionMapper');
const { mapLembrete } = require('../utils/reminderMapper');
const { mesReferenciaFromQuery, intervaloDoMes, mesAnterior, mesReferenciaToQuery } = require('../utils/monthUtils');
const reminderRepository = require('../repositories/reminderRepository');
const { startOfDay, endOfDay, diasAteVencimento } = require('./reminderService');
const { formatDateOnly } = require('../utils/dateTimezone');
const {
    obterRecebimentosFixosConfig,
    recebimentosFixosNoDia,
    aplicarMarcadoresRecebimentoFixo,
} = require('../utils/fixedIncomeUtils');

const includeTransacao = {
    categoria: true,
    tags: { include: { tag: true } },
};

const dayKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const emptyDayMarker = () => ({
    receitas: 0,
    despesas: 0,
    lembretes: 0,
    temReceita: false,
    temDespesa: false,
    temLembrete: false,
    temRecebimentoFixo: false,
    recebimentosFixos: [],
});

const obterResumoMes = async (usuarioId, inicio, fim) => {
    const agregados = await prisma.transacao.groupBy({
        by: ['tipo'],
        where: {
            usuarioId,
            data: { gte: inicio, lte: fim },
        },
        _sum: { valor: true },
        _count: { id: true },
    });

    let receitasTotal = 0;
    let despesasTotal = 0;
    let totalTransacoes = 0;

    for (const row of agregados) {
        const valor = Number(row._sum.valor ?? 0);
        totalTransacoes += row._count.id;
        if (row.tipo === 'RECEITA') receitasTotal += valor;
        if (row.tipo === 'DESPESA') despesasTotal += valor;
    }

    return {
        receitasTotal,
        despesasTotal,
        saldo: receitasTotal - despesasTotal,
        totalTransacoes,
    };
};

const obterMarcadoresDias = async (usuarioId, inicio, fim) => {
    const [transacoes, lembretes] = await Promise.all([
        prisma.transacao.findMany({
            where: { usuarioId, data: { gte: inicio, lte: fim } },
            select: { data: true, tipo: true, valor: true },
        }),
        reminderRepository.listarPorUsuario(usuarioId, { inicio, fim }),
    ]);

    const dias = {};

    for (const tx of transacoes) {
        const key = dayKey(tx.data);
        if (!dias[key]) dias[key] = emptyDayMarker();
        const valor = Number(tx.valor);
        if (tx.tipo === 'RECEITA') {
            dias[key].receitas += valor;
            dias[key].temReceita = true;
        } else {
            dias[key].despesas += valor;
            dias[key].temDespesa = true;
        }
    }

    for (const lembrete of lembretes) {
        const key = formatDateOnly(lembrete.dataVencimento);
        if (!dias[key]) dias[key] = emptyDayMarker();
        dias[key].lembretes += 1;
        dias[key].temLembrete = true;
    }

    return dias;
};

const obterVisaoMes = async (usuarioId, query) => {
    const mesReferencia = mesReferenciaFromQuery(query.mes);
    const { inicio, fim } = intervaloDoMes(mesReferencia);
    const mesAnteriorRef = mesAnterior(mesReferencia);
    const { inicio: inicioAnterior, fim: fimAnterior } = intervaloDoMes(mesAnteriorRef);

    const [resumo, resumoAnterior, dias, proximosVencimentos, config] = await Promise.all([
        obterResumoMes(usuarioId, inicio, fim),
        obterResumoMes(usuarioId, inicioAnterior, fimAnterior),
        obterMarcadoresDias(usuarioId, inicio, fim),
        reminderRepository.listarProximos(usuarioId, { limite: 10 }),
        prisma.configuracaoUsuario.findUnique({ where: { usuarioId } }),
    ]);

    const recebimentosFixos = obterRecebimentosFixosConfig(config);
    aplicarMarcadoresRecebimentoFixo(
        dias,
        recebimentosFixos,
        mesReferencia.getFullYear(),
        mesReferencia.getMonth() + 1
    );

    const buildVariacao = (atual, anterior, modo = 'percentual') => {
        if (modo === 'contagem') {
            const diff = atual - anterior;
            if (diff === 0) return { tipo: 'igual' };
            return { tipo: 'contagem', valor: diff };
        }

        if (atual === anterior) return { tipo: 'igual' };
        if (anterior === 0) {
            if (atual === 0) return { tipo: 'sem_base' };
            return { tipo: 'valor_novo', valor: atual };
        }

        return {
            tipo: 'percentual',
            valor: Math.round(((atual - anterior) / Math.abs(anterior)) * 1000) / 10,
        };
    };

    return {
        mes: mesReferenciaToQuery(mesReferencia),
        resumo: {
            ...resumo,
            variacaoReceitas: buildVariacao(
                resumo.receitasTotal,
                resumoAnterior.receitasTotal
            ),
            variacaoDespesas: buildVariacao(
                resumo.despesasTotal,
                resumoAnterior.despesasTotal
            ),
            variacaoSaldo: buildVariacao(resumo.saldo, resumoAnterior.saldo),
            variacaoTransacoes: buildVariacao(
                resumo.totalTransacoes,
                resumoAnterior.totalTransacoes,
                'contagem'
            ),
        },
        dias,
        proximosVencimentos: proximosVencimentos.map((item) => ({
            ...mapLembrete(item),
            diasAteVencimento: diasAteVencimento(item.dataVencimento),
        })),
        recebimentosFixos,
    };
};

const parseDataQuery = (dataStr) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
        throw new AppError('Formato de data inválido. Use YYYY-MM-DD', 400);
    }
    const [year, month, day] = dataStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const obterDetalheDia = async (usuarioId, query) => {
    const data = parseDataQuery(query.data);
    const inicio = startOfDay(data);
    const fim = endOfDay(data);

    const [transacoes, lembretes, config] = await Promise.all([
        prisma.transacao.findMany({
            where: { usuarioId, data: { gte: inicio, lte: fim } },
            include: includeTransacao,
            orderBy: { data: 'asc' },
        }),
        reminderRepository.listarPorUsuario(usuarioId, { inicio, fim }),
        prisma.configuracaoUsuario.findUnique({ where: { usuarioId } }),
    ]);

    const recebimentosConfig = obterRecebimentosFixosConfig(config);
    const recebimentosFixos = recebimentosFixosNoDia(
        recebimentosConfig,
        data.getFullYear(),
        data.getMonth() + 1,
        data.getDate()
    );

    let receitas = 0;
    let despesas = 0;

    for (const tx of transacoes) {
        const valor = Number(tx.valor);
        if (tx.tipo === 'RECEITA') receitas += valor;
        else despesas += valor;
    }

    return {
        data: dayKey(data),
        transacoes: transacoes.map(mapTransacao),
        lembretes: lembretes.map((item) => ({
            ...mapLembrete(item),
            diasAteVencimento: diasAteVencimento(item.dataVencimento),
        })),
        totais: {
            receitas,
            despesas,
            saldo: receitas - despesas,
        },
        recebimentosFixos,
    };
};

module.exports = {
    obterVisaoMes,
    obterDetalheDia,
};
