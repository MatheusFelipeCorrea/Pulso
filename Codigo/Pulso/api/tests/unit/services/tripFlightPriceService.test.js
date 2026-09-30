// TEMP Sprint-3: duffelProvider depende de awesomeApiProvider, que entra no PR de moedas.
// Descomentar o teste abaixo depois do merge dele.
describe('tripFlightPriceService', () => {
    it.todo('reativar depois do PR de moedas');
});

// const { obterMediaPassagem } = require('../../../src/services/tripFlightPriceService');
//
// describe('tripFlightPriceService', () => {
//     it('retorna estimativa para destinos conhecidos', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'Argentina',
//             dataPrevista: '2026-08-01',
//         });
//
//         expect(result.disponivel).toBe(true);
//         expect(result.destino).toBe('Buenos Aires');
//         expect(result.valorMedioBrl).toBeGreaterThan(0);
//         expect(result.fonte).toBe('estimativa');
//         expect(result.onibus.disponivel).toBe(true);
//         expect(result.onibus.valorConvencionalBrl).toBeGreaterThan(0);
//         expect(result.onibus.buserDisponivel).toBe(false);
//         expect(result.trem.disponivel).toBe(false);
//     });
//
//     it('retorna hub de referÃªncia quando destino usa aeroporto vizinho', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'MacaÃ©, Rio de Janeiro, Brasil',
//             destinoMeta: {
//                 catalogId: 'BR-GIG-macae',
//                 iata: 'GIG',
//                 label: 'MacaÃ©',
//                 countryCode: 'BR',
//                 countryName: 'Brasil',
//                 moedaSugerida: 'BRL',
//                 domestic: true,
//             },
//             dataPrevista: '2026-03-10',
//             origemId: 'GRU',
//         });
//
//         expect(result.hubReferencia).toEqual({
//             destino: 'MacaÃ©',
//             hub: 'Rio de Janeiro',
//             iata: 'GIG',
//         });
//     });
//
//     it('retorna Ã´nibus com Buser em destinos domÃ©sticos', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'Rio de Janeiro',
//             dataPrevista: '2026-03-10',
//             origemId: 'GRU',
//         });
//
//         expect(result.onibus.buserDisponivel).toBe(true);
//         expect(result.onibus.idaVolta).toBe(true);
//         expect(result.onibus.valorBuserBrl).toBe(179.8);
//         expect(result.onibus.valorConvencionalBrl).toBe(290);
//         expect(result.onibus.valorBuserBrl).toBeLessThan(result.onibus.valorConvencionalBrl);
//     });
//
//     it('mantÃ©m Ã´nibus internacional sÃ³ de ida', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'Argentina',
//             dataPrevista: '2026-03-10',
//             origemId: 'GRU',
//         });
//
//         expect(result.onibus.idaVolta).toBe(false);
//         expect(result.onibus.valorConvencionalBrl).toBe(580);
//     });
//
//     it('ajusta estimativa em fÃ©rias de julho', async () => {
//         const july = await obterMediaPassagem({
//             destino: 'Rio de Janeiro',
//             dataPrevista: '2026-07-10',
//             origemId: 'GRU',
//         });
//         const march = await obterMediaPassagem({
//             destino: 'Rio de Janeiro',
//             dataPrevista: '2026-03-10',
//             origemId: 'GRU',
//         });
//
//         expect(july.ajusteSazonal?.periodo).toBe('FÃ©rias escolares de julho');
//         expect(july.valorMedioBrl).toBeGreaterThan(march.valorMedioBrl);
//         expect(july.onibus.valorConvencionalBrl).toBeGreaterThan(march.onibus.valorConvencionalBrl);
//     });
//     it('ajusta estimativas conforme a cidade de origem', async () => {
//         const fromSp = await obterMediaPassagem({
//             destino: 'Argentina',
//             dataPrevista: '2026-08-01',
//             origemId: 'GRU',
//         });
//         const fromRio = await obterMediaPassagem({
//             destino: 'Argentina',
//             dataPrevista: '2026-08-01',
//             origemId: 'GIG',
//         });
//
//         expect(fromSp.origemId).toBe('GRU');
//         expect(fromRio.origemId).toBe('GIG');
//         expect(fromRio.valorMedioBrl).toBeGreaterThan(fromSp.valorMedioBrl);
//         expect(fromRio.onibus.valorConvencionalBrl).toBeGreaterThan(fromSp.onibus.valorConvencionalBrl);
//     });
//
//     it('retorna indisponÃ­vel para destino desconhecido', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'Cidade Imaginaria XYZ',
//         });
//
//         expect(result.disponivel).toBe(false);
//     });
//
//     it('resolve VitÃ³ria (ES) sem confundir com Rio', async () => {
//         const result = await obterMediaPassagem({
//             destino: 'VitÃ³ria, EspÃ­rito Santo, Brasil',
//             destinoMeta: {
//                 catalogId: 'BR-VIX-vitoria',
//                 iata: 'VIX',
//                 label: 'VitÃ³ria',
//                 countryCode: 'BR',
//                 countryName: 'Brasil',
//                 moedaSugerida: 'BRL',
//                 domestic: true,
//             },
//             dataPrevista: '2026-08-01',
//             origemId: 'CNF',
//         });
//
//         expect(result.disponivel).toBe(true);
//         expect(result.destino).toBe('VitÃ³ria');
//         expect(result.valorMedioBrl).toBeGreaterThan(0);
//         expect(result.onibus.disponivel).toBe(true);
//         expect(result.onibus.buserDisponivel).toBe(true);
//         expect(result.trem.disponivel).toBe(true);
//         expect(result.trem.servico).toContain('VitÃ³ria-Minas');
//     });
// });
