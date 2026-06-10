import { CATEGORIA_FILTRO_NOME_PREFIX } from './filterOptions.js'

function nomeCategoria(item) {
  return item.categoriaNome ?? item.nome ?? ''
}

function idCategoria(item) {
  return item.categoriaId ?? item.id ?? null
}

export function categoriaPassaFiltroOrcamento(item, categoriaFiltro) {
  if (!categoriaFiltro) return true

  const nome = nomeCategoria(item)
  const id = idCategoria(item)

  if (
    typeof categoriaFiltro === 'string' &&
    categoriaFiltro.startsWith(CATEGORIA_FILTRO_NOME_PREFIX)
  ) {
    return nome === categoriaFiltro.slice(CATEGORIA_FILTRO_NOME_PREFIX.length)
  }

  return id === categoriaFiltro
}

/** Filtros locais (busca, categoria, tipo) sobre listas de orçamento */
export function filtrarCategoriasOrcamento(categorias = [], filtros = {}) {
  if (filtros.tipo === 'RECEITA') return []

  let list = categorias
  const busca = filtros.busca?.trim().toLowerCase()

  if (busca) {
    list = list.filter((item) => nomeCategoria(item).toLowerCase().includes(busca))
  }

  if (filtros.categoria) {
    list = list.filter((item) => categoriaPassaFiltroOrcamento(item, filtros.categoria))
  }

  return list
}
