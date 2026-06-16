import { describe, expect, it } from 'vitest'
import {
  collectWikipediaTitles,
  getTripDestinationImage,
  getTripCurrencyImage,
  normalizeDestinationText,
  parseDestinationParts,
} from '@/utils/tripDestinationImages.js'

describe('tripDestinationImages', () => {
  it('normaliza texto com acentos', () => {
    expect(normalizeDestinationText('São Paulo')).toBe('sao paulo')
    expect(normalizeDestinationText('Japão')).toBe('japao')
  })

  it('extrai partes do destino', () => {
    expect(parseDestinationParts('Paris, França')).toEqual(['Paris, França', 'Paris', 'França'])
  })

  it('resolve imagem por cidade brasileira', () => {
    const image = getTripDestinationImage('Macaé', 'BRL')
    expect(image).toContain('unsplash.com')
    expect(image).not.toContain('1488646953014')
  })

  it('nao confunde Vitória (ES) com Rio de Janeiro', () => {
    const vitoria = getTripDestinationImage('Vitória, Espírito Santo', 'BRL')
    const rio = getTripDestinationImage('Rio de Janeiro', 'BRL')

    expect(vitoria).toContain('1571019613454')
    expect(rio).toContain('1483729558449')
    expect(vitoria).not.toBe(rio)
  })

  it('resolve imagem por país', () => {
    const image = getTripDestinationImage('Japão', 'JPY')
    expect(image).toContain('1542051841857')
  })

  it('nao confunde palavras com codigos iso de pais', () => {
    const image = getTripDestinationImage('Destino inventado', 'ARS')
    expect(image).toContain('1559827260')
  })

  it('mapeia moedas adicionais', () => {
    expect(getTripCurrencyImage('INR')).toContain('unsplash.com')
    expect(getTripCurrencyImage('KRW')).toContain('unsplash.com')
  })

  it('coleta títulos da wikipedia para país e destino', () => {
    const titles = collectWikipediaTitles('Buenos Aires, Argentina')
    expect(titles).toContain('Argentina')
    expect(titles).toContain('Buenos Aires')
  })
})
