/**
 * Utilitários para mapear opções de filtro vindas do backend → Select do DS.
 */

import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { getBadgeDefinition } from '@/components/badges/badgeCatalog.js'
import { badgeKindFromRecurso } from '@/components/badges/enumMappers.js'

const BADGE_VARIANT_ICON_COLORS = {
  primary: '#7C3AED',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#2563EB',
  orange: '#F97316',
  cyan: '#06B6D4',
  neutral: '#71717A',
  default: '#71717A',
}

export const CATEGORIA_FILTRO_NOME_PREFIX = 'nome:'

/** Categoria da API → opção de Select com ícone colorido (formulário) */
export function categoriaToSelectOption(categoria) {
  return {
    value: categoria.id,
    label: categoria.nome,
    icon: resolveBadgeIcon(categoria.icone ?? 'Tag', { size: 16 }),
    iconColor: categoria.cor,
  }
}

/** Uma opção por nome — nomes repetidos (ex.: Outros) viram filtro único por nome */
function agruparCategoriasParaFiltro(categorias = []) {
  const porNome = new Map()

  for (const categoria of categorias) {
    if (!porNome.has(categoria.nome)) {
      porNome.set(categoria.nome, [])
    }
    porNome.get(categoria.nome).push(categoria)
  }

  const nomes = [...porNome.keys()].sort((a, b) => {
    if (a === 'Outros') return 1
    if (b === 'Outros') return -1
    return a.localeCompare(b, 'pt-BR')
  })

  return nomes.map((nome) => {
    const grupo = porNome.get(nome)
    const representante = grupo[0]
    const value =
      grupo.length > 1 ? `${CATEGORIA_FILTRO_NOME_PREFIX}${nome}` : representante.id

    return {
      value,
      label: nome,
      icon: resolveBadgeIcon(representante.icone ?? 'Tag', { size: 16 }),
      iconColor: representante.cor,
    }
  })
}

/** Recurso (Dinheiro, VA, VR, VT) → opção de Select com ícone do catálogo */
export function recursoToSelectOption(recurso) {
  const kind = badgeKindFromRecurso(recurso.value)
  const def = kind ? getBadgeDefinition(kind) : null

  if (!def) {
    return { value: recurso.value, label: recurso.label }
  }

  return {
    value: recurso.value,
    label: recurso.label ?? def.label,
    icon: resolveBadgeIcon(def.icon, { size: 16 }),
    iconColor: def.color ?? BADGE_VARIANT_ICON_COLORS[def.variant] ?? BADGE_VARIANT_ICON_COLORS.default,
  }
}

/** Lista de recursos do formulário/filtro com ícones */
export function recursoSelectOptions(recursos = []) {
  return recursos.map(recursoToSelectOption)
}

/** Recursos do filtro — mantém "Todos" sem ícone */
export function recursoFilterOptions(recursos = []) {
  return recursos.map((item) =>
    item.value === 'TODOS' ? { value: item.value, label: item.label } : recursoToSelectOption(item)
  )
}

/** Converte lista { value, label } ou objetos customizados em opções de Select */
export function toSelectOptions(
  items = [],
  { valueKey = 'value', labelKey = 'label', iconKey, iconColorKey } = {}
) {
  return items.map((item) => {
    const option = {
      value: item[valueKey],
      label: item[labelKey],
    }
    if (iconKey && item[iconKey]) option.icon = item[iconKey]
    if (iconColorKey && item[iconColorKey]) option.iconColor = item[iconColorKey]
    return option
  })
}

/** Adiciona opção "todas/todos" no início */
export function withEmptyOption(options, { value = '', label = 'Todas' } = {}) {
  return [{ value, label }, ...options]
}

/** Categorias da API → opções de filtro (agrupa por nome; tipo refina depois) */
export function categoriaFilterOptions(categorias = []) {
  return withEmptyOption(agruparCategoriasParaFiltro(categorias), { value: '', label: 'Todas' })
}

/** Tags da API → sugestões para TagsInput */
export function tagSuggestions(tags = []) {
  return tags.map((t) => t.nome);
}
