const prisma = require('../config/database');
const { intervaloDoMes } = require('../utils/monthUtils');

const includeCategoria = { categoria: true };

const buscarPorUsuarioEMes = async (usuarioId, mesReferencia) =>
    prisma.orcamento.findMany({
        where: { usuarioId, mesReferencia },
        include: includeCategoria,
        orderBy: { categoria: { nome: 'asc' } },
    });

const buscarPorId = async (id, usuarioId) =>
    prisma.orcamento.findFirst({
        where: { id, usuarioId },
        include: includeCategoria,
    });

const contarPorUsuarioEMes = async (usuarioId, mesReferencia) =>
    prisma.orcamento.count({
        where: { usuarioId, mesReferencia },
    });

const upsert = async ({ usuarioId, categoriaId, mesReferencia, limiteValor }) =>
    prisma.orcamento.upsert({
        where: {
            usuarioId_categoriaId_mesReferencia: {
                usuarioId,
                categoriaId,
                mesReferencia,
            },
        },
        create: {
            usuarioId,
            categoriaId,
            mesReferencia,
            limiteValor,
        },
        update: { limiteValor },
        include: includeCategoria,
    });

const deletarForaDaLista = async (usuarioId, mesReferencia, categoriaIds) => {
    const where = {
        usuarioId,
        mesReferencia,
    };
    if (categoriaIds.length > 0) {
        where.categoriaId = { notIn: categoriaIds };
    }
    return prisma.orcamento.deleteMany({ where });
};

const deletar = async (id) => prisma.orcamento.delete({ where: { id } });

const buscarUsuariosComOrcamentoNoMes = async (mesReferencia) => {
    const rows = await prisma.orcamento.findMany({
        where: { mesReferencia },
        select: { usuarioId: true },
        distinct: ['usuarioId'],
    });
    return rows.map((row) => row.usuarioId);
};

const calcularGastosPorCategoria = async (usuarioId, mesReferencia) => {
    const { inicio, fim } = intervaloDoMes(mesReferencia);

    const agregados = await prisma.transacao.groupBy({
        by: ['categoriaId'],
        where: {
            usuarioId,
            tipo: 'DESPESA',
            data: { gte: inicio, lte: fim },
        },
        _sum: { valor: true },
    });

    return agregados.reduce((acc, row) => {
        acc[row.categoriaId] = Number(row._sum.valor ?? 0);
        return acc;
    }, {});
};

const copiarParaMes = async (usuarioId, mesOrigem, mesDestino) => {
    const origem = await buscarPorUsuarioEMes(usuarioId, mesOrigem);
    const criados = [];

    for (const item of origem) {
        const orcamento = await upsert({
            usuarioId,
            categoriaId: item.categoriaId,
            mesReferencia: mesDestino,
            limiteValor: item.limiteValor,
        });
        criados.push(orcamento);
    }

    return criados;
};

module.exports = {
    buscarPorUsuarioEMes,
    buscarPorId,
    contarPorUsuarioEMes,
    upsert,
    deletarForaDaLista,
    deletar,
    buscarUsuariosComOrcamentoNoMes,
    calcularGastosPorCategoria,
    copiarParaMes,
};
