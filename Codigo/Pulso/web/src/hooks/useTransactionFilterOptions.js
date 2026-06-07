import { useCallback } from 'react'
import { useFilterOptions } from './useFilterOptions.js'
import * as transactionService from '@/services/transactionService.js'

/** Opções de filtro e formulário de transações — sempre do backend */
export function useTransactionFilterOptions({ enabled = true } = {}) {
  const fetchFn = useCallback(
    () => transactionService.obterOpcoesFiltro(),
    []
  )

  return useFilterOptions(fetchFn, { enabled })
}
