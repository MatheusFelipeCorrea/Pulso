import { describe, expect, it } from 'vitest'
import {
    calcMesesAtePrazo,
    calcProgressoMeta,
    calcValorMensalSugerido,
    inferirTipoMeta,
    podeReceberAporte,
    roundMoney,
} from '@/utils/goalBalanceUtils.js'

describe('goalBalanceUtils', () => {
    it('calcula progresso e arredonda', () => {
        expect(roundMoney(10.555)).toBe(10.56)
        expect(calcProgressoMeta({ valorAlvo: 1000, valorAtual: 250 })).toMatchObject({
            percentual: 25,
            valorRestante: 750,
        })
        expect(calcProgressoMeta({ valorAlvo: 0, valorAtual: 10 }).percentual).toBe(0)
    })

    it('infere prazo e aporte', () => {
        const emUmMes = new Date()
        emUmMes.setMonth(emUmMes.getMonth() + 2)
        expect(inferirTipoMeta(null)).toBe('LONGO_PRAZO')
        expect(inferirTipoMeta(emUmMes.toISOString())).toBe('CURTO_PRAZO')
        const emUmAno = new Date()
        emUmAno.setFullYear(emUmAno.getFullYear() + 1)
        expect(inferirTipoMeta(emUmAno.toISOString())).toBe('LONGO_PRAZO')
        expect(podeReceberAporte({ status: 'ATIVA' })).toBe(true)
        expect(podeReceberAporte({ status: 'PAUSADA' })).toBe(false)
        expect(calcMesesAtePrazo(null)).toBeNull()
        expect(calcValorMensalSugerido(1000, 1000, emUmAno.toISOString())).toBe(0)
        expect(calcValorMensalSugerido(1200, 0, emUmAno.toISOString())).toBeGreaterThan(0)
    })
})
