const notificationService = require('./notificationService');
const gamificationService = require('./gamificationService');
const AppError = require('../utils/appError');
const metaRepository = require('../repositories/metaRepository');
const { mapMeta } = require('../utils/metaMapper');
const {
    roundMoney,
    inferirTipoMeta,
    calcProgressoMeta,
    calcValorMensalSugerido,
    podeReceberAporte,
    metaEstaVencida,
} = require('../utils/metaBalanceUtils');
const {
    formatDateOnly,
    parseVencimentoDate,
    startOfDayInTimezone,
    todayInTimezone,
} = require('../utils/dateTimezone');

const parseDate = (input) => {
    if (input instanceof Date) return input;
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return parseVencimentoDate(input);
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        throw new AppError('Data inválida', 400);
    }
    return parsed;
};

const validarPrazoFuturo = (prazo) => {
    const parsed = parseDate(prazo);
    const hoje = todayInTimezone();
    const prazoOnly = formatDateOnly(parsed);

    if (prazoOnly <= hoje) {
        throw new AppError('Prazo da meta deve ser uma data futura', 400);
    }

    return parsed;
};

const validarDataAporte = (data) => {
    const parsed = parseDate(data);
    const hoje = todayInTimezone();
    const dataOnly = formatDateOnly(parsed);

    if (dataOnly > hoje) {
        throw new AppError('Data do aporte não pode ser futura', 400);
    }

    return parsed;
};

const buscarMetaComAportes = async (metaId, usuarioId) => {
    const meta = await metaRepository.buscarPorId(metaId, usuarioId, { comAportes: true });
    if (!meta) {
        throw new AppError('Meta não encontrada', 404);
    }
    return meta;
};

const sincronizarConclusao = async (meta) => {
    const { valorRestante } = calcProgressoMeta(meta);

    if (valorRestante <= 0 && meta.status !== 'CONCLUIDA') {
        const atualizada = await metaRepository.atualizar(meta.id, meta.usuarioId, {
            status: 'CONCLUIDA',
            concluidaEm: new Date(),
        });
        return { ...atualizada, aportes: meta.aportes };
    }

    return meta;
};

const montarResumo = (metas) => {
    const ativas = metas.filter((m) => m.status === 'ATIVA' || m.status === 'PAUSADA');
    let totalEmMetas = 0;
    let totalAcumulado = 0;
    let somaPercentual = 0;

    for (const meta of ativas) {
        const progresso = calcProgressoMeta(meta);
        totalEmMetas += progresso.valorAlvo;
        totalAcumulado += progresso.valorAtual;
        somaPercentual += progresso.percentual;
    }

    const metasAtivas = metas.filter((m) => m.status === 'ATIVA').length;
    const progressoMedio = ativas.length > 0 ? somaPercentual / ativas.length : 0;

    let sugestaoMensal = 0;
    for (const meta of metas.filter((m) => m.status === 'ATIVA')) {
        sugestaoMensal += calcValorMensalSugerido(meta);
    }

    const categorias = {
        curtoPrazo: { quantidade: 0, total: 0 },
        longoPrazo: { quantidade: 0, total: 0 },
        concluidas: { quantidade: 0, total: 0 },
        pausadas: { quantidade: 0, total: 0 },
    };

    for (const meta of metas) {
        const progresso = calcProgressoMeta(meta);
        if (meta.status === 'CONCLUIDA') {
            categorias.concluidas.quantidade += 1;
            categorias.concluidas.total += progresso.valorAlvo;
        } else if (meta.status === 'PAUSADA') {
            categorias.pausadas.quantidade += 1;
            categorias.pausadas.total += progresso.valorAlvo;
        } else if (meta.tipo === 'CURTO_PRAZO') {
            categorias.curtoPrazo.quantidade += 1;
            categorias.curtoPrazo.total += progresso.valorAlvo;
        } else if (meta.tipo === 'LONGO_PRAZO') {
            categorias.longoPrazo.quantidade += 1;
            categorias.longoPrazo.total += progresso.valorAlvo;
        }
    }

    return {
        totalEmMetas: totalEmMetas.toFixed(2),
        totalAcumulado: totalAcumulado.toFixed(2),
        progressoMedio: progressoMedio.toFixed(1),
        metasAtivas,
        sugestaoMensal: roundMoney(sugestaoMensal).toFixed(2),
        categorias,
    };
};

