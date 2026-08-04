import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  CircleDollarSign,
  ClipboardList,
  Eye,
  FolderOpen,
  Globe,
  Info,
  Trash2,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { CurrencyFlag } from '@/components/features/trips/CurrencyFlag.jsx'
import { buildTripExpenseCategorySelectOptions } from '@/utils/tripExpenseCategorySelect.jsx'
import { formatTripDetailDate } from '@/utils/tripDetailUtils.js'
import { formatTripDestinationDisplay } from '@/utils/tripDestinationDisplay.js'

const DESCRIPTION_MAX = 100

const categoryOptions = buildTripExpenseCategorySelectOptions()

const emptyForm = () => ({
  categoria: 'TRANSPORTE',
  descricao: '',
  valorEstimado: 0,
})

export function TripExpenseFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  viagem = null,
  despesa = null,
  totalAtual = 0,
  previewTotalLabel = 'Total da viagem com esta pretensão:',
  submitting = false,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const isEdit = Boolean(despesa)

  useEffect(() => {
    if (!open) return
    setError('')
    if (despesa) {
      setForm({
        categoria: despesa.categoria ?? 'TRANSPORTE',
        descricao: despesa.descricao ?? '',
        valorEstimado: Number(despesa.valorEstimado) || 0,
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, despesa])

  const previewTotal = useMemo(() => {
    const current = Number(totalAtual) || 0
    const value = Number(form.valorEstimado) || 0
    const previous = isEdit ? Number(despesa?.valorEstimado) || 0 : 0
    return current - previous + value
  }, [totalAtual, form.valorEstimado, isEdit, despesa?.valorEstimado])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.valorEstimado || form.valorEstimado <= 0) {
      setError('Informe um valor estimado maior que zero.')
      return
    }

    try {
      await onSubmit?.({
        categoria: form.categoria,
        descricao: form.descricao.trim().slice(0, DESCRIPTION_MAX) || null,
        valorEstimado: form.valorEstimado,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar a pretensão.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="trip-expense-modal">
      <form className="trip-expense-form" onSubmit={handleSubmit} noValidate>
        <header className="trip-expense-form__header">
          <div>
            <h2>{isEdit ? 'Editar Pretensão' : 'Nova Pretensão'}</h2>
            <p>Estime um gasto para compor o planejamento da viagem.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="trip-expense-form__body">
          {viagem ? (
            <div className="trip-expense-form__context">
              <span>
                <Globe size={14} aria-hidden />
                {formatTripDestinationDisplay(viagem.destino, viagem.destinoMeta)}
              </span>
              <span>
                <CurrencyFlag code={viagem.moeda} size={14} />
                {viagem.moeda}
              </span>
              <span>
                <Calendar size={14} aria-hidden />
                {formatTripDetailDate(viagem.dataPrevista)}
              </span>
            </div>
          ) : null}

          <Select
            label={
              <FormFieldLabel icon={FolderOpen} tone="purple">
                Categoria
              </FormFieldLabel>
            }
            value={form.categoria}
            onChange={(categoria) => setForm((prev) => ({ ...prev, categoria }))}
            options={categoryOptions}
            placeholder="Selecione uma categoria"
            className="trip-expense-form__category-select"
          />

          <InputText
            label={
              <FormFieldLabel icon={ClipboardList} tone="blue">
                Descrição <span className="trip-expense-form__optional">(opcional)</span>
              </FormFieldLabel>
            }
            value={form.descricao}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                descricao: event.target.value.slice(0, DESCRIPTION_MAX),
              }))
            }
            placeholder="Ex: Airbnb 3 noites"
            helperText={`${form.descricao.length}/${DESCRIPTION_MAX}`}
          />

          <InputMoney
            label={
              <FormFieldLabel icon={CircleDollarSign} tone="green">
                Valor estimado
              </FormFieldLabel>
            }
            value={form.valorEstimado}
            onChange={(valorEstimado) => setForm((prev) => ({ ...prev, valorEstimado }))}
            placeholder="0,00"
            helperText={
              <span className="trip-expense-form__conversion">
                <Info size={13} aria-hidden />
                ≈ {formatCurrency(form.valorEstimado || 0)} (conversão em BRL)
              </span>
            }
          />

          <div className="trip-expense-form__preview">
            <p className="trip-expense-form__preview-label">
              <Eye size={15} aria-hidden />
              Preview
            </p>
            <span>{previewTotalLabel}</span>
            <strong>{formatCurrency(previewTotal)}</strong>
          </div>

          {error ? <p className="trip-expense-form__error">{error}</p> : null}
        </div>

        <footer className="trip-expense-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <div className="trip-expense-form__footer-actions">
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                className="trip-expense-form__delete-btn"
                leftIcon={<Trash2 size={14} />}
                onClick={() => onDelete?.()}
              >
                Excluir
              </Button>
            ) : null}
            <Button type="submit" variant="primary" loading={submitting}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
