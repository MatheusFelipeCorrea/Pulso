jest.mock('../../../src/services/categoryService', () => ({
    listarCategorias: jest.fn(),
}));
jest.mock('../../../src/services/tagService', () => ({
    listarTags: jest.fn(),
}));

const categoryService = require('../../../src/services/categoryService');
const tagService = require('../../../src/services/tagService');
const transactionFilterService = require('../../../src/services/transactionFilterService');

describe('transactionFilterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna opções de filtro com categorias, tags e constantes', async () => {
        categoryService.listarCategorias.mockResolvedValue([{ id: 'c1', nome: 'Alimentação' }]);
        tagService.listarTags.mockResolvedValue([
            { id: 't1', nome: 'Essencial', icone: 'Tag', cor: '#fff', extra: true },
        ]);

        const result = await transactionFilterService.obterOpcoesFiltro('u1');

        expect(result.categorias).toEqual([{ id: 'c1', nome: 'Alimentação' }]);
        expect(result.tags).toEqual([{ id: 't1', nome: 'Essencial', icone: 'Tag', cor: '#fff' }]);
        expect(Array.isArray(result.tipos)).toBe(true);
        expect(Array.isArray(result.recursos)).toBe(true);
        expect(result.formulario).toEqual(
            expect.objectContaining({
                recursos: expect.any(Array),
                frequencias: expect.any(Array),
                ateQuando: expect.any(Array),
            })
        );
    });
});
