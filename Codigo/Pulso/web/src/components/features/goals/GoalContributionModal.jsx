import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Calendar, CircleDollarSign, Clock, Eye, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { calcProgressoMeta } from '@/utils/goalBalanceUtils.js'
import { GoalIcon } from './goalIcons.jsx'

export function GoalContributionModal({ open, onClose, onSubmit, submitting = false, meta = null }) {
  const [valor, setValor] = useState(0)
  const [data, setData] = useState(new Date())
  const [error, setError] = useState('')

  const saldo = useMemo(() => (meta ? calcProgressoMeta(meta) : null), [meta])

  useEffect(() => {
    if (!open || !meta) return
    setError('')
    setValor(0)
    setData(new Date())
  }, [open, meta?.id])

  const preview = useMemo(() => {
    if (!saldo || valor <= 0) return null
    const novoAtual = Math.min(saldo.valorAlvo, saldo.valorAtual + valor)
    const novoRestante = Math.max(0, saldo.valorAlvo - novoAtual)
    const percentual = saldo.valorAlvo > 0 ? (novoAtual / saldo.valorAlvo) * 100 : 0
    return { novoAtual, novoRestante, percentual }
  }, [saldo, valor])

  const excedeLimite = Boolean(saldo && valor > saldo.valorRestante)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!valor || valor <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }
    if (excedeLimite) {
      setError(`O valor do aporte não pode ultrapassar ${formatCurrency(saldo.valorRestante)}.`)
      return
    }

    try {
      await onSubmit?.({
        valor,
        data: data.toISOString(),
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível registrar o aporte.')
    }
  }

  if (!meta) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="goal-contribution-modal">
      <form className="goal-contribution-form" onSubmit={handleSubmit} noValidate>
        <header className="goal-contribution-form__header">
          <div>
            <h2>Novo Aporte</h2>
            <p>Adicione um valor à sua meta.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="goal-contribution-form__body">
          <div className="goal-contribution-form__meta">
            <GoalIcon nome={meta.nome} status={meta.status} />
            <div>
              <strong>{meta.nome}</strong>
              <span>Progresso atual</span>
            </div>
          </div>

          <ProgressBar
            value={saldo.valorAtual}
            max={saldo.valorAlvo}
            variant="success"
            size="lg"
            layout="labeled"
            showLabel
            label={`${formatCurrency(saldo.valorAtual)} de ${formatCurrency(saldo.valorAlvo)} (${Math.round(saldo.percentual)}%)`}
          />

          <InputMoney
            label={
              <FormFieldLabel icon={CircleDollarSign} tone="green">
                Valor do aporte
              </FormFieldLabel>
            }
            value={valor}
            onChange={setValor}
            helperText={`Valor disponível para aportar: ${formatCurrency(saldo.valorRestante)}`}
          />

          <DatePicker
            label={
              <FormFieldLabel icon={Calendar} tone="blue">
                Data
              </FormFieldLabel>
            }
            value={data}
            onChange={setData}
            maxDate={new Date()}
          />

          {preview ? (
            <section className="goal-contribution-form__preview">
              <h3>
                <Eye size={16} aria-hidden />
                Preview
              </h3>
              <p>Após este aporte:</p>
              <ProgressBar
                value={preview.novoAtual}
                max={saldo.valorAlvo}
                variant="primary"
                size="lg"
                layout="labeled"
                showLabel
                label={`${formatCurrency(preview.novoAtual)} de ${formatCurrency(saldo.valorAlvo)} (${Math.round(preview.percentual)}%)`}
              />
              <p className="goal-contribution-form__remaining">
                <Clock size={14} aria-hidden />
                Faltam {formatCurrency(preview.novoRestante)} para concluir sua meta
              </p>
            </section>
          ) : null}

          {excedeLimite ? (
            <div className="goal-contribution-form__warning" role="alert">
              <AlertTriangle size={16} aria-hidden />
              <div>
                <strong>O valor do aporte não pode ultrapassar {formatCurrency(saldo.valorRestante)}</strong>
                <span>Esse é o valor restante para atingir sua meta.</span>
              </div>
            </div>
          ) : null}

          {error ? <p className="goal-contribution-form__error">{error}</p> : null}
        </div>

        <footer className="goal-contribution-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting} disabled={excedeLimite}>
            Registrar Aporte
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
