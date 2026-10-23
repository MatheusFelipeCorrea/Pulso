const { parseBrazilianNumber, normalizeDescricao } = require('./importParseUtils');
const { parseVencimentoDate } = require('../utils/dateTimezone');

const MESES = {
    janeiro: 0,
    fevereiro: 1,
    marco: 2,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11,
};

const SALDO_CONTA_LABEL_RE = /saldo final do per[ií]odo|saldo final/i;
const DATE_CONTA_RE = /^(\d{1,2})\s+de\s+([a-zç]+)\s+(\d{4})$/i;
const SIGNED_VALUE_LINE_RE = /^([+\u2212-])\s*R\$?\s*([\d.,]+)\s*$/i;
const TIME_LINE_RE = /^\d{1,2}:\d{2}$/;
const UNSIGNED_MONEY_RE = /^R\$?\s*([\d.,]+)\s*$/;
const TIPO_TRANSACAO_RE =
    /^(pix recebido|pix enviado|compra realizada|pagamento realizado|rendimento recebido)$/i;
const SKIP_RE =
    /^(?:extrato de conta|per[ií]odo|hora|tipo|valor|origem|forma de pagamento|documento emitido|d[uú]vidas|com saldo|saldo ao final do dia|\d+\s+de\s+\d+|todos os dias|\d+\s+de\s+\d+\s*$|\d+\s+of\s+\d+|$)/i;

const RECEITA_CONTA_RE = /pix recebido|rendimento|transfer[eê]ncia recebida|dep[oó]sito|cr[eé]dito/i;
const DESPESA_CONTA_RE = /pix enviado|compra realizada|pagamento realizado|pagamento|compra|d[eé]bito|saque/i;

const normalizeMonthKey = (month) =>
    month
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const pad2 = (value) => String(value).padStart(2, '0');

const buildDate = (day, monthName, year) => {
    const monthIndex = MESES[normalizeMonthKey(monthName)];
    if (monthIndex == null) return null;
    return parseVencimentoDate(`${Number(year)}-${pad2(monthIndex + 1)}-${pad2(Number(day))}`);
};

const formatSaldo = (raw) => {
    const saldo = parseBrazilianNumber(raw);
    return saldo != null ? Number(Math.abs(saldo)).toFixed(2) : null;
};

const isContaStatement = (text) =>
    /extrato de conta|saldo final do per[ií]odo|picpay servi/i.test(text) &&
    (/pix recebido|compra realizada|pagamento realizado|rendimento recebido/i.test(text) ||
        SIGNED_VALUE_LINE_RE.test(text));

const inferTipoConta = (descricao, tipoHint, signedTipo) => {
    if (signedTipo) return signedTipo;

    const texto = `${tipoHint} ${descricao}`.toLowerCase();
    if (RECEITA_CONTA_RE.test(texto)) return 'RECEITA';
    if (DESPESA_CONTA_RE.test(texto)) return 'DESPESA';
    return 'DESPESA';
};

const isSaldoHeaderLine = (line) => SALDO_CONTA_LABEL_RE.test(line);

const isFooterOrHeaderNoise = (line) =>
    SKIP_RE.test(line) ||
    /^cpf:/i.test(line) ||
    /^cnpj:/i.test(line) ||
    /ag[eê]ncia:/i.test(line) ||
    /picpay servi/i.test(line) ||
    /ouvidoria/i.test(line);

const pickDescricao = (lines) => {
    const candidates = lines
        .map((line) => line.trim())
        .filter(
            (line) =>
                line &&
                !isFooterOrHeaderNoise(line) &&
                !TIME_LINE_RE.test(line) &&
                !SIGNED_VALUE_LINE_RE.test(line) &&
                !UNSIGNED_MONEY_RE.test(line) &&
                !DATE_CONTA_RE.test(line) &&
                !TIPO_TRANSACAO_RE.test(line)
        );

    return candidates.join(' ').trim() || null;
};

