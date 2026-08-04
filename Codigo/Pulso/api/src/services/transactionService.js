const AppError = require('../utils/appError');
const transactionRepository = require('../repositories/transactionRepository');
const {
    startOfDay,
    calcularUntilAPartirDoCorte,
    aplicarUntilNaRegra,
} = require('../utils/recurrenceUtils');
const categoryRepository = require('../repositories/categoryRepository');
const tagRepository = require('../repositories/tagRepository');
const notificationService = require('./notificationService');
const gamificationService = require('./gamificationService');
const insightService = require('./insightService');
const prisma = require('../config/database');
const { validarRecursoCategoria } = require('../utils/recursoCategoriaRules');
const { mapTransacao } = require('../utils/transactionMapper');

const incrementarStreak = async (usuarioId) => {
    const hoje = startOfDay(new Date());
    const sequencia = await prisma.sequencia.findUnique({ where: { usuarioId } });
    if (!sequencia) return { antes: 0, depois: 0 };

    const anterior = sequencia.sequenciaAtual;
    const ultima = sequencia.ultimaAtividade ? startOfDay(sequencia.ultimaAtividade) : null;
    if (ultima && ultima.getTime() === hoje.getTime()) {
        return { antes: anterior, depois: anterior };
    }

    let novaSequencia = 1;
    if (ultima) {
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        if (ultima.getTime() === ontem.getTime()) {
            novaSequencia = sequencia.sequenciaAtual + 1;
        }
    }

    await prisma.sequencia.update({
        where: { usuarioId },
        data: {
            sequenciaAtual: novaSequencia,
            maiorSequencia: Math.max(sequencia.maiorSequencia, novaSequencia),
            ultimaAtividade: new Date(),
        },
    });

    return { antes: anterior, depois: novaSequencia };
};

const RECURSO_LABELS = {
    DINHEIRO: 'Dinheiro',
    VA: 'VA',
    VR: 'VR',
    VT: 'VT',
    POUPANCA: 'Poupança',
};

const formatCurrencyBr = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const notificarTransferenciaRegistrada = async (usuarioId, transacao) => {
    const origem = RECURSO_LABELS[transacao.recurso] ?? transacao.recurso;
    const destino = RECURSO_LABELS[transacao.recursoDestino] ?? transacao.recursoDestino;
    const descricao = transacao.descricao || `${origem} → ${destino}`;
    const valorFmt = formatCurrencyBr(transacao.valor);

    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'TRANSFERENCIA_REGISTRADA',
        titulo: 'Transferência registrada',
        mensagem: `${descricao}: ${valorFmt}`,
        linkAcao: '/transactions',
        metadados: {
            transacaoId: transacao.id,
            recurso: transacao.recurso,
            recursoDestino: transacao.recursoDestino,
            valor: Number(transacao.valor).toFixed(2),
            tipo: transacao.tipo,
        },
    });
};

const notificarTransacaoRegistrada = async (usuarioId, transacao, categoria) => {
    if (transacao.tipo === 'TRANSFERENCIA') {
        await notificarTransferenciaRegistrada(usuarioId, transacao);
        return;
    }

    const tipo = transacao.tipo === 'RECEITA' ? 'RECEITA_REGISTRADA' : 'DESPESA_REGISTRADA';
    const sinal = transacao.tipo === 'RECEITA' ? '+' : '-';
    const descricao = transacao.descricao || categoria.nome;
    const valorFmt = formatCurrencyBr(transacao.valor);

    await notificationService.criarNotificacao(usuarioId, {
        tipo,
        titulo: tipo === 'RECEITA_REGISTRADA' ? 'Receita registrada' : 'Despesa registrada',
        mensagem: `${descricao}: ${sinal}${valorFmt}`,
        linkAcao: '/transactions',
        metadados: {
            transacaoId: transacao.id,
            categoriaId: categoria.id,
            valor: Number(transacao.valor).toFixed(2),
            tipo: transacao.tipo,
        },
    });
};

