import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDebtStatusBadge, getDebtSummaryText } from '@/utils/debtStatusUtils.js'

describe('debtStatusUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna status de dívida quitada com data formatada', () => {
    expect(
      getDebtStatusBadge({
        quitada: true,
        dataQuitacao: '2026-06-10',
      })
    ).toEqual({
      label: 'Quitada em 10/06/2026',
      variant: 'success',
      tone: 'green',
    })
  })

  it('retorna status sem prazo definido quando não há prazo', () => {
    expect(getDebtStatusBadge({ quitada: false })).toEqual({
      label: 'Sem prazo definido',
      variant: 'neutral',
      tone: 'gray',
    })
  })

  it('retorna status vencida, hoje e em 2 dias', () => {
    expect(getDebtStatusBadge({ quitada: false, prazoDevolucao: '2026-06-14' }).label).toBe(
      'Vencida há 1 dia'
    )
    expect(getDebtStatusBadge({ quitada: false, prazoDevolucao: '2026-06-15' }).label).toBe(
      'Vence hoje'
    )
    expect(getDebtStatusBadge({ quitada: false, prazoDevolucao: '2026-06-17' }).label).toBe(
      'Vence em 2 dias'
    )
  })

  it('retorna status futuro com data formatada', () => {
    expect(getDebtStatusBadge({ quitada: false, prazoDevolucao: '2026-06-25' })).toEqual({
      label: 'Vence em 25/06/2026',
      variant: 'success',
      tone: 'green',
    })
  })

  it('gera texto-resumo por direção da dívida', () => {
    expect(getDebtSummaryText({ direcao: 'EU_DEVO', nomePessoa: 'Ana', valor: 120 })).toEqual({
      linha: 'Você deve R$ 120,00',
      sublinha: 'para Ana',
    })

    expect(getDebtSummaryText({ direcao: 'ME_DEVEM', nomePessoa: 'Bruno', valor: 90 })).toEqual({
      linha: 'Bruno te deve',
      sublinha: 'R$ 90,00',
    })
  })
})
