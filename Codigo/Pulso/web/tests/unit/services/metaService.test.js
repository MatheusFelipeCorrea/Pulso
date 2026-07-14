import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import api from '@/services/api.js'
import { sugerirReservaEmergencia } from '@/services/metaService.js'

describe('services/metaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('busca sugestão de reserva de emergência sem parâmetros', async () => {
    api.get.mockResolvedValueOnce({
      data: { mediaGastoMensal: '1000.00', meses: 6, valorSugerido: '6000.00' },
    })

    const result = await sugerirReservaEmergencia()

    expect(api.get).toHaveBeenCalledWith('/metas/sugestao-reserva-emergencia?', { signal: undefined })
    expect(result).toEqual({ mediaGastoMensal: '1000.00', meses: 6, valorSugerido: '6000.00' })
  })

  it('inclui meses customizado na query', async () => {
    api.get.mockResolvedValueOnce({ data: { valorSugerido: '3000.00' } })

    await sugerirReservaEmergencia({ meses: 3 })

    expect(api.get).toHaveBeenCalledWith('/metas/sugestao-reserva-emergencia?meses=3', {
      signal: undefined,
    })
  })
})
