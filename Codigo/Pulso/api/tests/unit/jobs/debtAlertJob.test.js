jest.mock('../../../src/services/debtAlertService', () => ({
    verificarDividasENotificar: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const { verificarDividasENotificar } = require('../../../src/services/debtAlertService');
const { runDebtAlertJob } = require('../../../src/jobs/debtAlertJob');

describe('debtAlertJob', () => {
    it('executa alertas de dívidas', async () => {
        verificarDividasENotificar.mockResolvedValue({ criadas: 1, verificadas: 3 });
        await expect(runDebtAlertJob()).resolves.toEqual({ criadas: 1, verificadas: 3 });
    });
});
