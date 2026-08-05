const AppError = require('../utils/appError');
const awesomeApiProvider = require('../providers/awesomeApiProvider');
const moedaFavoritaRepository = require('../repositories/moedaFavoritaRepository');
const {
    DEFAULT_FAVORITES,
    ensureCatalog,
    getSupportedCurrencies,
    isSupportedCurrency,
    getCurrency,
} = require('../constants/currencyCatalog');

const MAX_FAVORITES = 8;

const normalizeCodigos = (codigos) => {
    if (!codigos) return [];
    if (Array.isArray(codigos)) return codigos;
    if (typeof codigos === 'string') {
        return codigos
            .split(',')
            .map((code) => code.trim())
            .filter(Boolean);
    }
    return [];
};

const mapCurrencyRate = (code, rate) => {
    const currency = getCurrency(code);
    if (!currency || !rate) return null;

    return {
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        bid: Number(rate.bid),
        pctChange: Number(rate.pctChange) || 0,
        updatedAt: rate.updatedAt,
    };
};

const listarCotacoes = async (codigos = []) => {
    await ensureCatalog();

    const codes = normalizeCodigos(codigos);
    const requested = codes.length
        ? codes.map((code) => String(code).toUpperCase()).filter(isSupportedCurrency)
        : (await getSupportedCurrencies()).map((item) => item.code).filter((code) => code !== 'BRL');

    let rates = {};
    try {
        rates = await awesomeApiProvider.getRatesForCodes(requested);
    } catch (error) {
        console.warn('[moedaService] falha ao obter cotações:', error.message);
        throw new AppError('Não foi possível obter a cotação no momento', 502);
    }

    const atualizadoEm = new Date().toISOString();

    const cotacoes = requested
        .map((code) => mapCurrencyRate(code, rates[code]))
        .filter(Boolean);

    return { cotacoes, atualizadoEm };
};

const converter = async ({ valor, de, para }) => {
    await ensureCatalog();

    const amount = Number(valor);
    const from = String(de ?? 'BRL').toUpperCase();
    const to = String(para ?? 'USD').toUpperCase();

    if (!Number.isFinite(amount) || amount < 0) {
        throw new AppError('Informe um valor válido para conversão', 400);
    }
    if (!isSupportedCurrency(from) || !isSupportedCurrency(to)) {
        throw new AppError('Moeda não suportada', 400);
    }
    if (from === to) {
        return {
            de: from,
            para: to,
            valorOrigem: amount.toFixed(2),
            valorConvertido: amount.toFixed(2),
            taxa: '1.0000',
            atualizadoEm: new Date().toISOString(),
        };
    }

    const rates = await awesomeApiProvider.getRatesForCodes([from, to]);
    const rateFrom = rates[from];
    const rateTo = rates[to];

    if (!rateFrom || !rateTo) {
        throw new AppError('Não foi possível obter a cotação no momento', 502);
    }

    const valorEmBrl = from === 'BRL' ? amount : amount * rateFrom.bid;
    const valorConvertido = to === 'BRL' ? valorEmBrl : valorEmBrl / rateTo.bid;
    const taxa = to === 'BRL' ? rateFrom.bid : rateFrom.bid / rateTo.bid;

    return {
        de: from,
        para: to,
        valorOrigem: amount.toFixed(2),
        valorConvertido: valorConvertido.toFixed(2),
        taxa: taxa.toFixed(4),
        atualizadoEm: rateTo.updatedAt ?? rateFrom.updatedAt,
    };
};

const obterHistorico = async (codigo, dias = 30) => {
    await ensureCatalog();

    const code = String(codigo ?? 'USD').toUpperCase();
    const currency = getCurrency(code);

    if (!currency || code === 'BRL') {
        throw new AppError('Histórico disponível apenas para moedas estrangeiras', 400);
    }

    const points = await awesomeApiProvider.fetchHistoryForCurrency(code, dias);
    if (!points.length) {
        throw new AppError('Histórico indisponível no momento', 502);
    }

    const liveRate = await awesomeApiProvider.getRateForCode(code);
    const today = new Date().toISOString().slice(0, 10);
    if (liveRate?.bid) {
        const lastPoint = points[points.length - 1];
        if (lastPoint?.date === today) {
            points[points.length - 1] = { ...lastPoint, bid: liveRate.bid, ask: liveRate.ask ?? liveRate.bid };
        } else {
            points.push({
                date: today,
                bid: liveRate.bid,
                ask: liveRate.ask ?? liveRate.bid,
            });
        }
    }

    const bids = points.map((item) => item.bid);
    const atual = liveRate?.bid ?? bids[bids.length - 1];
    const minima = Math.min(...bids);
    const maxima = Math.max(...bids);
    const primeira = bids[0];
    const variacao = primeira > 0 ? ((atual - primeira) / primeira) * 100 : 0;

    return {
        codigo: code,
        dias: Number(dias) || 30,
        pontos: points,
        resumo: {
            atual: atual.toFixed(4),
            minima: minima.toFixed(4),
            maxima: maxima.toFixed(4),
            variacao: variacao.toFixed(2),
        },
        atualizadoEm: liveRate?.updatedAt ?? new Date().toISOString(),
    };
};

const listarFavoritas = async (usuarioId) => {
    let favoritas = [];
    try {
        favoritas = await moedaFavoritaRepository.listarPorUsuario(usuarioId);
    } catch (error) {
        console.warn('[moedaService] falha ao listar favoritas:', error.message);
        throw new AppError('Não foi possível carregar moedas favoritas', 502);
    }

    const codigos = favoritas.map((item) => item.codigo);
    const { cotacoes, atualizadoEm } = await listarCotacoes(codigos);

    return {
        favoritas: cotacoes,
        atualizadoEm,
    };
};

const adicionarFavorita = async (usuarioId, codigo) => {
    await ensureCatalog();

    const normalized = String(codigo ?? '').toUpperCase();
    if (!isSupportedCurrency(normalized)) {
        throw new AppError('Moeda inválida para favoritos', 400);
    }

    const total = await moedaFavoritaRepository.contarPorUsuario(usuarioId);
    if (total >= MAX_FAVORITES) {
        throw new AppError(`Limite de ${MAX_FAVORITES} moedas favoritas atingido`, 400);
    }

    try {
        await moedaFavoritaRepository.criar(usuarioId, normalized);
    } catch (error) {
        if (error.code === 'P2002') {
            throw new AppError('Moeda já está nos favoritos', 409);
        }
        throw error;
    }

    return listarFavoritas(usuarioId);
};

const removerFavorita = async (usuarioId, codigo) => {
    const normalized = String(codigo ?? '').toUpperCase();
    await moedaFavoritaRepository.excluir(usuarioId, normalized);
    return listarFavoritas(usuarioId);
};

const garantirFavoritasPadrao = async (usuarioId) => {
    await ensureCatalog();

    const existentes = await moedaFavoritaRepository.listarPorUsuario(usuarioId);
    if (existentes.length > 0) return listarFavoritas(usuarioId);

    for (const code of DEFAULT_FAVORITES) {
        try {
            await moedaFavoritaRepository.criar(usuarioId, code);
        } catch {
            // ignora duplicatas em corrida
        }
    }

    return listarFavoritas(usuarioId);
};

const obterCatalogo = async () => ({
    moedas: await getSupportedCurrencies(),
});

module.exports = {
    listarCotacoes,
    converter,
    obterHistorico,
    listarFavoritas,
    adicionarFavorita,
    removerFavorita,
    garantirFavoritasPadrao,
    obterCatalogo,
};
