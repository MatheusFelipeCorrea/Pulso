jest.mock('axios');

const axios = require('axios');
const duffelProvider = require('../../../src/providers/duffelProvider');

describe('duffelProvider', () => {
    const originalToken = process.env.DUFFEL_ACCESS_TOKEN;

    afterEach(() => {
        jest.resetAllMocks();
        if (originalToken) {
            process.env.DUFFEL_ACCESS_TOKEN = originalToken;
        } else {
            delete process.env.DUFFEL_ACCESS_TOKEN;
        }
    });

    it('retorna null sem credenciais', async () => {
        delete process.env.DUFFEL_ACCESS_TOKEN;

        const result = await duffelProvider.fetchAverageRoundTripPrice({
            origin: 'GRU',
            destination: 'GIG',
            departureDate: '2026-08-01',
            returnDate: '2026-08-08',
        });

        expect(result).toBeNull();
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('calcula média das ofertas em BRL', async () => {
        process.env.DUFFEL_ACCESS_TOKEN = 'duffel_test_token';

        axios.post.mockResolvedValue({
            data: {
                data: {
                    offers: [
                        { total_amount: '620.00', total_currency: 'BRL' },
                        { total_amount: '680.00', total_currency: 'BRL' },
                    ],
                },
            },
        });

        const result = await duffelProvider.fetchAverageRoundTripPrice({
            origin: 'GRU',
            destination: 'GIG',
            departureDate: '2026-08-01',
            returnDate: '2026-08-08',
        });

        expect(result).toBe(650);
        expect(axios.post).toHaveBeenCalled();
    });
});
