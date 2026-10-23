import api from './api.js'

export async function analisarExtrato({ arquivo, origem, mapeamento }, { signal } = {}) {
  const formData = new FormData()
  formData.append('arquivo', arquivo)
  formData.append('origem', origem)
  if (mapeamento) {
    formData.append('mapeamento', JSON.stringify(mapeamento))
  }

  const { data } = await api.post('/importacoes/analisar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal,
  })
  return data
}

export async function confirmarImportacao(payload) {
  const { data } = await api.post('/importacoes/confirmar', payload)
  return data
}
