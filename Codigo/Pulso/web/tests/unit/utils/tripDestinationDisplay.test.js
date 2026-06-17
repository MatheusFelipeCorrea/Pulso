import { describe, expect, it } from 'vitest'
import {
  formatTripDestinationDisplay,
  getTripDestinationParts,
} from '@/utils/tripDestinationDisplay.js'

describe('tripDestinationDisplay', () => {
  it('usa label e país do destinoMeta', () => {
    expect(
      formatTripDestinationDisplay('Macaé, Rio de Janeiro, Brasil', {
        label: 'Macaé',
        countryName: 'Brasil',
      })
    ).toBe('Macaé, Brasil')
  })

  it('simplifica destino legado pegando primeira e última parte', () => {
    expect(
      formatTripDestinationDisplay(
        'Buenos Aires, Ciudad Autónoma de Buenos Aires, Argentina',
        null
      )
    ).toBe('Buenos Aires, Argentina')
  })

  it('retorna partes para layout em duas linhas', () => {
    expect(
      getTripDestinationParts('Tóquio, Japão', {
        label: 'Tóquio',
        countryName: 'Japão',
      })
    ).toEqual({ city: 'Tóquio', country: 'Japão' })
  })
})
