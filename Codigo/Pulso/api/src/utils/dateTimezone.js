const TIMEZONE = 'America/Sao_Paulo';
const HORA_PADRAO_LEMBRETE = 10;
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

const formatDateOnly = (date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date(date));

/** YYYY-MM-DD já é dia civil em SP — não passar por `new Date('YYYY-MM-DD')` (meia-noite UTC vira dia anterior). */
const toDateOnlyInTimezone = (input) => {
    if (typeof input === 'string' && DATE_ONLY_RE.test(input.trim())) {
        return input.trim();
    }
    return formatDateOnly(input);
};

const parseVencimentoDate = (input) => {
    const dateOnly = toDateOnlyInTimezone(input);
    return new Date(`${dateOnly}T12:00:00.000Z`);
};

const addDays = (date, days) => {
    const dateOnly = toDateOnlyInTimezone(date);
    const [year, month, day] = dateOnly.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0, 0));
    return utc;
};

const startOfDayInTimezone = (date) => {
    const dateOnly = toDateOnlyInTimezone(date);
    return new Date(`${dateOnly}T03:00:00.000Z`);
};

const endOfDayInTimezone = (date) => {
    const dateOnly = toDateOnlyInTimezone(date);
    const [year, month, day] = dateOnly.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59, 999));
};

const todayInTimezone = () => formatDateOnly(new Date());

module.exports = {
    TIMEZONE,
    HORA_PADRAO_LEMBRETE,
    formatDateOnly,
    toDateOnlyInTimezone,
    parseVencimentoDate,
    addDays,
    startOfDayInTimezone,
    endOfDayInTimezone,
    todayInTimezone,
};
