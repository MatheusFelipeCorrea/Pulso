const { toUint8Array } = require('../../../src/parsers/extractPdfText');

describe('extractPdfText toUint8Array', () => {
    it('converte Buffer em Uint8Array separado (pdfjs não aceita Buffer direto)', () => {
        const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46]);
        expect(Buffer.isBuffer(buffer)).toBe(true);
        expect(buffer instanceof Uint8Array).toBe(true);

        const data = toUint8Array(buffer);

        expect(data).toBeInstanceOf(Uint8Array);
        expect(Buffer.isBuffer(data)).toBe(false);
        expect(data).toEqual(new Uint8Array([0x25, 0x50, 0x44, 0x46]));
    });

    it('mantém Uint8Array puro sem recriar', () => {
        const original = new Uint8Array([1, 2, 3]);
        expect(toUint8Array(original)).toBe(original);
    });
});
