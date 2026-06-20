const fs = require('fs').promises;
const path = require('path');
const { validateImageFile, storeGrupoImage } = require('../../../src/services/grupoImageStorageService');
const AppError = require('../../../src/utils/appError');

jest.mock('fs', () => ({
    promises: {
        mkdir: jest.fn().mockResolvedValue(undefined),
        writeFile: jest.fn().mockResolvedValue(undefined),
    },
}));

describe('grupoImageStorageService', () => {
    const validFile = {
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake'),
    };

    it('rejeita formato inválido', () => {
        expect(() =>
            validateImageFile({ mimetype: 'application/pdf', size: 100, buffer: Buffer.from('x') })
        ).toThrow(AppError);
    });

    it('rejeita arquivo acima de 2 MB', () => {
        expect(() =>
            validateImageFile({ mimetype: 'image/png', size: 3 * 1024 * 1024, buffer: Buffer.from('x') })
        ).toThrow('2 MB');
    });

    it('salva localmente fora da Vercel', async () => {
        const originalVercel = process.env.VERCEL;
        delete process.env.VERCEL;
        delete process.env.BLOB_READ_WRITE_TOKEN;

        const url = await storeGrupoImage('grp-1', validFile);

        expect(url).toContain('/api/uploads/grupos/grp-1-');
        expect(url).toMatch(/\.jpg$/);

        process.env.VERCEL = originalVercel;
    });
});
