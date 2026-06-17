const AppError = require('../utils/appError');
const tripFlightPriceService = require('./tripFlightPriceService');
const viagemRepository = require('../repositories/viagemRepository');
const metaRepository = require('../repositories/metaRepository');
const awesomeApiProvider = require('../providers/awesomeApiProvider');
const { mapViagem } = require('../utils/viagemMapper');
const { isSupportedCurrency } = require('../constants/currencyCatalog');
const { listTripOrigins } = require('../constants/tripOrigins');
const { listTripDestinations, countTripDestinations, getCatalogEntry, buildDestinoMetaFromCatalog } = require('../constants/tripDestinationsCatalog');
const { resolveDestinationAirport } = require('../constants/tripDestinationAirports');
const geonamesProvider = require('../providers/geonamesProvider');
const tripDestinationResolver = require('./tripDestinationResolver');
const { attachCoverImage } = require('./tripDestinationImageService');
const {
    formatDateOnly,
    parseVencimentoDate,
    todayInTimezone,
} = require('../utils/dateTimezone');

const CATEGORIAS_DESPESA = [
    'TRANSPORTE',
    'HOSPEDAGEM',
    'ALIMENTACAO',
    'PASSEIOS',
    'COMPRAS',
    'DOCUMENTACAO',
    'SAUDE',
    'EMERGENCIAS',
    'ENTRETENIMENTO',
    'OUTROS',
];

const TIPOS_OBSERVACAO = ['GERAL', 'CHECKLIST', 'LINK', 'DICA', 'DOCUMENTOS'];

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

const validarDataFutura = (data) => {
    const parsed = parseDate(data);
    const hoje = todayInTimezone();
    const dataOnly = formatDateOnly(parsed);
    if (dataOnly <= hoje) {
        throw new AppError('Data prevista deve ser futura', 400);
    }
    return parsed;
};

const validarMoeda = (moeda) => {
    const code = String(moeda ?? '').toUpperCase();
    if (!isSupportedCurrency(code)) {
        throw new AppError('Moeda não suportada', 400);
    }
    return code;
};

const validarMetaVinculo = async (usuarioId, metaId, viagemId = null) => {
    if (!metaId) return null;

    const meta = await metaRepository.buscarPorId(metaId, usuarioId);
    if (!meta) {
        throw new AppError('Meta financeira não encontrada', 404);
    }

    const existente = await viagemRepository.buscarPorMetaId(metaId, usuarioId, viagemId);
    if (existente) {
        throw new AppError('Esta meta já está vinculada a outra viagem', 409);
    }

    return metaId;
};

const buscarViagem = async (viagemId, usuarioId) => {
    const viagem = await viagemRepository.buscarPorId(viagemId, usuarioId);
    if (!viagem) {
        throw new AppError('Viagem não encontrada', 404);
    }
    return viagem;
};

const hydrateCoverImage = async (viagem, usuarioId) => {
    const baseMeta =
        viagem.destinoMeta && typeof viagem.destinoMeta === 'object' ? viagem.destinoMeta : {};

    if (baseMeta.coverImageUrl && !/\/420px-/.test(baseMeta.coverImageUrl)) return;

    const enriched = await attachCoverImage(baseMeta, viagem.destino);
    if (!enriched?.coverImageUrl) return;

    if (enriched.coverImageUrl === baseMeta.coverImageUrl) return;

    await viagemRepository.atualizar(viagem.id, usuarioId, { destinoMeta: enriched });
    viagem.destinoMeta = enriched;
};

const listarViagens = async (usuarioId) => {
    const viagens = await viagemRepository.listarPorUsuario(usuarioId);

    await Promise.all(viagens.map((viagem) => hydrateCoverImage(viagem, usuarioId)));

    return viagens.map(mapViagem);
};

const obterResumoPagina = async (usuarioId) => {
    const viagens = await listarViagens(usuarioId);
    const totalPlanejado = viagens.reduce((acc, item) => acc + Number(item.totalBrl), 0);

    return {
        quantidadeViagens: viagens.length,
        totalPlanejadoBrl: totalPlanejado.toFixed(2),
    };
};

