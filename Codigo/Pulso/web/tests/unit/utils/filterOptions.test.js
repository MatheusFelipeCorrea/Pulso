import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/badges/iconRegistry.jsx', () => ({
  resolveBadgeIcon: vi.fn((icon, { size }) => `icon:${icon}:${size}`),
}))

vi.mock('@/components/badges/badgeCatalog.js', () => ({
  getBadgeDefinition: vi.fn((kind) =>
    kind === 'vr'
      ? { icon: 'Wallet', label: 'Vale Refeicao', color: '#00AA00', variant: 'success' }
      : null
  ),
}))

vi.mock('@/components/badges/enumMappers.js', () => ({
  badgeKindFromRecurso: vi.fn((value) => (value === 'VR' ? 'vr' : null)),
}))

import {
  CATEGORIA_FILTRO_NOME_PREFIX,
  categoriaFilterOptions,
  categoriaToSelectOption,
  recursoFilterOptions,
  recursoSelectOptions,
  recursoToSelectOption,
  tagSuggestions,
  toSelectOptions,
  withEmptyOption,
} from '@/utils/filterOptions.js'

describe('utils/filterOptions', () => {
  it('converte categoria para opção com ícone', () => {
    expect(
      categoriaToSelectOption({ id: 'c1', nome: 'Mercado', icone: 'ShoppingCart', cor: '#111' })
    ).toEqual({
      value: 'c1',
      label: 'Mercado',
      icon: 'icon:ShoppingCart:16',
      iconColor: '#111',
    })
  })

  it('agrupa categorias duplicadas por nome e move Outros para o fim', () => {
    const options = categoriaFilterOptions([
      { id: '1', nome: 'Outros', icone: 'Tag', cor: '#333' },
      { id: '2', nome: 'Alimentacao', icone: 'Utensils', cor: '#222' },
      { id: '3', nome: 'Outros', icone: 'Tag', cor: '#444' },
    ])

    expect(options[0]).toEqual({ value: '', label: 'Todas' })
    expect(options[1].label).toBe('Alimentacao')
    expect(options[2].label).toBe('Outros')
    expect(options[2].value).toBe(`${CATEGORIA_FILTRO_NOME_PREFIX}Outros`)
  })

  it('mapeia recursos com badge quando houver definição e faz fallback', () => {
    expect(recursoToSelectOption({ value: 'VR', label: 'VR' })).toEqual({
      value: 'VR',
      label: 'VR',
      icon: 'icon:Wallet:16',
      iconColor: '#00AA00',
    })

    expect(recursoToSelectOption({ value: 'XYZ', label: 'Outro' })).toEqual({
      value: 'XYZ',
      label: 'Outro',
    })
  })

  it('preserva opção TODOS sem ícone em filtros de recurso', () => {
    expect(
      recursoFilterOptions([
        { value: 'TODOS', label: 'Todos' },
        { value: 'VR', label: 'Vale' },
      ])
    ).toEqual([
      { value: 'TODOS', label: 'Todos' },
      { value: 'VR', label: 'Vale', icon: 'icon:Wallet:16', iconColor: '#00AA00' },
    ])
    expect(recursoSelectOptions([{ value: 'XYZ', label: 'Outro' }])).toEqual([
      { value: 'XYZ', label: 'Outro' },
    ])
  })

  it('converte listas genéricas para options, adiciona vazio e mapeia tags', () => {
    const generic = toSelectOptions([{ id: 'x1', nome: 'Casa', iconName: 'Home', color: '#111' }], {
      valueKey: 'id',
      labelKey: 'nome',
      iconKey: 'iconName',
      iconColorKey: 'color',
    })

    expect(generic).toEqual([{ value: 'x1', label: 'Casa', icon: 'Home', iconColor: '#111' }])
    expect(withEmptyOption(generic, { value: 'all', label: 'Todas categorias' })).toEqual([
      { value: 'all', label: 'Todas categorias' },
      { value: 'x1', label: 'Casa', icon: 'Home', iconColor: '#111' },
    ])
    expect(tagSuggestions([{ nome: 'Mercado' }, { nome: 'Lazer' }])).toEqual(['Mercado', 'Lazer'])
  })
})
