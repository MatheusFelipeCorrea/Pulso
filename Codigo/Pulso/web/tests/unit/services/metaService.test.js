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
    atualizarMeta,
    buscarMetas,
    criarMeta,
    excluirAporte,
    excluirMeta,
    obterResumo,
    pausarMeta,
    registrarAporte,
    retomarMeta,
    sugerirReservaEmergencia,
} from '@/services/metaService.js'

describe('services/metaService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('busca sugestão de reserva de emergência sem parâmetros', async () => {
        api.get.mockResolvedValueOnce({
            data: { mediaGastoMensal: '1000.00', meses: 6, valorSugerido: '6000.00' },
        })

        const result = await sugerirReservaEmergencia()

        expect(api.get).toHaveBeenCalledWith('/metas/sugestao-reserva-emergencia?', {
            signal: undefined,
        })
        expect(result).toEqual({ mediaGastoMensal: '1000.00', meses: 6, valorSugerido: '6000.00' })
    })

    it('inclui meses customizado na query', async () => {
        api.get.mockResolvedValueOnce({ data: { valorSugerido: '3000.00' } })

        await sugerirReservaEmergencia({ meses: 3 })

        expect(api.get).toHaveBeenCalledWith('/metas/sugestao-reserva-emergencia?meses=3', {
            signal: undefined,
        })
    })

    it('lista, cria, atualiza, aporta e exclui', async () => {
        api.get.mockResolvedValueOnce({
            data: [{ id: 'm1' }],
            headers: { 'x-total-count': '1', 'x-total-pages': '1', 'x-current-page': '1' },
        })
        api.get.mockResolvedValueOnce({ data: { total: 1 } })
        api.post.mockResolvedValue({ data: { id: 'm1' } })
        api.patch.mockResolvedValue({ data: { id: 'm1', status: 'PAUSADA' } })
        api.delete.mockResolvedValue({ data: { ok: true } })

        const list = await buscarMetas({
            status: 'ATIVA',
            tipo: 'CURTO_PRAZO',
            busca: 'viagem',
            prazoInicio: '2026-01-01',
            prazoFim: '2026-12-31',
            pagina: 2,
            limite: 10,
        })
        expect(list.metas).toHaveLength(1)
        expect(list.total).toBe(1)
        await obterResumo()
        await criarMeta({ titulo: 'X' })
        await atualizarMeta('m1', { titulo: 'Y' })
        await registrarAporte('m1', { valor: 10 })
        await excluirAporte('m1', 'a1')
        await excluirMeta('m1')
        await pausarMeta('m1')
        await retomarMeta('m1')
        expect(api.delete).toHaveBeenCalled()
    })
})
