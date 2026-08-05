const AppError = require('../utils/appError');
const { parseOfx } = require('./ofxParser');
const { parseCsv } = require('./csvParser');
const { parseXlsx } = require('./xlsxParser');
const { parsePdf } = require('./pdfParser');

const EXTENSION_PARSERS = {
    ofx: parseOfx,
    csv: parseCsv,
    txt: parseCsv,
    xlsx: parseXlsx,
    xls: parseXlsx,
    pdf: parsePdf,
};

const parseStatementFile = async ({ buffer, filename, mapeamento = {} }) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const parser = EXTENSION_PARSERS[ext];
    if (!parser) {
        throw new AppError(`Formato .${ext} não suportado`, 400);
    }

    const result = await parser(buffer, mapeamento);
    if (result.precisaMapeamento) {
        return result;
    }

    if (!result.linhas?.length) {
        if (result.saldoExtrato != null && result.saldoExtrato !== '') {
            return { ...result, linhas: [] };
        }
        throw new AppError('Nenhuma transação encontrada no arquivo', 422);
    }

    return result;
};

module.exports = { parseStatementFile };
