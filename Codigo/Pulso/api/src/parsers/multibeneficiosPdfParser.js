const { parseBrazilianNumber, normalizeDescricao, inferTipoFromDescricaoBeneficio } = require('./importParseUtils');
const { parseVencimentoDate } = require('../utils/dateTimezone');

const pad2 = (value) => String(value).padStart(2, '0');

const MESES = {
    janeiro: 0,
    january: 0,
    fevereiro: 1,
    february: 1,
    marco: 2,
    march: 2,
    março: 2,
    abril: 3,
    april: 3,
    maio: 4,
    may: 4,
    junho: 5,
    june: 5,
    julho: 6,
    july: 6,
    agosto: 7,
    august: 7,
    setembro: 8,
    september: 8,
    outubro: 9,
    october: 9,
    novembro: 10,
    november: 10,
    dezembro: 11,
    december: 11,
};

const SALDO_LABEL_RE =
    /(?:saldo\s+(?:total|dispon[ií]vel|atual|das?\s+carteiras?)|total\s+balance|available\s+balance|wallet\s+balance|balance\s+total|current\s+balance)/i;

const DATE_PT_RE =
    /^(?:Hoje|Today|(?:segunda|ter[cç]a|quarta|quinta|sexta|s[aá]bado|domingo|monday|tuesday|wednesday|thursday|friday|saturday|sunday)[-\w\s]*),?\s*(\d{1,2})\s+([a-zç]+)(?:\s+(?:de\s+)?(\d{4}))?/i;
const DATE_EN_RE = /^(\d{1,2})\s+([a-zç]+)\s+(\d{4})$/i;
const VALUE_INLINE_RE = /R\$?\s*([\d.,]+)\s*$/i;
const SIGNED_VALUE_LINE_RE = /^([+-])\s*R\$?\s*([\d.,]+)\s*$/i;
const UNSIGNED_VALUE_LINE_RE = /^R\$?\s*([\d.,]+)\s*$/i;

const SKIP_RE =
    /^(?:extrato|statement|multibenef|multibenef[ií]cios|multibenefits|pluxee|alelo|sodexo|ticket|atualizado|updated|applied filters|pdf generated|--\s*\d+\s+of\s+\d+\s+--$|\d+\s+days\s*\|)/i;

const CONTEXT_NOISE_RE =
    /^(?:purchase on(?:\s+(?:meal|food|refei|aliment|transport))?|compra no(?:\s+(?:refei|aliment|transporte))?|(?:meal|refei\w*|aliment\w*|food|transport)\s*•|pdf generated|statement updated|applied filters|\d+\s+days|newest first|pluxee|multibenefits?)$/i;

const formatSaldo = (raw) => {
    const saldo = parseBrazilianNumber(raw);
    return saldo != null ? Number(Math.abs(saldo)).toFixed(2) : null;
};

const normalizeMonthKey = (month) =>
    month
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const inferYear = (monthIndex, reference = new Date()) => {
    const year = reference.getFullYear();
    if (monthIndex > reference.getMonth()) {
        return year - 1;
    }
    return year;
};

const buildDateWithYear = (day, monthName, year) => {
    const monthKey = normalizeMonthKey(monthName);
    const monthIndex = MESES[monthKey];
    if (monthIndex == null) return null;

    const dateOnly = `${Number(year)}-${pad2(monthIndex + 1)}-${pad2(Number(day))}`;
    return parseVencimentoDate(dateOnly);
};

const buildDate = (day, monthName, reference = new Date()) => {
    const monthKey = normalizeMonthKey(monthName);
    const monthIndex = MESES[monthKey];
    if (monthIndex == null) return null;

    const year = inferYear(monthIndex, reference);
    return buildDateWithYear(day, monthName, year);
};

const parseDateHeader = (line, reference = new Date()) => {
    const enMatch = line.match(DATE_EN_RE);
    if (enMatch) {
        return buildDateWithYear(enMatch[1], enMatch[2], enMatch[3]);
    }

    const ptMatch = line.match(DATE_PT_RE);
    if (ptMatch) {
        if (ptMatch[3]) {
            return buildDateWithYear(ptMatch[1], ptMatch[2], ptMatch[3]);
        }
        return buildDate(ptMatch[1], ptMatch[2], reference);
    }

    return null;
};

const isMultibeneficiosStatement = (text) =>
    /multibenef|pluxee|alelo|sodexo|ticket|vale[\s-]?refei|total balance|saldo total|disponibilizacao de valor|purchase on meal|compra no refei/i.test(
        text
    );

const isSaldoHeaderLine = (line) => SALDO_LABEL_RE.test(line);

