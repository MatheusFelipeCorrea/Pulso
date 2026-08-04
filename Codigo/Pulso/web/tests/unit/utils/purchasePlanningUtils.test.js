import { describe, expect, it } from 'vitest'
import {
  calcComprometimentoParcela,
  getComprometimentoNivel,
  shouldShowImpactAlert,
} from '@/utils/purchasePlanningUtils.js'

describe('purchasePlanningUtils', () => {
  it('calcula parcela e percentual de comprometimento', () => {
    const result = calcComprometimentoParcela(4000, 12, 5000)
    expect(result.parcela).toBeCloseTo(333.33, 1)
    expect(result.percentual).toBe(6.7)
    expect(result.nivel).toBe('saudavel')
  })

  it('marca nível de atenção e arriscado conforme o percentual', () => {
    expect(calcComprometimentoParcela(3000, 12, 500).nivel).toBe('arriscado')
    expect(calcComprometimentoParcela(1350, 12, 450).nivel).toBe('atencao')
  })

  it('retorna saudável sem estourar quando não há renda cadastrada', () => {
    const result = calcComprometimentoParcela(4000, 12, 0)
    expect(result.percentual).toBe(0)
    expect(result.nivel).toBe('saudavel')
  })

  it('usa parcelas mínimas de 1 mesmo com valor inválido', () => {
    const result = calcComprometimentoParcela(1200, 0, 1200)
    expect(result.parcela).toBe(1200)
  })

  it('mostra o alerta de impacto apenas acima de 20%', () => {
    expect(shouldShowImpactAlert(20)).toBe(false)
    expect(shouldShowImpactAlert(20.1)).toBe(true)
  })

  it('classifica o nível de comprometimento pelos mesmos limiares do backend', () => {
    expect(getComprometimentoNivel(20)).toBe('saudavel')
    expect(getComprometimentoNivel(25)).toBe('atencao')
    expect(getComprometimentoNivel(35)).toBe('arriscado')
  })
})
