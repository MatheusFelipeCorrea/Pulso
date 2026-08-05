const path = require('path');

let pdfjsPromise;
let standardFontDataUrl;

const getPdfjs = () => {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs');
    }
    return pdfjsPromise;
};

const resolveStandardFontDataUrl = () => {
    if (standardFontDataUrl) {
        return standardFontDataUrl;
    }

    const fontsDir = path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts');
    standardFontDataUrl = `${fontsDir.replace(/\\/g, '/')}/`;
    return standardFontDataUrl;
};

const toUint8Array = (buffer) => {
    if (Buffer.isBuffer(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    if (buffer instanceof Uint8Array) {
        return buffer;
    }
    return new Uint8Array(buffer);
};

const extractPdfText = async (buffer) => {
    const pdfjs = await getPdfjs();
    const data = toUint8Array(buffer);
    const doc = await pdfjs.getDocument({
        data,
        standardFontDataUrl: resolveStandardFontDataUrl(),
        useSystemFonts: true,
    }).promise;

    const chunks = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const content = await page.getTextContent();
        chunks.push(content.items.map((item) => item.str).join('\n'));
    }

    return chunks.join('\n');
};

module.exports = { extractPdfText, toUint8Array };
