import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/useFilterOptions.js', () => ({
  useFilterOptions: vi.fn(() => ({ data: { categorias: [] }, loading: false })),
}))

vi.mock('@/services/transactionService.js', () => ({
  obterOpcoesFiltro: vi.fn().mockResolvedValue({ categorias: ['Casa'] }),
}))

import { useFilterOptions } from '@/hooks/useFilterOptions.js'
import * as transactionService from '@/services/transactionService.js'
import { useTransactionFilterOptions } from '@/hooks/useTransactionFilterOptions.js'

describe('hooks/useTransactionFilterOptions', () => {
  it('delegates para useFilterOptions com callback de serviço', async () => {
    const { result } = renderHook(() => useTransactionFilterOptions({ enabled: false }))

    expect(result.current).toEqual({ data: { categorias: [] }, loading: false })
    expect(useFilterOptions).toHaveBeenCalledTimes(1)
    expect(useFilterOptions).toHaveBeenCalledWith(expect.any(Function), { enabled: false })

    const fetchFn = useFilterOptions.mock.calls[0][0]
    await expect(fetchFn()).resolves.toEqual({ categorias: ['Casa'] })
    expect(transactionService.obterOpcoesFiltro).toHaveBeenCalledTimes(1)
  })
})
