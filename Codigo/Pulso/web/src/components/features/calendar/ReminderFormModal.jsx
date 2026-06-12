import { useEffect, useMemo, useState } from 'react'
import { Bell, Calendar, CircleDollarSign, Hash, Paperclip, RefreshCw, Tag, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import {
  buildReminderCategorySelectOptions,
  getReminderCategoryMeta,
} from '@/utils/reminderCategories.jsx'

const ANTECEDENCIA_OPTIONS = [
  { value: 'NO_DIA', label: 'No dia' },
  { value: 'UM_DIA', label: '1 dia antes' },
  { value: 'TRES_DIAS', label: '3 dias antes' },
  { value: 'CINCO_DIAS', label: '5 dias antes' },
  { value: 'UMA_SEMANA', label: '1 semana antes' },
]

const emptyForm = (defaultDate = new Date(), googleConnected = false) => ({
  titulo: '',
  valor: 0,
  dataVencimento: defaultDate,
  antecedencia: 'UM_DIA',
  categoria: 'FATURA_CARTAO',
  sincronizarGoogle: googleConnected,
  repetirMensal: false,
  diaRecorrencia: defaultDate.getDate(),
})

function GoogleCalendarGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export function ReminderFormModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  lembrete = null,
  defaultDate = new Date(),
  googleConnected = false,
}) {
  const [form, setForm] = useState(() => emptyForm(defaultDate))
  const isEdit = Boolean(lembrete)

  const categoriaOptions = useMemo(() => buildReminderCategorySelectOptions(), [])
  const categoriaMeta = getReminderCategoryMeta(form.categoria)

  useEffect(() => {
    if (!open) return
    if (lembrete) {
      const vencimento = new Date(lembrete.dataVencimento)
      setForm({
        titulo: lembrete.titulo ?? '',
        valor: lembrete.valor != null ? Number(lembrete.valor) : 0,
        dataVencimento: vencimento,
        antecedencia: lembrete.antecedencia ?? 'UM_DIA',
        categoria: lembrete.categoria ?? 'OUTRO',
        sincronizarGoogle: Boolean(lembrete.sincronizado),
        repetirMensal: Boolean(lembrete.repetirMensal),
        diaRecorrencia: lembrete.diaRecorrencia ?? vencimento.getDate(),
      })
    } else {
      setForm(emptyForm(defaultDate, googleConnected))
    }
  }, [open, lembrete, defaultDate, googleConnected])

  const handleCategoriaChange = (value) => {
    if (String(value).startsWith('__group_')) return
    setForm((prev) => ({ ...prev, categoria: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit?.({
      titulo: form.titulo.trim(),
      valor: form.valor > 0 ? form.valor : null,
      dataVencimento: form.dataVencimento.toISOString(),
      antecedencia: form.antecedencia,
      categoria: form.categoria,
      sincronizarGoogle: googleConnected ? form.sincronizarGoogle : false,
      repetirMensal: form.repetirMensal,
      diaRecorrencia: form.repetirMensal ? form.diaRecorrencia : undefined,
    })
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="xl" className="calendar-reminder-modal">
      <form className="calendar-reminder-form" onSubmit={handleSubmit}>
        <header className="calendar-reminder-form__header">
          <div>
            <h2>{isEdit ? 'Editar Lembrete' : 'Novo Lembrete'}</h2>
            <p>Crie um lembrete para não esquecer o que importa.</p>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Fechar"
            icon={<X size={18} />}
            onClick={onClose}
          />
        </header>

        <div className="calendar-reminder-form__body">
          <InputText
            label={
              <FormFieldLabel icon={Paperclip} tone="purple">
                Título
              </FormFieldLabel>
            }
            value={form.titulo}
            onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
            placeholder="Ex: Fatura do cartão"
            required
          />

          <div className="calendar-reminder-form__row">
            <InputMoney
              label={
                <FormFieldLabel icon={CircleDollarSign} tone="green">
                  Valor (opcional)
                </FormFieldLabel>
              }
              value={form.valor}
              onChange={(value) => setForm((prev) => ({ ...prev, valor: value }))}
            />
            <DatePicker
              label={
                <FormFieldLabel icon={Calendar} tone="purple">
                  Data de vencimento
                </FormFieldLabel>
              }
              value={form.dataVencimento}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  dataVencimento: value,
                  diaRecorrencia: value.getDate(),
                }))
              }
              required
            />
          </div>

          <Select
            label={
              <FormFieldLabel icon={Bell} tone="yellow">
                Antecedência
              </FormFieldLabel>
            }
            value={form.antecedencia}
            onChange={(value) => setForm((prev) => ({ ...prev, antecedencia: value }))}
            options={ANTECEDENCIA_OPTIONS.map((opt) => ({
              ...opt,
              icon: <Bell size={16} strokeWidth={2} />,
              iconColor: '#EAB308',
            }))}
          />

          <Select
            label={
              <FormFieldLabel icon={Tag} tone="blue">
                Ícone / Tipo
              </FormFieldLabel>
            }
            value={form.categoria}
            onChange={handleCategoriaChange}
            options={categoriaOptions}
            placeholder="Selecione a categoria"
          />

          <section className="calendar-reminder-form__card">
            <div className="calendar-reminder-form__card-body">
              <span className="calendar-reminder-form__card-icon calendar-reminder-form__card-icon--google">
                <GoogleCalendarGlyph />
              </span>
              <div className="calendar-reminder-form__card-text">
                <strong>Sincronizar com Google Agenda</strong>
                <p>
                  {googleConnected
                    ? 'Este lembrete será adicionado ao calendário Pulso no Google.'
                    : 'Conecte o Google Agenda acima para sincronizar este lembrete.'}
                </p>
              </div>
            </div>
            <Toggle
              checked={googleConnected && form.sincronizarGoogle}
              disabled={!googleConnected || submitting}
              onChange={(checked) => setForm((prev) => ({ ...prev, sincronizarGoogle: checked }))}
            />
          </section>

          <section className="calendar-reminder-form__card calendar-reminder-form__card--stacked">
            <div className="calendar-reminder-form__card-head">
              <span
                className="calendar-reminder-form__card-icon"
                style={{
                  color: categoriaMeta.color,
                  background: `color-mix(in srgb, ${categoriaMeta.color} 14%, transparent)`,
                }}
              >
                <RefreshCw size={18} strokeWidth={2} />
              </span>
              <strong>Repetência (opcional)</strong>
            </div>

            <Checkbox
              label="Repetir todo mês"
              checked={form.repetirMensal}
              onChange={(checked) => setForm((prev) => ({ ...prev, repetirMensal: checked }))}
            />

            {form.repetirMensal ? (
              <div className="calendar-reminder-form__day-picker">
                <FormFieldLabel icon={Hash} tone="purple" className="calendar-reminder-form__day-picker-label">
                  Dia do mês
                </FormFieldLabel>
                <div
                  className="calendar-reminder-form__day-grid"
                  role="radiogroup"
                  aria-label="Dia da recorrência mensal"
                >
                  {Array.from({ length: 28 }, (_, index) => {
                    const day = index + 1
                    const selected = form.diaRecorrencia === day
                    return (
                      <button
                        key={day}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`calendar-reminder-form__day-cell${selected ? ' calendar-reminder-form__day-cell--selected' : ''}`}
                        onClick={() => setForm((prev) => ({ ...prev, diaRecorrencia: day }))}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
                <p className="calendar-reminder-form__recurrence-hint">
                  Este lembrete será criado automaticamente todo dia{' '}
                  <strong>{form.diaRecorrencia}</strong> de cada mês.
                </p>
              </div>
            ) : (
              <p className="calendar-reminder-form__recurrence-hint calendar-reminder-form__recurrence-hint--muted">
                Ative a repetição para escolher em qual dia do mês o lembrete será recriado.
              </p>
            )}
          </section>
        </div>

        <footer className="calendar-reminder-form__footer">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={submitting || !form.titulo.trim()}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar Lembrete'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
