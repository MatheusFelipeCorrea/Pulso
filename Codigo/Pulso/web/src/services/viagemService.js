import api from './api.js'

export async function obterMediaPassagem(viagemId, options = {}) {
  const { data } = await api.get(`/viagens/${viagemId}/media-passagem`, options)
  return data
}

export async function buscarViagem(id, options = {}) {
  const { data } = await api.get(`/viagens/${id}`, options)
  return data
}

export async function listarViagens(options = {}) {
  const { data } = await api.get('/viagens', options)
  return data
}

export async function obterResumo(options = {}) {
  const { data } = await api.get('/viagens/resumo', options)
  return data
}

export async function criarViagem(payload) {
  const { data } = await api.post('/viagens', payload)
  return data
}

export async function editarViagem(id, payload) {
  const { data } = await api.patch(`/viagens/${id}`, payload)
  return data
}

export async function excluirViagem(id) {
  await api.delete(`/viagens/${id}`)
}

export async function criarDespesa(viagemId, payload) {
  const { data } = await api.post(`/viagens/${viagemId}/despesas`, payload)
  return data
}

export async function editarDespesa(viagemId, despesaId, payload) {
  const { data } = await api.patch(`/viagens/${viagemId}/despesas/${despesaId}`, payload)
  return data
}

export async function excluirDespesa(viagemId, despesaId) {
  const { data } = await api.delete(`/viagens/${viagemId}/despesas/${despesaId}`)
  return data
}

export async function criarObservacao(viagemId, payload) {
  const { data } = await api.post(`/viagens/${viagemId}/observacoes`, payload)
  return data
}

export async function editarObservacao(viagemId, observacaoId, payload) {
  const { data } = await api.patch(`/viagens/${viagemId}/observacoes/${observacaoId}`, payload)
  return data
}

export async function excluirObservacao(viagemId, observacaoId) {
  const { data } = await api.delete(`/viagens/${viagemId}/observacoes/${observacaoId}`)
  return data
}
