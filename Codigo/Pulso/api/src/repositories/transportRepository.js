const prisma = require('../config/database');

const calcularSaldoRestanteTx = async (tx, usuarioId, inicio, fim) => {
    const [recebidoResult, usos, vendidoResult] = await Promise.all([
        tx.transacao.aggregate({
            where: {
                usuarioId,
                tipo: 'RECEITA',
                recurso: 'VT',
                data: { gte: inicio, lte: fim },
            },
            _sum: { valor: true },
        }),
        tx.usoVt.findMany({
            where: {
                usuarioId,
                data: { gte: inicio, lte: fim },
            },
            select: { quantidade: true, valorPorPassagem: true },
        }),
        tx.vendaVt.aggregate({
            where: {
                usuarioId,
                dataVenda: { gte: inicio, lte: fim },
            },
            _sum: { valorNominal: true },
        }),
    ]);

    const recebido = Number(recebidoResult._sum.valor ?? 0);
    let usado = 0;
    for (const uso of usos) {
        usado += uso.quantidade * Number(uso.valorPorPassagem);
    }
    const vendidoNominal = Number(vendidoResult._sum.valorNominal ?? 0);

    return recebido - usado - vendidoNominal;
};

const criarVendaComTransacao = async ({ vendaData, transacaoData, inicio, fim }) =>
    prisma.$transaction(
        async (tx) => {
            const saldoRestante = await calcularSaldoRestanteTx(
                tx,
                vendaData.usuarioId,
                inicio,
                fim
            );
            const valorNominal = Number(vendaData.valorNominal);

            if (valorNominal > saldoRestante + 0.001) {
                const error = new Error('INSUFFICIENT_VT_BALANCE');
                error.code = 'INSUFFICIENT_VT_BALANCE';
                error.saldoRestante = saldoRestante;
                throw error;
            }

            const venda = await tx.vendaVt.create({ data: vendaData });
            await tx.transacao.create({ data: transacaoData });
            return { venda, saldoRestante: saldoRestante - valorNominal };
        },
        { isolationLevel: 'Serializable' }
    );

const criarUsoVtAtomico = async ({ usoData, inicio, fim, totalUsado }) =>
    prisma.$transaction(
        async (tx) => {
            const saldoRestante = await calcularSaldoRestanteTx(
                tx,
                usoData.usuarioId,
                inicio,
                fim
            );

            if (totalUsado > saldoRestante + 0.001) {
                const error = new Error('INSUFFICIENT_VT_BALANCE');
                error.code = 'INSUFFICIENT_VT_BALANCE';
                error.saldoRestante = saldoRestante;
                throw error;
            }

            const uso = await tx.usoVt.create({ data: usoData });
            return { uso, saldoRestante: saldoRestante - totalUsado };
        },
        { isolationLevel: 'Serializable' }
    );

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
    criarUsoVtAtomico,
    listarVendas,
    criarUsoVt,
    listarUsos,
};
