import api from './api.js'

export async function syncPendingJobs(options = {}) {
  const { data } = await api.post('/sync', null, options)
  return data
}
