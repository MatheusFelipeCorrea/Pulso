import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GoalCard } from '@/components/features/goals/GoalCard.jsx'

const meta = {
  id: '1',
  nome: 'Viagem para Macaé',
  valorAlvo: '2100.00',
  valorAtual: '1407.00',
  valorRestante: '693.00',
  percentual: '67.0',
  prazo: '2026-08-15T12:00:00.000Z',
  tipo: 'CURTO_PRAZO',
  status: 'ATIVA',
  valorMensalSugerido: '350.00',
  mesesRestantes: 2,
  vencida: false,
}

describe('GoalCard', () => {
  it('renderiza meta ativa', () => {
    render(<GoalCard meta={meta} />)
    expect(screen.getByText('Viagem para Macaé')).toBeInTheDocument()
  })
})
