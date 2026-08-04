import { useEffect, useMemo, useState } from 'react'
import {
  Calculator,
  Calendar,
  Check,
  CircleDollarSign,
  Folder,
  Info,
  Pencil,
  Plus,
  User,
  Users,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { Badge } from '@/design-system/components/data-display/Badge/Badge.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { categoriaToSelectOption } from '@/utils/filterOptions.js'
import { listarCategorias } from '@/services/categoryService.js'
import { splitEqual, getPagador } from '@/utils/expenseSplitUtils.js'

const emptyForm = () => ({
  titulo: '',
  valorTotal: 0,
  data: new Date(),
  categoriaId: null,
  pagoPorMim: true,
  outroPagadorNome: '',
  participantesOutros: [],
  novoParticipanteNome: '',
  tipo: 'IGUAL',
  valoresPersonalizados: {},
})

export function ExpenseSplitFormModal({ open, onClose, onSubmit, submitting = false, divisao = null }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [categorias, setCategorias] = useState([])
  const isEdit = Boolean(divisao)

  useEffect(() => {
    if (!open) return
    listarCategorias('DESPESA')
      .then(setCategorias)
      .catch(() => setCategorias([]))
  }, [open])

  useEffect(() => {
    if (!open) return
    setError('')

    if (divisao) {
      const pagador = getPagador(divisao)
      const outros = (divisao.participantes ?? []).filter((p) => !p.ehOrganizador)
      const organizador = (divisao.participantes ?? []).find((p) => p.ehOrganizador)
      const pagoPorMim = Boolean(pagador?.ehOrganizador)

      setForm({
        titulo: divisao.titulo,
        valorTotal: Number(divisao.valorTotal),
        data: new Date(divisao.data),
        categoriaId: null,
        pagoPorMim,
        outroPagadorNome: pagoPorMim ? '' : (pagador?.nome ?? ''),
        participantesOutros: outros.map((p) => p.nome),
        novoParticipanteNome: '',
        tipo: divisao.tipo,
        valoresPersonalizados: Object.fromEntries([
          ...outros.map((p) => [p.nome, Number(p.valor)]),
          ['__organizador__', Number(organizador?.valor ?? 0)],
        ]),
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, divisao])

  const categoriaOptions = useMemo(() => categorias.map(categoriaToSelectOption), [categorias])

  const todosOsNomes = useMemo(() => ['Você', ...form.participantesOutros], [form.participantesOutros])
  const n = todosOsNomes.length

  const partesIguais = useMemo(() => {
    if (n === 0 || !form.valorTotal) return []
    // Backend calcula [outros..., organizador] — mantém a mesma ordem no preview.
    const partes = splitEqual(form.valorTotal, n)
    return [...form.participantesOutros, 'Você'].map((nome, index) => [nome, partes[index]])
  }, [form.participantesOutros, form.valorTotal, n])

  const partesPreview =
    form.tipo === 'IGUAL'
      ? Object.fromEntries(partesIguais)
      : {
          Você: Number(form.valoresPersonalizados.__organizador__ ?? 0),
          ...Object.fromEntries(
            form.participantesOutros.map((nome) => [nome, Number(form.valoresPersonalizados[nome] ?? 0)])
          ),
        }

  const handleAdicionarParticipante = () => {
    const nome = form.novoParticipanteNome.trim()
    if (!nome) return
    setForm((prev) => ({
      ...prev,
      participantesOutros: [...prev.participantesOutros, nome],
      novoParticipanteNome: '',
    }))
  }

  const handleRemoverParticipante = (nome) => {
    setForm((prev) => ({
      ...prev,
      participantesOutros: prev.participantesOutros.filter((item) => item !== nome),
    }))
  }

  const handleAtualizarValorPersonalizado = (chave, valor) => {
    setForm((prev) => ({
      ...prev,
      valoresPersonalizados: { ...prev.valoresPersonalizados, [chave]: valor },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.titulo.trim()) {
      setError('Informe uma descrição.')
      return
    }
    if (!form.valorTotal || form.valorTotal <= 0) {
      setError('Informe um valor total maior que zero.')
      return
    }
    if (form.participantesOutros.length === 0) {
      setError('Adicione ao menos 1 participante além de você.')
      return
    }
    if (!form.pagoPorMim && !form.outroPagadorNome.trim()) {
      setError('Informe o nome de quem pagou.')
      return
    }

    const categoria = categorias.find((c) => c.id === form.categoriaId)

    const payload = {
      titulo: form.titulo.trim(),
      valorTotal: form.valorTotal,
      tipo: form.tipo,
      data: form.data.toISOString().slice(0, 10),
      icone: categoria?.icone ?? null,
      cor: categoria?.cor ?? null,
      participantes: form.participantesOutros.map((nome) => ({
        nome,
        ...(form.tipo === 'PERSONALIZADA' ? { valor: Number(form.valoresPersonalizados[nome] ?? 0) } : {}),
      })),
      pagoPor: form.pagoPorMim ? 'VOCE' : form.outroPagadorNome.trim(),
      ...(form.tipo === 'PERSONALIZADA'
        ? { valorOrganizador: Number(form.valoresPersonalizados.__organizador__ ?? 0) }
        : {}),
    }

    try {
      await onSubmit?.(payload)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar a divisão.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="expense-split-form-modal">
      <form className="expense-split-form" onSubmit={handleSubmit} noValidate>
        <header className="expense-split-form__header">
          <h2>{isEdit ? 'Editar Divisão de Despesa' : 'Nova Divisão de Despesa'}</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="expense-split-form__body">
          <section className="expense-split-form__section">
            <h3>1. Dados da despesa</h3>
            <div className="expense-split-form__row">
              <InputText
                label={<FormFieldLabel icon={Pencil}>Descrição</FormFieldLabel>}
                placeholder="Ex: Jantar no Outback"
                value={form.titulo}
                onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
              />
              <InputMoney
                label={<FormFieldLabel icon={CircleDollarSign}>Valor total</FormFieldLabel>}
                value={form.valorTotal}
                onChange={(valor) => setForm((prev) => ({ ...prev, valorTotal: valor }))}
              />
            </div>
            <div className="expense-split-form__row">
              <DatePicker
                label={<FormFieldLabel icon={Calendar}>Data</FormFieldLabel>}
                value={form.data}
                onChange={(valor) => setForm((prev) => ({ ...prev, data: valor }))}
                maxDate={new Date()}
              />
              <Select
                label={<FormFieldLabel icon={Folder}>Categoria</FormFieldLabel>}
                value={form.categoriaId}
                onChange={(valor) => setForm((prev) => ({ ...prev, categoriaId: valor }))}
                options={categoriaOptions}
                placeholder="Selecione..."
              />
            </div>
          </section>

          <section className="expense-split-form__section">
            <h3>2. Quem pagou a conta?</h3>
            <div className="expense-split-form__payer" role="radiogroup" aria-label="Quem pagou a conta">
              <div className="expense-split-form__payer-option">
                <button
                  type="button"
                  role="radio"
                  aria-checked={form.pagoPorMim}
                  className="expense-split-form__radio-row"
                  onClick={() => setForm((prev) => ({ ...prev, pagoPorMim: true }))}
                >
                  <span className={`expense-split-form__radio${form.pagoPorMim ? ' is-checked' : ''}`} aria-hidden />
                  <User size={16} className="expense-split-form__payer-icon" aria-hidden />
                  Eu paguei
                </button>
              </div>
              <div className="expense-split-form__payer-option">
                <button
                  type="button"
                  role="radio"
                  aria-checked={!form.pagoPorMim}
                  className="expense-split-form__radio-row"
                  onClick={() => setForm((prev) => ({ ...prev, pagoPorMim: false }))}
                >
                  <span className={`expense-split-form__radio${!form.pagoPorMim ? ' is-checked' : ''}`} aria-hidden />
                  <User size={16} className="expense-split-form__payer-icon" aria-hidden />
                  Outra pessoa
                </button>
                <InputText
                  placeholder="Nome de quem pagou"
                  value={form.outroPagadorNome}
                  disabled={form.pagoPorMim}
                  onChange={(e) => setForm((prev) => ({ ...prev, outroPagadorNome: e.target.value }))}
                  className="expense-split-form__payer-input"
                />
              </div>
            </div>
          </section>

          <section className="expense-split-form__section">
            <div className="expense-split-form__section-heading">
              <h3>3. Dividir entre</h3>
              <span className="expense-split-form__count">
                <Users size={14} aria-hidden /> {n} {n === 1 ? 'pessoa' : 'pessoas'}
              </span>
            </div>

            <div className="expense-split-form__add-row">
              <InputText
                placeholder="Nome do participante"
                value={form.novoParticipanteNome}
                onChange={(e) => setForm((prev) => ({ ...prev, novoParticipanteNome: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAdicionarParticipante()
                  }
                }}
              />
              <Button type="button" variant="secondary" leftIcon={<Plus size={14} />} onClick={handleAdicionarParticipante}>
                Adicionar
              </Button>
            </div>

            <ul className="expense-split-form__participants">
              <li className="expense-split-form__participant-row">
                <User size={16} aria-hidden />
                <span className="expense-split-form__participant-name">Você</span>
                <Badge variant="success" size="sm" leftIcon={<Check size={12} />}>
                  Incluso
                </Badge>
                {form.tipo === 'PERSONALIZADA' ? (
                  <InputMoney
                    className="expense-split-form__participant-value"
                    value={form.valoresPersonalizados.__organizador__ ?? 0}
                    onChange={(valor) => handleAtualizarValorPersonalizado('__organizador__', valor)}
                  />
                ) : (
                  <span className="expense-split-form__non-removable">Você não pode ser removido</span>
                )}
              </li>
              {form.participantesOutros.map((nome) => (
                <li key={nome} className="expense-split-form__participant-row">
                  <User size={16} aria-hidden />
                  <span className="expense-split-form__participant-name">{nome}</span>
                  {form.tipo === 'PERSONALIZADA' ? (
                    <InputMoney
                      className="expense-split-form__participant-value"
                      value={form.valoresPersonalizados[nome] ?? 0}
                      onChange={(valor) => handleAtualizarValorPersonalizado(nome, valor)}
                    />
                  ) : null}
                  <IconButton
                    variant="ghost"
                    size="sm"
                    ariaLabel={`Remover ${nome}`}
                    icon={<X size={16} />}
                    onClick={() => handleRemoverParticipante(nome)}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="expense-split-form__section">
            <h3>4. Tipo de divisão</h3>
            <Toggle
              label={<strong>Divisão igualitária</strong>}
              description="Todos pagam o mesmo valor"
              checked={form.tipo === 'IGUAL'}
              onChange={() => setForm((prev) => ({ ...prev, tipo: 'IGUAL' }))}
            />
            {form.tipo === 'IGUAL' && n > 0 && form.valorTotal > 0 ? (
              <p className="expense-split-form__formula">
                <Calculator size={16} aria-hidden />
                {formatCurrency(form.valorTotal)} ÷ {n} ={' '}
                <strong>{formatCurrency(form.valorTotal / n)}</strong> por pessoa
              </p>
            ) : null}

            <div className="expense-split-form__divider">ou</div>

            <Toggle
              label={<strong>Divisão personalizada</strong>}
              description="Defina valores diferentes para cada pessoa"
              checked={form.tipo === 'PERSONALIZADA'}
              onChange={() => setForm((prev) => ({ ...prev, tipo: 'PERSONALIZADA' }))}
            />
          </section>

          <section className="expense-split-form__section">
            <h3>5. Preview da divisão</h3>
            <div className="expense-split-form__preview">
              <div className="expense-split-form__preview-row expense-split-form__preview-row--total">
                <span className="expense-split-form__preview-icon" aria-hidden>
                  <Calculator size={18} />
                </span>
                <span>Total da despesa</span>
                <strong>{formatCurrency(form.valorTotal)}</strong>
              </div>
              <div className="expense-split-form__preview-row">
                <User size={16} aria-hidden />
                <span>Sua parte</span>
                <strong className="expense-split-form__preview-value">
                  {formatCurrency(partesPreview.Você ?? 0)}
                </strong>
              </div>
              {form.participantesOutros.map((nome) => (
                <div key={nome} className="expense-split-form__preview-row">
                  <User size={16} aria-hidden />
                  <span>{nome} deve</span>
                  <strong className="expense-split-form__preview-value">
                    {formatCurrency(partesPreview[nome] ?? 0)}
                  </strong>
                </div>
              ))}
              <p className="expense-split-form__preview-note">
                <Info size={14} aria-hidden /> Valores negativos indicam que a pessoa deve receber.
              </p>
            </div>
          </section>

          {error ? <p className="expense-split-form__error">{error}</p> : null}
        </div>

        <footer className="expense-split-form__footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Divisão'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
