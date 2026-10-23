const AppError = require('../utils/appError');
const {
    parseBrazilianNumber,
    parseFlexibleDate,
    inferTipoFromValor,
    normalizeDescricao,
    detectDelimiter,
    splitCsvLine,
    resolveColumnIndex,
} = require('./importParseUtils');

const parseCsvRows = (rows, mapping = {}) => {
    if (!rows.length) {
        throw new AppError('Arquivo CSV vazio', 400);
    }

    const headers = rows[0].map((cell) => String(cell ?? '').trim());
    const dataIdx = resolveColumnIndex(headers, 'data', mapping);
    const valorIdx = resolveColumnIndex(headers, 'valor', mapping);
    const descIdx = resolveColumnIndex(headers, 'descricao', mapping);

    if (dataIdx < 0 || valorIdx < 0 || descIdx < 0) {
        return {
            precisaMapeamento: true,
            colunasDisponiveis: headers,
            amostraLinhas: rows.slice(1, 6),
            parser: 'csv',
            linhas: [],
        };
    }

    const linhas = [];
    for (const row of rows.slice(1)) {
        if (!row || row.every((cell) => !String(cell ?? '').trim())) continue;

        const data = parseFlexibleDate(row[dataIdx]);
        const valorRaw = parseBrazilianNumber(row[valorIdx]);
        if (!data || valorRaw == null || valorRaw === 0) continue;

        linhas.push({
            data: data.toISOString(),
            valor: Math.abs(valorRaw).toFixed(2),
            descricao: normalizeDescricao(row[descIdx]),
            tipo: inferTipoFromValor(valorRaw),
        });
    }

    return { linhas, parser: 'csv', precisaMapeamento: false };
};

const parseCsv = (buffer, mapping = {}) => {
    const raw = buffer.toString('utf8').replace(/^\uFEFF/, '');
    const lines = raw.split(/\r?\n/).filter((line) => line.trim());
    if (!lines.length) {
        throw new AppError('Arquivo CSV vazio', 400);
    }

    const delimiter = detectDelimiter(lines[0]);
    const rows = lines.map((line) => splitCsvLine(line, delimiter));
    return parseCsvRows(rows, mapping);
};

module.exports = { parseCsv, parseCsvRows };
