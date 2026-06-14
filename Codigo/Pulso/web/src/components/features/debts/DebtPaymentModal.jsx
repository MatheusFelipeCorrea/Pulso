import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, CircleDollarSign, MessageSquare, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { formatPersonName } from '@/utils/personName.js'
import { calcSaldoDivida } from '@/utils/debtBalanceUtils.js'

export function DebtPaymentModal({ open, onClose, onSubmit, submitting = false, divida = null }) {
  const [valor, setValor] = useState(0)
  const [dataPagamento, setDataPagamento] = useState(new Date())
  const [observacao, setObservacao] = useState('')
  const [error, setError] = useState('')

  const saldo = useMemo(() => (divida ? calcSaldoDivida(divida) : null), [divida])
  const nomePessoa = formatPersonName(divida?.nomePessoa)

  useEffect(() => {
    if (!open || !divida) return
    setError('')
    setDataPagamento(new Date())
    setObservacao('')
    setValor(0)
  }, [open, divida?.id])

  const quitaPorCompleto = Boolean(saldo && valor > 0 && valor >= saldo.valorRestante)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!valor || valor <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }
    if (saldo && valor > saldo.valorRestante) {
      setError('Valor não pode ser maior que o saldo restante.')
      return
    }

    try {
      await onSubmit?.({
        valor,
        dataPagamento: dataPagamento.toISOString(),
        observacao: observacao.trim() || null,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível registrar o pagamento.')
    }
  }

  if (!divida) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="debt-payment-modal">
      <form className="debt-payment-form" onSubmit={handleSubmit}>
        <header className="debt-payment-form__header">
          <div>
            <h2>Registrar pagamento</h2>
            <p>
              {nomePessoa} · saldo restante {formatCurrency(saldo?.valorRestante ?? 0)}
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="debt-payment-form__body">
          <InputMoney
            label={
              <FormFieldLabel icon={CircleDollarSign} tone="green">
                Valor do pagamento
              </FormFieldLabel>
            }
            value={valor}
            onChange={setValor}
            helperText="Informe só o valor recebido agora — pagamento parcial não move a dívida para Quitadas."
          />

          {quitaPorCompleto ? (
            <p className="debt-payment-form__hint debt-payment-form__hint--warning">
              Este valor zera o saldo e a dívida irá para a aba Quitadas automaticamente.
            </p>
          ) : null}

          <DatePicker
            label={
              <FormFieldLabel icon={Calendar} tone="purple">
                Data do pagamento
              </FormFieldLabel>
            }
            value={dataPagamento}
            onChange={setDataPagamento}
            maxDate={new Date()}
          />

          <Textarea
            className="debt-payment-form__notes"
            label={
              <FormFieldLabel icon={MessageSquare} tone="blue">
                Observação (opcional)
              </FormFieldLabel>
            }
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Pagou metade no PIX"
            maxLength={250}
            rows={3}
            resize="none"
          />

          {error ? <p className="debt-payment-form__error">{error}</p> : null}
        </div>

        <footer className="debt-payment-form__footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Registrar
          </Button>
        </footer>
      </form>
    </Modal>
  )
}

export function formatPagamentoData(iso) {
  if (!iso) return '—'
  return format(new Date(iso), 'dd/MM/yyyy', { locale: ptBR })
}
