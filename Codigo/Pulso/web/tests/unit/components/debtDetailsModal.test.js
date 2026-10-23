import { describe, expect, it } from 'vitest'
import { getPaymentHistoryText } from '@/components/features/debts/DebtDetailsModal.jsx'

describe('getPaymentHistoryText', () => {
  it('descreve pagamento recebido', () => {
    const texto = getPaymentHistoryText(
      { direcao: 'ME_DEVEM', nomePessoa: 'Daniel' },
      { valor: 30 }
    )

    expect(texto).toBe('Daniel pagou R$ 30,00')
  })

  it('descreve pagamento feito por mim', () => {
    const texto = getPaymentHistoryText(
      { direcao: 'EU_DEVO', nomePessoa: 'Ana' },
      { valor: 40 }
    )

    expect(texto).toBe('Você pagou R$ 40,00 para Ana')
  })
})
