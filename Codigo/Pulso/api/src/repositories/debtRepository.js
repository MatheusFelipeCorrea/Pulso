const prisma = require('../config/database');
const {
    startOfDayInTimezone,
    endOfDayInTimezone,
    todayInTimezone,
    addDays,
    formatDateOnly,
} = require('../utils/dateTimezone');

const includePagamentos = {
    pagamentos: {
        orderBy: { dataPagamento: 'desc' },
    },
};

const buildWhere = (usuarioId, filtros = {}) => {
    const where = { usuarioId };

    if (filtros.quitada === true || filtros.quitada === false) {
        where.quitada = filtros.quitada;
    }

    if (filtros.direcao && filtros.direcao !== 'TODOS') {
        where.direcao = filtros.direcao;
    }

    if (filtros.busca?.trim()) {
        where.nomePessoa = { contains: filtros.busca.trim(), mode: 'insensitive' };
    }

    if (filtros.dataInicio || filtros.dataFim) {
        where.dataEmprestimo = {};
        if (filtros.dataInicio) {
            where.dataEmprestimo.gte = startOfDayInTimezone(filtros.dataInicio);
        }
        if (filtros.dataFim) {
            where.dataEmprestimo.lte = endOfDayInTimezone(filtros.dataFim);
        }
    }

    if (filtros.prazoInicio || filtros.prazoFim) {
        where.prazoDevolucao = {};
        if (filtros.prazoInicio) {
            where.prazoDevolucao.gte = startOfDayInTimezone(filtros.prazoInicio);
        }
        if (filtros.prazoFim) {
            where.prazoDevolucao.lte = endOfDayInTimezone(filtros.prazoFim);
        }
    }

    if (filtros.status === 'vencida') {
        where.quitada = false;
        where.prazoDevolucao = {
            ...(where.prazoDevolucao ?? {}),
            lt: startOfDayInTimezone(new Date()),
        };
    } else if (filtros.status === 'vence_breve') {
        const hoje = todayInTimezone();
        where.quitada = false;
        where.prazoDevolucao = {
            ...(where.prazoDevolucao ?? {}),
            gte: startOfDayInTimezone(hoje),
            lte: endOfDayInTimezone(addDays(hoje, 7)),
        };
    }

    return where;
};

const listarPorUsuario = async (usuarioId, filtros, { pagina = 1, limite = 10 } = {}) => {
    const where = buildWhere(usuarioId, filtros);
    const pageNum = Math.max(Number(pagina) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limite) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const orderBy =
        filtros.ordenarValor === 'asc' || filtros.ordenarValor === 'desc'
            ? { valor: filtros.ordenarValor }
            : { criadoEm: 'desc' };

    const [dividas, total] = await Promise.all([
        prisma.divida.findMany({
            where,
            include: includePagamentos,
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.divida.count({ where }),
    ]);

    return { dividas, total };
};

const listarAtivasComPagamentos = async (usuarioId) =>
    prisma.divida.findMany({
        where: { usuarioId, quitada: false },
        include: includePagamentos,
    });

const contarPorAba = async (usuarioId) => {
    const { isDividaQuitada } = require('../utils/debtBalanceUtils');
    const dividas = await prisma.divida.findMany({
        where: { usuarioId },
        include: includePagamentos,
    });

    let meDevem = 0;
    let euDevo = 0;
    let quitadas = 0;

    for (const divida of dividas) {
        const pagamentos = divida.pagamentos ?? [];
        if (isDividaQuitada(divida, pagamentos)) {
            quitadas += 1;
        } else if (divida.direcao === 'ME_DEVEM') {
            meDevem += 1;
        } else if (divida.direcao === 'EU_DEVO') {
            euDevo += 1;
        }
    }

    return { meDevem, euDevo, quitadas };
};

const criar = async (dados) => prisma.divida.create({ data: dados });

const buscarPorId = async (dividaId, usuarioId, { comPagamentos = false } = {}) =>
    prisma.divida.findFirst({
        where: { id: dividaId, usuarioId },
        include: comPagamentos ? includePagamentos : undefined,
    });

const atualizar = async (dividaId, usuarioId, dados) =>
    prisma.divida.update({
        where: { id: dividaId, usuarioId },
        data: dados,
    });

const quitar = async (dividaId, usuarioId, dataQuitacao = new Date()) =>
    prisma.divida.update({
        where: { id: dividaId, usuarioId },
        data: {
            quitada: true,
            dataQuitacao,
        },
    });

const reabrir = async (dividaId, usuarioId) =>
    prisma.divida.update({
        where: { id: dividaId, usuarioId },
        data: {
            quitada: false,
            dataQuitacao: null,
        },
    });

const excluir = async (dividaId, usuarioId) =>
    prisma.divida.delete({
        where: { id: dividaId, usuarioId },
    });

const excluirQuitadasAntigas = async (diasLimite = 180) => {
    const limite = new Date();
    limite.setDate(limite.getDate() - diasLimite);

    const resultado = await prisma.divida.deleteMany({
        where: {
            quitada: true,
            dataQuitacao: { lt: limite },
        },
    });

    return resultado.count;
};

const buscarParaAlertas = async () =>
    prisma.divida.findMany({
        where: {
            quitada: false,
            prazoDevolucao: { not: null },
        },
        include: includePagamentos,
        orderBy: { prazoDevolucao: 'asc' },
    });

const criarPagamento = async (dados) => prisma.pagamentoDivida.create({ data: dados });

const buscarPagamento = async (pagamentoId, dividaId, usuarioId) =>
    prisma.pagamentoDivida.findFirst({
        where: {
            id: pagamentoId,
            dividaId,
            divida: { usuarioId },
        },
    });

const excluirPagamento = async (pagamentoId) =>
    prisma.pagamentoDivida.delete({
        where: { id: pagamentoId },
    });

module.exports = {
    listarPorUsuario,
    listarAtivasComPagamentos,
    contarPorAba,
    criar,
    buscarPorId,
    atualizar,
    quitar,
    reabrir,
    excluir,
    excluirQuitadasAntigas,
    buscarParaAlertas,
    criarPagamento,
    buscarPagamento,
    excluirPagamento,
};
