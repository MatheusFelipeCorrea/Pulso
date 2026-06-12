import { describe, expect, it } from 'vitest'
import {
  deleteAccountMessage,
  deleteGenericMessage,
  deleteGoalMessage,
  deleteGroupMessage,
  deleteRecurringTransactionMessage,
  deleteReminderMessage,
  deleteTransactionMessage,
  deleteTripMessage,
  leaveGroupMessage,
} from '@/utils/confirmDeleteMessages.js'

describe('confirmDeleteMessages', () => {
  it('gera mensagens específicas com nome interpolado', () => {
    expect(deleteTransactionMessage('Mercado')).toContain('"Mercado"')
    expect(deleteRecurringTransactionMessage('Assinatura')).toContain('recorrente')
    expect(deleteGoalMessage('Reserva')).toContain('aportes')
    expect(deleteTripMessage('Férias')).toContain('dados relacionados')
    expect(deleteReminderMessage('Pagar fatura')).toContain('excluído permanentemente')
    expect(deleteGroupMessage('Time A')).toContain('todos os dados')
    expect(leaveGroupMessage('Time A')).toContain('sairá do grupo')
    expect(deleteGenericMessage('Item')).toContain('não pode ser desfeita')
  })

  it('retorna mensagem de exclusão de conta', () => {
    expect(deleteAccountMessage()).toContain('TODOS os seus dados')
  })
})