const validarData = (data, recorrente) => {
    const parsed = data instanceof Date ? data : new Date(data);
    if (Number.isNaN(parsed.getTime())) {
        throw new AppError('Data inválida', 400);
    }

    if (!recorrente) {
        const hoje = startOfDay(new Date());
        if (startOfDay(parsed) > hoje) {
            throw new AppError('Transação não pode ter data futura', 400);
        }
    }

    return parsed;
};

const validarTags = async (usuarioId, tagIds) => {
    if (!tagIds?.length) return [];

    const tags = await tagRepository.buscarPorIds(tagIds, usuarioId);
    if (tags.length !== tagIds.length) {
        throw new AppError('Uma ou mais tags não foram encontradas', 404);
    }
    return tags;
};

const buscarCategoriaDoUsuario = async (usuarioId, categoriaId) => {
    const categoria = await categoryRepository.buscarPorId(categoriaId, usuarioId);
    if (!categoria) {
        throw new AppError('Categoria não encontrada', 404);
    }
    return categoria;
};

const montarResumo = (agregados) => {
    let receitasTotal = 0;
    let receitasQtd = 0;
    let despesasTotal = 0;
    let despesasQtd = 0;

    for (const item of agregados) {
        const total = Number(item._sum.valor ?? 0);
        const qtd = item._count.id ?? 0;
        if (item.tipo === 'RECEITA') {
            receitasTotal = total;
            receitasQtd = qtd;
        } else if (item.tipo === 'DESPESA') {
            despesasTotal = total;
            despesasQtd = qtd;
        }
    }

    const saldo = receitasTotal - despesasTotal;

    return {
        receitas: { total: receitasTotal.toFixed(2), quantidade: receitasQtd },
        despesas: { total: despesasTotal.toFixed(2), quantidade: despesasQtd },
        saldo: saldo.toFixed(2),
    };
};

const listarTransacoes = async (usuarioId, filtros) => {
    const pagina = Number(filtros.pagina) || 1;
    const limite = Number(filtros.limite) || 10;

    const { transacoes, total } = await transactionRepository.listarPorUsuario(
        usuarioId,
        filtros,
        { pagina, limite }
    );

    const paginas = Math.max(1, Math.ceil(total / limite));

    return {
        transacoes: transacoes.map(mapTransacao),
        total,
        paginas,
        pagina,
    };
};

const calcularResumo = async (usuarioId, filtros) => {
    const agregados = await transactionRepository.calcularAgregados(usuarioId, filtros);
    return montarResumo(agregados);
};

const criarTransacao = async (usuarioId, dados) => {
    const isTransferencia = dados.tipo === 'TRANSFERENCIA';
    let categoria = null;

    if (isTransferencia) {
        if (dados.recursoDestino === dados.recurso) {
            throw new AppError('Recurso de destino deve ser diferente do recurso de origem', 400);
        }
    } else {
        categoria = await buscarCategoriaDoUsuario(usuarioId, dados.categoriaId);

        if (categoria.tipo !== dados.tipo) {
            throw new AppError('Categoria incompatível com o tipo da transação', 400);
        }

        validarRecursoCategoria(dados.recurso, categoria, dados.tipo);
    }

    const data = validarData(dados.data, dados.recorrente);
    const tags = await validarTags(usuarioId, dados.tags);

    if (dados.recorrente && !dados.regraRecorrencia) {
        throw new AppError('Regra de recorrência é obrigatória para transações recorrentes', 400);
    }

    const transacao = await transactionRepository.criar({
        usuarioId,
        categoriaId: isTransferencia ? null : dados.categoriaId,
        tipo: dados.tipo,
        recurso: dados.recurso,
        recursoDestino: isTransferencia ? dados.recursoDestino : null,
        valor: dados.valor,
        descricao: dados.descricao ?? null,
        data,
        recorrente: dados.recorrente ?? false,
        regraRecorrencia: dados.recorrente ? dados.regraRecorrencia : null,
    });

    if (tags.length) {
        await transactionRepository.vincularTags(
            transacao.id,
            tags.map((t) => t.id)
        );
    }

    const streak = await incrementarStreak(usuarioId);

    const completa = await transactionRepository.buscarPorId(transacao.id, usuarioId);

    await notificarTransacaoRegistrada(usuarioId, completa, categoria);
    await gamificationService.processarAposTransacao(usuarioId, streak.antes, streak.depois);
    await insightService.tentarGerarInsightAposTransacao(usuarioId);

    return mapTransacao(completa);
};

