import api from './api.js'

const axiosConfig = (options = {}) => ({
  signal: options.signal,
})

export async function obterSaldo(periodo, options = {}) {
  const params = new URLSearchParams()
  if (periodo) params.set('periodo', periodo)
  const { data } = await api.get(`/transporte/saldo?${params.toString()}`, axiosConfig(options))
  return data
}

export async function listarVendas(periodo, pagina = 1, limite = 10, options = {}) {
  const params = new URLSearchParams()
  if (periodo) params.set('periodo', periodo)
  params.set('pagina', String(pagina))
  params.set('limite', String(limite))
  const { data } = await api.get(`/transporte/vendas?${params.toString()}`, axiosConfig(options))
  return data
}

export async function listarUsos(periodo, pagina = 1, limite = 10, options = {}) {
  const params = new URLSearchParams()
  if (periodo) params.set('periodo', periodo)
  params.set('pagina', String(pagina))
  params.set('limite', String(limite))
  const { data } = await api.get(`/transporte/usos?${params.toString()}`, axiosConfig(options))
  return data
}

export async function registrarVenda(payload) {
  const { data } = await api.post('/transporte/vendas', payload)
  return data
}

export async function registrarUso(payload) {
  const { data } = await api.post('/transporte/usos', payload)
  return data
}

export async function atualizarVtHabilitado(vtHabilitado) {
  const { data } = await api.patch('/transporte/vt-habilitado', { vtHabilitado })
  return data
}
