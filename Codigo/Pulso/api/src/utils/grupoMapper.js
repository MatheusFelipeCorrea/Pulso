const mapMembro = (membro, usuarioAtualId) => ({
    id: membro.usuario.id,
    nome: membro.usuario.nome,
    urlAvatar: membro.usuario.urlAvatar,
    papel: membro.papel,
    entrouEm: membro.entrouEm?.toISOString?.() ?? membro.entrouEm,
    souEu: membro.usuarioId === usuarioAtualId,
});

const toMoneyString = (value) => Number(value ?? 0).toFixed(2);

const extractCoverImageUrl = (destinoMeta) => {
    if (!destinoMeta || typeof destinoMeta !== 'object') return null;
    const url = destinoMeta.coverImageUrl;
    return typeof url === 'string' && url.trim() ? url.trim() : null;
};

const resolveGrupoImagemExibicao = (grupo) => {
    if (grupo.urlImagem) return grupo.urlImagem;
    const viagem = grupo.viagens?.[0] ?? null;
    return extractCoverImageUrl(viagem?.destinoMeta);
};

const mapDespesaViagem = (despesa) => ({
    id: despesa.id,
    categoria: despesa.categoria,
    descricao: despesa.descricao,
    valorEstimado: toMoneyString(despesa.valorEstimado),
});

const mapViagemGrupo = (viagem) => {
    if (!viagem) return null;

    const porMembro = new Map();
    let totalGrupo = 0;

    for (const despesa of viagem.despesas ?? []) {
        const usuario = despesa.adicionadoPor;
        const valor = Number(despesa.valorEstimado ?? 0);
        totalGrupo += valor;

        if (!porMembro.has(usuario.id)) {
            porMembro.set(usuario.id, {
                usuarioId: usuario.id,
                nome: usuario.nome,
                urlAvatar: usuario.urlAvatar,
                despesas: [],
                total: 0,
            });
        }

        const entry = porMembro.get(usuario.id);
        entry.despesas.push(mapDespesaViagem(despesa));
        entry.total += valor;
    }

    return {
        id: viagem.id,
        destino: viagem.destino,
        destinoMeta: viagem.destinoMeta ?? null,
        moeda: viagem.moeda,
        dataPrevista: viagem.dataPrevista?.toISOString?.() ?? viagem.dataPrevista,
        totalGrupo: toMoneyString(totalGrupo),
        membros: Array.from(porMembro.values()).map((entry) => ({
            ...entry,
            total: toMoneyString(entry.total),
        })),
    };
};

const mapMetaGrupo = (meta) => {
    if (!meta) return null;

    const valorAlvo = Number(meta.valorAlvo ?? 0);
    const valorAtual = Number(meta.valorAtual ?? 0);
    const percentual = valorAlvo > 0 ? Math.min(100, Math.round((valorAtual / valorAlvo) * 100)) : 0;
    const porMembro = new Map();

    for (const aporte of meta.aportes ?? []) {
        const usuario = aporte.usuario;
        const valor = Number(aporte.valor ?? 0);
        const atual = porMembro.get(usuario.id) ?? {
            usuarioId: usuario.id,
            nome: usuario.nome,
            urlAvatar: usuario.urlAvatar,
            total: 0,
        };
        atual.total += valor;
        porMembro.set(usuario.id, atual);
    }

    return {
        id: meta.id,
        nome: meta.nome,
        descricao: meta.descricao,
        valorAlvo: toMoneyString(valorAlvo),
        valorAtual: toMoneyString(valorAtual),
        percentual,
        prazo: meta.prazo?.toISOString?.() ?? meta.prazo,
        status: meta.status,
        aportesPorMembro: Array.from(porMembro.values()).map((entry) => ({
            ...entry,
            total: toMoneyString(entry.total),
            completo: entry.total > 0,
        })),
    };
};

