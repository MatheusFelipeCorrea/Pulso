import { describe, expect, it } from 'vitest'
import {
    AJUSTE_SALDO_IMPORTACAO_DESCRICAO,
    categoriaCompativelImportacao,
    isAjusteSaldoImportacao,
    isOrigemBeneficio,
    isOrigemComSaldoExtrato,
} from '@/utils/importBeneficioUtils.js'

describe('importBeneficioUtils', () => {
    it('reconhece origem e ajuste', () => {
        expect(isAjusteSaldoImportacao(AJUSTE_SALDO_IMPORTACAO_DESCRICAO)).toBe(true)
        expect(isAjusteSaldoImportacao('Almoço')).toBe(false)
        expect(isOrigemBeneficio('VA')).toBe(true)
        expect(isOrigemBeneficio('DINHEIRO')).toBe(false)
        expect(isOrigemComSaldoExtrato('CONTA')).toBe(true)
    })

    it('filtra categoria por benefício', () => {
        const alimentacao = { tipo: 'DESPESA', nome: 'Alimentação', grupoBeneficio: 'ALIMENTACAO' }
        const compras = { tipo: 'DESPESA', nome: 'Compras' }
        expect(categoriaCompativelImportacao(null, 'VA', 'DESPESA')).toBe(false)
        expect(categoriaCompativelImportacao(alimentacao, 'DINHEIRO', 'DESPESA')).toBe(true)
        expect(categoriaCompativelImportacao(alimentacao, 'VA', 'RECEITA')).toBe(false)
        expect(
            categoriaCompativelImportacao({ ...alimentacao, tipo: 'RECEITA' }, 'VA', 'RECEITA')
        ).toBe(true)
        expect(categoriaCompativelImportacao(alimentacao, 'VR', 'DESPESA')).toBe(true)
        expect(categoriaCompativelImportacao(alimentacao, 'VA', 'DESPESA')).toBe(true)
        expect(categoriaCompativelImportacao(compras, 'VR', 'DESPESA')).toBe(false)
        expect(
            categoriaCompativelImportacao({ tipo: 'DESPESA', nome: 'Transporte' }, 'VT', 'DESPESA')
        ).toBe(true)
    })
})
