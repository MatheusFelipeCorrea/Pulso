import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  CircleDollarSign,
  Link2,
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
import { InputNumber } from '@/design-system/components/inputs/InputNumber/InputNumber.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { inferirTipoMeta } from '@/utils/goalBalanceUtils.js'
import { PRIORIDADE_OPTIONS } from '@/utils/purchasePlanningUtils.js'
import * as metaService from '@/services/metaService.js'

const TABS = {
  EXISTING: 'existing',
  CREATE: 'create',
}

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
  const [tab, setTab] = useState(TABS.EXISTING)
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
    setTab(TABS.EXISTING)
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
      metas.map((meta) => ({
        value: meta.id,
        label: `${meta.nome} · ${formatCurrency(meta.valorAlvo)}`,
      })),
    [metas]
  )

  const selectedMeta = metas.find((meta) => meta.id === metaId)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (tab === TABS.EXISTING) {
      if (!metaId) {
        setError('Selecione uma meta para vincular.')
        return
      }
    } else if (!criarMeta.prazo) {
      setError('Informe o prazo da nova meta.')
      return
    }

    const payload =
      tab === TABS.EXISTING
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
    <Modal isOpen={open} onClose={onClose} size="md" className="pp-link-goal-modal">
      <form className="pp-link-goal-form" onSubmit={handleSubmit} noValidate>
        <header className="pp-link-goal-form__header">
          <div>
            <h2>Vincular meta</h2>
            <p>
              Associe <strong>{item.nome}</strong> a uma meta financeira para acompanhar o progresso.
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="pp-link-goal-form__tabs" role="tablist" aria-label="Modo de vínculo">
          <button
            type="button"
            role="tab"
            aria-selected={tab === TABS.EXISTING}
            className={tab === TABS.EXISTING ? 'is-active' : ''}
            onClick={() => setTab(TABS.EXISTING)}
          >
            Meta existente
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === TABS.CREATE}
            className={tab === TABS.CREATE ? 'is-active' : ''}
            onClick={() => setTab(TABS.CREATE)}
          >
            Criar nova meta
          </button>
        </div>

        <div className="pp-link-goal-form__body">
          {tab === TABS.EXISTING ? (
            loadingMetas ? (
              <SpinnerDots center label="Carregando metas..." />
            ) : metaOptions.length ? (
              <>
                <FormFieldLabel htmlFor="pp-link-meta-select" required>
                  Selecione a meta
                </FormFieldLabel>
                <Select
                  id="pp-link-meta-select"
                  options={metaOptions}
                  value={metaId}
                  onChange={setMetaId}
                  placeholder="Escolha uma meta ativa..."
                />
                {selectedMeta ? (
                  <p className="pp-link-goal-form__hint">
                    Progresso atual: {formatCurrency(selectedMeta.valorAtual)} de{' '}
                    {formatCurrency(selectedMeta.valorAlvo)} (
                    {Math.round(Number(selectedMeta.percentual) || 0)}%)
                  </p>
                ) : null}
              </>
            ) : (
              <p className="pp-link-goal-form__empty">
                Nenhuma meta ativa encontrada. Use a aba &quot;Criar nova meta&quot;.
              </p>
            )
          ) : (
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
                  <p className="pp-link-goal-form__hint">
                    Prazo: {format(criarMeta.prazo, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                ) : null}
            </>
          )}

          <Toggle
            checked={ajustarMetaValor}
            onChange={setAjustarMetaValor}
            label="Ajustar valor alvo da meta"
            description={`Atualizar meta para ${formatCurrency(item.valorEstimado)} (valor do item).`}
          />

          {error ? <p className="pp-link-goal-form__error">{error}</p> : null}
        </div>

        <footer className="pp-link-goal-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            leftIcon={tab === TABS.CREATE ? <Plus size={16} /> : <Link2 size={16} />}
          >
            {tab === TABS.CREATE ? 'Criar e vincular' : 'Vincular meta'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
