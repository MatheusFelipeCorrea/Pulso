const prisma = require('../config/database');

const usuarioSelect = {
    id: true,
    nome: true,
    urlAvatar: true,
};

const includeMembros = {
    membros: {
        include: { usuario: { select: usuarioSelect } },
        orderBy: { entrouEm: 'asc' },
    },
    criador: { select: usuarioSelect },
};

const includeDetalhe = {
    ...includeMembros,
    viagens: {
        include: {
            despesas: {
                include: { adicionadoPor: { select: usuarioSelect } },
                orderBy: { criadoEm: 'asc' },
            },
        },
        orderBy: { criadoEm: 'desc' },
        take: 1,
    },
    metas: {
        where: { status: { in: ['ATIVA', 'CONCLUIDA'] } },
        include: {
            aportes: {
                include: { usuario: { select: usuarioSelect } },
                orderBy: { data: 'desc' },
            },
        },
        orderBy: { criadoEm: 'asc' },
    },
    mensagens: {
        include: { usuario: { select: usuarioSelect } },
        orderBy: { criadoEm: 'asc' },
        take: 100,
    },
};

const listarPorUsuario = async (usuarioId) =>
    prisma.grupo.findMany({
        where: {
            membros: { some: { usuarioId } },
        },
        include: {
            ...includeMembros,
            viagens: {
                select: { destinoMeta: true },
                orderBy: { criadoEm: 'desc' },
                take: 1,
            },
            _count: { select: { membros: true } },
        },
        orderBy: { atualizadoEm: 'desc' },
    });

const buscarPorId = async (grupoId, usuarioId) =>
    prisma.grupo.findFirst({
        where: {
            id: grupoId,
            membros: { some: { usuarioId } },
        },
        include: includeDetalhe,
    });

const buscarPorCodigoConvite = async (codigoConvite) =>
    prisma.grupo.findUnique({
        where: { codigoConvite },
        include: includeMembros,
    });

const buscarMembro = async (grupoId, usuarioId) =>
    prisma.membroGrupo.findUnique({
        where: {
            grupoId_usuarioId: { grupoId, usuarioId },
        },
    });

const criar = async ({ nome, descricao, codigoConvite, criadorId }) =>
    prisma.$transaction(async (tx) => {
        const grupo = await tx.grupo.create({
            data: {
                nome,
                descricao,
                codigoConvite,
                criadorId,
            },
        });

        await tx.membroGrupo.create({
            data: {
                grupoId: grupo.id,
                usuarioId: criadorId,
                papel: 'ADMIN',
            },
        });

        return tx.grupo.findUnique({
            where: { id: grupo.id },
            include: includeMembros,
        });
    });

const atualizar = async (grupoId, dados) =>
    prisma.grupo.update({
        where: { id: grupoId },
        data: dados,
        include: includeMembros,
    });

const excluir = async (grupoId) =>
    prisma.grupo.delete({
        where: { id: grupoId },
    });

const adicionarMembro = async (grupoId, usuarioId, papel = 'MEMBRO') =>
    prisma.membroGrupo.create({
        data: { grupoId, usuarioId, papel },
    });

const removerMembro = async (grupoId, usuarioId) =>
    prisma.membroGrupo.delete({
        where: {
            grupoId_usuarioId: { grupoId, usuarioId },
        },
    });

const atualizarMembro = async (grupoId, usuarioId, dados) =>
    prisma.membroGrupo.update({
        where: {
            grupoId_usuarioId: { grupoId, usuarioId },
        },
        data: dados,
    });

const contarMetasAtivas = async (grupoId) =>
    prisma.metaGrupo.count({
        where: { grupoId, status: 'ATIVA' },
    });

const codigoConviteExiste = async (codigoConvite) => {
    const grupo = await prisma.grupo.findUnique({
        where: { codigoConvite },
        select: { id: true },
    });
    return Boolean(grupo);
};

const contarViagens = async (grupoId) =>
    prisma.viagemGrupo.count({
        where: { grupoId },
    });

const criarViagem = async (grupoId, dados) =>
    prisma.viagemGrupo.create({
        data: {
            grupoId,
            destino: dados.destino,
            destinoMeta: dados.destinoMeta ?? null,
            moeda: dados.moeda,
            dataPrevista: dados.dataPrevista,
        },
        include: {
            despesas: {
                include: { adicionadoPor: { select: usuarioSelect } },
            },
        },
    });

const criarMetas = async (grupoId, metas) =>
    prisma.$transaction(
        metas.map((meta) =>
            prisma.metaGrupo.create({
                data: {
                    grupoId,
                    nome: meta.nome,
                    valorAlvo: meta.valorAlvo,
                    prazo: meta.prazo,
                    descricao: meta.descricao ?? null,
                },
            })
        )
    );

const buscarMetaDoGrupo = async (grupoId, metaGrupoId) =>
    prisma.metaGrupo.findFirst({
        where: { id: metaGrupoId, grupoId, status: 'ATIVA' },
    });

