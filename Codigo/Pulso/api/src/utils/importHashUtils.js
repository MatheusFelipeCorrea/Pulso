const crypto = require('crypto');
const { normalize } = require('./recursoCategoriaRules');

const formatDateKey = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const buildImportHash = (data, valor, descricao) => {
    const dateKey = formatDateKey(data);
    const amount = Math.abs(Number(valor)).toFixed(2);
    const desc = normalize(descricao ?? '').slice(0, 120);
    return crypto.createHash('sha256').update(`${dateKey}|${amount}|${desc}`).digest('hex');
};

module.exports = { formatDateKey, buildImportHash };
