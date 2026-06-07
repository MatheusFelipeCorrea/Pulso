import { useCallback, useEffect, useState } from 'react'

/**
 * Hook genérico para carregar opções de filtro/formulário do backend.
 *
 * @param {() => Promise<object>} fetchFn — função que retorna metadados da API
 * @param {{ enabled?: boolean }} [options]
 */
export function useFilterOptions(fetchFn, { enabled = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    if (!fetchFn) return null

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (!enabled) return undefined
    reload().catch(() => {})
    return undefined
  }, [enabled, reload])

  return { data, loading, error, reload, setData }
}
