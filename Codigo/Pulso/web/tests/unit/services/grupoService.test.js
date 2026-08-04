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
import { atualizarModoDivisaoGrupo } from '@/services/grupoService.js'

describe('services/grupoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('atualiza o modo de divisão do grupo', async () => {
    api.patch.mockResolvedValueOnce({ data: { id: 'grupo-1', modoDivisao: 'IGUAL' } })

    const result = await atualizarModoDivisaoGrupo('grupo-1', 'IGUAL')

    expect(api.patch).toHaveBeenCalledWith('/grupos/grupo-1/modo-divisao', { modoDivisao: 'IGUAL' })
    expect(result).toEqual({ id: 'grupo-1', modoDivisao: 'IGUAL' })
  })
})
