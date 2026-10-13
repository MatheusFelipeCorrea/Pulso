const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatUntilDate = (date) => {
    const d = startOfDay(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
};

/** Último dia de ocorrência = dia anterior ao corte (série encerra antes do corte). */
const calcularUntilAPartirDoCorte = (dataCorte) => {
    const cutoff = startOfDay(dataCorte);
    const until = new Date(cutoff);
    until.setDate(until.getDate() - 1);
    return until;
};

const aplicarUntilNaRegra = (regra, untilDate) => {
    const base = String(regra ?? '').trim();
    const untilToken = `UNTIL=${formatUntilDate(untilDate)}`;

    if (!base) {
        return untilToken;
    }

    if (base.includes('UNTIL=')) {
        return base.replace(/UNTIL=\d{8}/, untilToken);
    }

    return `${base};${untilToken}`;
};

module.exports = {
    startOfDay,
    formatUntilDate,
    calcularUntilAPartirDoCorte,
    aplicarUntilNaRegra,
};