const mapMetasGrupoAgregado = (metas) => {
    if (!metas?.length) return null;
    if (metas.length === 1) {
        const mapped = mapMetaGrupo(metas[0]);
        return mapped ? { ...mapped, primaryMetaId: metas[0].id, quantidadeMetas: 1 } : null;
    }

    let valorAlvo = 0;
    let valorAtual = 0;
    const porMembro = new Map();

    for (const meta of metas) {
        valorAlvo += Number(meta.valorAlvo ?? 0);
        valorAtual += Number(meta.valorAtual ?? 0);

        for (const aporte of meta.aportes ?? []) {
            const usuario = aporte.usuario;
            const valor = Number(aporte.valor ?? 0);
            const atual = porMembro.get(usuario.id) ?? {
                usuarioId: usuario.id,
                nome: usuario.nome,
                urlAvatar: usuario.urlAvatar,
                total: 0,
            };
            atual.total += valor;
            porMembro.set(usuario.id, atual);
        }
    }

    const percentual = valorAlvo > 0 ? Math.min(100, Math.round((valorAtual / valorAlvo) * 100)) : 0;

    return {
        id: metas[0].id,
        primaryMetaId: metas[0].id,
        quantidadeMetas: metas.length,
        nome:
            metas.length === 2
                ? `${metas[0].nome} + ${metas[1].nome}`
                : `${metas.length} metas do grupo`,
        descricao: null,
        valorAlvo: toMoneyString(valorAlvo),
        valorAtual: toMoneyString(valorAtual),
        percentual,
        prazo: metas[0].prazo?.toISOString?.() ?? metas[0].prazo,
        status: 'ATIVA',
        aportesPorMembro: Array.from(porMembro.values()).map((entry) => ({
            ...entry,
            total: toMoneyString(entry.total),
            completo: entry.total > 0,
        })),
        itens: metas.map((meta) => mapMetaGrupo(meta)),
    };
};

const mapMensagemGrupo = (mensagem) => ({
    id: mensagem.id,
    usuarioId: mensagem.usuario.id,
    nome: mensagem.usuario.nome,
    urlAvatar: mensagem.usuario.urlAvatar,
    conteudo: mensagem.conteudo,
    criadoEm: mensagem.criadoEm?.toISOString?.() ?? mensagem.criadoEm,
});

const mapGrupoResumo = (grupo, usuarioAtualId) => {
    const meuMembro = grupo.membros?.find((m) => m.usuarioId === usuarioAtualId);
    const membros = (grupo.membros ?? []).map((m) => mapMembro(m, usuarioAtualId));

    return {
        id: grupo.id,
        nome: grupo.nome,
        descricao: grupo.descricao,
        codigoConvite: grupo.codigoConvite,
        urlImagem: grupo.urlImagem ?? null,
        imagemExibicao: resolveGrupoImagemExibicao(grupo),
        meuPapel: meuMembro?.papel ?? null,
        quantidadeMembros: grupo._count?.membros ?? membros.length,
        membrosPreview: membros.slice(0, 5),
        criador: grupo.criador
            ? {
                  id: grupo.criador.id,
                  nome: grupo.criador.nome,
                  urlAvatar: grupo.criador.urlAvatar,
              }
            : null,
        ultimaAtividade: grupo.atualizadoEm?.toISOString?.() ?? grupo.atualizadoEm,
        criadoEm: grupo.criadoEm?.toISOString?.() ?? grupo.criadoEm,
    };
};

const mapGrupoDetalhe = (grupo, usuarioAtualId) => ({
    ...mapGrupoResumo(grupo, usuarioAtualId),
    modoDivisao: grupo.modoDivisao ?? 'PRETENSAO',
    membros: (grupo.membros ?? []).map((m) => mapMembro(m, usuarioAtualId)),
    viagem: mapViagemGrupo(grupo.viagens?.[0] ?? null),
    metasLista: (grupo.metas ?? []).map((m) => mapMetaGrupo(m)),
    meta: mapMetasGrupoAgregado(grupo.metas ?? []),
    mensagens: (grupo.mensagens ?? []).map(mapMensagemGrupo),
});

const mapGrupoPreview = (grupo, usuarioAtualId) => {
    const jaMembro = Boolean(grupo.membros?.some((m) => m.usuarioId === usuarioAtualId));
    const membros = (grupo.membros ?? []).map((m) => mapMembro(m, usuarioAtualId));

    return {
        id: grupo.id,
        nome: grupo.nome,
        descricao: grupo.descricao,
        quantidadeMembros: membros.length,
        membrosPreview: membros.slice(0, 5),
        criador: grupo.criador
            ? {
                  id: grupo.criador.id,
                  nome: grupo.criador.nome,
                  urlAvatar: grupo.criador.urlAvatar,
              }
            : null,
        jaMembro,
    };
};

module.exports = {
    mapGrupoResumo,
    mapGrupoDetalhe,
    mapGrupoPreview,
    mapMensagemGrupo,
};