import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  CircleDollarSign,
  Link2,
  Package,
  Plus,
  Target,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { inferirTipoMeta } from '@/utils/goalBalanceUtils.js'
import {
  capitalizeNomeItem,
  PRIORIDADE_LABELS,
} from '@/utils/purchasePlanningUtils.js'
import {
  GOAL_LINK_TABS,
  GoalLinkModeToggle,
} from '@/components/features/purchase-planning/GoalLinkModeToggle.jsx'
import { getGoalIcon } from '@/utils/goalIconRules.js'
import * as metaService from '@/services/metaService.js'

const emptyCreateMeta = () => ({
  nome: '',
  valorAlvo: 0,
  prazo: null,
})

export function LinkGoalModal({
  open,
  onClose,
  onSubmit,
  item,
  submitting = false,
}) {
  const [tab, setTab] = useState(GOAL_LINK_TABS.EXISTING)
  const [metas, setMetas] = useState([])
  const [loadingMetas, setLoadingMetas] = useState(false)
  const [metaId, setMetaId] = useState(null)
  const [ajustarMetaValor, setAjustarMetaValor] = useState(true)
  const [criarMeta, setCriarMeta] = useState(emptyCreateMeta)
  const [error, setError] = useState('')

  const carregarMetas = useCallback(async (signal) => {
    setLoadingMetas(true)
    try {
      const data = await metaService.buscarMetas(
        { status: 'ATIVA', limite: 50, pagina: 1 },
        { signal }
      )
      setMetas(data.metas ?? [])
    } catch {
      if (!signal?.aborted) setMetas([])
    } finally {
      if (!signal?.aborted) setLoadingMetas(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setTab(GOAL_LINK_TABS.EXISTING)
    setMetaId(null)
    setAjustarMetaValor(true)
    setCriarMeta({
      ...emptyCreateMeta(),
      nome: item?.nome ? `Comprar: ${item.nome}` : '',
      valorAlvo: Number(item?.valorEstimado) || 0,
    })
    setError('')

    const controller = new AbortController()
    carregarMetas(controller.signal)
    return () => controller.abort()
  }, [open, item, carregarMetas])

  const metaOptions = useMemo(
    () =>
      metas.map((meta) => {
        const Icon = getGoalIcon(meta.nome)
        return {
          value: meta.id,
          label: meta.nome,
          icon: <Icon size={14} aria-hidden />,
          trailingText: formatCurrency(meta.valorAlvo),
        }
      }),
    [metas]
  )

  const selectedMeta = metas.find((meta) => meta.id === metaId)
  const itemNome = capitalizeNomeItem(item?.nome)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (tab === GOAL_LINK_TABS.EXISTING) {
      if (!metaId) {
        setError('Selecione uma meta para vincular.')
        return
      }
    } else if (!criarMeta.prazo) {
      setError('Informe o prazo da nova meta.')
      return
    }

    const payload =
      tab === GOAL_LINK_TABS.EXISTING
        ? { metaId, ajustarMetaValor }
        : {
            ajustarMetaValor,
            criarMeta: {
              nome: criarMeta.nome.trim() || `Comprar: ${item?.nome ?? 'item'}`,
              valorAlvo: criarMeta.valorAlvo || Number(item?.valorEstimado) || 0,
              prazo: criarMeta.prazo.toISOString(),
              tipo: inferirTipoMeta(criarMeta.prazo.toISOString()),
            },
          }

    try {
      await onSubmit?.(payload)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível vincular a meta.')
    }
  }

  if (!item) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="pp-form-modal">
      <form className="pp-form" onSubmit={handleSubmit} noValidate>
        <header className="pp-form__header">
          <div>
            <h2>Vincular meta</h2>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="pp-form__body">
          <div className="pp-link-goal-item">
            <span className="pp-link-goal-item__icon" aria-hidden>
              <Package size={18} />
            </span>
            <div className="pp-link-goal-item__copy">
              <strong>
                {itemNome} — {formatCurrency(item.valorEstimado)}
              </strong>
            </div>
            {item.prioridade ? (
              <span className={`pp-link-goal-item__priority pp-link-goal-item__priority--${item.prioridade.toLowerCase()}`}>
                {PRIORIDADE_LABELS[item.prioridade]}
              </span>
            ) : null}
          </div>

          <GoalLinkModeToggle
            value={tab}
            onChange={setTab}
            existingSlot={
              loadingMetas ? (
                <SpinnerDots center label="Carregando metas..." />
              ) : metaOptions.length ? (
                <>
                  <Select
                    options={metaOptions}
                    value={metaId}
                    onChange={setMetaId}
                    placeholder="Selecione uma meta ativa..."
                    required
                  />
                  {selectedMeta ? (
                    <p className="pp-form__hint">
                      Progresso atual: {formatCurrency(selectedMeta.valorAtual)} de{' '}
                      {formatCurrency(selectedMeta.valorAlvo)} (
                      {Math.round(Number(selectedMeta.percentual) || 0)}%)
                    </p>
                  ) : null}
                  <Toggle
                    checked={ajustarMetaValor}
                    onChange={setAjustarMetaValor}
                    label="Ajustar valor alvo da meta"
                    description={`Atualizar meta para ${formatCurrency(item.valorEstimado)} (valor do item).`}
                  />
                </>
              ) : (
                <p className="pp-form__hint">
                  Nenhuma meta ativa encontrada. Use a opção &quot;Criar nova meta&quot;.
                </p>
              )
            }
          />

          {tab === GOAL_LINK_TABS.CREATE ? (
            <>
              <InputText
                label={
                  <FormFieldLabel icon={Target} tone="purple">
                    Nome da meta
                  </FormFieldLabel>
                }
                value={criarMeta.nome}
                onChange={(event) =>
                  setCriarMeta((prev) => ({ ...prev, nome: event.target.value }))
                }
                placeholder="Ex.: Comprar notebook"
              />
              <InputMoney
                label={
                  <FormFieldLabel icon={CircleDollarSign} tone="green">
                    Valor alvo
                  </FormFieldLabel>
                }
                value={criarMeta.valorAlvo}
                onChange={(valorAlvo) => setCriarMeta((prev) => ({ ...prev, valorAlvo }))}
              />
              <DatePicker
                label={
                  <FormFieldLabel icon={Calendar} tone="blue">
                    Prazo
                  </FormFieldLabel>
                }
                value={criarMeta.prazo}
                onChange={(prazo) => setCriarMeta((prev) => ({ ...prev, prazo }))}
                minDate={new Date()}
                placeholder="Selecione a data"
              />
              {criarMeta.prazo ? (
                <p className="pp-form__hint">
                  Prazo: {format(criarMeta.prazo, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              ) : null}
            </>
          ) : null}

          {error ? <p className="pp-form__error">{error}</p> : null}
        </div>

        <footer className="pp-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            leftIcon={tab === GOAL_LINK_TABS.CREATE ? <Plus size={16} /> : <Link2 size={16} />}
          >
            {tab === GOAL_LINK_TABS.CREATE ? 'Criar e vincular' : 'Vincular'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
