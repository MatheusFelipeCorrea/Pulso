jest.unmock('../../../src/services/categoryService');
jest.mock('../../../src/repositories/categoryRepository');

const categoryRepository = require('../../../src/repositories/categoryRepository');
const categoryService = require('../../../src/services/categoryService');

describe('categoryService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista categorias após garantir categorias padrão', async () => {
        categoryRepository.criarPadrao.mockResolvedValue(undefined);
        categoryRepository.listarPorUsuario.mockResolvedValue([
            {
                id: 'cat-1',
                nome: 'Salário',
                icone: 'Wallet',
                cor: '#10B981',
                tipo: 'RECEITA',
                padrao: true,
            },
            {
                id: 'cat-2',
                nome: 'Transporte',
                icone: 'Bus',
                cor: '#3B82F6',
                tipo: 'DESPESA',
                padrao: false,
            },
        ]);

        const result = await categoryService.listarCategorias('usr-1', 'DESPESA');

        expect(categoryRepository.criarPadrao).toHaveBeenCalledWith('usr-1');
        expect(categoryRepository.listarPorUsuario).toHaveBeenCalledWith('usr-1', 'DESPESA');
        expect(result).toEqual([
            {
                id: 'cat-1',
                nome: 'Salário',
                icone: 'Wallet',
                cor: '#10B981',
                tipo: 'RECEITA',
                padrao: true,
            },
            {
                id: 'cat-2',
                nome: 'Transporte',
                icone: 'Bus',
                cor: '#3B82F6',
                tipo: 'DESPESA',
                padrao: false,
            },
        ]);
    });

    it('executa seedCategoriasPadrao', async () => {
        categoryRepository.criarPadrao.mockResolvedValue(undefined);

        await categoryService.seedCategoriasPadrao('usr-seed');

        expect(categoryRepository.criarPadrao).toHaveBeenCalledWith('usr-seed');
    });

    it('rejeita criação de categoria duplicada', async () => {
        categoryRepository.criarPadrao.mockResolvedValue(undefined);
        categoryRepository.buscarPorNome.mockResolvedValue({ id: 'cat-existing' });

        await expect(
            categoryService.criarCategoria('usr-1', {
                nome: '  Mercado  ',
                tipo: 'DESPESA',
                icone: 'Cart',
                cor: '#EF4444',
            })
        ).rejects.toMatchObject({
            statusCode: 409,
            message: 'Já existe uma categoria com este nome para este tipo',
        });

        expect(categoryRepository.criar).not.toHaveBeenCalled();
    });

    it('cria categoria nova com nome sanitizado', async () => {
        categoryRepository.criarPadrao.mockResolvedValue(undefined);
        categoryRepository.buscarPorNome.mockResolvedValue(null);
        categoryRepository.criar.mockResolvedValue({
            id: 'cat-3',
            nome: 'Mercado',
            tipo: 'DESPESA',
            icone: 'Cart',
            cor: '#EF4444',
        });

        const result = await categoryService.criarCategoria('usr-1', {
            nome: '  Mercado  ',
            tipo: 'DESPESA',
            icone: 'Cart',
            cor: '#EF4444',
        });

        expect(categoryRepository.criar).toHaveBeenCalledWith({
            nome: 'Mercado',
            tipo: 'DESPESA',
            icone: 'Cart',
            cor: '#EF4444',
            padrao: false,
            usuarioId: 'usr-1',
        });
        expect(result).toEqual({
            id: 'cat-3',
            nome: 'Mercado',
            tipo: 'DESPESA',
            icone: 'Cart',
            cor: '#EF4444',
            padrao: false,
        });
    });

    it('impede atualização de categoria padrão', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-default',
            nome: 'Alimentação',
            tipo: 'DESPESA',
            padrao: true,
        });

        await expect(
            categoryService.atualizarCategoria('usr-1', 'cat-default', {
                nome: 'Supermercado',
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Categorias padrão do sistema não podem ser editadas',
        });
    });

    it('rejeita atualização de categoria inexistente', async () => {
        categoryRepository.buscarPorId.mockResolvedValue(null);

        await expect(
            categoryService.atualizarCategoria('usr-1', 'cat-missing', { nome: 'Nova' })
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Categoria não encontrada',
        });
    });

    it('rejeita atualização com nome duplicado', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-1',
            nome: 'Mercado',
            tipo: 'DESPESA',
            padrao: false,
        });
        categoryRepository.buscarPorNome.mockResolvedValue({
            id: 'cat-2',
            nome: 'Transporte',
            tipo: 'DESPESA',
        });

        await expect(
            categoryService.atualizarCategoria('usr-1', 'cat-1', { nome: 'Transporte' })
        ).rejects.toMatchObject({
            statusCode: 409,
        });
    });

    it('atualiza categoria com nome e metadados', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-1',
            nome: 'Mercado',
            tipo: 'DESPESA',
            padrao: false,
        });
        categoryRepository.buscarPorNome.mockResolvedValue(null);
        categoryRepository.atualizar.mockResolvedValue({
            id: 'cat-1',
            nome: 'Feira',
            tipo: 'DESPESA',
            icone: 'Apple',
            cor: '#22C55E',
        });

        const result = await categoryService.atualizarCategoria('usr-1', 'cat-1', {
            nome: 'Feira',
            icone: 'Apple',
            cor: '#22C55E',
        });

        expect(categoryRepository.atualizar).toHaveBeenCalledWith('cat-1', {
            nome: 'Feira',
            icone: 'Apple',
            cor: '#22C55E',
        });
        expect(result).toEqual({
            id: 'cat-1',
            nome: 'Feira',
            tipo: 'DESPESA',
            icone: 'Apple',
            cor: '#22C55E',
            padrao: false,
        });
    });

    it('impede remoção de categoria em uso', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-1',
            nome: 'Mercado',
            tipo: 'DESPESA',
            padrao: false,
        });
        categoryRepository.contarUso.mockResolvedValue(2);

        await expect(categoryService.removerCategoria('usr-1', 'cat-1')).rejects.toMatchObject({
            statusCode: 400,
            message: 'Esta categoria está em uso em transações ou orçamentos e não pode ser excluída',
        });

        expect(categoryRepository.deletar).not.toHaveBeenCalled();
    });

    it('rejeita remoção de categoria inexistente', async () => {
        categoryRepository.buscarPorId.mockResolvedValue(null);

        await expect(categoryService.removerCategoria('usr-1', 'cat-404')).rejects.toMatchObject({
            statusCode: 404,
        });
    });

    it('rejeita remoção de categoria padrão', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-default',
            padrao: true,
        });

        await expect(
            categoryService.removerCategoria('usr-1', 'cat-default')
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Categorias padrão do sistema não podem ser excluídas',
        });
    });

    it('remove categoria fora de uso', async () => {
        categoryRepository.buscarPorId.mockResolvedValue({
            id: 'cat-7',
            padrao: false,
        });
        categoryRepository.contarUso.mockResolvedValue(0);
        categoryRepository.deletar.mockResolvedValue(undefined);

        await categoryService.removerCategoria('usr-1', 'cat-7');

        expect(categoryRepository.deletar).toHaveBeenCalledWith('cat-7');
    });

    it('lista ícones e cores disponíveis', () => {
        const result = categoryService.listarIconesDisponiveis();

        expect(Array.isArray(result.icones)).toBe(true);
        expect(Array.isArray(result.cores)).toBe(true);
        expect(result.icones.length).toBeGreaterThan(0);
        expect(result.cores.length).toBeGreaterThan(0);
    });
});