const criarAporte = async (metaGrupoId, usuarioId, dados) =>
    prisma.$transaction(async (tx) => {
        const meta = await tx.metaGrupo.findUnique({ where: { id: metaGrupoId } });
        if (!meta) return { aporte: null, concluida: false, metaNome: null };

        const aporte = await tx.aporteMetaGrupo.create({
            data: {
                metaGrupoId,
                usuarioId,
                valor: dados.valor,
                data: dados.data,
            },
        });

        const sum = await tx.aporteMetaGrupo.aggregate({
            where: { metaGrupoId },
            _sum: { valor: true },
        });

        const valorAtual = Number(sum._sum.valor ?? 0);
        const valorAlvo = Number(meta.valorAlvo ?? 0);
        const updateData = { valorAtual };
        let concluida = false;

        if (valorAtual >= valorAlvo && meta.status !== 'CONCLUIDA') {
            updateData.status = 'CONCLUIDA';
            updateData.concluidaEm = new Date();
            concluida = true;
        }

        await tx.metaGrupo.update({
            where: { id: metaGrupoId },
            data: updateData,
        });

        return { aporte, concluida, metaNome: meta.nome, metaId: meta.id };
    });

const atualizarViagem = async (viagemId, dados) =>
    prisma.viagemGrupo.update({
        where: { id: viagemId },
        data: dados,
    });

const excluirViagem = async (viagemId) =>
    prisma.viagemGrupo.delete({
        where: { id: viagemId },
    });

const buscarViagemPorId = async (viagemId, grupoId) =>
    prisma.viagemGrupo.findFirst({
        where: { id: viagemId, grupoId },
    });

const buscarViagemDoGrupo = async (grupoId) =>
    prisma.viagemGrupo.findFirst({
        where: { grupoId },
        orderBy: { criadoEm: 'desc' },
        select: { id: true },
    });

const criarDespesaViagem = async ({ viagemGrupoId, adicionadoPorId, categoria, descricao, valorEstimado }) =>
    prisma.despesaViagemGrupo.create({
        data: {
            viagemGrupoId,
            adicionadoPorId,
            categoria,
            descricao,
            valorEstimado,
        },
    });

const buscarDespesaViagem = async (despesaId, viagemGrupoId, usuarioId) =>
    prisma.despesaViagemGrupo.findFirst({
        where: {
            id: despesaId,
            viagemGrupoId,
            adicionadoPorId: usuarioId,
        },
    });

const atualizarDespesaViagem = async (despesaId, dados) =>
    prisma.despesaViagemGrupo.update({
        where: { id: despesaId },
        data: dados,
    });

const excluirDespesaViagem = async (despesaId) =>
    prisma.despesaViagemGrupo.delete({
        where: { id: despesaId },
    });

const criarMensagemChat = async (grupoId, usuarioId, conteudo) =>
    prisma.mensagemChatGrupo.create({
        data: {
            grupoId,
            usuarioId,
            conteudo,
        },
    });

const listarMensagens = async (grupoId, { pagina = 1, limite = 20 } = {}) => {
    const take = Math.min(Number(limite) || 20, 50);
    const skip = (Math.max(Number(pagina) || 1, 1) - 1) * take;

    const where = { grupoId };

    const [items, total] = await Promise.all([
        prisma.mensagemChatGrupo.findMany({
            where,
            include: { usuario: { select: usuarioSelect } },
            orderBy: { criadoEm: 'desc' },
            skip,
            take,
        }),
        prisma.mensagemChatGrupo.count({ where }),
    ]);

    return {
        items: items.reverse(),
        total,
        paginas: Math.ceil(total / take) || 1,
        pagina: Number(pagina) || 1,
    };
};

const contarMensagens = async (grupoId) =>
    prisma.mensagemChatGrupo.count({ where: { grupoId } });

const excluirMensagensAntigas = async (diasLimite = 180) => {
    const limite = new Date();
    limite.setDate(limite.getDate() - diasLimite);

    const resultado = await prisma.mensagemChatGrupo.deleteMany({
        where: {
            criadoEm: { lt: limite },
        },
    });

    return resultado.count;
};

module.exports = {
    listarPorUsuario,
    buscarPorId,
    buscarPorCodigoConvite,
    buscarMembro,
    criar,
    atualizar,
    excluir,
    adicionarMembro,
    removerMembro,
    atualizarMembro,
    contarMetasAtivas,
    atualizarViagem,
    excluirViagem,
    buscarViagemPorId,
    codigoConviteExiste,
    contarViagens,
    criarViagem,
    criarMetas,
    buscarMetaDoGrupo,
    criarAporte,
    buscarViagemDoGrupo,
    criarDespesaViagem,
    buscarDespesaViagem,
    atualizarDespesaViagem,
    excluirDespesaViagem,
    criarMensagemChat,
    listarMensagens,
    contarMensagens,
    excluirMensagensAntigas,
};
