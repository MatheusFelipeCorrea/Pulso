jest.mock('../../../src/repositories/transactionRepository');

const transactionRepository = require('../../../src/repositories/transactionRepository');
const categorySuggestionService = require('../../../src/services/categorySuggestionService');

describe('categorySuggestionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sugere a categoria com base no histórico de descrições do usuário', async () => {
        transactionRepository.listarDescricoesPorTipo.mockResolvedValue([
            { descricao: 'Uber para o trabalho', categoriaId: 'cat-transporte' },
            { descricao: 'Uber para casa', categoriaId: 'cat-transporte' },
        ]);

        const resultado = await categorySuggestionService.sugerirCategoria('u1', {
            tipo: 'DESPESA',
            descricao: 'Uber pro trampo',
        });

        expect(transactionRepository.listarDescricoesPorTipo).toHaveBeenCalledWith('u1', 'DESPESA');
        expect(resultado).toEqual({ categoriaId: 'cat-transporte' });
    });

    it('retorna categoriaId nulo quando não há correspondência', async () => {
        transactionRepository.listarDescricoesPorTipo.mockResolvedValue([]);

        const resultado = await categorySuggestionService.sugerirCategoria('u1', {
            tipo: 'RECEITA',
            descricao: 'Salário',
        });

        expect(resultado).toEqual({ categoriaId: null });
    });
});
