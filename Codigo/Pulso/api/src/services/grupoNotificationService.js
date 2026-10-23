const notificationService = require('./notificationService');

const notificarMembros = async (membroIds, usuarioOrigemId, payload) => {
    const targets = [...new Set(membroIds)].filter((id) => id !== usuarioOrigemId);
    if (!targets.length) return;

    await Promise.all(
        targets.map((usuarioId) => notificationService.criarNotificacao(usuarioId, payload))
    );
};

const notificarTodosMembros = async (membroIds, payload) => {
    const targets = [...new Set(membroIds)];
    if (!targets.length) return;

    await Promise.all(
        targets.map((usuarioId) => notificationService.criarNotificacao(usuarioId, payload))
    );
};

const linkGrupo = (grupoId) => `/groups/${grupoId}`;

const notificarGrupoAtividade = async (grupo, actorId, mensagem, metadados = {}) => {
    const membroIds = (grupo.membros ?? []).map((m) => m.usuarioId);
    await notificarMembros(membroIds, actorId, {
        tipo: 'GRUPO_ATIVIDADE',
        titulo: 'Grupo (atividade)',
        mensagem,
        linkAcao: linkGrupo(grupo.id),
        metadados: { grupoId: grupo.id, ...metadados },
    });
};

const notificarExclusaoGrupo = async (grupo, adminId) => {
    const membroIds = (grupo.membros ?? []).map((m) => m.usuarioId);
    await notificarMembros(membroIds, adminId, {
        tipo: 'GRUPO_ATIVIDADE',
        titulo: 'Grupo (atividade)',
        mensagem: `O grupo "${grupo.nome}" foi excluído pelo administrador.`,
        linkAcao: '/groups',
        metadados: { grupoId: grupo.id, evento: 'GRUPO_EXCLUIDO' },
    });
};

const notificarMetaGrupoAtingida = async (grupo, metaNome, metaId) => {
    const membroIds = (grupo.membros ?? []).map((m) => m.usuarioId);
    await notificarTodosMembros(membroIds, {
        tipo: 'META_ATINGIDA',
        titulo: 'Meta atingida',
        mensagem: `Meta "${metaNome}" concluída!`,
        linkAcao: linkGrupo(grupo.id),
        metadados: { grupoId: grupo.id, metaGrupoId: metaId, escopo: 'GRUPO' },
    });
};

const nomeUsuarioNoGrupo = (grupo, usuarioId) => {
    const membro = (grupo.membros ?? []).find((m) => m.usuarioId === usuarioId);
    return membro?.usuario?.nome ?? 'Um membro';
};

module.exports = {
    notificarGrupoAtividade,
    notificarExclusaoGrupo,
    notificarMetaGrupoAtingida,
    nomeUsuarioNoGrupo,
};
