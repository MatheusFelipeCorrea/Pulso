const prisma = require('../config/database');
const { startOfDayInTimezone, endOfDayInTimezone } = require('../utils/dateTimezone');

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
            : { dataEmprestimo: 'desc' };

    const [dividas, total] = await Promise.all([
        prisma.divida.findMany({
            where,
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.divida.count({ where }),
    ]);

    return { dividas, total };
};

const calcularAgregados = async (usuarioId) =>
    prisma.divida.groupBy({
        by: ['direcao'],
        where: { usuarioId, quitada: false },
        _sum: { valor: true },
        _count: { id: true },
    });

const criar = async (dados) => prisma.divida.create({ data: dados });

const buscarPorId = async (dividaId, usuarioId) =>
    prisma.divida.findFirst({
        where: { id: dividaId, usuarioId },
    });

const atualizar = async (dividaId, usuarioId, dados) =>
    prisma.divida.update({
        where: { id: dividaId, usuarioId },
        data: dados,
    });

const quitar = async (dividaId, usuarioId) =>
    prisma.divida.update({
        where: { id: dividaId, usuarioId },
        data: {
            quitada: true,
            dataQuitacao: new Date(),
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
        orderBy: { prazoDevolucao: 'asc' },
    });

module.exports = {
    listarPorUsuario,
    calcularAgregados,
    criar,
    buscarPorId,
    atualizar,
    quitar,
    excluir,
    excluirQuitadasAntigas,
    buscarParaAlertas,
};
