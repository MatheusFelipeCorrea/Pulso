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
import { criarTag, editarTag, excluirTag, listarTags } from '@/services/tagService.js'

describe('services/tagService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('lista e cria tags', async () => {
        api.get.mockResolvedValueOnce({ data: [{ id: 't1', nome: 'Mercado' }] })
        api.post.mockResolvedValueOnce({ data: { id: 't2', nome: 'Casa' } })

        await expect(listarTags()).resolves.toEqual([{ id: 't1', nome: 'Mercado' }])
        await expect(criarTag('Casa')).resolves.toEqual({ id: 't2', nome: 'Casa' })

        expect(api.get).toHaveBeenCalledWith('/tags')
        expect(api.post).toHaveBeenCalledWith('/tags', { nome: 'Casa' })
    })

    it('edita e exclui tag', async () => {
        api.patch.mockResolvedValueOnce({ data: { id: 't1', nome: 'Novo' } })
        api.delete.mockResolvedValueOnce({})
        await expect(editarTag('t1', { nome: 'Novo' })).resolves.toEqual({ id: 't1', nome: 'Novo' })
        await excluirTag('t1')
        expect(api.patch).toHaveBeenCalledWith('/tags/t1', { nome: 'Novo' })
        expect(api.delete).toHaveBeenCalledWith('/tags/t1')
    })
})
