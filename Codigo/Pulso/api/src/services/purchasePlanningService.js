const prisma = require('../config/database');
const AppError = require('../utils/appError');
const purchasePlanningRepository = require('../repositories/purchasePlanningRepository');
const categoryRepository = require('../repositories/categoryRepository');
const metaRepository = require('../repositories/metaRepository');
const transactionRepository = require('../repositories/transactionRepository');
const { mapItem, mapItemComprado } = require('../utils/purchasePlanningMapper');
const {
    roundMoney,
    calcComprometimento,
    inferirCategoria,
    CATEGORIA_LABELS,
    DICAS,
} = require('../utils/purchasePlanningUtils');
const { intervaloDoMes, mesReferenciaFromQuery, mesAtualString } = require('../utils/monthUtils');
const { inferirTipoMeta } = require('../utils/metaBalanceUtils');
const { todayInTimezone } = require('../utils/dateTimezone');
const { resolvePurchaseItemImage } = require('./purchaseItemImageService');
const { storePurchaseItemImage } = require('./purchaseItemImageStorageService');

const validarNome = (nome) => {
    const texto = String(nome ?? '').trim();
    if (!texto) throw new AppError('Nome do item é obrigatório', 400);
    if (texto.length > 120) throw new AppError('Nome deve ter no máximo 120 caracteres', 400);
    return texto;
};

const validarValor = (valor) => {
    const num = roundMoney(valor);
    if (num <= 0) throw new AppError('Valor deve ser maior que zero', 400);
    return num;
};

const buscarItem = async (id, usuarioId) => {
    const item = await purchasePlanningRepository.buscarPorId(id, usuarioId);
    if (!item) throw new AppError('Item não encontrado', 404);
    return item;
};

const obterRendaMensal = async (usuarioId) => {
    const config = await prisma.configuracaoUsuario.findUnique({
        where: { usuarioId },
        select: {
            rendaMensalPlanejada: true,
            valorSalario: true,
            valorVa: true,
            valorVr: true,
        },
    });
    if (!config) return 0;
    const renda =
        config.rendaMensalPlanejada ??
        Number(config.valorSalario ?? 0) +
            Number(config.valorVa ?? 0) +
            Number(config.valorVr ?? 0);
    return roundMoney(renda);
};

const calcularSobraMensal = async (usuarioId) => {
    const mesReferencia = mesReferenciaFromQuery(mesAtualString());
    const { inicio, fim } = intervaloDoMes(mesReferencia);

    const agregados = await prisma.transacao.groupBy({
        by: ['tipo'],
        where: {
            usuarioId,
            data: { gte: inicio, lte: fim },
        },
        _sum: { valor: true },
    });

    let receitas = 0;
    let despesas = 0;
    for (const row of agregados) {
        const total = Number(row._sum.valor ?? 0);
        if (row.tipo === 'RECEITA') receitas += total;
        if (row.tipo === 'DESPESA') despesas += total;
    }

    const rendaMensal = await obterRendaMensal(usuarioId);
    const baseRenda = rendaMensal > 0 ? rendaMensal : receitas;
    const sobra = roundMoney(baseRenda - despesas);
    return { rendaMensal: baseRenda, sobraMensal: Math.max(0, sobra), receitas, despesas };
};

const montarContexto = async (usuarioId) => calcularSobraMensal(usuarioId);

const montarResumo = async (usuarioId, itens, contexto) => {
    const totalValor = itens.reduce((acc, item) => acc + Number(item.valorEstimado ?? 0), 0);
    const comprometimentos = itens
        .filter((item) => item.simularParcelas)
        .map((item) =>
            calcComprometimento(item.valorEstimado, item.parcelas || 12, contexto.rendaMensal)
        );
    const mediaImpacto =
        comprometimentos.length > 0
            ? Math.round(
                  (comprometimentos.reduce((acc, item) => acc + item.percentual, 0) /
                      comprometimentos.length) *
                      10
              ) / 10
            : 0;

    const categoriasRaw = await purchasePlanningRepository.contarPorCategoria(usuarioId);
    const categorias = {};
    for (const row of categoriasRaw) {
        categorias[row.categoria] = {
            label: CATEGORIA_LABELS[row.categoria] ?? row.categoria,
            quantidade: row._count.id,
            total: roundMoney(row._sum.valorEstimado ?? 0).toFixed(2),
        };
    }

    return {
        totalValor: roundMoney(totalValor).toFixed(2),
        totalItens: itens.length,
        mediaImpactoRenda: mediaImpacto,
        rendaMensal: contexto.rendaMensal.toFixed(2),
        sobraMensal: contexto.sobraMensal.toFixed(2),
        categorias,
        dicas: DICAS,
    };
};

