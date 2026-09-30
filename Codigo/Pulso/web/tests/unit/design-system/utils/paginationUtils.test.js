import { describe, expect, it } from 'vitest'
import { getPaginationInfoRange, getPaginationRange } from '@/design-system/utils/paginationUtils.js'

describe('paginationUtils', () => {
  it('gera faixa simples quando total de páginas é pequeno', () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('gera faixa com reticências quando total de páginas é grande', () => {
    expect(getPaginationRange(6, 12)).toEqual([1, 'ellipsis', 4, 5, 6, 7, 8, 'ellipsis', 12])
  })

  it('retorna intervalo textual de itens na paginação', () => {
    expect(getPaginationInfoRange(2, 10, 117)).toEqual({ start: 11, end: 20, total: 117 })
    expect(getPaginationInfoRange(1, 10, 0)).toEqual({ start: 0, end: 0, total: 0 })
  })
})