const extractSaldoExtratoFromText = (text) => {
    if (!text) return null;

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    for (let index = 0; index < Math.min(lines.length, 40); index += 1) {
        if (!isSaldoHeaderLine(lines[index])) continue;

        for (let offset = 1; offset <= 6 && index + offset < lines.length; offset += 1) {
            const line = lines[index + offset];
            if (SIGNED_VALUE_LINE_RE.test(line)) continue;
            const money = line.match(/^R\$?\s*([\d.,]+)\s*$/i);
            if (money) return formatSaldo(money[1]);
        }
    }

    return null;
};

const parseContaText = (text) => {
    if (!isContaStatement(text)) return null;

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    let currentDate = null;
    let tipoHint = '';
    let descLines = [];
    let pendingTx = null;
    const saldoExtrato = extractSaldoExtratoFromText(text);
    const linhas = [];

    const flushPending = () => {
        if (!pendingTx || !currentDate) return;

        const descricao = pickDescricao(descLines) || pendingTx.tipoHint;
        pushTransaction(
            descricao,
            pendingTx.valorRaw,
            [pendingTx.tipoHint, ...descLines].join(' '),
            pendingTx.signedTipo
        );
        pendingTx = null;
        descLines = [];
    };

    const pushTransaction = (descricaoRaw, valorRaw, hint, signedTipo = null) => {
        if (!currentDate) return;

        const valor = parseBrazilianNumber(valorRaw);
        if (valor == null || valor === 0) return;

        const descricao = normalizeDescricao(descricaoRaw || hint || 'Transação em conta');
        const tipo = inferTipoConta(descricao, hint, signedTipo);

        linhas.push({
            data: currentDate.toISOString(),
            valor: Math.abs(valor).toFixed(2),
            descricao,
            tipo,
        });
    };

    const resetTransacao = () => {
        flushPending();
        tipoHint = '';
        descLines = [];
    };

    for (const line of lines) {
        if (isSaldoHeaderLine(line) || /saldo ao final do dia/i.test(line)) {
            resetTransacao();
            continue;
        }

        if (UNSIGNED_MONEY_RE.test(line) && !SIGNED_VALUE_LINE_RE.test(line)) {
            resetTransacao();
            continue;
        }

        if (isFooterOrHeaderNoise(line)) {
            continue;
        }

        const dateMatch = line.match(DATE_CONTA_RE);
        if (dateMatch) {
            resetTransacao();
            currentDate = buildDate(dateMatch[1], dateMatch[2], dateMatch[3]);
            continue;
        }

        if (TIME_LINE_RE.test(line)) {
            flushPending();
            tipoHint = '';
            descLines = [];
            continue;
        }

        const signedMatch = line.match(SIGNED_VALUE_LINE_RE);
        if (signedMatch) {
            flushPending();
            const sign = signedMatch[1];
            pendingTx = {
                valorRaw: `${sign === '+' ? '+' : '-'}${signedMatch[2]}`,
                signedTipo: sign === '+' ? 'RECEITA' : 'DESPESA',
                tipoHint,
            };
            descLines = [];
            continue;
        }

        if (TIPO_TRANSACAO_RE.test(line)) {
            flushPending();
            tipoHint = line;
            descLines = [];
            continue;
        }

        if (pendingTx) {
            descLines.push(line);
            if (descLines.length > 4) {
                descLines.shift();
            }
            continue;
        }

        if (tipoHint && !TIME_LINE_RE.test(line)) {
            descLines.push(line);
        }
    }

    flushPending();

    if (!linhas.length) {
        return saldoExtrato ? { linhas: [], parser: 'pdf-conta', saldoExtrato } : null;
    }

    return {
        linhas,
        parser: 'pdf-conta',
        saldoExtrato,
    };
};

module.exports = {
    isContaStatement,
    extractSaldoExtratoFromContaText: extractSaldoExtratoFromText,
    parseContaText,
};
