jest.mock('../../../src/services/budgetService', () => ({
    verificarLimitesENotificar: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const budgetService = require('../../../src/services/budgetService');
const { runBudgetAlertJob } = require('../../../src/jobs/budgetAlertJob');

describe('budgetAlertJob', () => {
    it('executa job e retorna resultado', async () => {
        budgetService.verificarLimitesENotificar.mockResolvedValue({
            criadas: 2,
            usuariosVerificados: 1,
        });

        await expect(runBudgetAlertJob()).resolves.toEqual({ criadas: 2, usuariosVerificados: 1 });
    });
});
