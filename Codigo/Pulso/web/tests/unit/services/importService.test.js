import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/api.js', () => ({
    default: {
        post: vi.fn(),
    },
}))

import api from '@/services/api.js'
import { analisarExtrato, confirmarImportacao } from '@/services/importService.js'

describe('services/importService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('envia o arquivo e o mapeamento opcional para analise', async () => {
        const arquivo = new File(['a'], 'extrato.pdf', { type: 'application/pdf' })
        const signal = new AbortController().signal
        api.post.mockResolvedValueOnce({ data: { linhas: 2 } })

        const result = await analisarExtrato(
            { arquivo, origem: 'CONTA', mapeamento: { data: 'A' } },
            { signal }
        )

        expect(result).toEqual({ linhas: 2 })
        const [url, body, config] = api.post.mock.calls[0]
        expect(url).toBe('/importacoes/analisar')
        expect(body).toBeInstanceOf(FormData)
        expect(body.get('origem')).toBe('CONTA')
        expect(body.get('mapeamento')).toBe(JSON.stringify({ data: 'A' }))
        expect(config.signal).toBe(signal)
    })

    it('confirma a importacao e omite mapeamento ausente', async () => {
        api.post.mockResolvedValueOnce({ data: { importadas: 1 } })
        api.post.mockResolvedValueOnce({ data: { ok: true } })

        await analisarExtrato({ arquivo: new File(['b'], 'b.pdf'), origem: 'VA' })
        const confirmado = await confirmarImportacao({ ids: ['1'] })

        expect(confirmado).toEqual({ ok: true })
        expect(api.post.mock.calls[0][0]).toBe('/importacoes/analisar')
        expect(api.post.mock.calls[0][1].get('mapeamento')).toBeNull()
        expect(api.post.mock.calls[1]).toEqual(['/importacoes/confirmar', { ids: ['1'] }])
    })
})
