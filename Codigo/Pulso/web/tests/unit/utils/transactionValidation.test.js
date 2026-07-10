import { describe, expect, it } from 'vitest'
import { validarRecursoCategoria, validarTransferencia } from '@/utils/transactionValidation.js'

describe('validarRecursoCategoria', () => {
  it('retorna null para tipo diferente de despesa ou recurso DINHEIRO', () => {
    expect(validarRecursoCategoria('VA', 'Alimentação', 'RECEITA')).toBeNull()
    expect(validarRecursoCategoria('DINHEIRO', 'Transporte', 'DESPESA')).toBeNull()
  })

  it('valida regras para VA e VR', () => {
    expect(validarRecursoCategoria('VA', 'Saúde', 'DESPESA')).toBe(
      'VA só pode ser usado em despesas de Alimentação ou Compras'
    )
    expect(validarRecursoCategoria('VR', 'Transporte', 'DESPESA')).toBe(
      'VR só pode ser usado em despesas de Alimentação'
    )
  })

  it('valida regras para VT com normalização de acentos', () => {
    expect(validarRecursoCategoria('VT', 'Alimentação', 'DESPESA')).toBe(
      'Não é possível usar VT para despesas de alimentação'
    )
    expect(validarRecursoCategoria('VT', 'Comprás', 'DESPESA')).toBe(
      'VT só pode ser usado em despesas de Transporte'
    )
    expect(validarRecursoCategoria('VT', 'Transporte', 'DESPESA')).toBeNull()
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
