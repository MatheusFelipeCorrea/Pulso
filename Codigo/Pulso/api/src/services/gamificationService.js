const prisma = require('../config/database');
const notificationService = require('./notificationService');

const CONQUISTAS_CATALOGO = [
    {
        codigo: 'PRIMEIRA_TRANSACAO',
        nome: 'Primeiro passo',
        descricao: 'Registrou a primeira transação no Pulso',
        icone: 'receipt',
        recompensaXp: 10,
        criterio: { tipo: 'TRANSACOES', min: 1 },
    },
    {
        codigo: 'STREAK_7',
        nome: '7 dias seguidos',
        descricao: 'Registrou transações por 7 dias consecutivos',
        icone: 'flame',
        recompensaXp: 25,
        criterio: { tipo: 'STREAK', min: 7 },
    },
    {
        codigo: 'PRIMEIRA_META',
        nome: 'Sonhador',
        descricao: 'Criou sua primeira meta financeira',
        icone: 'target',
        recompensaXp: 15,
        criterio: { tipo: 'METAS', min: 1 },
    },
];

const garantirCatalogoConquistas = async () => {
    for (const item of CONQUISTAS_CATALOGO) {
        await prisma.conquista.upsert({
            where: { codigo: item.codigo },
            create: item,
            update: {
                nome: item.nome,
                descricao: item.descricao,
                icone: item.icone,
                recompensaXp: item.recompensaXp,
                criterio: item.criterio,
            },
        });
    }
};

const desbloquearConquista = async (usuarioId, codigo) => {
    await garantirCatalogoConquistas();

    const conquista = await prisma.conquista.findUnique({ where: { codigo } });
    if (!conquista) return null;

    const existente = await prisma.conquistaUsuario.findUnique({
        where: {
            usuarioId_conquistaId: { usuarioId, conquistaId: conquista.id },
        },
    });
    if (existente) return null;

    await prisma.conquistaUsuario.create({
        data: { usuarioId, conquistaId: conquista.id },
    });

    await prisma.sequencia.updateMany({
        where: { usuarioId },
        data: { xp: { increment: conquista.recompensaXp } },
    });

    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'CONQUISTA',
        titulo: 'Conquista',
        mensagem: `Nova conquista: ${conquista.nome}!`,
        linkAcao: '/achievements',
        metadados: { conquistaCodigo: codigo, conquistaId: conquista.id },
    });

    return conquista;
};

const notificarStreak = async (usuarioId, sequenciaAtual, anterior) => {
    if (sequenciaAtual <= 1 || sequenciaAtual === anterior) return;

    const marcos = [3, 7, 14, 30];
    const atingiuMarco = marcos.find((m) => sequenciaAtual >= m && anterior < m);
    if (!atingiuMarco) return;

    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'STREAK',
        titulo: 'Streak',
        mensagem: `${sequenciaAtual} dias seguidos! Continue assim!`,
        linkAcao: '/transactions',
        metadados: { sequenciaAtual, marco: atingiuMarco },
    });
};

const processarAposTransacao = async (usuarioId, sequenciaAntes, sequenciaDepois) => {
    const totalTransacoes = await prisma.transacao.count({ where: { usuarioId } });
    if (totalTransacoes === 1) {
        await desbloquearConquista(usuarioId, 'PRIMEIRA_TRANSACAO');
    }

    if (sequenciaDepois >= 7) {
        await desbloquearConquista(usuarioId, 'STREAK_7');
    }

    await notificarStreak(usuarioId, sequenciaDepois, sequenciaAntes);
};

const processarAposCriarMeta = async (usuarioId) => {
    const total = await prisma.meta.count({ where: { usuarioId } });
    if (total === 1) {
        await desbloquearConquista(usuarioId, 'PRIMEIRA_META');
    }
};

module.exports = {
    garantirCatalogoConquistas,
    desbloquearConquista,
    processarAposTransacao,
    processarAposCriarMeta,
    notificarStreak,
};
