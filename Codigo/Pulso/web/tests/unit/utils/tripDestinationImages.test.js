import { describe, expect, it } from 'vitest'
import {
  collectPlaceWikipediaTitles,
  getTripDestinationImage,
  getTripCurrencyImage,
  normalizeDestinationText,
  parseDestinationParts,
  resolveCountryCode,
} from '@/utils/tripDestinationImages.js'
import { buildCommonsSearchQueries, buildGeoWikiTitles } from '@/utils/tripCommonsImage.js'
import { isPlaceWikiSummary } from '@/utils/tripWikipediaImage.js'

describe('tripDestinationImages', () => {
  it('normaliza texto com acentos', () => {
    expect(normalizeDestinationText('São Paulo')).toBe('sao paulo')
    expect(normalizeDestinationText('Japão')).toBe('japao')
  })

  it('extrai partes do destino', () => {
    expect(parseDestinationParts('Paris, França')).toEqual(['Paris, França', 'Paris', 'França'])
  })

  it('usa coverImageUrl salva na API', () => {
    const image = getTripDestinationImage('Macaé', 'BRL', {
      coverImageUrl: 'https://upload.wikimedia.org/macae.jpg',
    })
    expect(image).toBe('https://upload.wikimedia.org/macae.jpg')
  })

  it('retorna null sem cover salva', () => {
    const image = getTripDestinationImage('Macaé', 'BRL', { countryCode: 'BR' })
    expect(image).toBeNull()
  })

  it('repara thumb wikimedia com tamanho inválido', () => {
    const image = getTripDestinationImage('Tóquio', 'JPY', {
      coverImageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/420px-Skyscrapers_of_Shinjuku_2009_January.jpg',
    })
    expect(image).toContain('/330px-')
    expect(image).not.toContain('/420px-')
  })

  it('resolve país pelo destinoMeta', () => {
    expect(resolveCountryCode('Qualquer', { countryCode: 'US' }, 'USD')).toBe('US')
    expect(resolveCountryCode('Buenos Aires, Argentina', null, 'ARS')).toBe('AR')
  })

  it('mapeia moeda para bandeira', () => {
    expect(getTripCurrencyImage('JPY')).toContain('flagcdn.com/w320/jp.png')
  })

  it('gera títulos wiki geográficos para qualquer destino do catálogo', () => {
    const titles = collectPlaceWikipediaTitles('Vitória, Espírito Santo, Brasil', {
      label: 'Vitória',
      region: 'Espírito Santo',
      countryName: 'Brasil',
    })
    expect(titles).toContain('Vitória, Espírito Santo')
    expect(titles).toContain('Vitória (Espírito Santo)')
  })

  it('monta busca no commons', () => {
    const queries = buildCommonsSearchQueries('Paris, França', {
      label: 'Paris',
      countryName: 'França',
    })
    expect(queries[0]).toContain('Paris')
    expect(queries[0]).toContain('França')
  })

  it('geo wiki titles a partir do meta', () => {
    expect(buildGeoWikiTitles('X', { label: 'Kyoto', countryName: 'Japão' })).toContain('Kyoto, Japão')
  })
})

describe('isPlaceWikiSummary', () => {
  it('rejeita clube de futebol', () => {
    expect(
      isPlaceWikiSummary({
        type: 'standard',
        title: 'Club de Regatas Vasco da Gama',
        description: 'clube de futebol brasileiro',
        thumbnail: { source: 'https://upload.wikimedia.org/x.jpg' },
      })
    ).toBe(false)
  })

  it('rejeita thumbnail de bandeira', () => {
    expect(
      isPlaceWikiSummary({
        type: 'standard',
        title: 'Brasil',
        description: 'país da América do Sul',
        thumbnail: { source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png' },
      })
    ).toBe(false)
  })

  it('aceita municipio', () => {
    expect(
      isPlaceWikiSummary({
        type: 'standard',
        title: 'Macaé',
        description: 'município do estado do Rio de Janeiro',
        thumbnail: { source: 'https://upload.wikimedia.org/x.jpg' },
      })
    ).toBe(true)
  })
})
