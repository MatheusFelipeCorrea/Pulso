import api from './api.js'

export async function listarCategorias(tipo) {
  const params = tipo ? `?tipo=${tipo}` : ''
  const { data } = await api.get(`/categorias${params}`)
  return data
}

export async function listarIconesCategoria() {
  const { data } = await api.get('/categorias/icones')
  return data
}

export async function criarCategoria(body) {
  const { data } = await api.post('/categorias', body)
  return data
}

export async function atualizarCategoria(id, body) {
  const { data } = await api.patch(`/categorias/${id}`, body)
  return data
}

export async function removerCategoria(id) {
  await api.delete(`/categorias/${id}`)
}
