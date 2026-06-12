jest.mock('../../../src/repositories/debtRepository', () => ({
    excluirQuitadasAntigas: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const debtRepository = require('../../../src/repositories/debtRepository');
const { runDebtCleanupJob } = require('../../../src/jobs/debtCleanupJob');

describe('debtCleanupJob', () => {
    it('remove dívidas antigas quitadas', async () => {
        debtRepository.excluirQuitadasAntigas.mockResolvedValue(4);
        await expect(runDebtCleanupJob()).resolves.toEqual({ removidas: 4 });
        expect(debtRepository.excluirQuitadasAntigas).toHaveBeenCalledWith(180);
    });
});
