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
    alterarPapelMembroGrupo,
    atualizarModoDivisaoGrupo,
    buscarGrupo,
    criarDespesaViagemGrupo,
    criarGrupo,
    criarMetasGrupo,
    criarViagemGrupo,
    desvincularViagemGrupo,
    editarDespesaViagemGrupo,
    editarGrupo,
    editarViagemGrupo,
    entrarNoGrupo,
    enviarImagemGrupo,
    enviarMensagemGrupo,
    excluirDespesaViagemGrupo,
    excluirGrupo,
    listarGrupos,
    listarMensagensGrupo,
    obterMediaPassagemViagemGrupo,
    previewGrupoPorCodigo,
    registrarAporteGrupo,
    removerMembroGrupo,
    renovarCodigoConviteGrupo,
    sairDoGrupo,
} from '@/services/grupoService.js'

describe('services/grupoService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        api.get.mockResolvedValue({ data: { ok: true } })
        api.post.mockResolvedValue({ data: { ok: true } })
        api.patch.mockResolvedValue({ data: { ok: true } })
        api.delete.mockResolvedValue({ data: { ok: true } })
    })

    it('cobre os endpoints de grupo', async () => {
        await listarGrupos({ signal: 's' })
        await buscarGrupo('g1')
        await criarGrupo({ nome: 'Casa' })
        await editarGrupo('g1', { nome: 'Apê' })
        await atualizarModoDivisaoGrupo('g1', 'IGUAL')
        await enviarImagemGrupo('g1', new File(['x'], 'foto.png'))
        await excluirGrupo('g1')
        await sairDoGrupo('g1')
        await criarViagemGrupo('g1', { destino: 'SP' })
        await obterMediaPassagemViagemGrupo('g1', { origem: 'CNF' })
        await obterMediaPassagemViagemGrupo('g1', {})
        await criarDespesaViagemGrupo('g1', { valor: 10 })
        await editarDespesaViagemGrupo('g1', 'd1', { valor: 20 })
        await excluirDespesaViagemGrupo('g1', 'd1')
        await criarMetasGrupo('g1', [{ titulo: 'm' }])
        await registrarAporteGrupo('g1', 'm1', { valor: 5 })
        await enviarMensagemGrupo('g1', { texto: 'oi' })
        await listarMensagensGrupo('g1')
        await previewGrupoPorCodigo('PULSO-AB12')
        await entrarNoGrupo('PULSO-AB12')
        await removerMembroGrupo('g1', 'u1')
        await alterarPapelMembroGrupo('g1', 'u1', 'ADMIN')
        await renovarCodigoConviteGrupo('g1')
        await editarViagemGrupo('g1', { destino: 'RJ' })
        await desvincularViagemGrupo('g1')

        expect(api.get).toHaveBeenCalled()
        expect(api.post).toHaveBeenCalled()
        expect(api.patch).toHaveBeenCalled()
        expect(api.delete).toHaveBeenCalled()
    })
})
