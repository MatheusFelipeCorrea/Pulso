const AppError = require('../utils/appError');
const amadeusProvider = require('../providers/amadeusProvider');
const { DEFAULT_ORIGIN, resolveDestinationAirport } = require('../constants/tripDestinationAirports');

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

const obterMediaPassagem = async ({ destino, dataPrevista }) => {
    const destination = resolveDestinationAirport(destino);
    if (!destination) {
        return {
            disponivel: false,
            mensagem: 'Ainda não temos estimativa de passagens para este destino.',
        };
    }

    const { departureDate, returnDate } = buildTravelDates(dataPrevista);
    let valorMedioBrl = destination.fallbackBrl;
    let fonte = 'estimativa';

    if (amadeusProvider.hasCredentials()) {
        try {
            const liveAverage = await amadeusProvider.fetchAverageRoundTripPrice({
                origin: DEFAULT_ORIGIN.code,
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

    const tipoViagem = destination.domestic ? 'doméstica' : 'internacional';

    return {
        disponivel: true,
        destino: destination.label,
        origem: DEFAULT_ORIGIN.label,
        aeroportoOrigem: DEFAULT_ORIGIN.code,
        aeroportoDestino: destination.iata,
        valorMedioBrl,
        moeda: 'BRL',
        fonte,
        tipoViagem,
        idaVolta: true,
        atualizadoEm: new Date().toISOString(),
        mensagem: `Valor médio de passagem aérea ${tipoViagem} ida e volta saindo de ${DEFAULT_ORIGIN.label} para ${destination.label}.`,
    };
};

const obterMediaPassagemPorViagem = async (viagem) => {
    if (!viagem?.destino) {
        throw new AppError('Viagem inválida', 400);
    }

    return obterMediaPassagem({
        destino: viagem.destino,
        dataPrevista: viagem.dataPrevista,
    });
};

module.exports = {
    obterMediaPassagem,
    obterMediaPassagemPorViagem,
};
