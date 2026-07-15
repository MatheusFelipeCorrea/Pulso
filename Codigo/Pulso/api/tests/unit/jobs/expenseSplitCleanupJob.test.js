jest.mock('../../../src/repositories/expenseSplitRepository', () => ({
    excluirQuitadasAntigas: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const expenseSplitRepository = require('../../../src/repositories/expenseSplitRepository');
const { runExpenseSplitCleanupJob } = require('../../../src/jobs/expenseSplitCleanupJob');

describe('expenseSplitCleanupJob', () => {
    it('remove divisões quitadas antigas', async () => {
        expenseSplitRepository.excluirQuitadasAntigas.mockResolvedValue(3);
        await expect(runExpenseSplitCleanupJob()).resolves.toEqual({ removidas: 3 });
        expect(expenseSplitRepository.excluirQuitadasAntigas).toHaveBeenCalledWith(180);
    });
});
