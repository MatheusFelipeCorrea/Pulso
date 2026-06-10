import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function obterVisaoMes(mes, options = {}) {
  const params = new URLSearchParams()
  if (mes) params.set('mes', mes)
  const { data } = await api.get(`/calendario/mes?${params.toString()}`, axiosConfig(options))
  return data
}

export async function obterDetalheDia(data, options = {}) {
  const params = new URLSearchParams({ data })
  const response = await api.get(`/calendario/dia?${params.toString()}`, axiosConfig(options))
  return response.data
}

export async function obterStatusGoogle(options = {}) {
  const { data } = await api.get('/calendario/google/status', axiosConfig(options))
  return data
}

export async function obterUrlGoogle(options = {}) {
  const { data } = await api.get('/calendario/google/url', axiosConfig(options))
  return data
}

export async function desconectarGoogle(options = {}) {
  await api.post('/calendario/google/desconectar', {}, axiosConfig(options))
}

export async function obterPendentesSyncGoogle(options = {}) {
  const { data } = await api.get('/calendario/google/sync/pendentes', axiosConfig(options))
  return data
}

export async function sincronizarPendentesGoogle(escopo = 'futuros', options = {}) {
  const { data } = await api.post(
    '/calendario/google/sync',
    { escopo },
    axiosConfig(options)
  )
  return data
}
