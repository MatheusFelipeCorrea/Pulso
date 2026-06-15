import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  CircleDollarSign,
  Eye,
  FileText,
  Pencil,
  PiggyBank,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  calcMesesAtePrazo,
  calcValorMensalSugerido,
  inferirTipoMeta,
} from '@/utils/goalBalanceUtils.js'

const emptyForm = () => ({
  nome: '',
  valorAlvo: 0,
  prazo: null,
  tipo: 'CURTO_PRAZO',
  descricao: '',
})

export function GoalFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  submitting = false,
  deleting = false,
  meta = null,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const isEdit = Boolean(meta)

  useEffect(() => {
    if (!open) return
    setError('')
    if (meta) {
      setForm({
        nome: meta.nome ?? '',
        valorAlvo: Number(meta.valorAlvo) || 0,
        prazo: meta.prazo ? new Date(meta.prazo) : null,
        tipo: meta.tipo ?? 'CURTO_PRAZO',
        descricao: meta.descricao ?? '',
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, meta])

  const previewMensal = useMemo(() => {
    if (!form.prazo || !form.valorAlvo) return 0
    return calcValorMensalSugerido(form.valorAlvo, 0, form.prazo.toISOString())
  }, [form.prazo, form.valorAlvo])

  const previewMeses = useMemo(() => {
    if (!form.prazo) return null
    return calcMesesAtePrazo(form.prazo.toISOString())
  }, [form.prazo])

  const handleTipoChange = (tipo) => {
    setForm((prev) => ({ ...prev, tipo }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.nome.trim()) {
      setError('Informe o nome da meta.')
      return
    }
    if (!form.valorAlvo || form.valorAlvo <= 0) {
      setError('Informe um valor alvo maior que zero.')
      return
    }
    if (!form.prazo) {
      setError('Selecione o prazo da meta.')
      return
    }

    const payload = {
      nome: form.nome.trim(),
      valorAlvo: form.valorAlvo,
      prazo: form.prazo.toISOString(),
      tipo: form.tipo || inferirTipoMeta(form.prazo.toISOString()),
      descricao: form.descricao.trim() || null,
    }

    try {
      await onSubmit?.(payload)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar a meta.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="goal-form-modal">
      <form className="goal-form" onSubmit={handleSubmit} noValidate>
        <header className="goal-form__header">
          <div>
            <h2>{isEdit ? 'Editar Meta' : 'Nova Meta'}</h2>
            <p>Defina seu objetivo e acompanhe o progresso.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="goal-form__body">
          <InputText
            label={
              <FormFieldLabel icon={Pencil} tone="purple">
                Nome da meta
              </FormFieldLabel>
            }
            value={form.nome}
            onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
            placeholder="Ex: Viagem para Macaé"
            maxLength={100}
          />

          <InputMoney
            label={
              <FormFieldLabel icon={CircleDollarSign} tone="green">
                Valor alvo
              </FormFieldLabel>
            }
            value={form.valorAlvo}
            onChange={(valor) => setForm((prev) => ({ ...prev, valorAlvo: valor }))}
          />

          <DatePicker
            label={
              <FormFieldLabel icon={Calendar} tone="blue">
                Prazo
              </FormFieldLabel>
            }
            value={form.prazo}
            onChange={(date) =>
              setForm((prev) => ({
                ...prev,
                prazo: date,
                tipo: date ? inferirTipoMeta(date.toISOString()) : prev.tipo,
              }))
            }
            minDate={new Date()}
            placeholder="Selecione uma data futura"
          />

          <Textarea
            className="goal-form__notes"
            label={
              <FormFieldLabel icon={FileText} tone="purple">
                Descrição (opcional)
              </FormFieldLabel>
            }
            value={form.descricao}
            onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))}
            placeholder="Descreva sua meta..."
            maxLength={200}
            rows={3}
            resize="vertical"
          />

          <fieldset className="goal-form__tipo">
            <legend>
              <FormFieldLabel icon={Target} tone="purple">
                Tipo de meta
              </FormFieldLabel>
            </legend>
            <div className="goal-form__tipo-options">
              <button
                type="button"
                className={`goal-form__tipo-card${form.tipo === 'CURTO_PRAZO' ? ' is-active' : ''}`}
                onClick={() => handleTipoChange('CURTO_PRAZO')}
              >
                <Zap size={18} aria-hidden />
                <span>Curto prazo</span>
                <small>até 6 meses</small>
              </button>
              <button
                type="button"
                className={`goal-form__tipo-card${form.tipo === 'LONGO_PRAZO' ? ' is-active' : ''}`}
                onClick={() => handleTipoChange('LONGO_PRAZO')}
              >
                <Target size={18} aria-hidden />
                <span>Longo prazo</span>
                <small>mais de 6 meses</small>
              </button>
            </div>
          </fieldset>

          <section className="goal-form__preview">
            <h3>
              <Eye size={16} aria-hidden />
              Preview
            </h3>
            {form.valorAlvo > 0 && form.prazo ? (
              <>
                <PiggyBank size={42} className="goal-form__preview-icon" aria-hidden />
                <p>
                  Se guardar <strong>{formatCurrency(previewMensal)}/mês</strong>, atinge em{' '}
                  <strong>{previewMeses} {previewMeses === 1 ? 'mês' : 'meses'}</strong>.
                </p>
                <small>Este cálculo é uma estimativa.</small>
              </>
            ) : (
              <p className="goal-form__preview-empty">
                Preencha o valor alvo e o prazo para ver sua simulação.
              </p>
            )}
          </section>

          {error ? <p className="goal-form__error">{error}</p> : null}
        </div>

        <footer className="goal-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <div className="goal-form__footer-actions">
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                className="goal-form__delete-btn"
                leftIcon={<Trash2 size={14} />}
                loading={deleting}
                onClick={() => onDelete?.(meta)}
              >
                Excluir
              </Button>
            ) : null}
            <Button type="submit" variant="primary" loading={submitting}>
              {isEdit ? 'Salvar alterações' : 'Criar Meta'}
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
