const prisma = require('../config/database');

const includeParticipantes = {
    participantes: { orderBy: { criadoEm: 'asc' } },
};

const criar = async (dados) =>
    prisma.divisao.create({
        data: dados,
        include: includeParticipantes,
    });

const buscarPorId = async (divisaoId, usuarioId) =>
    prisma.divisao.findFirst({
        where: { id: divisaoId, usuarioId },
        include: includeParticipantes,
    });

const listarAtivas = async (usuarioId) =>
    prisma.divisao.findMany({
        where: { usuarioId, status: 'ATIVA' },
        include: includeParticipantes,
        orderBy: { criadoEm: 'desc' },
    });

const listarHistorico = async (usuarioId, { pagina = 1, limite = 10 } = {}) => {
    const pageNum = Math.max(Number(pagina) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limite) || 10, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const where = { usuarioId, status: 'QUITADA' };

    const [divisoes, total] = await Promise.all([
        prisma.divisao.findMany({
            where,
            include: includeParticipantes,
            orderBy: { quitadaEm: 'desc' },
            skip,
            take: limitNum,
        }),
        prisma.divisao.count({ where }),
    ]);

    return { divisoes, total };
};

const listarAtivasComParticipantes = async (usuarioId) =>
    prisma.divisao.findMany({
        where: { usuarioId, status: 'ATIVA' },
        include: includeParticipantes,
    });

const contarTodasCriadas = async (usuarioId) => prisma.divisao.count({ where: { usuarioId } });

const atualizar = async (divisaoId, usuarioId, dados) =>
    prisma.divisao.update({
        where: { id: divisaoId, usuarioId },
        data: dados,
        include: includeParticipantes,
    });

const substituirParticipantes = async (divisaoId, participantesData) =>
    prisma.$transaction([
        prisma.divisaoParticipante.deleteMany({ where: { divisaoId } }),
        prisma.divisaoParticipante.createMany({
            data: participantesData.map((participante) => ({ ...participante, divisaoId })),
        }),
    ]);

const quitar = async (divisaoId, usuarioId, quitadaEm = new Date()) =>
    prisma.divisao.update({
        where: { id: divisaoId, usuarioId },
        data: { status: 'QUITADA', quitadaEm },
    });

const reabrir = async (divisaoId, usuarioId) =>
    prisma.divisao.update({
        where: { id: divisaoId, usuarioId },
        data: { status: 'ATIVA', quitadaEm: null },
    });

const excluir = async (divisaoId, usuarioId) =>
    prisma.divisao.delete({
        where: { id: divisaoId, usuarioId },
    });

const excluirQuitadasAntigas = async (diasLimite = 180) => {
    const limite = new Date();
    limite.setDate(limite.getDate() - diasLimite);

    const resultado = await prisma.divisao.deleteMany({
        where: {
            status: 'QUITADA',
            quitadaEm: { lt: limite },
        },
    });

    return resultado.count;
};

const buscarParticipante = async (participanteId, divisaoId, usuarioId) =>
    prisma.divisaoParticipante.findFirst({
        where: {
            id: participanteId,
            divisaoId,
            divisao: { usuarioId },
        },
    });

const atualizarParticipante = async (participanteId, dados) =>
    prisma.divisaoParticipante.update({
        where: { id: participanteId },
        data: dados,
    });

const vincularLembreteAParticipantes = async (lembreteId, participanteIds) =>
    prisma.lembrete.update({
        where: { id: lembreteId },
        data: {
            divisaoParticipantes: {
                connect: participanteIds.map((id) => ({ id })),
            },
        },
    });

module.exports = {
    criar,
    buscarPorId,
    listarAtivas,
    listarHistorico,
    listarAtivasComParticipantes,
    contarTodasCriadas,
    atualizar,
    substituirParticipantes,
    quitar,
    reabrir,
    excluir,
    excluirQuitadasAntigas,
    buscarParticipante,
    atualizarParticipante,
    vincularLembreteAParticipantes,
};
