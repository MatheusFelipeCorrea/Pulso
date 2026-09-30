const prisma = require('../config/database');
const notificationService = require('./notificationService');
const { todayInTimezone, formatDateOnly } = require('../utils/dateTimezone');

const mesReferenciaAtual = () => {
    const hoje = todayInTimezone();
    return hoje.slice(0, 7);
};

const jaGerouInsightNoMes = async (usuarioId) => {
    const mes = mesReferenciaAtual();
    const items = await prisma.notificacao.findMany({
        where: { usuarioId, tipo: 'INSIGHT_IA' },
        orderBy: { criadoEm: 'desc' },
        take: 5,
    });

    return items.some((item) => {
        const meta = item.metadados;
        return meta && typeof meta === 'object' && meta.mesReferencia === mes;
    });
};

const gerarInsightParaUsuario = async (usuarioId) => {
    if (await jaGerouInsightNoMes(usuarioId)) return null;

    const inicioMes = new Date(`${mesReferenciaAtual()}-01T12:00:00.000Z`);

    const despesas = await prisma.transacao.groupBy({
        by: ['categoriaId'],
        where: {
            usuarioId,
            tipo: 'DESPESA',
            data: { gte: inicioMes },
        },
        _sum: { valor: true },
        orderBy: { _sum: { valor: 'desc' } },
        take: 1,
    });

    if (!despesas.length) return null;

    const top = despesas[0];
    const categoria = await prisma.categoria.findUnique({
        where: { id: top.categoriaId },
        select: { nome: true },
    });

    const valor = Number(top._sum.valor ?? 0);
    if (valor <= 0) return null;

    const nomeCategoria = categoria?.nome ?? 'esta categoria';
    const mensagem = `Seu maior gasto do mês está em ${nomeCategoria} (${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Vale revisar o orçamento.`;

    return notificationService.criarNotificacao(usuarioId, {
        tipo: 'INSIGHT_IA',
        titulo: 'Insight IA',
        mensagem,
        linkAcao: '/budget',
        metadados: {
            mesReferencia: mesReferenciaAtual(),
            categoriaId: top.categoriaId,
            geradoPor: 'regras',
        },
    });
};

const tentarGerarInsightAposTransacao = async (usuarioId) => {
    try {
        return await gerarInsightParaUsuario(usuarioId);
    } catch {
        return null;
    }
};

module.exports = {
    gerarInsightParaUsuario,
    tentarGerarInsightAposTransacao,
};
