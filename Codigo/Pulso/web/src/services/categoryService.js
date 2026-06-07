import api from './api.js'

export async function listarCategorias(tipo) {
  const params = tipo ? `?tipo=${tipo}` : ''
  const { data } = await api.get(`/categorias${params}`)
  return data
}
