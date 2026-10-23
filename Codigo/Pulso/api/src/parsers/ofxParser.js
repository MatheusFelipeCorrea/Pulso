const {
    parseBrazilianNumber,
    parseFlexibleDate,
    inferTipoFromValor,
    normalizeDescricao,
} = require('./importParseUtils');

const readTag = (block, tag) => {
    const re = new RegExp(`<${tag}>([^<\\n\\r]+)`, 'i');
    const match = block.match(re);
    return match ? match[1].trim() : '';
};

const parseOfx = (buffer) => {
    const text = buffer.toString('utf8');
    const blocks = text.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) ?? [];

    const linhas = [];
    for (const block of blocks) {
        const dtPosted = readTag(block, 'DTPOSTED');
        const trnAmt = readTag(block, 'TRNAMT');
        const memo = readTag(block, 'MEMO');
        const name = readTag(block, 'NAME');
        const trnType = readTag(block, 'TRNTYPE').toUpperCase();

        const data = parseFlexibleDate(dtPosted);
        const valorRaw = parseBrazilianNumber(trnAmt);
        if (!data || valorRaw == null || valorRaw === 0) continue;

        let tipo = inferTipoFromValor(valorRaw);
        if (trnType === 'CREDIT' || trnType === 'DEP') tipo = 'RECEITA';
        if (trnType === 'DEBIT' || trnType === 'XFER') tipo = 'DESPESA';

        linhas.push({
            data: data.toISOString(),
            valor: Math.abs(valorRaw).toFixed(2),
            descricao: normalizeDescricao(memo || name),
            tipo,
        });
    }

    return { linhas, parser: 'ofx' };
};

module.exports = { parseOfx };
