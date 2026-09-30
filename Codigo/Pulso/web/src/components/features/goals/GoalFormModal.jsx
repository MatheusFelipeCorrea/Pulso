import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  CircleDollarSign,
  Eye,
  FileText,
  Pencil,
  PiggyBank,
  Shield,
  Sparkles,
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
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  calcMesesAtePrazo,
  calcValorMensalSugerido,
  inferirTipoMeta,
} from '@/utils/goalBalanceUtils.js'
import * as metaService from '@/services/metaService.js'
import { GoalAportesSection } from './GoalAportesSection.jsx'

const emptyForm = () => ({
  nome: '',
  valorAlvo: 0,
  prazo: null,
  tipo: null,
  descricao: '',
})

export function GoalFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  onDeleteAporte,
  deletingAporteId = null,
  submitting = false,
  deleting = false,
  meta = null,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [sugerindoReserva, setSugerindoReserva] = useState(false)
  const [reservaInfo, setReservaInfo] = useState(null)
  const isEdit = Boolean(meta)

  useEffect(() => {
    if (!open) return
    setError('')
    setReservaInfo(null)
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

  const handleUsarReservaEmergencia = async () => {
    setSugerindoReserva(true)
    setError('')
    try {
      const sugestao = await metaService.sugerirReservaEmergencia()
      const prazoSugerido = new Date()
      prazoSugerido.setMonth(prazoSugerido.getMonth() + 12)

      setForm((prev) => ({
        ...prev,
        nome: prev.nome.trim() || 'Reserva de Emergência',
        valorAlvo: Number(sugestao.valorSugerido) || prev.valorAlvo,
        tipo: 'LONGO_PRAZO',
        prazo: prev.prazo ?? prazoSugerido,
        descricao: prev.descricao || 'Fundo para imprevistos e emergências financeiras.',
      }))
      setReservaInfo(sugestao)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível calcular a sugestão.')
    } finally {
      setSugerindoReserva(false)
    }
  }

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
          {!isEdit ? (
            <button
              type="button"
              className="goal-form__emergency-suggestion"
              onClick={handleUsarReservaEmergencia}
              disabled={sugerindoReserva}
            >
              <span className="goal-form__emergency-icon" aria-hidden>
                <Shield size={18} />
              </span>
              <div className="goal-form__emergency-copy">
                <strong>Criar Reserva de Emergência</strong>
                <span>Preenchemos nome e valor com base no seu gasto médio mensal</span>
              </div>
              {sugerindoReserva ? (
                <SpinnerDots />
              ) : (
                <Sparkles size={16} className="goal-form__emergency-sparkles" aria-hidden />
              )}
            </button>
          ) : null}

          {reservaInfo ? (
            <p className="goal-form__emergency-hint">
              Sugestão: {reservaInfo.meses} meses de gasto médio ({formatCurrency(reservaInfo.mediaGastoMensal)}/mês).
            </p>
          ) : null}

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
              <label className={`goal-form__tipo-option${form.tipo === 'CURTO_PRAZO' ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="goal-form-tipo"
                  checked={form.tipo === 'CURTO_PRAZO'}
                  onChange={() => handleTipoChange('CURTO_PRAZO')}
                />
                <Zap size={16} aria-hidden />
                <span>
                  Curto prazo <small>(até 6 meses)</small>
                </span>
              </label>
              <label className={`goal-form__tipo-option${form.tipo === 'LONGO_PRAZO' ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="goal-form-tipo"
                  checked={form.tipo === 'LONGO_PRAZO'}
                  onChange={() => handleTipoChange('LONGO_PRAZO')}
                />
                <Target size={16} aria-hidden />
                <span>
                  Longo prazo <small>(mais de 6 meses)</small>
                </span>
              </label>
            </div>
          </fieldset>

          <section className="goal-form__preview">
            <FormFieldLabel icon={Eye} tone="purple">
              Preview
            </FormFieldLabel>
            {form.valorAlvo > 0 && form.prazo ? (
              <div className="goal-form__preview-content">
                <PiggyBank size={44} className="goal-form__preview-icon" aria-hidden />
                <div className="goal-form__preview-text">
                  <p>
                    Se guardar <strong>{formatCurrency(previewMensal)}/mês</strong>, atinge em{' '}
                    <strong>{previewMeses} {previewMeses === 1 ? 'mês' : 'meses'}</strong>
                  </p>
                  <small>Este cálculo é uma estimativa.</small>
                </div>
              </div>
            ) : (
              <p className="goal-form__preview-hint">
                Preencha o valor alvo e o prazo para ver sua simulação.
              </p>
            )}
          </section>

          {isEdit ? (
            <GoalAportesSection
              meta={meta}
              onDeleteAporte={onDeleteAporte}
              deletingAporteId={deletingAporteId}
            />
          ) : null}

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
