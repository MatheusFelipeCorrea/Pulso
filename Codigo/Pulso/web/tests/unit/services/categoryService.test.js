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
import {
  atualizarCategoria,
  criarCategoria,
  listarCategorias,
  listarIconesCategoria,
  removerCategoria,
} from '@/services/categoryService.js'

describe('services/categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista categorias com e sem tipo e lista icones', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 'c1' }] })
    api.get.mockResolvedValueOnce({ data: [{ id: 'c2' }] })
    api.get.mockResolvedValueOnce({ data: ['Tag'] })

    await expect(listarCategorias('DESPESA')).resolves.toEqual([{ id: 'c1' }])
    await expect(listarCategorias()).resolves.toEqual([{ id: 'c2' }])
    await expect(listarIconesCategoria()).resolves.toEqual(['Tag'])

    expect(api.get).toHaveBeenNthCalledWith(1, '/categorias?tipo=DESPESA')
    expect(api.get).toHaveBeenNthCalledWith(2, '/categorias')
    expect(api.get).toHaveBeenNthCalledWith(3, '/categorias/icones')
  })

  it('cria, atualiza e remove categoria', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 'c1' } })
    api.patch.mockResolvedValueOnce({ data: { id: 'c1', nome: 'Moradia' } })
    api.delete.mockResolvedValueOnce({})

    await expect(criarCategoria({ nome: 'Casa' })).resolves.toEqual({ id: 'c1' })
    await expect(atualizarCategoria('c1', { nome: 'Moradia' })).resolves.toEqual({
      id: 'c1',
      nome: 'Moradia',
    })
    await removerCategoria('c1')

    expect(api.post).toHaveBeenCalledWith('/categorias', { nome: 'Casa' })
    expect(api.patch).toHaveBeenCalledWith('/categorias/c1', { nome: 'Moradia' })
    expect(api.delete).toHaveBeenCalledWith('/categorias/c1')
  })
})
