import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'

import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

import { formatPersonName } from '@/utils/personName.js'

import { calcSaldoDivida } from '@/utils/debtBalanceUtils.js'



export function SettleDebtModal({ open, onClose, onConfirm, divida, loading }) {

  if (!divida) return null



  const nomePessoa = formatPersonName(divida.nomePessoa)

  const { valorRestante, valorTotal } = calcSaldoDivida(divida)

  const saldoTexto =

    valorRestante < valorTotal

      ? `Saldo restante: ${formatCurrency(valorRestante)} (total ${formatCurrency(valorTotal)})`

      : formatCurrency(valorTotal)



  return (

    <ConfirmModal

      isOpen={open}

      onClose={onClose}

      onConfirm={onConfirm}

      title="Marcar como quitada?"

      message={`Tem certeza que deseja quitar esta dívida? ${nomePessoa} — ${saldoTexto}. O saldo restante será registrado como pagamento e a dívida só irá para Quitadas quando o total estiver pago.`}

      confirmLabel="Confirmar"

      cancelLabel="Cancelar"

      tone="warning"

      loading={loading}

    />

  )

}


