import api from './api.js'

export async function obterDashboard(params = {}, config = {}) {
  const { data } = await api.get('/dashboard', { params, ...config })
  return data
}
