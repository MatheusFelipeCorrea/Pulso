const MODES = ['flight', 'bus', 'train'];

const FIXED_WINDOWS = [
    {
        id: 'black_friday',
        label: 'Black Friday',
        tendencia: 'baixa',
        match: { month: 11, dayFrom: 20, dayTo: 30 },
        factors: { flight: 0.9, bus: 0.95, train: 0.95 },
    },
    {
        id: 'reveillon',
        label: 'Réveillon e Ano Novo',
        tendencia: 'alta',
        match: { month: 12, dayFrom: 27, dayTo: 31 },
        factors: { flight: 1.4, bus: 1.3, train: 1.25 },
    },
    {
        id: 'january_holidays',
        label: 'Férias de janeiro',
        tendencia: 'alta',
        match: { month: 1, dayFrom: 1, dayTo: 31 },
        factors: { flight: 1.28, bus: 1.22, train: 1.15 },
    },
    {
        id: 'summer_holidays',
        label: 'Férias escolares de verão',
        tendencia: 'alta',
        match: { month: 12, dayFrom: 15, dayTo: 26 },
        factors: { flight: 1.22, bus: 1.18, train: 1.12 },
    },
    {
        id: 'july_holidays',
        label: 'Férias escolares de julho',
        tendencia: 'alta',
        match: { month: 7, dayFrom: 1, dayTo: 31 },
        factors: { flight: 1.2, bus: 1.16, train: 1.1 },
    },
    {
        id: 'low_season_may',
        label: 'Baixa temporada (maio)',
        tendencia: 'baixa',
        match: { month: 5, dayFrom: 1, dayTo: 31 },
        factors: { flight: 0.93, bus: 0.96, train: 0.96 },
    },
    {
        id: 'low_season_aug_sep',
        label: 'Baixa temporada (ago/set)',
        tendencia: 'baixa',
        match: [{ month: 8, dayFrom: 10, dayTo: 31 }, { month: 9, dayFrom: 1, dayTo: 30 }],
        factors: { flight: 0.92, bus: 0.95, train: 0.95 },
    },
];

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function startOfDay(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
}

function getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function getMovableWindows(year) {
    const easter = getEasterSunday(year);
    const carnavalTuesday = addDays(easter, -47);

    return [
        {
            id: 'carnaval',
            label: 'Carnaval',
            tendencia: 'alta',
            start: startOfDay(addDays(carnavalTuesday, -5)),
            end: startOfDay(addDays(carnavalTuesday, 1)),
            factors: { flight: 1.32, bus: 1.24, train: 1.15 },
        },
        {
            id: 'pascoa',
            label: 'Semana Santa',
            tendencia: 'alta',
            start: startOfDay(addDays(easter, -4)),
            end: startOfDay(addDays(easter, 1)),
            factors: { flight: 1.16, bus: 1.12, train: 1.08 },
        },
    ];
}

function matchesFixedWindow(date, window) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const ranges = Array.isArray(window.match) ? window.match : [window.match];

    return ranges.some((range) => {
        if (range.month !== month) return false;
        return day >= range.dayFrom && day <= range.dayTo;
    });
}

function dateInRange(date, start, end) {
    const value = startOfDay(date).getTime();
    return value >= start.getTime() && value <= end.getTime();
}

function tripTouchesWindow(departureDate, returnDate, window) {
    let current = startOfDay(departureDate);
    const end = startOfDay(returnDate);

    while (current.getTime() <= end.getTime()) {
        if (window.start && window.end) {
            if (dateInRange(current, window.start, window.end)) return true;
        } else if (matchesFixedWindow(current, window)) {
            return true;
        }
        current = addDays(current, 1);
    }

    return false;
}

function collectMatchingWindows(departureDate, returnDate) {
    const departure = startOfDay(departureDate);
    const returning = startOfDay(returnDate);
    const years = new Set([departure.getFullYear(), returning.getFullYear()]);
    const matches = [];

    for (const window of FIXED_WINDOWS) {
        if (tripTouchesWindow(departure, returning, window)) {
            matches.push(window);
        }
    }

    for (const year of years) {
        for (const window of getMovableWindows(year)) {
            if (tripTouchesWindow(departure, returning, window)) {
                matches.push(window);
            }
        }
    }

    return matches;
}

function getInternationalSummerBump(departureDate, returnDate) {
    const months = new Set();
    let current = startOfDay(departureDate);
    const end = startOfDay(returnDate);

    while (current.getTime() <= end.getTime()) {
        months.add(current.getMonth() + 1);
        current = addDays(current, 1);
    }

    const hitsEuropeanSummer = [6, 7, 8].some((month) => months.has(month));
    if (!hitsEuropeanSummer) return null;

    return {
        id: 'international_summer',
        label: 'Alta temporada internacional (verão europeu)',
        tendencia: 'alta',
        factors: { flight: 1.1, bus: 1, train: 1 },
    };
}

/**
 * Ajusta estimativas conforme a data da viagem (férias, Black Friday, etc.).
 * Não substitui cotação ao vivo — só enriquece estimativas regionais.
 */
function getSeasonalAdjustment({ departureDate, returnDate, mode = 'flight', domestic = true }) {
    if (!MODES.includes(mode)) {
        throw new Error(`Modo sazonal inválido: ${mode}`);
    }

    const departure = departureDate ? startOfDay(departureDate) : null;
    const returning = returnDate ? startOfDay(returnDate) : null;

    if (!departure || Number.isNaN(departure.getTime())) {
        return { fator: 1, periodo: null, tendencia: 'neutra' };
    }

    const safeReturn = returning && !Number.isNaN(returning.getTime()) ? returning : departure;
    const matches = collectMatchingWindows(departure, safeReturn);

    if (!domestic) {
        const internationalBump = getInternationalSummerBump(departure, safeReturn);
        if (internationalBump) matches.push(internationalBump);
    }

    if (!matches.length) {
        return { fator: 1, periodo: null, tendencia: 'neutra' };
    }

    const highs = matches.filter((item) => item.tendencia === 'alta');
    const lows = matches.filter((item) => item.tendencia === 'baixa');

    if (highs.length) {
        const winner = highs.reduce((best, current) => {
            const currentFactor = current.factors[mode] ?? 1;
            const bestFactor = best.factors[mode] ?? 1;
            return currentFactor > bestFactor ? current : best;
        });

        return {
            fator: winner.factors[mode] ?? 1,
            periodo: winner.label,
            tendencia: 'alta',
        };
    }

    const winner = lows.reduce((best, current) => {
        const currentFactor = current.factors[mode] ?? 1;
        const bestFactor = best.factors[mode] ?? 1;
        return currentFactor < bestFactor ? current : best;
    });

    return {
        fator: winner.factors[mode] ?? 1,
        periodo: winner.label,
        tendencia: 'baixa',
    };
}

function applySeasonalPrice(baseAmount, adjustment) {
    const base = Number(baseAmount);
    const factor = Number(adjustment?.fator ?? 1);

    if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(factor) || factor === 1) {
        return base;
    }

    return Math.round(base * factor);
}

function buildSeasonalMessage(baseMessage, adjustment) {
    if (!adjustment?.periodo || adjustment.fator === 1) {
        return baseMessage;
    }

    const pct = Math.round(Math.abs(adjustment.fator - 1) * 100);
    const direction = adjustment.tendencia === 'baixa' ? 'abaixo' : 'acima';
    return `${baseMessage} Ajuste sazonal para ${adjustment.periodo} (~${pct}% ${direction} da média anual).`;
}

module.exports = {
    getSeasonalAdjustment,
    applySeasonalPrice,
    buildSeasonalMessage,
};