const editarTransacao = async (usuarioId, transacaoId, dados) => {
    const existente = await transactionRepository.buscarPorId(transacaoId, usuarioId);
    if (!existente) {
        throw new AppError('Transação não encontrada', 404);
    }

    const tipo = dados.tipo ?? existente.tipo;
    const recurso = dados.recurso ?? existente.recurso;
    const isTransferencia = tipo === 'TRANSFERENCIA';

    if (isTransferencia) {
        const recursoDestino = dados.recursoDestino ?? existente.recursoDestino;
        if (!recursoDestino || recursoDestino === recurso) {
            throw new AppError('Recurso de destino deve ser diferente do recurso de origem', 400);
        }
    } else {
        const categoriaId = dados.categoriaId ?? existente.categoriaId;
        const categoria = await buscarCategoriaDoUsuario(usuarioId, categoriaId);
        if (categoria.tipo !== tipo) {
            throw new AppError('Categoria incompatível com o tipo da transação', 400);
        }

        validarRecursoCategoria(recurso, categoria, tipo);
    }

    const updateData = {};
    if (dados.tipo !== undefined) updateData.tipo = dados.tipo;
    if (dados.categoriaId !== undefined) updateData.categoriaId = dados.categoriaId;
    if (dados.recurso !== undefined) updateData.recurso = dados.recurso;
    if (dados.recursoDestino !== undefined) updateData.recursoDestino = dados.recursoDestino;
    if (dados.valor !== undefined) updateData.valor = dados.valor;
    if (dados.descricao !== undefined) updateData.descricao = dados.descricao;
    if (dados.data !== undefined) {
        updateData.data = validarData(dados.data, existente.recorrente);
    }

    if (isTransferencia) {
        updateData.categoriaId = null;
    } else if (dados.tipo !== undefined && existente.tipo === 'TRANSFERENCIA') {
        updateData.recursoDestino = null;
    }

    await transactionRepository.atualizar(transacaoId, updateData);

    if (dados.tags !== undefined) {
        const tags = await validarTags(usuarioId, dados.tags);
        await transactionRepository.desvincularTags(transacaoId);
        if (tags.length) {
            await transactionRepository.vincularTags(
                transacaoId,
                tags.map((t) => t.id)
            );
        }
    }

    const atualizada = await transactionRepository.buscarPorId(transacaoId, usuarioId);
    return mapTransacao(atualizada);
};

const excluirTransacao = async (usuarioId, transacaoId, excluirFuturas = false, dataCorte = null) => {
    const existente = await transactionRepository.buscarPorId(transacaoId, usuarioId);
    if (!existente) {
        throw new AppError('Transação não encontrada', 404);
    }

    const isMaeRecorrente = existente.recorrente && !existente.paiId;
    const isFilhaRecorrente = Boolean(existente.paiId);

    if (!excluirFuturas || (!isMaeRecorrente && !isFilhaRecorrente)) {
        await transactionRepository.excluir(transacaoId);
        return;
    }

    const paiId = isMaeRecorrente ? existente.id : existente.paiId;
    const mae =
        isMaeRecorrente
            ? existente
            : await transactionRepository.buscarPorId(paiId, usuarioId);

    if (!mae) {
        throw new AppError('Transação recorrente não encontrada', 404);
    }

    const cutoff = startOfDay(dataCorte ? new Date(dataCorte) : new Date());

    await transactionRepository.excluirRecorrentesFilhasAPartirDe(paiId, cutoff);

    const untilDate = calcularUntilAPartirDoCorte(cutoff);
    const novaRegra = aplicarUntilNaRegra(mae.regraRecorrencia, untilDate);

    await transactionRepository.encerrarRecorrencia(paiId, novaRegra);
};

module.exports = {
    listarTransacoes,
    calcularResumo,
    criarTransacao,
    editarTransacao,
    excluirTransacao,
};
