jest.mock('../../../src/services/reminderAlertService', () => ({
    verificarLembretesENotificar: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({ info: jest.fn() }));

const reminderAlertService = require('../../../src/services/reminderAlertService');
const { runReminderAlertJob } = require('../../../src/jobs/reminderAlertJob');

describe('reminderAlertJob', () => {
    it('executa alertas de lembretes', async () => {
        reminderAlertService.verificarLembretesENotificar.mockResolvedValue({
            criadas: 3,
            verificados: 7,
        });

        await expect(runReminderAlertJob()).resolves.toEqual({ criadas: 3, verificados: 7 });
    });
});
