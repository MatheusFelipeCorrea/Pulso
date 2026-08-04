import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GoalsPage from '@/pages/GoalsPage.jsx'

vi.mock('@/services/metaService.js', () => ({
  obterResumo: vi.fn().mockResolvedValue({
    totalEmMetas: '0.00',
    totalAcumulado: '0.00',
    progressoMedio: '0.0',
    metasAtivas: 0,
    sugestaoMensal: '0.00',
    categorias: {
      curtoPrazo: { quantidade: 0, total: 0 },
      longoPrazo: { quantidade: 0, total: 0 },
      concluidas: { quantidade: 0, total: 0 },
      pausadas: { quantidade: 0, total: 0 },
    },
    contadores: { todas: 0, ativas: 0, pausadas: 0, concluidas: 0 },
    atividadeRecente: [],
  }),
  buscarMetas: vi.fn().mockResolvedValue({ metas: [], total: 0, paginas: 1, pagina: 1 }),
}))

vi.mock('@/design-system/components/feedback/Toast/useToast.js', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('GoalsPage', () => {
  it('renderiza sem quebrar', async () => {
    Element.prototype.scrollIntoView = vi.fn()
    render(<GoalsPage />)
    expect(await screen.findByText('Metas Financeiras')).toBeInTheDocument()
  })
})