const listarMetas = async (usuarioId, filtros) => {
    const pagina = Number(filtros.pagina) || 1;
    const limite = Number(filtros.limite) || 10;

    const { metas, total } = await metaRepository.listarPorUsuario(usuarioId, filtros, {
        pagina,
        limite,
    });

    const paginas = Math.max(1, Math.ceil(total / limite));

    return {
        metas: metas.map(mapMeta),
        total,
        paginas,
        pagina,
    };
};

const calcularResumo = async (usuarioId) => {
    const [metas, contadores, aportes, conclusoes] = await Promise.all([
        metaRepository.listarTodasComAportes(usuarioId),
        metaRepository.contarPorStatus(usuarioId),
        metaRepository.listarAtividadeRecente(usuarioId, 8),
        metaRepository.listarConclusoesRecentes(usuarioId, 8),
    ]);

    const atividadeRecente = [
        ...aportes.map((item) => ({
            id: `aporte-${item.id}`,
            metaId: item.meta.id,
            metaNome: item.meta.nome,
            valor: Number(item.valor).toFixed(2),
            data: item.data.toISOString(),
            tipo: 'aporte',
        })),
        ...conclusoes.map((meta) => ({
            id: `conclusao-${meta.id}`,
            metaId: meta.id,
            metaNome: meta.nome,
            valor: Number(meta.valorAlvo).toFixed(2),
            data: meta.concluidaEm.toISOString(),
            tipo: 'meta_concluida',
        })),
    ]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);

    return {
        ...montarResumo(metas),
        contadores,
        atividadeRecente,
    };
};

const criarMeta = async (usuarioId, dados) => {
    const prazo = validarPrazoFuturo(dados.prazo);
    const tipo = dados.tipo ?? inferirTipoMeta(prazo);

    const meta = await metaRepository.criar({
        usuarioId,
        nome: dados.nome.trim(),
        valorAlvo: dados.valorAlvo,
        prazo,
        tipo,
        descricao: dados.descricao?.trim() || null,
        prioridade: dados.prioridade ?? null,
    });

    await gamificationService.processarAposCriarMeta(usuarioId);

    return mapMeta({ ...meta, aportes: [] });
};

const editarMeta = async (usuarioId, metaId, dados) => {
    const meta = await buscarMetaComAportes(metaId, usuarioId);

    if (meta.status === 'CANCELADA') {
        throw new AppError('Meta cancelada não pode ser editada. Crie uma nova meta', 400);
    }

    if (meta.status === 'CONCLUIDA' && dados.status !== 'CONCLUIDA') {
        throw new AppError('Meta concluída não pode ser alterada', 400);
    }

    const payload = {};

    if (dados.nome !== undefined) payload.nome = dados.nome.trim();
    if (dados.descricao !== undefined) payload.descricao = dados.descricao?.trim() || null;
    if (dados.prioridade !== undefined) payload.prioridade = dados.prioridade;
    if (dados.tipo !== undefined) payload.tipo = dados.tipo;

    if (dados.valorAlvo !== undefined) {
        const valorAtual = roundMoney(meta.valorAtual);
        if (roundMoney(dados.valorAlvo) < valorAtual) {
            throw new AppError('Valor alvo não pode ser menor que o valor já acumulado', 400);
        }
        payload.valorAlvo = dados.valorAlvo;
    }

    if (dados.prazo !== undefined) {
        payload.prazo = validarPrazoFuturo(dados.prazo);
        if (dados.tipo === undefined) {
            payload.tipo = inferirTipoMeta(payload.prazo);
        }
    }

    if (dados.status !== undefined) {
        if (dados.status === 'CANCELADA' && meta.status !== 'CANCELADA') {
            throw new AppError('Use a exclusão para remover metas. Metas canceladas não podem ser reativadas', 400);
        }
        if (dados.status === 'PAUSADA' && meta.status !== 'ATIVA') {
            throw new AppError('Somente metas ativas podem ser pausadas', 400);
        }
        if (dados.status === 'ATIVA' && meta.status !== 'PAUSADA') {
            throw new AppError('Somente metas pausadas podem ser retomadas', 400);
        }
        if (dados.status === 'CONCLUIDA' && calcProgressoMeta(meta).valorRestante > 0) {
            throw new AppError('Meta só pode ser concluída quando o valor alvo for atingido', 400);
        }
        payload.status = dados.status;
        if (dados.status === 'CONCLUIDA') {
            payload.concluidaEm = new Date();
        }
        if (dados.status === 'ATIVA') {
            payload.concluidaEm = null;
        }
    }

    const atualizada = await metaRepository.atualizar(metaId, usuarioId, payload);
    return mapMeta({ ...atualizada, aportes: meta.aportes });
};

