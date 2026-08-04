import { describe, expect, it } from 'vitest'
import { validarRecursoCategoria, validarTransferencia } from '@/utils/transactionValidation.js'

describe('validarRecursoCategoria', () => {
  it('retorna null para tipo diferente de despesa ou recurso DINHEIRO', () => {
    expect(validarRecursoCategoria('VA', { nome: 'Alimentação' }, 'RECEITA')).toBeNull()
    expect(validarRecursoCategoria('DINHEIRO', { nome: 'Transporte' }, 'DESPESA')).toBeNull()
  })

  it('valida regras para VA e VR', () => {
    expect(validarRecursoCategoria('VA', { nome: 'Saúde' }, 'DESPESA')).toMatch(
      /não aceita Vale Alimentação/
    )
    expect(validarRecursoCategoria('VR', { nome: 'Transporte' }, 'DESPESA')).toMatch(
      /não aceita Vale Refeição/
    )
  })

  it('aceita VA com grupoBeneficio explícito ou alias exato', () => {
    expect(validarRecursoCategoria('VA', { nome: 'Mercado', grupoBeneficio: 'COMPRAS' }, 'DESPESA')).toBeNull()
    expect(validarRecursoCategoria('VA', { nome: 'Mercado' }, 'DESPESA')).toBeNull()
    expect(validarRecursoCategoria('VA', { nome: 'Shopping' }, 'DESPESA')).toMatch(/não aceita Vale Alimentação/)
  })

  it('valida regras para VT com normalização de acentos', () => {
    expect(validarRecursoCategoria('VT', { nome: 'Alimentação' }, 'DESPESA')).toBe(
      'Não é possível usar VT na categoria "Alimentação". VT não vale para alimentação.'
    )
    expect(validarRecursoCategoria('VT', { nome: 'Comprás' }, 'DESPESA')).toMatch(
      /não aceita Vale Transporte/
    )
    expect(validarRecursoCategoria('VT', { nome: 'Transporte' }, 'DESPESA')).toBeNull()
  })
})

describe('validarTransferencia', () => {
  it('retorna null quando recurso e destino ainda não foram escolhidos', () => {
    expect(validarTransferencia(null, null)).toBeNull()
    expect(validarTransferencia('DINHEIRO', null)).toBeNull()
  })

  it('retorna null quando origem e destino são diferentes', () => {
    expect(validarTransferencia('DINHEIRO', 'POUPANCA')).toBeNull()
  })

  it('retorna erro quando origem e destino são iguais', () => {
    expect(validarTransferencia('DINHEIRO', 'DINHEIRO')).toBe(
      'Recurso de destino deve ser diferente do recurso de origem'
    )
  })
})
