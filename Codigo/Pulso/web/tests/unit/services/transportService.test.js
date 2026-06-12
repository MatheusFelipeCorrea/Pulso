import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

import api from '@/services/api.js'
import {
  atualizarVtHabilitado,
  listarUsos,
  listarVendas,
  obterSaldo,
  registrarUso,
  registrarVenda,
} from '@/services/transportService.js'

describe('services/transportService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtem saldo e lista vendas/usos com paginação', async () => {
    const signal = new AbortController().signal
    api.get.mockResolvedValueOnce({ data: { saldo: 120 } })
    api.get.mockResolvedValueOnce({ data: [{ id: 'v1' }] })
    api.get.mockResolvedValueOnce({ data: [{ id: 'u1' }] })

    await expect(obterSaldo('30d', { signal })).resolves.toEqual({ saldo: 120 })
    await expect(listarVendas('7d', 2, 15, { signal })).resolves.toEqual([{ id: 'v1' }])
    await expect(listarUsos(undefined, 3, 5, { signal })).resolves.toEqual([{ id: 'u1' }])

    expect(api.get).toHaveBeenNthCalledWith(1, '/transporte/saldo?periodo=30d', { signal })
    expect(api.get).toHaveBeenNthCalledWith(2, '/transporte/vendas?periodo=7d&pagina=2&limite=15', { signal })
    expect(api.get).toHaveBeenNthCalledWith(3, '/transporte/usos?pagina=3&limite=5', { signal })
  })

  it('registra vendas/usos e atualiza flag de VT', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 'v1' } })
    api.post.mockResolvedValueOnce({ data: { id: 'u1' } })
    api.patch.mockResolvedValueOnce({ data: { vtHabilitado: true } })

    await expect(registrarVenda({ valor: 200 })).resolves.toEqual({ id: 'v1' })
    await expect(registrarUso({ valor: 6 })).resolves.toEqual({ id: 'u1' })
    await expect(atualizarVtHabilitado(true)).resolves.toEqual({ vtHabilitado: true })

    expect(api.post).toHaveBeenNthCalledWith(1, '/transporte/vendas', { valor: 200 })
    expect(api.post).toHaveBeenNthCalledWith(2, '/transporte/usos', { valor: 6 })
    expect(api.patch).toHaveBeenCalledWith('/transporte/vt-habilitado', { vtHabilitado: true })
  })
})
