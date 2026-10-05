import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function listarPainel(options = {}) {
  const { data } = await api.get('/planejamento-compra', axiosConfig(options))
  return data
}

export async function criarItem(payload, options = {}) {
  const { data } = await api.post('/planejamento-compra', payload, axiosConfig(options))
  return data
}

export async function editarItem(id, payload, options = {}) {
  const { data } = await api.patch(`/planejamento-compra/${id}`, payload, axiosConfig(options))
  return data
}

export async function excluirItem(id, options = {}) {
  await api.delete(`/planejamento-compra/${id}`, axiosConfig(options))
}

export async function vincularMeta(id, payload, options = {}) {
  const { data } = await api.post(
    `/planejamento-compra/${id}/vincular-meta`,
    payload,
    axiosConfig(options)
  )
  return data
}

export async function desvincularMeta(id, options = {}) {
  const { data } = await api.delete(
    `/planejamento-compra/${id}/vincular-meta`,
    axiosConfig(options)
  )
  return data
}

export async function marcarComprado(id, payload = {}, options = {}) {
  const { data } = await api.post(
    `/planejamento-compra/${id}/comprar`,
    payload,
    axiosConfig(options)
  )
  return data
}

export async function resolverImagem(payload, options = {}) {
  const { data } = await api.post('/planejamento-compra/resolver-imagem', payload, axiosConfig(options))
  return data
}

export async function enviarImagemItem(id, file, options = {}) {
  const formData = new FormData()
  formData.append('imagem', file)
  const { data } = await api.post(`/planejamento-compra/${id}/imagem`, formData, {
    ...axiosConfig(options),
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