const registrarAporte = async (usuarioId, metaId, dados) => {
    const meta = await buscarMetaComAportes(metaId, usuarioId);

    if (!podeReceberAporte(meta)) {
        if (meta.status === 'PAUSADA') {
            throw new AppError('Meta pausada não recebe aportes', 400);
        }
        if (meta.status === 'CONCLUIDA') {
            throw new AppError('Meta concluída não recebe mais aportes', 400);
        }
        throw new AppError('Meta não está ativa', 400);
    }

    const valorAporte = roundMoney(dados.valor);
    const { valorRestante } = calcProgressoMeta(meta);

    if (valorAporte > valorRestante) {
        throw new AppError('Valor do aporte não pode ultrapassar o que falta para atingir a meta', 400);
    }

    const aporte = await metaRepository.criarAporte({
        metaId,
        valor: valorAporte,
        data: validarDataAporte(dados.data),
    });

    const novoValorAtual = roundMoney(Number(meta.valorAtual) + valorAporte);
    let metaAtualizada = await metaRepository.atualizar(metaId, usuarioId, {
        valorAtual: novoValorAtual,
    });

    const aportes = [aporte, ...meta.aportes];
    const antesConclusao = metaAtualizada.status;
    metaAtualizada = await sincronizarConclusao({ ...metaAtualizada, aportes });

    if (antesConclusao !== 'CONCLUIDA' && metaAtualizada.status === 'CONCLUIDA') {
        await notificationService.criarNotificacao(usuarioId, {
            tipo: 'META_ATINGIDA',
            titulo: 'Meta atingida',
            mensagem: `Meta "${metaAtualizada.nome}" concluída!`,
            linkAcao: '/goals',
            metadados: { metaId: metaAtualizada.id, escopo: 'PESSOAL' },
        });
    }

    return {
        meta: mapMeta(metaAtualizada),
        aporte: {
            id: aporte.id,
            valor: Number(aporte.valor).toFixed(2),
            data: aporte.data.toISOString(),
            criadoEm: aporte.criadoEm.toISOString(),
        },
    };
};

const excluirAporte = async (usuarioId, metaId, aporteId) => {
    const meta = await buscarMetaComAportes(metaId, usuarioId);
    const aporte = await metaRepository.buscarAporte(aporteId, metaId, usuarioId);

    if (!aporte) {
        throw new AppError('Aporte não encontrado', 404);
    }

    if (meta.status === 'CONCLUIDA') {
        throw new AppError('Remova aportes antes de reabrir uma meta concluída', 400);
    }

    await metaRepository.excluirAporte(aporteId);

    const novoValorAtual = Math.max(0, roundMoney(Number(meta.valorAtual) - Number(aporte.valor)));
    const aportes = meta.aportes.filter((item) => item.id !== aporteId);

    let metaAtualizada = await metaRepository.atualizar(metaId, usuarioId, {
        valorAtual: novoValorAtual,
        status: meta.status === 'CONCLUIDA' ? 'ATIVA' : meta.status,
        concluidaEm: null,
    });

    return mapMeta({ ...metaAtualizada, aportes });
};

const excluirMeta = async (usuarioId, metaId) => {
    const meta = await metaRepository.buscarPorId(metaId, usuarioId);
    if (!meta) {
        throw new AppError('Meta não encontrada', 404);
    }

    await metaRepository.excluir(metaId, usuarioId);
};

module.exports = {
    listarMetas,
    calcularResumo,
    criarMeta,
    editarMeta,
    registrarAporte,
    excluirAporte,
    excluirMeta,
    metaEstaVencida,
};
