import { useEffect, useMemo, useState } from 'react'
import {
  AlignLeft,
  ArrowLeftRight,
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Heart,
  RefreshCw,
  Sparkles,
  Tag,
  Tags,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { TagsInput } from '@/design-system/components/selects/TagsInput/TagsInput.jsx'
import { Checkbox } from '@/design-system/components/forms/Checkbox/Checkbox.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { validarRecursoCategoria, validarTransferencia } from '@/utils/transactionValidation.js'
import { REQUIRED_FIELD_ERROR } from '@/utils/formValidation.js'
import { buildRecurrenceRule } from '@/utils/transactionRecurrence.js'
import { sugerirCategoria } from '@/services/transactionService.js'
import { cn } from '@/design-system/utils/cn.js'
import { tagSuggestions, categoriaToSelectOption, recursoSelectOptions, toSelectOptions } from '@/utils/filterOptions.js'

const SUGESTAO_DEBOUNCE_MS = 400
const SUGESTAO_DESCRICAO_MINIMA = 3

const emptyForm = () => ({
  tipo: 'DESPESA',
  valor: 0,
  data: new Date(),
  categoriaId: null,
  descricao: '',
  recurso: null,
  recursoDestino: null,
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
  const [fieldErrors, setFieldErrors] = useState({})
  const [categoriaAutoSugerida, setCategoriaAutoSugerida] = useState(false)

  const categorias = opcoes?.categorias ?? []
  const tagsCatalog = opcoes?.tags ?? []
  const recursoOptions = recursoSelectOptions(opcoes?.formulario?.recursos)
  const frequenciaOptions = toSelectOptions(opcoes?.formulario?.frequencias)
  const ateQuandoOptions = toSelectOptions(opcoes?.formulario?.ateQuando)

  const isTransferencia = form.tipo === 'TRANSFERENCIA'

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    setCategoriaAutoSugerida(false)

    if (mode === 'edit' && transacao) {
      setForm({
        tipo: transacao.tipo,
        valor: Number(transacao.valor),
        data: new Date(transacao.data),
        categoriaId: transacao.categoria?.id ?? null,
        descricao: transacao.descricao ?? '',
        recurso: transacao.recurso,
        recursoDestino: transacao.recursoDestino ?? null,
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

  const transferenciaError = useMemo(() => {
    if (!isTransferencia) return null
    return validarTransferencia(form.recurso, form.recursoDestino)
  }, [isTransferencia, form.recurso, form.recursoDestino])

  const recursoOrigemOptions = useMemo(
    () => (isTransferencia ? recursoOptions.filter((o) => o.value !== form.recursoDestino) : recursoOptions),
    [recursoOptions, isTransferencia, form.recursoDestino]
  )
  const recursoDestinoOptions = useMemo(
    () => recursoOptions.filter((o) => o.value !== form.recurso),
    [recursoOptions, form.recurso]
  )

  const updateForm = (patch) => {
    setForm((prev) => {
      const next = { ...prev, ...patch }
      if (patch.tipo && patch.tipo !== prev.tipo) {
        next.categoriaId = null
        next.recursoDestino = null
      }
      return next
    })

    if ('tipo' in patch) {
      setCategoriaAutoSugerida(false)
    }

    const touchedFields = Object.keys(patch)
    if (touchedFields.length > 0) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        touchedFields.forEach((field) => {
          delete next[field]
        })
        return next
      })
    }
  }

  const handleCategoriaChange = (categoriaId) => {
    updateForm({ categoriaId })
    setCategoriaAutoSugerida(false)
  }

  // RF-141 — sugere a categoria com base no histórico de descrições do usuário
  useEffect(() => {
    if (!open || mode !== 'create' || isTransferencia) return
    if (form.categoriaId && !categoriaAutoSugerida) return

    const descricao = form.descricao.trim()
    if (descricao.length < SUGESTAO_DESCRICAO_MINIMA) return

    let cancelado = false
    const timer = setTimeout(async () => {
      try {
        const { categoriaId } = await sugerirCategoria({ tipo: form.tipo, descricao })
        if (!cancelado && categoriaId) {
          setForm((prev) => ({ ...prev, categoriaId }))
          setCategoriaAutoSugerida(true)
        }
      } catch {
        // sugestão é apenas um auxílio; falhas na busca não devem travar o formulário
      }
    }, SUGESTAO_DEBOUNCE_MS)

    return () => {
      cancelado = true
      clearTimeout(timer)
    }
  }, [open, mode, isTransferencia, form.descricao, form.tipo, form.categoriaId, categoriaAutoSugerida])

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

    const nextFieldErrors = {}
    if (!form.valor || form.valor <= 0) nextFieldErrors.valor = REQUIRED_FIELD_ERROR
    if (!form.data) nextFieldErrors.data = REQUIRED_FIELD_ERROR
    if (!form.recurso) nextFieldErrors.recurso = REQUIRED_FIELD_ERROR

    if (isTransferencia) {
      if (!form.recursoDestino) nextFieldErrors.recursoDestino = REQUIRED_FIELD_ERROR
    } else if (!form.categoriaId) {
      nextFieldErrors.categoriaId = REQUIRED_FIELD_ERROR
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    if (isTransferencia ? transferenciaError : recursoError) return

    setFieldErrors({})
    onSubmit?.({
      tipo: form.tipo,
      categoriaId: isTransferencia ? undefined : form.categoriaId,
      recurso: form.recurso,
      recursoDestino: isTransferencia ? form.recursoDestino : undefined,
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
      <form className="tx-form" onSubmit={handleSubmit} noValidate>
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
              className={cn('tx-form__toggle-btn', form.tipo === 'DESPESA' && 'tx-form__toggle-btn--active tx-form__toggle-btn--expense')}
              onClick={() => updateForm({ tipo: 'DESPESA' })}
            >
              <Heart size={18} fill={form.tipo === 'DESPESA' ? 'currentColor' : 'none'} />
              Despesa
            </button>
            <button
              type="button"
              className={cn('tx-form__toggle-btn', isTransferencia && 'tx-form__toggle-btn--active tx-form__toggle-btn--transfer')}
              onClick={() => updateForm({ tipo: 'TRANSFERENCIA' })}
            >
              <ArrowLeftRight size={18} />
              Transferência
            </button>
          </div>

          <div
            className={cn(
              'tx-form__money',
              isTransferencia
                ? 'tx-form__money--transfer'
                : isReceita
                  ? 'tx-form__money--income'
                  : 'tx-form__money--expense'
            )}
          >
            <InputMoney
              label={
                <FormFieldLabel icon={CircleDollarSign} tone="green">
                  Valor
                </FormFieldLabel>
              }
              value={form.valor}
              onChange={(v) => updateForm({ valor: v })}
              size="large"
              required
              error={fieldErrors.valor}
            />
          </div>

          <div className="tx-form__grid">
            <DatePicker
              label={
                <FormFieldLabel icon={Calendar} tone="purple">
                  Data
                </FormFieldLabel>
              }
              value={form.data}
              onChange={(d) => updateForm({ data: d })}
              required
              error={fieldErrors.data}
            />
            {isTransferencia ? (
              <Select
                label={
                  <FormFieldLabel icon={ArrowLeftRight} tone="blue">
                    Recurso de destino
                  </FormFieldLabel>
                }
                value={form.recursoDestino}
                onChange={(v) => updateForm({ recursoDestino: v })}
                options={recursoDestinoOptions}
                placeholder="Selecione o recurso"
                error={transferenciaError || fieldErrors.recursoDestino}
                required
              />
            ) : (
              <Select
                label={
                  <FormFieldLabel icon={Tag} tone="blue">
                    Categoria
                  </FormFieldLabel>
                }
                value={form.categoriaId}
                onChange={handleCategoriaChange}
                options={categoriaOptions}
                placeholder="Selecione uma categoria"
                required
                error={fieldErrors.categoriaId}
              />
            )}
          </div>

          {!isTransferencia && categoriaAutoSugerida && form.categoriaId ? (
            <p className="tx-form__suggestion-hint">
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
              Categoria sugerida automaticamente
            </p>
          ) : null}

          <InputText
            label={
              <FormFieldLabel icon={AlignLeft} tone="purple">
                Descrição
              </FormFieldLabel>
            }
            value={form.descricao}
            onChange={(e) => updateForm({ descricao: e.target.value })}
            placeholder="Ex: Almoço no RU"
          />

          <Select
            label={
              <FormFieldLabel icon={Wallet} tone="green">
                Recurso de origem
              </FormFieldLabel>
            }
            value={form.recurso}
            onChange={(v) => updateForm({ recurso: v })}
            options={recursoOrigemOptions}
            placeholder="Selecione o recurso"
            error={(isTransferencia ? null : recursoError) || fieldErrors.recurso}
            required
          />

          <TagsInput
            label={
              <FormFieldLabel icon={Tags} tone="blue">
                Tags
              </FormFieldLabel>
            }
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
              <FormFieldLabel icon={RefreshCw} tone="purple" className="tx-form__recurring-label">
                Repetir automaticamente
              </FormFieldLabel>
            }
          />

          {form.recorrente ? (
            <div className="tx-form__grid tx-form__recurring">
              <Select
                label={
                  <FormFieldLabel icon={RefreshCw} tone="purple">
                    Frequência
                  </FormFieldLabel>
                }
                value={form.frequencia}
                onChange={(v) => updateForm({ frequencia: v })}
                options={frequenciaOptions}
              />
              <Select
                label={
                  <FormFieldLabel icon={CalendarClock} tone="yellow">
                    Até quando
                  </FormFieldLabel>
                }
                value={form.ateQuando}
                onChange={(v) => updateForm({ ateQuando: v })}
                options={ateQuandoOptions}
              />
              {form.ateQuando === 'DATA' ? (
                <DatePicker
                  label={
                    <FormFieldLabel icon={Calendar} tone="purple">
                      Data final
                    </FormFieldLabel>
                  }
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
