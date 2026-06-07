const prisma = require('../config/database');

const buscarConfiguracao = async (usuarioId) =>
    prisma.configuracaoUsuario.findUnique({
        where: { usuarioId },
    });

const atualizarValorPadraoPassagem = async (usuarioId, valor) =>
    prisma.configuracaoUsuario.update({
        where: { usuarioId },
        data: { valorPadraoPassagem: valor },
    });

const atualizarVtHabilitado = async (usuarioId, vtHabilitado) =>
    prisma.configuracaoUsuario.update({
        where: { usuarioId },
        data: { vtHabilitado },
    });

const calcularRecebidoVt = async (usuarioId, inicio, fim) => {
    const result = await prisma.transacao.aggregate({
        where: {
            usuarioId,
            tipo: 'RECEITA',
            recurso: 'VT',
            data: { gte: inicio, lte: fim },
        },
        _sum: { valor: true },
    });
    return Number(result._sum.valor ?? 0);
};

const calcularUsadoVt = async (usuarioId, inicio, fim) => {
    const usos = await prisma.usoVt.findMany({
        where: {
            usuarioId,
            data: { gte: inicio, lte: fim },
        },
        select: { quantidade: true, valorPorPassagem: true },
    });

    let total = 0;
    let passagens = 0;
    for (const uso of usos) {
        passagens += uso.quantidade;
        total += uso.quantidade * Number(uso.valorPorPassagem);
    }
    return { total, passagens };
};

const calcularVendidoNominalVt = async (usuarioId, inicio, fim) => {
    const result = await prisma.vendaVt.aggregate({
        where: {
            usuarioId,
            dataVenda: { gte: inicio, lte: fim },
        },
        _sum: { valorNominal: true },
    });
    return Number(result._sum.valorNominal ?? 0);
};

const criarVendaComTransacao = async ({ vendaData, transacaoData }) =>
    prisma.$transaction(async (tx) => {
        const venda = await tx.vendaVt.create({ data: vendaData });
        await tx.transacao.create({ data: transacaoData });
        return venda;
    });

const buildPeriodoWhere = (inicio, fim, dateField) =>
    inicio && fim ? { [dateField]: { gte: inicio, lte: fim } } : {};

const listarVendas = async (usuarioId, inicio, fim, skip, take) => {
    const where = {
        usuarioId,
        ...buildPeriodoWhere(inicio, fim, 'dataVenda'),
    };

    const [vendas, total, todasNoPeriodo] = await Promise.all([
        prisma.vendaVt.findMany({
            where,
            orderBy: { dataVenda: 'desc' },
            skip,
            take,
        }),
        prisma.vendaVt.count({ where }),
        prisma.vendaVt.findMany({
            where,
            select: { valorNominal: true, valorRecebido: true },
        }),
    ]);

    return { vendas, total, todasNoPeriodo };
};

const criarUsoVt = async (data) => prisma.usoVt.create({ data });

const listarUsos = async (usuarioId, inicio, fim, skip, take) => {
    const where = {
        usuarioId,
        ...buildPeriodoWhere(inicio, fim, 'data'),
    };

    const [usos, total, todosNoPeriodo] = await Promise.all([
        prisma.usoVt.findMany({
            where,
            orderBy: { data: 'desc' },
            skip,
            take,
        }),
        prisma.usoVt.count({ where }),
        prisma.usoVt.findMany({
            where,
            select: { quantidade: true, valorPorPassagem: true },
        }),
    ]);

    return { usos, total, todosNoPeriodo };
};

module.exports = {
    buscarConfiguracao,
    atualizarValorPadraoPassagem,
    atualizarVtHabilitado,
    calcularRecebidoVt,
    calcularUsadoVt,
    calcularVendidoNominalVt,
    criarVendaComTransacao,
    listarVendas,
    criarUsoVt,
    listarUsos,
};