const isTransactionValueLine = (line) =>
    SIGNED_VALUE_LINE_RE.test(line) ||
    (UNSIGNED_VALUE_LINE_RE.test(line) && !isSaldoHeaderLine(line));

const pickDescricao = (contextLines) => {
    const candidates = contextLines.filter(
        (line) =>
            !CONTEXT_NOISE_RE.test(line) &&
            !/^\d{1,2}:\d{2}/.test(line) &&
            !/•\s*\d{1,2}:\d{2}/.test(line) &&
            !parseDateHeader(line) &&
            !isTransactionValueLine(line)
    );

    return candidates.at(-1) || candidates[0] || 'Transação benefício';
};

const extractSaldoExtratoFromText = (text) => {
    if (!text) {
        return null;
    }

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const scanLimit = Math.min(lines.length, 30);

    for (let index = 0; index < scanLimit; index += 1) {
        const line = lines[index];
        if (!isSaldoHeaderLine(line)) {
            continue;
        }

        const inline = line.match(/R\$?\s*([\d.,]+)/i);
        if (inline && !/^[+-]/.test(line)) {
            return formatSaldo(inline[1]);
        }

        for (let offset = 1; offset <= 3 && index + offset < lines.length; offset += 1) {
            const nextLine = lines[index + offset];
            if (SIGNED_VALUE_LINE_RE.test(nextLine) || /^[+-]/.test(nextLine)) {
                continue;
            }

            const money = nextLine.match(/^R\$?\s*([\d.,]+)\s*$/i);
            if (money) {
                return formatSaldo(money[1]);
            }
        }
    }

    return null;
};

const parseMultibeneficiosText = (text, reference = new Date()) => {
    if (!isMultibeneficiosStatement(text)) {
        return null;
    }

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    let currentDate = null;
    let contextLines = [];
    let saldoExtrato = extractSaldoExtratoFromText(text);
    const linhas = [];

    const pushTransaction = (descricaoRaw, valorInput, tipoHint, signedTipo = null) => {
        if (!currentDate) return;

        const valor = parseBrazilianNumber(valorInput);
        if (valor == null || valor === 0) return;

        const descricao = normalizeDescricao(descricaoRaw);
        let tipo = signedTipo;
        if (!tipo) {
            if (valor < 0) {
                tipo = 'DESPESA';
            } else {
                tipo = inferTipoFromDescricaoBeneficio(descricao, tipoHint);
            }
        }

        linhas.push({
            data: currentDate.toISOString(),
            valor: Math.abs(valor).toFixed(2),
            descricao,
            tipo,
        });
    };

    for (const line of lines) {
        if (isSaldoHeaderLine(line)) {
            contextLines = [];
            continue;
        }

        if (SKIP_RE.test(line) && !isTransactionValueLine(line)) {
            continue;
        }

        const parsedDate = parseDateHeader(line, reference);
        if (parsedDate) {
            currentDate = parsedDate;
            contextLines = [];
            continue;
        }

        const signedMatch = line.match(SIGNED_VALUE_LINE_RE);
        if (signedMatch) {
            const signedTipo = signedMatch[1] === '+' ? 'RECEITA' : 'DESPESA';
            pushTransaction(
                pickDescricao(contextLines),
                `${signedMatch[1]}${signedMatch[2]}`,
                contextLines.join(' '),
                signedTipo
            );
            contextLines = [];
            continue;
        }

        const unsignedLineMatch = line.match(UNSIGNED_VALUE_LINE_RE);
        if (unsignedLineMatch && !isSaldoHeaderLine(line)) {
            pushTransaction(
                pickDescricao(contextLines),
                unsignedLineMatch[1],
                contextLines.join(' ')
            );
            contextLines = [];
            continue;
        }

        const inlineValueMatch = line.match(VALUE_INLINE_RE);
        if (inlineValueMatch) {
            const descricaoRaw = line.replace(VALUE_INLINE_RE, '').trim();
            pushTransaction(
                descricaoRaw || pickDescricao(contextLines),
                inlineValueMatch[1],
                [...contextLines, descricaoRaw].join(' ')
            );
            contextLines = [];
            continue;
        }

        contextLines.push(line);
        if (contextLines.length > 4) {
            contextLines.shift();
        }
    }

    if (!linhas.length) {
        return saldoExtrato ? { linhas: [], parser: 'pdf-beneficio', saldoExtrato } : null;
    }

    return {
        linhas,
        parser: 'pdf-beneficio',
        saldoExtrato,
    };
};

module.exports = {
    isMultibeneficiosStatement,
    extractSaldoExtratoFromText,
    parseMultibeneficiosText,
};
