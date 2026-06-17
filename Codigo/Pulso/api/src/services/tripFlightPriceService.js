const AppError = require('../utils/appError');
const duffelProvider = require('../providers/duffelProvider');
const amadeusProvider = require('../providers/amadeusProvider');
const { resolveTripOrigin } = require('../constants/tripOrigins');
const { getFlightFallback } = require('../constants/tripTransportRoutes');
const { getHubByIata } = require('../constants/tripAirportHubs');
const {
    resolveDestinationAirport,
    buildBusInsight,
    buildTrainInsight,
} = require('../constants/tripDestinationAirports');
const {
    getSeasonalAdjustment,
    applySeasonalPrice,
} = require('../constants/tripSeasonalPricing');

const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const formatIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const normalizeLabel = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const buildHubReferencia = (destination) => {
    const hub = getHubByIata(destination.iata);
    const hubLabel = hub?.label ?? destination.iata;

    if (normalizeLabel(destination.label) === normalizeLabel(hubLabel)) {
        return null;
    }

    return {
        destino: destination.label,
        hub: hubLabel,
        iata: destination.iata,
    };
};

const buildTravelDates = (dataPrevista) => {
    const base = dataPrevista ? new Date(dataPrevista) : addDays(new Date(), 45);
    const safeBase = Number.isNaN(base.getTime()) ? addDays(new Date(), 45) : base;
    const departure = addDays(safeBase, 0);
    const returning = addDays(departure, 7);
    return {
        departureDate: formatIsoDate(departure),
        returnDate: formatIsoDate(returning),
    };
};

const obterMediaPassagem = async ({ destino, destinoMeta, dataPrevista, origemId }) => {
    const origin = resolveTripOrigin(origemId);
    const destination = resolveDestinationAirport(destino, destinoMeta);

    if (!destination) {
        return {
            disponivel: false,
            mensagem: 'Ainda não temos estimativa de passagens para este destino.',
            origemId: origin.id,
            origem: origin.label,
            onibus: { disponivel: false },
            trem: { disponivel: false, destino: null },
        };
    }

    const { departureDate, returnDate } = buildTravelDates(dataPrevista);
    const departure = new Date(departureDate);
    const returning = new Date(returnDate);
    const domestic = Boolean(destination.domestic);

    let valorMedioBrl = getFlightFallback(origin, destination);
    let fonte = 'estimativa';

    if (duffelProvider.hasCredentials()) {
        try {
            const liveAverage = await duffelProvider.fetchAverageRoundTripPrice({
                origin: origin.code,
                destination: destination.iata,
                departureDate,
                returnDate,
            });
            if (liveAverage) {
                valorMedioBrl = liveAverage;
                fonte = 'duffel';
            }
        } catch {
            // mantém estimativa regional
        }
    }

    if (fonte === 'estimativa' && amadeusProvider.hasCredentials()) {
        try {
            const liveAverage = await amadeusProvider.fetchAverageRoundTripPrice({
                origin: origin.code,
                destination: destination.iata,
                departureDate,
                returnDate,
            });
            if (liveAverage) {
                valorMedioBrl = liveAverage;
                fonte = 'amadeus';
            }
        } catch {
            // mantém estimativa regional
        }
    }

    const flightSeason =
        fonte === 'estimativa'
            ? getSeasonalAdjustment({
                  departureDate: departure,
                  returnDate: returning,
                  mode: 'flight',
                  domestic,
              })
            : { fator: 1, periodo: null, tendencia: 'neutra' };

    if (fonte === 'estimativa') {
        valorMedioBrl = applySeasonalPrice(valorMedioBrl, flightSeason);
    }

    const tipoViagem = domestic ? 'doméstica' : 'internacional';
    const baseFlightMessage = `Saindo de ${origin.label} · ida e volta`;
    const hubReferencia = buildHubReferencia(destination);

    return {
        disponivel: true,
        destino: destination.label,
        origemId: origin.id,
        origem: origin.label,
        origemCidade: origin.cidade,
        aeroportoOrigem: origin.code,
        aeroportoDestino: destination.iata,
        hubReferencia,
        valorMedioBrl,
        moeda: 'BRL',
        fonte,
        tipoViagem,
        idaVolta: true,
        atualizadoEm: new Date().toISOString(),
        ajusteSazonal: flightSeason.periodo ? flightSeason : null,
        mensagem: baseFlightMessage,
        onibus: buildBusInsight(destination, origin, {
            departureDate: departure,
            returnDate: returning,
        }),
        trem: buildTrainInsight(destination, origin, {
            departureDate: departure,
            returnDate: returning,
        }),
    };
};

const obterMediaPassagemPorViagem = async (viagem, origemId) => {
    if (!viagem?.destino) {
        throw new AppError('Viagem inválida', 400);
    }

    return obterMediaPassagem({
        destino: viagem.destino,
        destinoMeta: viagem.destinoMeta,
        dataPrevista: viagem.dataPrevista,
        origemId,
    });
};

module.exports = {
    obterMediaPassagem,
    obterMediaPassagemPorViagem,
};
