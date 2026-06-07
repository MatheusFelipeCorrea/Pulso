import { useEffect, useState } from 'react'
import {
  Bus,
  Calculator,
  Calendar,
  CircleDollarSign,
  Hash,
  Info,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { VtFieldHint, VtFieldLabel } from '@/components/features/transport/VtFieldLabel.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { toISODate } from '@/utils/transportUtils.js'

const DEFAULT_PASSAGEM = 4.8

export function VtUsageModal({
  open,
  saldo,
  valorPadrao,
  onClose,
  onSubmit,
  submitting,
  error,
}) {
  const [quantidade, setQuantidade] = useState(2)
  const [valorPorPassagem, setValorPorPassagem] = useState(DEFAULT_PASSAGEM)
  const [data, setData] = useState(() => new Date())
  const [salvarPadrao, setSalvarPadrao] = useState(true)
  const [localError, setLocalError] = useState('')

  const saldoNum = Number(saldo?.saldoRestante ?? 0)
  const passagensMes = saldo?.passagensUsadas ?? 0
  const totalUsado = quantidade * valorPorPassagem
  const novoSaldo = saldoNum - totalUsado

  useEffect(() => {
    if (!open) return
    setQuantidade(2)
    setValorPorPassagem(valorPadrao ? Number(valorPadrao) : DEFAULT_PASSAGEM)
    setData(new Date())
    setSalvarPadrao(true)
    setLocalError('')
  }, [open, valorPadrao])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    if (quantidade < 1) {
      setLocalError('Quantidade de passagens deve ser pelo menos 1')
      return
    }
    if (valorPorPassagem <= 0) {
      setLocalError('Valor por passagem deve ser maior que zero')
      return
    }
    if (totalUsado > saldoNum + 0.001) {
      setLocalError(
        `Saldo insuficiente. Você tem apenas ${formatCurrency(saldoNum)} disponível.`
      )
      return
    }

    onSubmit({
      quantidade,
      valorPorPassagem,
      data: toISODate(data),
      salvarValorPadrao: salvarPadrao,
    })
  }

  const displayError = error || localError

  return (
    <Modal isOpen={open} onClose={onClose} size="lg">
      <form className="tx-form vt-form" onSubmit={handleSubmit}>
        <header className="tx-form__header">
          <h2 className="tx-form__title">Registrar Uso de VT</h2>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Fechar"
            icon={<X size={18} />}
            onClick={onClose}
          />
        </header>

        <div className="tx-form__body">
          <div className="vt-info-card">
            <div className="vt-info-card__icon vt-info-card__icon--bus" aria-hidden>
              <Bus size={22} />
            </div>
            <div className="vt-info-card__content">
              <p className="vt-info-card__label">
                Saldo VT atual:{' '}
                <strong className="vt-info-card__value-inline">{formatCurrency(saldoNum)}</strong>
              </p>
              <p className="vt-info-card__label">
                Passagens usadas este mês:{' '}
                <strong className="vt-info-card__value-inline">{passagensMes}</strong>
              </p>
            </div>
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={Hash} htmlFor="vt-uso-quantidade">
              Quantidade de passagens
            </VtFieldLabel>
            <div className="vt-stepper" id="vt-uso-quantidade">
              <IconButton
                variant="secondary"
                size="sm"
                icon={<Minus size={16} />}
                ariaLabel="Diminuir quantidade"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                disabled={submitting || quantidade <= 1}
              />
              <span className="vt-stepper__value">{quantidade}</span>
              <IconButton
                variant="secondary"
                size="sm"
                icon={<Plus size={16} />}
                ariaLabel="Aumentar quantidade"
                onClick={() => setQuantidade((q) => q + 1)}
                disabled={submitting}
              />
            </div>
            <VtFieldHint>Informe quantas passagens você utilizou</VtFieldHint>
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={CircleDollarSign} htmlFor="vt-uso-valor">
              Valor por passagem
            </VtFieldLabel>
            <InputMoney
              id="vt-uso-valor"
              value={valorPorPassagem}
              onChange={setValorPorPassagem}
              disabled={submitting}
            />
            <VtFieldHint icon={Info}>Valor padrão da sua região</VtFieldHint>
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={Calendar} htmlFor="vt-uso-data">
              Data
            </VtFieldLabel>
            <DatePicker
              id="vt-uso-data"
              value={data}
              onChange={setData}
              disabled={submitting}
            />
            <VtFieldHint icon={Info}>Data em que você utilizou o VT</VtFieldHint>
          </div>

          <div className="vt-info-card vt-info-card--calc">
            <div className="vt-info-card__icon vt-info-card__icon--calc" aria-hidden>
              <Calculator size={20} />
            </div>
            <div className="vt-info-card__content">
              <p className="vt-info-card__label">
                Total do uso:{' '}
                <strong className="vt-info-card__value-inline">
                  {formatCurrency(valorPorPassagem)} × {quantidade} = {formatCurrency(totalUsado)}
                </strong>
              </p>
              <p className="vt-info-card__value">
                Novo saldo VT: {formatCurrency(Math.max(0, novoSaldo))}
              </p>
            </div>
          </div>

          <div className="vt-form-field vt-form-field--toggle">
            <Toggle
              checked={salvarPadrao}
              onChange={setSalvarPadrao}
              label="Salvar valor da passagem como padrão"
              description="Usar este valor como padrão nas próximas vezes"
              disabled={submitting}
            />
            <VtFieldHint icon={Info} className="vt-field-hint--toggle">
              Mantém o valor unitário para os próximos registros de uso
            </VtFieldHint>
          </div>

          {displayError ? (
            <p className="vt-field-error" role="alert">
              {displayError}
            </p>
          ) : null}
        </div>

        <footer className="tx-form__footer">
          <span />
          <div className="tx-form__footer-actions">
            <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Registrar Uso
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