const listarPainel = async (usuarioId) => {
    const [itens, comprados, contexto] = await Promise.all([
        purchasePlanningRepository.listarDesejados(usuarioId),
        purchasePlanningRepository.listarComprados(usuarioId, 8),
        montarContexto(usuarioId),
    ]);

    const itensOrdenados = [...itens].sort((a, b) => {
        const ordem = { ALTA: 0, MEDIA: 1, BAIXA: 2 };
        return (ordem[a.prioridade] ?? 9) - (ordem[b.prioridade] ?? 9);
    });

    const resumo = await montarResumo(usuarioId, itensOrdenados, contexto);

    return {
        resumo,
        itens: itensOrdenados.map((item) => mapItem(item, contexto)),
        comprados: comprados.map(mapItemComprado),
    };
};

const resolverMeta = async (usuarioId, dados) => {
    if (dados.metaId) {
        const meta = await metaRepository.buscarPorId(dados.metaId, usuarioId);
        if (!meta) throw new AppError('Meta não encontrada', 404);
        if (meta.status !== 'ATIVA' && meta.status !== 'PAUSADA') {
            throw new AppError('Meta indisponível para vínculo', 400);
        }
        return meta.id;
    }

    if (dados.criarMeta) {
        const prazo = dados.criarMeta.prazo ? new Date(dados.criarMeta.prazo) : null;
        if (!prazo || Number.isNaN(prazo.getTime())) {
            throw new AppError('Prazo da meta é obrigatório', 400);
        }
        const tipo = dados.criarMeta.tipo ?? inferirTipoMeta(prazo);
        const meta = await metaRepository.criar({
            usuarioId,
            nome: dados.criarMeta.nome?.trim() || `Comprar: ${dados.nome}`,
            valorAlvo: dados.criarMeta.valorAlvo ?? dados.valorEstimado,
            prazo,
            tipo,
            prioridade: dados.prioridade ?? null,
        });
        return meta.id;
    }

    return null;
};

const obterImagemUrl = async (nome, dados = {}, itemAtual = null) => {
    const imagemInformada =
        dados.imagemUrl !== undefined ? dados.imagemUrl?.trim() || null : itemAtual?.imagemUrl ?? null;
    const linkProduto =
        dados.linkProduto !== undefined ? dados.linkProduto?.trim() || null : itemAtual?.linkProduto ?? null;
    const buscarNaInternet = dados.buscarImagemAuto !== false;

    if (dados.imagemUrl === null) return null;

    const { imagemUrl } = await resolvePurchaseItemImage({
        nome,
        imagemUrl: imagemInformada,
        linkProduto,
        buscarNaInternet,
    });

    return imagemUrl || imagemInformada || null;
};

const criarItem = async (usuarioId, dados) => {
    const nome = validarNome(dados.nome);
    const valorEstimado = validarValor(dados.valorEstimado);
    const categoria = dados.categoria ?? inferirCategoria(nome);
    const metaId = dados.vincularMeta ? await resolverMeta(usuarioId, { ...dados, nome, valorEstimado }) : null;
    const imagemUrl = await obterImagemUrl(nome, dados);

    const item = await purchasePlanningRepository.criar({
        usuarioId,
        nome,
        valorEstimado,
        prioridade: dados.prioridade ?? 'MEDIA',
        categoria,
        observacoes: dados.observacoes?.trim() || null,
        linkProduto: dados.linkProduto?.trim() || null,
        imagemUrl,
        simularParcelas: dados.simularParcelas ?? true,
        parcelas: Math.min(Math.max(Number(dados.parcelas) || 12, 1), 48),
        metaId,
    });

    const contexto = await montarContexto(usuarioId);
    return mapItem(item, contexto);
};

const editarItem = async (usuarioId, id, dados) => {
    const item = await buscarItem(id, usuarioId);
    if (item.status === 'COMPRADO') {
        throw new AppError('Itens comprados não podem ser editados', 400);
    }

    const payload = {};
    if (dados.nome !== undefined) payload.nome = validarNome(dados.nome);
    if (dados.valorEstimado !== undefined) payload.valorEstimado = validarValor(dados.valorEstimado);
    if (dados.prioridade !== undefined) payload.prioridade = dados.prioridade;
    if (dados.categoria !== undefined) payload.categoria = dados.categoria;
    if (dados.observacoes !== undefined) payload.observacoes = dados.observacoes?.trim() || null;
    if (dados.linkProduto !== undefined) payload.linkProduto = dados.linkProduto?.trim() || null;
    if (
        dados.imagemUrl !== undefined ||
        dados.linkProduto !== undefined ||
        dados.nome !== undefined ||
        dados.buscarImagemAuto !== undefined
    ) {
        payload.imagemUrl = await obterImagemUrl(
            payload.nome ?? item.nome,
            dados,
            item
        );
    }
    if (dados.simularParcelas !== undefined) payload.simularParcelas = dados.simularParcelas;
    if (dados.parcelas !== undefined) {
        payload.parcelas = Math.min(Math.max(Number(dados.parcelas) || 12, 1), 48);
    }

    if (!Object.keys(payload).length) {
        throw new AppError('Informe ao menos um campo para atualizar', 400);
    }

    const atualizado = await purchasePlanningRepository.atualizar(id, payload);
    const contexto = await montarContexto(usuarioId);
    return mapItem(atualizado, contexto);
};

