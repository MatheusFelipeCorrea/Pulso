const AppError = require('./appError');

const MES_QUERY_REGEX = /^\d{4}-\d{2}$/;
const MES_REFERENCIA_REGEX = /^\d{4}-\d{2}-01$/;

const mesAtualString = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const mesReferenciaFromQuery = (mes) => {
    const value = mes || mesAtualString();
    if (!MES_QUERY_REGEX.test(value)) {
        throw new AppError('Formato de mês inválido. Use YYYY-MM', 400);
    }
    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1, 1);
};

const mesReferenciaFromBody = (mesReferencia) => {
    if (!mesReferencia || !MES_REFERENCIA_REGEX.test(mesReferencia)) {
        throw new AppError('Formato de mês inválido. Use YYYY-MM-01', 400);
    }
    const [year, month] = mesReferencia.split('-').map(Number);
    return new Date(year, month - 1, 1);
};

const mesReferenciaToQuery = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const intervaloDoMes = (mesReferencia) => {
    const inicio = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth(), 1);
    const fim = new Date(
        mesReferencia.getFullYear(),
        mesReferencia.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );
    return { inicio, fim };
};

const mesAnterior = (mesReferencia) =>
    new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() - 1, 1);

const mesReferenciaIso = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
};

module.exports = {
    mesAtualString,
    mesReferenciaFromQuery,
    mesReferenciaFromBody,
    mesReferenciaToQuery,
    intervaloDoMes,
    mesAnterior,
    mesReferenciaIso,
};
