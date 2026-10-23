const XLSX = require('xlsx');
const { parseCsvRows } = require('./csvParser');

const parseXlsx = (buffer, mapping = {}) => {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    return parseCsvRows(rows, mapping);
};

module.exports = { parseXlsx };
