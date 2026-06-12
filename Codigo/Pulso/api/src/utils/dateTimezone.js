const TIMEZONE = 'America/Sao_Paulo';
const HORA_PADRAO_LEMBRETE = 10;

const formatDateOnly = (date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date(date));

const parseVencimentoDate = (input) => {
    const dateOnly = formatDateOnly(input);
    return new Date(`${dateOnly}T12:00:00.000Z`);
};

const addDays = (date, days) => {
    const dateOnly = formatDateOnly(date);
    const [year, month, day] = dateOnly.split('-').map(Number);
    const utc = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0, 0));
    return utc;
};

const startOfDayInTimezone = (date) => {
    const dateOnly = formatDateOnly(date);
    return new Date(`${dateOnly}T03:00:00.000Z`);
};

const endOfDayInTimezone = (date) => {
    const dateOnly = formatDateOnly(date);
    const nextDay = addDays(dateOnly, 1);
    const [year, month, day] = formatDateOnly(nextDay).split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 2, 59, 59, 999));
};

const todayInTimezone = () => formatDateOnly(new Date());

module.exports = {
    TIMEZONE,
    HORA_PADRAO_LEMBRETE,
    formatDateOnly,
    parseVencimentoDate,
    addDays,
    startOfDayInTimezone,
    endOfDayInTimezone,
    todayInTimezone,
};
