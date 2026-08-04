jest.mock('../../../src/repositories/grupoRepository', () => ({
    excluirMensagensAntigas: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const grupoRepository = require('../../../src/repositories/grupoRepository');
const { runChatCleanupJob } = require('../../../src/jobs/chatCleanupJob');

describe('chatCleanupJob', () => {
    it('remove mensagens de chat de grupo com mais de 180 dias', async () => {
        grupoRepository.excluirMensagensAntigas.mockResolvedValue(7);
        await expect(runChatCleanupJob()).resolves.toEqual({ removidas: 7 });
        expect(grupoRepository.excluirMensagensAntigas).toHaveBeenCalledWith(180);
    });
});
