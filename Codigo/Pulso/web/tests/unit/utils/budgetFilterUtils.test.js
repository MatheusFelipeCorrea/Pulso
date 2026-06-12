import { describe, expect, it } from 'vitest'
import { CATEGORIA_FILTRO_NOME_PREFIX } from '@/utils/filterOptions.js'
import { categoriaPassaFiltroOrcamento, filtrarCategoriasOrcamento } from '@/utils/budgetFilterUtils.js'

describe('budgetFilterUtils', () => {
  const categorias = [
    { id: 'cat-1', nome: 'Alimentação' },
    { categoriaId: 'cat-2', categoriaNome: 'Transporte' },
    { id: 'cat-3', nome: 'Saúde' },
  ]

  it('filtra por categoria via id e prefixo de nome', () => {
    expect(categoriaPassaFiltroOrcamento(categorias[0], 'cat-1')).toBe(true)
    expect(categoriaPassaFiltroOrcamento(categorias[0], 'cat-2')).toBe(false)
    expect(
      categoriaPassaFiltroOrcamento(
        categorias[1],
        `${CATEGORIA_FILTRO_NOME_PREFIX}Transporte`
      )
    ).toBe(true)
  })

  it('aplica filtros locais por busca, tipo e categoria', () => {
    expect(filtrarCategoriasOrcamento(categorias, { tipo: 'RECEITA' })).toEqual([])
    expect(filtrarCategoriasOrcamento(categorias, { busca: 'ali' })).toEqual([categorias[0]])
    expect(filtrarCategoriasOrcamento(categorias, { categoria: 'cat-3' })).toEqual([categorias[2]])
  })
})