const resolverDestinoPayload = async (dados) => {
    const destinoInformado = String(dados.destino ?? '').trim();
    const metaInformada = dados.destinoMeta ?? null;

    if (metaInformada?.geonameId) {
        let place = await geonamesProvider.getPlace(metaInformada.geonameId);

        if (!place && metaInformada.label && metaInformada.countryCode) {
            place = {
                geonameId: metaInformada.geonameId,
                name: metaInformada.label,
                countryCode: metaInformada.countryCode,
                countryName: metaInformada.countryName,
                adminName1: metaInformada.region ?? '',
                lat: metaInformada.lat,
                lng: metaInformada.lng,
                source: 'geonames',
            };
        }

        if (!place) {
            throw new AppError('Destino inválido. Selecione novamente na lista.', 400);
        }

        const resolved = tripDestinationResolver.resolveFromGeoNamesPlace(place);
        if (!resolved) {
            throw new AppError('Não foi possível resolver o destino selecionado.', 400);
        }

        if (destinoInformado && destinoInformado !== resolved.destino) {
            throw new AppError('O destino informado não corresponde à opção selecionada.', 400);
        }

        return {
            destino: resolved.destino,
            destinoMeta: resolved.destinoMeta,
        };
    }

    if (metaInformada?.catalogId && metaInformada?.source !== 'geonames') {
        const catalogEntry = getCatalogEntry(metaInformada.catalogId);
        if (!catalogEntry) {
            throw new AppError('Destino inválido. Selecione um local da lista.', 400);
        }

        const destino = catalogEntry.destino;
        if (destinoInformado && destinoInformado !== destino) {
            throw new AppError('O destino informado não corresponde à opção selecionada.', 400);
        }

        return {
            destino,
            destinoMeta: buildDestinoMetaFromCatalog(catalogEntry.id),
        };
    }

    if (metaInformada?.catalogId?.startsWith('GN-') && metaInformada?.iata) {
        if (destinoInformado && metaInformada.label) {
            return {
                destino: destinoInformado,
                destinoMeta: metaInformada,
            };
        }
    }

    if (!destinoInformado) {
        throw new AppError('Selecione um destino da lista.', 400);
    }

    const resolvedAirport = resolveDestinationAirport(destinoInformado, metaInformada);
    if (!resolvedAirport) {
        throw new AppError('Selecione um destino da lista de sugestões.', 400);
    }

    const catalogEntry = listTripDestinations().find(
        (entry) => entry.iata === resolvedAirport.iata && entry.label === resolvedAirport.label
    );

    if (catalogEntry) {
        return {
            destino: catalogEntry.destino,
            destinoMeta: buildDestinoMetaFromCatalog(catalogEntry.id),
        };
    }

    return {
        destino: destinoInformado,
        destinoMeta: metaInformada,
    };
};

const criarViagem = async (usuarioId, dados) => {
    const { destino, destinoMeta: destinoMetaBase } = await resolverDestinoPayload(dados);
    const destinoMeta = await attachCoverImage(destinoMetaBase, destino);
    const moeda = validarMoeda(dados.moeda);
    const dataPrevista = validarDataFutura(dados.dataPrevista);
    const metaId = await validarMetaVinculo(usuarioId, dados.metaId ?? null);

    const viagem = await viagemRepository.criar({
        usuarioId,
        destino,
        destinoMeta,
        moeda,
        dataPrevista,
        metaId,
    });

    return mapViagem(viagem);
};

const editarViagem = async (usuarioId, viagemId, dados) => {
    await buscarViagem(viagemId, usuarioId);

    const payload = {};

    if (dados.destino !== undefined || dados.destinoMeta !== undefined) {
        const resolved = await resolverDestinoPayload({
            destino: dados.destino,
            destinoMeta: dados.destinoMeta,
        });
        payload.destino = resolved.destino;
        payload.destinoMeta = await attachCoverImage(resolved.destinoMeta, resolved.destino);
    }

    if (dados.moeda !== undefined) {
        payload.moeda = validarMoeda(dados.moeda);
    }

    if (dados.dataPrevista !== undefined) {
        payload.dataPrevista = validarDataFutura(dados.dataPrevista);
    }

    if (dados.metaId !== undefined) {
        payload.metaId = await validarMetaVinculo(usuarioId, dados.metaId, viagemId);
    }

    const viagem = await viagemRepository.atualizar(viagemId, usuarioId, payload);
    return mapViagem(viagem);
};

