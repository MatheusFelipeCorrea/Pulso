import { useEffect, useMemo, useState } from 'react'
import { X, RefreshCw, Trash2, Heart } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { TagsInput } from '@/design-system/components/selects/TagsInput/TagsInput.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { validarRecursoCategoria } from '@/utils/transactionValidation.js'
import { buildRecurrenceRule } from '@/utils/transactionRecurrence.js'
import { cn } from '@/design-system/utils/cn.js'
import { tagSuggestions, categoriaToSelectOption, recursoSelectOptions, toSelectOptions } from '@/utils/filterOptions.js'

const emptyForm = () => ({
  tipo: 'DESPESA',
  valor: 0,
  data: new Date(),
  categoriaId: null,
  descricao: '',
  recurso: null,
  tagIds: [],
  tagLabels: [],
  recorrente: false,
  frequencia: 'MENSAL',
  ateQuando: 'SEM_FIM',
  dataFim: null,
})

export function TransactionFormModal({
  open,
  mode = 'create',
  transacao,
  opcoes,
  onClose,
  onSubmit,
  onDelete,
  submitting,
}) {
  const [form, setForm] = useState(emptyForm)

  const categorias = opcoes?.categorias ?? []
  const tagsCatalog = opcoes?.tags ?? []
  const recursoOptions = recursoSelectOptions(opcoes?.formulario?.recursos)
  const frequenciaOptions = toSelectOptions(opcoes?.formulario?.frequencias)
  const ateQuandoOptions = toSelectOptions(opcoes?.formulario?.ateQuando)

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && transacao) {
      setForm({
        tipo: transacao.tipo,
        valor: Number(transacao.valor),
        data: new Date(transacao.data),
        categoriaId: transacao.categoria?.id ?? null,
        descricao: transacao.descricao ?? '',
        recurso: transacao.recurso,
        tagIds: transacao.tags?.map((t) => t.id) ?? [],
        tagLabels: transacao.tags?.map((t) => t.nome) ?? [],
        recorrente: transacao.recorrente ?? false,
        frequencia: 'MENSAL',
        ateQuando: 'SEM_FIM',
        dataFim: null,
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, mode, transacao])

  const categoriasFiltradas = useMemo(
    () => categorias.filter((c) => c.tipo === form.tipo),
    [categorias, form.tipo]
  )

  const categoriaOptions = categoriasFiltradas.map(categoriaToSelectOption)

  const categoriaSelecionada = categorias.find((c) => c.id === form.categoriaId)
  const tagSuggestionList = tagSuggestions(tagsCatalog)

  const recursoError = useMemo(() => {
    if (!form.categoriaId || !form.recurso) return null
    return validarRecursoCategoria(form.recurso, categoriaSelecionada?.nome, form.tipo)
  }, [form.categoriaId, form.recurso, form.tipo, categoriaSelecionada?.nome])

  const updateForm = (patch) => {
    setForm((prev) => {
      const next = { ...prev, ...patch }
      if (patch.tipo && patch.tipo !== prev.tipo) {
        next.categoriaId = null
      }
      return next
    })
  }

  const addTagByName = (nome) => {
    const trimmed = nome.trim()
    if (!trimmed) return
    if (form.tagLabels.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return

    const existente = tagsCatalog.find((t) => t.nome.toLowerCase() === trimmed.toLowerCase())
    updateForm({
      tagLabels: [...form.tagLabels, trimmed],
      tagIds: existente ? [...form.tagIds, existente.id] : form.tagIds,
    })
  }

  const removeTag = (nome) => {
    const idx = form.tagLabels.indexOf(nome)
    updateForm({
      tagLabels: form.tagLabels.filter((t) => t !== nome),
      tagIds: form.tagIds.filter((_, i) => i !== idx),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.valor || form.valor <= 0) return
    if (!form.categoriaId || !form.recurso) return
    if (recursoError) return

    onSubmit?.({
      tipo: form.tipo,
      categoriaId: form.categoriaId,
      recurso: form.recurso,
      valor: form.valor,
      descricao: form.descricao || undefined,
      data: form.data.toISOString(),
      tags: form.tagIds,
      tagNames: form.tagLabels.filter(
        (nome) => !form.tagIds.some((id) => tagsCatalog.find((t) => t.id === id)?.nome === nome)
      ),
      recorrente: form.recorrente,
      regraRecorrencia: form.recorrente
        ? buildRecurrenceRule({
            frequencia: form.frequencia,
            ateQuando: form.ateQuando,
            dataFim: form.dataFim,
          })
        : undefined,
    })
  }

  const isReceita = form.tipo === 'RECEITA'

  return (
    <Modal isOpen={open} onClose={onClose} size="xl">
      <form className="tx-form" onSubmit={handleSubmit}>
        <header className="tx-form__header">
          <div>
            <h2 className="tx-form__title">
              {mode === 'edit' ? 'Editar Transação' : 'Nova Transação'}
            </h2>
            <p className="tx-form__subtitle">
              {mode === 'edit'
                ? 'Edite os dados da movimentação'
                : 'Registre uma movimentação financeira'}
            </p>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Fechar"
            icon={<X size={18} />}
            onClick={onClose}
          />
        </header>

        <div className="tx-form__body">
          <div className="tx-form__toggle">
            <button
              type="button"
              className={cn('tx-form__toggle-btn', isReceita && 'tx-form__toggle-btn--active tx-form__toggle-btn--income')}
              onClick={() => updateForm({ tipo: 'RECEITA' })}
            >
              <Heart size={18} fill={isReceita ? 'currentColor' : 'none'} />
              Receita
            </button>
            <button
              type="button"
              className={cn('tx-form__toggle-btn', !isReceita && 'tx-form__toggle-btn--active tx-form__toggle-btn--expense')}
              onClick={() => updateForm({ tipo: 'DESPESA' })}
            >
              <Heart size={18} fill={!isReceita ? 'currentColor' : 'none'} />
              Despesa
            </button>
          </div>

          <div className={cn('tx-form__money', isReceita ? 'tx-form__money--income' : 'tx-form__money--expense')}>
            <InputMoney
              label="Valor"
              value={form.valor}
              onChange={(v) => updateForm({ valor: v })}
              size="large"
              required
            />
          </div>

          <div className="tx-form__grid">
            <DatePicker
              label="Data"
              value={form.data}
              onChange={(d) => updateForm({ data: d })}
              required
            />
            <Select
              label="Categoria"
              value={form.categoriaId}
              onChange={(v) => updateForm({ categoriaId: v })}
              options={categoriaOptions}
              placeholder="Selecione uma categoria"
              required
            />
          </div>

          <InputText
            label="Descrição"
            value={form.descricao}
            onChange={(e) => updateForm({ descricao: e.target.value })}
            placeholder="Ex: Almoço no RU"
          />

          <Select
            label="Recurso de origem"
            value={form.recurso}
            onChange={(v) => updateForm({ recurso: v })}
            options={recursoOptions}
            placeholder="Selecione o recurso"
            error={recursoError}
            required
          />

          <TagsInput
            label="Tags"
            tags={form.tagLabels}
            onAdd={addTagByName}
            onRemove={removeTag}
            suggestions={tagSuggestionList}
            placeholder="faculdade, almoço..."
          />

          <Checkbox
            checked={form.recorrente}
            onChange={(checked) => updateForm({ recorrente: checked })}
            label={
              <span className="tx-form__recurring-label">
                <RefreshCw size={16} /> Repetir automaticamente
              </span>
            }
          />

          {form.recorrente ? (
            <div className="tx-form__grid tx-form__recurring">
              <Select
                label="Frequência"
                value={form.frequencia}
                onChange={(v) => updateForm({ frequencia: v })}
                options={frequenciaOptions}
              />
              <Select
                label="Até quando"
                value={form.ateQuando}
                onChange={(v) => updateForm({ ateQuando: v })}
                options={ateQuandoOptions}
              />
              {form.ateQuando === 'DATA' ? (
                <DatePicker
                  label="Data final"
                  value={form.dataFim}
                  onChange={(d) => updateForm({ dataFim: d })}
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <footer className="tx-form__footer">
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="secondary"
              className="tx-btn-danger-outline"
              leftIcon={<Trash2 size={16} />}
              onClick={() => onDelete?.(transacao)}
            >
              Excluir
            </Button>
          ) : (
            <span />
          )}
          <div className="tx-form__footer-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Salvar
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
