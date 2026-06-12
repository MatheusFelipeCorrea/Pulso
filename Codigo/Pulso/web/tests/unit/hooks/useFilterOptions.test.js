import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useFilterOptions } from '@/hooks/useFilterOptions.js'

describe('hooks/useFilterOptions', () => {
  it('carrega opções automaticamente quando enabled', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ categorias: ['Casa'] })
    const { result } = renderHook(() => useFilterOptions(fetchFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual({ categorias: ['Casa'] })
    expect(result.current.error).toBeNull()
  })

  it('não faz auto-load quando enabled=false e permite reload manual', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ tags: ['Mercado'] })
    const { result } = renderHook(() => useFilterOptions(fetchFn, { enabled: false }))

    expect(result.current.loading).toBe(false)
    expect(fetchFn).not.toHaveBeenCalled()

    await result.current.reload()
    expect(fetchFn).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(result.current.data).toEqual({ tags: ['Mercado'] })
    })
  })

  it('expõe erro ao falhar no reload', async () => {
    const error = new Error('falhou')
    const fetchFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useFilterOptions(fetchFn, { enabled: false }))

    await expect(result.current.reload()).rejects.toThrow('falhou')
    await waitFor(() => {
      expect(result.current.error).toBe(error)
      expect(result.current.loading).toBe(false)
    })
  })

  it('retorna null no reload quando fetchFn não existe', async () => {
    const { result } = renderHook(() => useFilterOptions(undefined, { enabled: false }))
    await expect(result.current.reload()).resolves.toBeNull()
  })
})
