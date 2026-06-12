import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Heart,
  MessageSquare,
  User,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { getDebtSummaryText } from '@/utils/debtStatusUtils.js'

const emptyForm = () => ({
  direcao: 'ME_DEVEM',
  nomePessoa: '',
  valor: 0,
  dataEmprestimo: new Date(),
  definirPrazo: false,
  prazoDevolucao: null,
  observacao: '',
})

export function DebtFormModal({ open, onClose, onSubmit, submitting = false, divida = null }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const isEdit = Boolean(divida)

  useEffect(() => {
    if (!open) return
    setError('')
    if (divida) {
      setForm({
        direcao: divida.direcao,
        nomePessoa: divida.nomePessoa ?? '',
        valor: Number(divida.valor) || 0,
        dataEmprestimo: new Date(divida.dataEmprestimo),
        definirPrazo: Boolean(divida.prazoDevolucao),
        prazoDevolucao: divida.prazoDevolucao ? new Date(divida.prazoDevolucao) : null,
        observacao: divida.observacao ?? '',
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, divida])

  const resumo = useMemo(
    () =>
      getDebtSummaryText({
        direcao: form.direcao,
        nomePessoa: form.nomePessoa || 'Pessoa',
        valor: form.valor,
      }),
    [form.direcao, form.nomePessoa, form.valor]
  )

  const tone = form.direcao === 'ME_DEVEM' ? 'receive' : 'pay'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.nomePessoa.trim()) {
      setError('Informe o nome da pessoa.')
      return
    }
    if (!form.valor || form.valor <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }
    if (form.definirPrazo && !form.prazoDevolucao) {
      setError('Selecione o prazo de devolução.')
      return
    }

    const payload = {
      nomePessoa: form.nomePessoa.trim(),
      valor: form.valor,
      dataEmprestimo: form.dataEmprestimo.toISOString(),
      prazoDevolucao: form.definirPrazo && form.prazoDevolucao ? form.prazoDevolucao.toISOString() : null,
      observacao: form.observacao.trim() || null,
    }

    if (!isEdit) {
      payload.direcao = form.direcao
    }

    try {
      await onSubmit?.(payload)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar o empréstimo.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="xl" className="debt-form-modal">
      <form className="debt-form" onSubmit={handleSubmit}>
        <header className="debt-form__header">
          <div>
            <h2>{isEdit ? 'Editar Empréstimo' : 'Novo Empréstimo'}</h2>
            <p>Registre quem te deve ou a quem você deve.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="debt-form__body">
          {!isEdit ? (
            <section className="debt-form__section">
              <h3 className="debt-form__section-title">1. DIREÇÃO</h3>
              <div className="debt-form__direction" role="radiogroup" aria-label="Direção do empréstimo">
                <button
                  type="button"
                  role="radio"
                  aria-checked={form.direcao === 'ME_DEVEM'}
                  className={`debt-form__direction-card debt-form__direction-card--receive${form.direcao === 'ME_DEVEM' ? ' is-active' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, direcao: 'ME_DEVEM' }))}
                >
                  <span className="debt-form__direction-icon" aria-hidden>
                    <ArrowDownLeft size={22} strokeWidth={2.25} />
                  </span>
                  <span className="debt-form__direction-text">
                    <span className="debt-form__direction-title">Emprestei</span>
                    <small className="debt-form__direction-sub">Me devem</small>
                  </span>
                  {form.direcao === 'ME_DEVEM' ? (
                    <span className="debt-form__direction-check" aria-hidden>
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={form.direcao === 'EU_DEVO'}
                  className={`debt-form__direction-card debt-form__direction-card--pay${form.direcao === 'EU_DEVO' ? ' is-active' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, direcao: 'EU_DEVO' }))}
                >
                  <span className="debt-form__direction-icon" aria-hidden>
                    <ArrowUpRight size={22} strokeWidth={2.25} />
                  </span>
                  <span className="debt-form__direction-text">
                    <span className="debt-form__direction-title">Peguei emprestado</span>
                    <small className="debt-form__direction-sub">Eu devo</small>
                  </span>
                  {form.direcao === 'EU_DEVO' ? (
                    <span className="debt-form__direction-check" aria-hidden>
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  ) : null}
                </button>
              </div>
            </section>
          ) : null}

          <section className="debt-form__section">
            <h3 className="debt-form__section-title">
              {isEdit ? 'DADOS DO EMPRÉSTIMO' : '2. DADOS DO EMPRÉSTIMO'}
            </h3>

            <div className="debt-form__grid">
              <InputText
                label={
                  <FormFieldLabel icon={User} tone="purple">
                    Nome da pessoa
                  </FormFieldLabel>
                }
                value={form.nomePessoa}
                onChange={(e) => setForm((prev) => ({ ...prev, nomePessoa: e.target.value }))}
                placeholder={
                  form.direcao === 'ME_DEVEM'
                    ? 'Pra quem você emprestou?'
                    : 'De quem você pegou emprestado?'
                }
                maxLength={120}
              />

              <InputMoney
                label={
                  <FormFieldLabel icon={CircleDollarSign} tone="green">
                    Valor
                  </FormFieldLabel>
                }
                value={form.valor}
                onChange={(v) => setForm((prev) => ({ ...prev, valor: v }))}
              />

              <DatePicker
                label={
                  <FormFieldLabel icon={Calendar} tone="purple">
                    Data do empréstimo
                  </FormFieldLabel>
                }
                value={form.dataEmprestimo}
                onChange={(v) => setForm((prev) => ({ ...prev, dataEmprestimo: v }))}
                maxDate={new Date()}
              />

              <div className="debt-form__toggle-row">
                <Toggle
                  label={
                    <FormFieldLabel icon={CalendarClock} tone="yellow">
                      Definir prazo de devolução?
                    </FormFieldLabel>
                  }
                  description="Você será lembrado quando o prazo se aproximar"
                  checked={form.definirPrazo}
                  onChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      definirPrazo: checked,
                      prazoDevolucao: checked ? prev.prazoDevolucao ?? new Date() : null,
                    }))
                  }
                />
              </div>

              {form.definirPrazo ? (
                <DatePicker
                  label={
                    <FormFieldLabel icon={Calendar} tone="purple">
                      Prazo de devolução
                    </FormFieldLabel>
                  }
                  value={form.prazoDevolucao}
                  onChange={(v) => setForm((prev) => ({ ...prev, prazoDevolucao: v }))}
                  minDate={form.dataEmprestimo}
                />
              ) : null}

              <Textarea
                className="debt-form__notes"
                label={
                  <FormFieldLabel icon={MessageSquare} tone="blue">
                    Observação (opcional)
                  </FormFieldLabel>
                }
                value={form.observacao}
                onChange={(e) => setForm((prev) => ({ ...prev, observacao: e.target.value }))}
                placeholder="Ex: Emprestei pra pagar o uber"
                maxLength={250}
                rows={3}
                resize="none"
              />
            </div>
          </section>

          <section className="debt-form__section debt-form__section--last">
            <h3 className="debt-form__section-title">{isEdit ? 'RESUMO' : '3. RESUMO'}</h3>
            <div className={`debt-form__preview debt-form__preview--${tone}`}>
              <span className="debt-form__preview-icon" aria-hidden>
                <Heart size={18} />
              </span>
              <div>
                <p className="debt-form__preview-line">{resumo.linha}</p>
                <p className="debt-form__preview-value">{resumo.sublinha}</p>
                {form.definirPrazo && form.prazoDevolucao ? (
                  <p className="debt-form__preview-deadline">
                    <Calendar size={14} aria-hidden />
                    Devolução até: {format(form.prazoDevolucao, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="debt-form__preview-hint">
              Este resumo será salvo e aparece no seu painel de dívidas
            </p>
          </section>

          {error ? <p className="debt-form__error">{error}</p> : null}
        </div>

        <footer className="debt-form__footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {isEdit ? 'Salvar alterações' : 'Registrar'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
