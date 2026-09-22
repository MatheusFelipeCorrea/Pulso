const mapNotificacao = (notificacao) => ({
    id: notificacao.id,
    tipo: notificacao.tipo,
    titulo: notificacao.titulo,
    mensagem: notificacao.mensagem,
    lida: notificacao.lida,
    linkAcao: notificacao.linkAcao,
    metadados: notificacao.metadados,
    criadoEm:
        notificacao.criadoEm instanceof Date
            ? notificacao.criadoEm.toISOString()
            : notificacao.criadoEm,
});

module.exports = {
    mapNotificacao,
};
