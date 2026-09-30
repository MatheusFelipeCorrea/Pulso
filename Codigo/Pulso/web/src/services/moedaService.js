import api from './api.js'

export async function obterCatalogo(options = {}) {
  const { data } = await api.get('/moedas/catalogo', options)
  return data
}

export async function listarCotacoes(codigos = [], options = {}) {
  const params = codigos.length ? { codigos: codigos.join(',') } : {}
  const { data } = await api.get('/moedas/cotacoes', { params, ...options })
  return data
}

export async function converterMoeda({ valor, de = 'BRL', para = 'USD' }, options = {}) {
  const { data } = await api.get('/moedas/converter', {
    params: { valor, de, para },
    ...options,
  })
  return data
}

export async function obterHistorico({ codigo = 'USD', dias = 30 } = {}, options = {}) {
  const { data } = await api.get('/moedas/historico', {
    params: { codigo, dias },
    ...options,
  })
  return data
}

export async function listarFavoritas(options = {}) {
  const { data } = await api.get('/moedas/favoritas', options)
  return data
}

export async function adicionarFavorita(codigo) {
  const { data } = await api.post('/moedas/favoritas', { codigo })
  return data
}

export async function removerFavorita(codigo) {
  const { data } = await api.delete(`/moedas/favoritas/${codigo}`)
  return data
}
