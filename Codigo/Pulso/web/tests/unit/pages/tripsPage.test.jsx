import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import TripsPage from '@/pages/TripsPage.jsx'

vi.mock('@/services/moedaService.js', () => ({
  obterCatalogo: vi.fn().mockResolvedValue({
    moedas: [
      { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷' },
      { code: 'USD', name: 'Dólar Americano', symbol: 'US$', flag: '🇺🇸' },
    ],
  }),
  listarFavoritas: vi.fn().mockResolvedValue({ favoritas: [], atualizadoEm: null }),
  converterMoeda: vi.fn().mockResolvedValue({
    valorConvertido: '178.57',
    taxa: '0.1786',
  }),
  obterHistorico: vi.fn().mockResolvedValue({
    pontos: [],
    resumo: { atual: '5.60', minima: '5.12', maxima: '5.82', variacao: '0.42' },
  }),
}))

vi.mock('@/services/viagemService.js', () => ({
  listarViagens: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/services/metaService.js', () => ({
  buscarMetas: vi.fn().mockResolvedValue({ metas: [] }),
  criarMeta: vi.fn(),
}))

vi.mock('@/design-system/components/feedback/Toast/useToast.js', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}))

describe('TripsPage', () => {
  it('renderiza sem quebrar', async () => {
    render(
      <MemoryRouter>
        <TripsPage />
      </MemoryRouter>
    )
    expect(await screen.findByText('Viagens e Moedas')).toBeInTheDocument()
  })
})
