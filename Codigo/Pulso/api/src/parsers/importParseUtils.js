const parseBrazilianNumber = (raw) => {
    if (raw == null || raw === '') return null;
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;

    let text = String(raw).trim();
    if (!text) return null;

    text = text.replace(/\s/g, '').replace(/^R\$/i, '');
    const negative = text.startsWith('-') || text.startsWith('(');
    text = text.replace(/[()]/g, '').replace(/^-/, '');

    if (text.includes(',') && text.includes('.')) {
        text = text.replace(/\./g, '').replace(',', '.');
    } else if (text.includes(',')) {
        text = text.replace(',', '.');
    }

    const value = Number.parseFloat(text);
    if (!Number.isFinite(value)) return null;
    return negative ? -Math.abs(value) : value;
};

const parseFlexibleDate = (raw) => {
    if (raw == null || raw === '') return null;
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;

    if (typeof raw === 'number' && raw > 25569) {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const date = new Date(excelEpoch.getTime() + raw * 86400000);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const text = String(raw).trim();
    if (!text) return null;

    const br = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
    if (br) {
        const day = Number(br[1]);
        const month = Number(br[2]);
        let year = Number(br[3]);
        if (year < 100) year += 2000;
        const date = new Date(year, month - 1, day, 12, 0, 0, 0);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const iso = text.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (iso) {
        const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 12, 0, 0, 0);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const ofx = text.match(/^(\d{4})(\d{2})(\d{2})/);
    if (ofx) {
        const date = new Date(Number(ofx[1]), Number(ofx[2]) - 1, Number(ofx[3]), 12, 0, 0, 0);
        if (!Number.isNaN(date.getTime())) return date;
    }

    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    return null;
};

const inferTipoFromValor = (valor) => (Number(valor) >= 0 ? 'RECEITA' : 'DESPESA');

const RECEITA_BENEFICIO_RE =
    /disponibiliz|saldo liberado|liberado|liberacao|liberação|credito|crédito|credit|recarga|carga|deposito|depósito|estorno|transferencia recebida|transferência recebida|top[\s-]?up|beneficio|benefício/i;
const DESPESA_BENEFICIO_RE = /compra|purchase|pagamento|debito|débito|saque/i;

/** Classifica créditos vs compras em extratos VA/VR/VT (Multibenefícios, Alelo, etc.) */
const inferTipoFromDescricaoBeneficio = (descricao, contexto = '') => {
    const texto = `${contexto} ${descricao}`.toLowerCase();

    if (RECEITA_BENEFICIO_RE.test(texto)) {
        return 'RECEITA';
    }
    if (DESPESA_BENEFICIO_RE.test(texto)) {
        return 'DESPESA';
    }

    if (/compra|purchase/i.test(texto)) {
        return 'DESPESA';
    }

    return 'RECEITA';
};

const normalizeDescricao = (value) => {
    const text = String(value ?? '').trim().replace(/\s+/g, ' ');
    return text.slice(0, 255) || 'Importação';
};

const detectDelimiter = (line) => {
    const semicolon = (line.match(/;/g) || []).length;
    const comma = (line.match(/,/g) || []).length;
    if (semicolon > comma) return ';';
    return ',';
};

const splitCsvLine = (line, delimiter) => {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === delimiter && !inQuotes) {
            cells.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }
    cells.push(current.trim());
    return cells;
};

const HEADER_ALIASES = {
    data: ['data', 'date', 'dt', 'data lancamento', 'data lançamento', 'data movimento'],
    valor: ['valor', 'amount', 'vlr', 'value', 'quantia', 'montante'],
    descricao: ['descricao', 'descrição', 'description', 'historico', 'histórico', 'memo', 'lancamento', 'lançamento', 'detalhe'],
};

const normalizeHeader = (header) =>
    String(header ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const resolveColumnIndex = (headers, field, mapping = {}) => {
    if (mapping[field]) {
        const idx = headers.findIndex((h) => normalizeHeader(h) === normalizeHeader(mapping[field]));
        if (idx >= 0) return idx;
    }
    for (const alias of HEADER_ALIASES[field]) {
        const idx = headers.findIndex((h) => normalizeHeader(h) === alias);
        if (idx >= 0) return idx;
    }
    return -1;
};

module.exports = {
    parseBrazilianNumber,
    parseFlexibleDate,
    inferTipoFromValor,
    inferTipoFromDescricaoBeneficio,
    normalizeDescricao,
    detectDelimiter,
    splitCsvLine,
    resolveColumnIndex,
    HEADER_ALIASES,
    normalizeHeader,
};
