jest.mock('../../../src/repositories/grupoRepository');

const grupoRepository = require('../../../src/repositories/grupoRepository');
const {
    normalizarCodigoConvite,
    CODIGO_REGEX,
    atualizarModoDivisao,
} = require('../../../src/services/grupoService');

const grupoBase = (overrides = {}) => ({
    id: 'grupo-1',
    nome: 'Viagem em grupo',
    descricao: null,
    codigoConvite: 'PULSO-X7K2',
    urlImagem: null,
    modoDivisao: 'PRETENSAO',
    criador: { id: 'usr-1', nome: 'Matheus', urlAvatar: null },
    membros: [
        { usuarioId: 'usr-1', papel: 'ADMIN', entrouEm: new Date(), usuario: { id: 'usr-1', nome: 'Matheus', urlAvatar: null } },
    ],
    viagens: [],
    metas: [],
    mensagens: [],
    criadoEm: new Date('2026-01-01T12:00:00.000Z'),
    atualizadoEm: new Date('2026-01-01T12:00:00.000Z'),
    ...overrides,
});

describe('grupoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('normaliza código de convite', () => {
        expect(normalizarCodigoConvite(' pulso-x7k2 ')).toBe('PULSO-X7K2');
        expect(CODIGO_REGEX.test('PULSO-X7K2')).toBe(true);
        expect(CODIGO_REGEX.test('PULSO-X7')).toBe(false);
    });

    it('atualiza o modo de divisão do grupo', async () => {
        grupoRepository.buscarPorId
            .mockResolvedValueOnce(grupoBase())
            .mockResolvedValueOnce(grupoBase({ modoDivisao: 'IGUAL' }));
        grupoRepository.atualizar.mockResolvedValue(grupoBase({ modoDivisao: 'IGUAL' }));

        const result = await atualizarModoDivisao('usr-1', 'grupo-1', 'IGUAL');

        expect(grupoRepository.atualizar).toHaveBeenCalledWith('grupo-1', { modoDivisao: 'IGUAL' });
        expect(result.modoDivisao).toBe('IGUAL');
    });

    it('rejeita atualizar modo de divisão se o usuário não pertence ao grupo', async () => {
        grupoRepository.buscarPorId.mockResolvedValue(null);

        await expect(atualizarModoDivisao('usr-2', 'grupo-1', 'IGUAL')).rejects.toMatchObject({
            statusCode: 404,
        });
    });
});
