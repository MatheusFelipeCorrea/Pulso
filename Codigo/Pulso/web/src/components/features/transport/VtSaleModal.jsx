import { useEffect, useState } from 'react'
import { Banknote, Bus, Calendar, CheckCircle2, Info, User, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { VtFieldHint, VtFieldLabel } from '@/components/features/transport/VtFieldLabel.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { toISODate } from '@/utils/transportUtils.js'
import { cn } from '@/design-system/utils/cn.js'

export function VtSaleModal({ open, saldo, onClose, onSubmit, submitting, error }) {
  const [nomeComprador, setNomeComprador] = useState('')
  const [dataVenda, setDataVenda] = useState(() => new Date())
  const [valorNominal, setValorNominal] = useState(0)
  const [valorRecebido, setValorRecebido] = useState(0)
  const [localError, setLocalError] = useState('')

  const saldoNum = Number(saldo?.saldoRestante ?? 0)

  useEffect(() => {
    if (!open) return
    setNomeComprador('')
    setDataVenda(new Date())
    setValorNominal(0)
    setValorRecebido(0)
    setLocalError('')
  }, [open])

  const diferenca = valorRecebido - valorNominal
  const novoSaldo = saldoNum - valorNominal

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    if (!nomeComprador.trim()) {
      setLocalError('Informe o comprador')
      return
    }
    if (valorNominal <= 0 || valorRecebido <= 0) {
      setLocalError('Valor nominal e valor recebido devem ser maiores que zero')
      return
    }
    if (valorNominal > saldoNum + 0.001) {
      setLocalError(
        `Saldo insuficiente. Você tem apenas ${formatCurrency(saldoNum)} disponível.`
      )
      return
    }

    onSubmit({
      nomeComprador: nomeComprador.trim(),
      dataVenda: toISODate(dataVenda),
      valorNominal,
      valorRecebido,
    })
  }

  const displayError = error || localError
  const diffTone = diferenca > 0 ? 'positive' : diferenca < 0 ? 'negative' : 'neutral'

  return (
    <Modal isOpen={open} onClose={onClose} size="xl">
      <form className="tx-form vt-form" onSubmit={handleSubmit}>
        <header className="tx-form__header">
          <h2 className="tx-form__title">Registrar Venda de VT</h2>
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
              <p className="vt-info-card__label">Saldo VT disponível para venda</p>
              <p className="vt-info-card__value">{formatCurrency(saldoNum)}</p>
              <p className="vt-info-card__status vt-info-card__status--ok">
                <CheckCircle2 size={14} aria-hidden />
                Disponível para vender
              </p>
            </div>
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={User} htmlFor="vt-venda-comprador">
              Comprador
            </VtFieldLabel>
            <InputText
              id="vt-venda-comprador"
              value={nomeComprador}
              onChange={(e) => setNomeComprador(e.target.value)}
              placeholder="Nome ou apelido do comprador"
              disabled={submitting}
              leftIcon={<User size={16} />}
            />
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={Calendar} htmlFor="vt-venda-data">
              Data da venda
            </VtFieldLabel>
            <DatePicker
              id="vt-venda-data"
              value={dataVenda}
              onChange={setDataVenda}
              disabled={submitting}
            />
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={Banknote} tone="green" htmlFor="vt-venda-nominal">
              Valor nominal vendido
            </VtFieldLabel>
            <InputMoney
              id="vt-venda-nominal"
              value={valorNominal}
              onChange={setValorNominal}
              disabled={submitting}
              error={displayError && valorNominal > saldoNum ? displayError : undefined}
            />
            <VtFieldHint icon={Info}>Valor de face do VT que está vendendo</VtFieldHint>
          </div>

          <div className="vt-form-field">
            <VtFieldLabel icon={Banknote} tone="green" htmlFor="vt-venda-recebido">
              Valor recebido
            </VtFieldLabel>
            <InputMoney
              id="vt-venda-recebido"
              value={valorRecebido}
              onChange={setValorRecebido}
              disabled={submitting}
            />
            <VtFieldHint icon={Info}>Quanto o comprador te pagou</VtFieldHint>
          </div>

          <div className="vt-summary-card">
            <div className="vt-summary-row">
              <span>Valor nominal</span>
              <span>{formatCurrency(valorNominal)}</span>
            </div>
            <div className="vt-summary-row">
              <span>Valor recebido</span>
              <span>{formatCurrency(valorRecebido)}</span>
            </div>
            <div className="vt-summary-row vt-summary-row--highlight">
              <span>Diferença</span>
              <span className={cn('vt-diff', `vt-diff--${diffTone}`)}>
                {formatCurrency(diferenca)}
                {diferenca < 0 ? ' (perda)' : diferenca > 0 ? ' (ganho)' : ''}
              </span>
            </div>
            <hr className="vt-summary-card__divider" />
            <div className="vt-summary-row vt-summary-row--blue">
              <span>Novo saldo VT após venda</span>
              <strong>{formatCurrency(Math.max(0, novoSaldo))}</strong>
            </div>
            <div className="vt-alert vt-alert--info vt-alert--inset">
              <Info size={16} aria-hidden />
              <p>
                Você pode registrar várias vendas no mesmo mês, desde que haja saldo disponível.
              </p>
            </div>
          </div>

          {displayError && !(valorNominal > saldoNum) ? (
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
              Registrar Venda
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
