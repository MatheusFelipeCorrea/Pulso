import api from './api.js'

export async function listarTags() {
  const { data } = await api.get('/tags')
  return data
}

export async function criarTag(nome) {
  const { data } = await api.post('/tags', { nome })
  return data
}