const excluirItem = async (usuarioId, id) => {
    await buscarItem(id, usuarioId);
    await purchasePlanningRepository.excluir(id);
};

const vincularMeta = async (usuarioId, id, dados) => {
    const item = await buscarItem(id, usuarioId);
    if (item.status === 'COMPRADO') {
        throw new AppError('Item já foi comprado', 400);
    }

    let metaId = dados.metaId;
    if (!metaId && dados.criarMeta) {
        metaId = await resolverMeta(usuarioId, {
            ...dados,
            nome: item.nome,
            valorEstimado: Number(item.valorEstimado),
            vincularMeta: true,
        });
    }

    if (!metaId) throw new AppError('Informe uma meta para vincular', 400);

    if (dados.ajustarMetaValor) {
        await metaRepository.atualizar(metaId, usuarioId, {
            valorAlvo: Number(item.valorEstimado),
        });
    }

    const atualizado = await purchasePlanningRepository.atualizar(id, { metaId });
    const contexto = await montarContexto(usuarioId);
    return mapItem(atualizado, contexto);
};

const desvincularMeta = async (usuarioId, id) => {
    await buscarItem(id, usuarioId);
    const atualizado = await purchasePlanningRepository.atualizar(id, { metaId: null });
    const contexto = await montarContexto(usuarioId);
    return mapItem(atualizado, contexto);
};

const buscarCategoriaCompras = async (usuarioId) => {
    const categorias = await categoryRepository.listarPorUsuario(usuarioId, 'DESPESA');
    const compras = categorias.find((c) => c.nome.toLowerCase() === 'compras');
    if (!compras) throw new AppError('Categoria Compras não encontrada', 404);
    return compras;
};

const marcarComprado = async (usuarioId, id, dados = {}) => {
    const item = await buscarItem(id, usuarioId);
    if (item.status === 'COMPRADO') {
        throw new AppError('Item já foi marcado como comprado', 400);
    }

    const categoria =
        dados.categoriaId != null
            ? await categoryRepository.buscarPorId(dados.categoriaId, usuarioId)
            : await buscarCategoriaCompras(usuarioId);

    if (!categoria || categoria.tipo !== 'DESPESA') {
        throw new AppError('Categoria inválida para despesa', 400);
    }

    const transacao = await transactionRepository.criar({
        usuarioId,
        categoriaId: categoria.id,
        tipo: 'DESPESA',
        recurso: dados.recurso ?? 'DINHEIRO',
        valor: Number(item.valorEstimado),
        descricao: `Compra: ${item.nome}`,
        data: todayInTimezone(),
        recorrente: false,
        regraRecorrencia: null,
    });

    const atualizado = await purchasePlanningRepository.atualizar(id, {
        status: 'COMPRADO',
        compradoEm: new Date(),
        transacaoId: transacao.id,
    });

    const contexto = await montarContexto(usuarioId);
    return mapItem(atualizado, contexto);
};

const resolverImagemPreview = async (dados) =>
    resolvePurchaseItemImage({
        nome: dados.nome,
        imagemUrl: dados.imagemUrl,
        linkProduto: dados.linkProduto,
        buscarNaInternet: dados.buscarNaInternet !== false,
    });

const enviarImagemItem = async (usuarioId, id, file) => {
    const item = await buscarItem(id, usuarioId);
    if (item.status === 'COMPRADO') {
        throw new AppError('Itens comprados não podem ser alterados', 400);
    }

    const imagemUrl = await storePurchaseItemImage(id, file);
    const atualizado = await purchasePlanningRepository.atualizar(id, { imagemUrl });
    const contexto = await montarContexto(usuarioId);
    return mapItem(atualizado, contexto);
};

module.exports = {
    listarPainel,
    criarItem,
    editarItem,
    excluirItem,
    vincularMeta,
    desvincularMeta,
    marcarComprado,
    resolverImagemPreview,
    enviarImagemItem,
    montarContexto,
};
