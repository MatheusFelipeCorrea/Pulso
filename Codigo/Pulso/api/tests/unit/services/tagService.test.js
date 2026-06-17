jest.mock('../../../src/repositories/tagRepository');

const tagRepository = require('../../../src/repositories/tagRepository');
const tagService = require('../../../src/services/tagService');

describe('tagService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista tags por usuário', async () => {
        tagRepository.listarPorUsuario.mockResolvedValue([
            { id: 'tag-1', nome: 'Casa', icone: 'Home', cor: '#6366F1' },
            { id: 'tag-2', nome: 'Saúde', icone: 'Heart', cor: '#EF4444' },
        ]);

        const result = await tagService.listarTags('usr-1');

        expect(tagRepository.listarPorUsuario).toHaveBeenCalledWith('usr-1');
        expect(result).toEqual([
            { id: 'tag-1', nome: 'Casa', icone: 'Home', cor: '#6366F1' },
            { id: 'tag-2', nome: 'Saúde', icone: 'Heart', cor: '#EF4444' },
        ]);
    });

    it('cria tag delegando para buscarOuCriar', async () => {
        tagRepository.buscarOuCriar.mockResolvedValue({
            id: 'tag-3',
            nome: 'Investimentos',
            icone: 'TrendingUp',
            cor: '#22C55E',
        });

        const result = await tagService.criarTag('usr-1', {
            nome: 'Investimentos',
            icone: 'TrendingUp',
            cor: '#22C55E',
        });

        expect(tagRepository.buscarOuCriar).toHaveBeenCalledWith(
            'usr-1',
            'Investimentos',
            'TrendingUp',
            '#22C55E'
        );
        expect(result).toEqual({
            id: 'tag-3',
            nome: 'Investimentos',
            icone: 'TrendingUp',
            cor: '#22C55E',
        });
    });

    it('edita tag existente', async () => {
        tagRepository.buscarPorId.mockResolvedValue({ id: 'tag-1', nome: 'Casa' });
        tagRepository.atualizar.mockResolvedValue({ id: 'tag-1', nome: 'Moradia' });

        const result = await tagService.editarTag('usr-1', 'tag-1', { nome: 'Moradia' });

        expect(tagRepository.buscarPorId).toHaveBeenCalledWith('tag-1', 'usr-1');
        expect(tagRepository.atualizar).toHaveBeenCalledWith('tag-1', 'usr-1', { nome: 'Moradia' });
        expect(result.nome).toBe('Moradia');
    });

    it('exclui tag existente', async () => {
        tagRepository.buscarPorId.mockResolvedValue({ id: 'tag-1', nome: 'Casa' });
        tagRepository.excluir.mockResolvedValue({ count: 1 });

        await tagService.excluirTag('usr-1', 'tag-1');

        expect(tagRepository.excluir).toHaveBeenCalledWith('tag-1', 'usr-1');
    });
});
