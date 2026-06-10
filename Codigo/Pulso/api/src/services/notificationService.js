const AppError = require('../utils/appError');
const notificationRepository = require('../repositories/notificationRepository');
const { mapNotificacao } = require('../utils/notificationMapper');

const listarNotificacoes = async (usuarioId, filtros = {}) => {
    const resultado = await notificationRepository.listar(usuarioId, filtros);
    return {
        notificacoes: resultado.items.map(mapNotificacao),
        total: resultado.total,
        paginas: resultado.paginas,
        pagina: resultado.pagina,
    };
};

const contarNaoLidas = async (usuarioId) => {
    const quantidade = await notificationRepository.contarNaoLidas(usuarioId);
    return { quantidade };
};

const marcarComoLida = async (usuarioId, notificacaoId) => {
    const notificacao = await notificationRepository.buscarPorId(notificacaoId, usuarioId);
    if (!notificacao) {
        throw new AppError('Notificação não encontrada', 404);
    }

    if (notificacao.lida) {
        return mapNotificacao(notificacao);
    }

    const atualizada = await notificationRepository.marcarComoLida(notificacaoId, usuarioId);
    if (!atualizada) {
        throw new AppError('Notificação não encontrada', 404);
    }

    return mapNotificacao(atualizada);
};

const marcarTodasLidas = async (usuarioId) => {
    const resultado = await notificationRepository.marcarTodasLidas(usuarioId);
    return { quantidadeMarcada: resultado.count };
};

const criarNotificacao = async (
    usuarioId,
    { tipo, titulo, mensagem, linkAcao = '/budget', metadados = null }
) =>
    notificationRepository.criar({
        usuarioId,
        tipo,
        titulo,
        mensagem,
        linkAcao,
        metadados,
    });

const verificarNotificacaoDuplicada = async (usuarioId, tipo, metadados) => {
    if (!metadados?.categoriaId || !metadados?.mesReferencia) return null;
    return notificationRepository.buscarDuplicadaOrcamento(
        usuarioId,
        tipo,
        metadados.categoriaId,
        metadados.mesReferencia
    );
};

module.exports = {
    listarNotificacoes,
    contarNaoLidas,
    marcarComoLida,
    marcarTodasLidas,
    criarNotificacao,
    verificarNotificacaoDuplicada,
};