const excluirViagem = async (usuarioId, viagemId) => {
    await buscarViagem(viagemId, usuarioId);
    await viagemRepository.excluir(viagemId, usuarioId);
};

const validarDespesa = (dados) => {
    const categoria = String(dados.categoria ?? '').toUpperCase();
    if (!CATEGORIAS_DESPESA.includes(categoria)) {
        throw new AppError('Categoria de despesa inválida', 400);
    }

    const valor = Number(dados.valorEstimado);
    if (!Number.isFinite(valor) || valor <= 0) {
        throw new AppError('Informe um valor estimado maior que zero', 400);
    }

    return {
        categoria,
        descricao: dados.descricao?.trim() || null,
        valorEstimado: valor,
    };
};

const criarDespesa = async (usuarioId, viagemId, dados) => {
    await buscarViagem(viagemId, usuarioId);
    const despesa = validarDespesa(dados);

    await viagemRepository.criarDespesa({
        viagemId,
        ...despesa,
    });

    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const editarDespesa = async (usuarioId, viagemId, despesaId, dados) => {
    await buscarViagem(viagemId, usuarioId);
    const existente = await viagemRepository.buscarDespesa(despesaId, viagemId, usuarioId);
    if (!existente) {
        throw new AppError('Pretensão não encontrada', 404);
    }

    const payload = {};
    if (dados.categoria !== undefined) {
        const categoria = String(dados.categoria).toUpperCase();
        if (!CATEGORIAS_DESPESA.includes(categoria)) {
            throw new AppError('Categoria de despesa inválida', 400);
        }
        payload.categoria = categoria;
    }
    if (dados.descricao !== undefined) {
        payload.descricao = dados.descricao?.trim() || null;
    }
    if (dados.valorEstimado !== undefined) {
        const valor = Number(dados.valorEstimado);
        if (!Number.isFinite(valor) || valor <= 0) {
            throw new AppError('Informe um valor estimado maior que zero', 400);
        }
        payload.valorEstimado = valor;
    }

    await viagemRepository.atualizarDespesa(despesaId, payload);
    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const excluirDespesa = async (usuarioId, viagemId, despesaId) => {
    await buscarViagem(viagemId, usuarioId);
    const existente = await viagemRepository.buscarDespesa(despesaId, viagemId, usuarioId);
    if (!existente) {
        throw new AppError('Pretensão não encontrada', 404);
    }

    await viagemRepository.excluirDespesa(despesaId);
    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const normalizarChecklist = (items) => {
    if (!Array.isArray(items)) return null;
    const normalized = items
        .map((item) => ({
            id: item.id?.trim() || crypto.randomUUID(),
            texto: String(item.texto ?? '').trim(),
            concluido: Boolean(item.concluido),
        }))
        .filter((item) => item.texto.length > 0);

    return normalized.length > 0 ? normalized : null;
};

const inferirTipoObservacao = (checklist, linkUrl) => {
    const hasChecklist = Array.isArray(checklist) && checklist.length > 0;
    const hasLink = Boolean(linkUrl);

    if (hasChecklist && hasLink) return 'GERAL';
    if (hasChecklist) return 'CHECKLIST';
    if (hasLink) return 'LINK';
    return 'GERAL';
};

const validarObservacao = (dados) => {
    const titulo = String(dados.titulo ?? '').trim();
    if (!titulo) {
        throw new AppError('Informe o título da observação', 400);
    }

    const conteudoRaw = dados.conteudo;
    const conteudo =
        conteudoRaw === null || conteudoRaw === undefined
            ? null
            : String(conteudoRaw).trim().slice(0, 1000) || null;

    let linkUrl = dados.linkUrl;
    if (linkUrl === '' || linkUrl === undefined) {
        linkUrl = null;
    } else if (linkUrl !== null) {
        linkUrl = String(linkUrl).trim();
        try {
            // eslint-disable-next-line no-new
            new URL(linkUrl);
        } catch {
            throw new AppError('Informe uma URL válida para o link', 400);
        }
    }

    const checklist = normalizarChecklist(dados.checklist);

    return {
        titulo: titulo.slice(0, 120),
        conteudo,
        tipo: inferirTipoObservacao(checklist, linkUrl),
        linkUrl,
        checklist,
    };
};

const criarObservacao = async (usuarioId, viagemId, dados) => {
    await buscarViagem(viagemId, usuarioId);
    const observacao = validarObservacao(dados);

    await viagemRepository.criarObservacao({
        viagemId,
        ...observacao,
    });

    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const editarObservacao = async (usuarioId, viagemId, observacaoId, dados) => {
    await buscarViagem(viagemId, usuarioId);
    const existente = await viagemRepository.buscarObservacao(observacaoId, viagemId, usuarioId);
    if (!existente) {
        throw new AppError('Observação não encontrada', 404);
    }

    const payload = {};

    if (dados.titulo !== undefined) {
        const titulo = String(dados.titulo ?? '').trim();
        if (!titulo) throw new AppError('Informe o título da observação', 400);
        payload.titulo = titulo.slice(0, 120);
    }

    if (dados.conteudo !== undefined) {
        payload.conteudo =
            dados.conteudo === null
                ? null
                : String(dados.conteudo).trim().slice(0, 1000) || null;
    }

    if (dados.linkUrl !== undefined) {
        let linkUrl = dados.linkUrl;
        if (linkUrl === '' || linkUrl === null) {
            payload.linkUrl = null;
        } else {
            linkUrl = String(linkUrl).trim();
            try {
                // eslint-disable-next-line no-new
                new URL(linkUrl);
            } catch {
                throw new AppError('Informe uma URL válida para o link', 400);
            }
            payload.linkUrl = linkUrl;
        }
    }

    if (dados.checklist !== undefined) {
        payload.checklist = normalizarChecklist(dados.checklist);
    }

    const mergedChecklist =
        payload.checklist !== undefined
            ? payload.checklist
            : normalizarChecklist(existente.checklist);
    const mergedLinkUrl =
        payload.linkUrl !== undefined ? payload.linkUrl : existente.linkUrl;
    payload.tipo = inferirTipoObservacao(mergedChecklist, mergedLinkUrl);

    await viagemRepository.atualizarObservacao(observacaoId, payload);
    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const excluirObservacao = async (usuarioId, viagemId, observacaoId) => {
    await buscarViagem(viagemId, usuarioId);
    const existente = await viagemRepository.buscarObservacao(observacaoId, viagemId, usuarioId);
    if (!existente) {
        throw new AppError('Observação não encontrada', 404);
    }

    await viagemRepository.excluirObservacao(observacaoId);
    const viagem = await buscarViagem(viagemId, usuarioId);
    return mapViagem(viagem);
};

const obterMediaPassagem = async (usuarioId, viagemId, origemId) => {
    const viagem = await buscarViagem(viagemId, usuarioId);
    return tripFlightPriceService.obterMediaPassagemPorViagem(viagem, origemId);
};

const listarOrigensViagem = async () => ({ origens: listTripOrigins() });

const listarDestinosViagem = async ({ q, limit } = {}) => {
    const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
    const query = String(q ?? '').trim();

    const places = await geonamesProvider.searchPlaces(query, { limit: parsedLimit });
    const destinos = places
        .map((place) => tripDestinationResolver.resolveFromGeoNamesPlace(place))
        .filter(Boolean)
        .map(({ destinoMeta, ...entry }) => entry);

    return {
        destinos,
        total: geonamesProvider.hasCredentials() ? null : countTripDestinations(),
        source: geonamesProvider.hasCredentials() ? 'geonames' : 'catalog',
    };
};

const obterViagem = async (usuarioId, viagemId) => {
    const viagem = await buscarViagem(viagemId, usuarioId);
    await hydrateCoverImage(viagem, usuarioId);
    return mapViagem(viagem);
};

const obterCotacaoMoeda = async (codigo) => {
    const rate = await awesomeApiProvider.getRateForCode(String(codigo).toUpperCase());
    if (!rate) {
        throw new AppError('Cotação indisponível', 502);
    }
    return rate;
};

module.exports = {
    listarViagens,
    obterViagem,
    obterMediaPassagem,
    listarOrigensViagem,
    listarDestinosViagem,
    obterResumoPagina,
    criarViagem,
    editarViagem,
    excluirViagem,
    criarDespesa,
    editarDespesa,
    excluirDespesa,
    criarObservacao,
    editarObservacao,
    excluirObservacao,
    obterCotacaoMoeda,
    CATEGORIAS_DESPESA,
};
