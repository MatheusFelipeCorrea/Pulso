const prisma = require('../config/database');

const includeRelations = {
    despesas: {
        orderBy: { criadoEm: 'asc' },
    },
    observacoes: {
        orderBy: { criadoEm: 'asc' },
    },
    meta: {
        select: {
            id: true,
            nome: true,
            valorAlvo: true,
            valorAtual: true,
            status: true,
            prazo: true,
        },
    },
};

const listarPorUsuario = async (usuarioId) =>
    prisma.viagem.findMany({
        where: { usuarioId },
        include: includeRelations,
        orderBy: { dataPrevista: 'asc' },
    });

const buscarPorId = async (viagemId, usuarioId) =>
    prisma.viagem.findFirst({
        where: { id: viagemId, usuarioId },
        include: includeRelations,
    });

const buscarPorMetaId = async (metaId, usuarioId, excludeViagemId = null) =>
    prisma.viagem.findFirst({
        where: {
            usuarioId,
            metaId,
            ...(excludeViagemId ? { NOT: { id: excludeViagemId } } : {}),
        },
    });

const criar = async (dados) =>
    prisma.viagem.create({
        data: dados,
        include: includeRelations,
    });

const atualizar = async (viagemId, usuarioId, dados) =>
    prisma.viagem.update({
        where: { id: viagemId, usuarioId },
        data: dados,
        include: includeRelations,
    });

const excluir = async (viagemId, usuarioId) =>
    prisma.viagem.delete({
        where: { id: viagemId, usuarioId },
    });

const criarDespesa = async (dados) =>
    prisma.despesaViagem.create({
        data: dados,
    });

const buscarDespesa = async (despesaId, viagemId, usuarioId) =>
    prisma.despesaViagem.findFirst({
        where: {
            id: despesaId,
            viagemId,
            viagem: { usuarioId },
        },
    });

const atualizarDespesa = async (despesaId, dados) =>
    prisma.despesaViagem.update({
        where: { id: despesaId },
        data: dados,
    });

const excluirDespesa = async (despesaId) =>
    prisma.despesaViagem.delete({
        where: { id: despesaId },
    });

const criarObservacao = async (dados) =>
    prisma.observacaoViagem.create({
        data: dados,
    });

const buscarObservacao = async (observacaoId, viagemId, usuarioId) =>
    prisma.observacaoViagem.findFirst({
        where: {
            id: observacaoId,
            viagemId,
            viagem: { usuarioId },
        },
    });

const atualizarObservacao = async (observacaoId, dados) =>
    prisma.observacaoViagem.update({
        where: { id: observacaoId },
        data: dados,
    });

const excluirObservacao = async (observacaoId) =>
    prisma.observacaoViagem.delete({
        where: { id: observacaoId },
    });

module.exports = {
    listarPorUsuario,
    buscarPorId,
    buscarPorMetaId,
    criar,
    atualizar,
    excluir,
    criarDespesa,
    buscarDespesa,
    atualizarDespesa,
    excluirDespesa,
    criarObservacao,
    buscarObservacao,
    atualizarObservacao,
    excluirObservacao,
};
