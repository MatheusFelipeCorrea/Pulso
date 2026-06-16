import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  CircleDollarSign,
  Globe,
  Info,
  Link2,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { CurrencySearchPicker } from '@/components/features/trips/CurrencySearchPicker.jsx'
import { DestinationSearchPicker } from '@/components/features/trips/DestinationSearchPicker.jsx'
import * as moedaService from '@/services/moedaService.js'
import * as viagemService from '@/services/viagemService.js'

const emptyForm = () => ({
  destino: '',
  destinoMeta: null,
  moeda: 'BRL',
  dataPrevista: null,
  vincularMeta: false,
  metaId: null,
})

function formatRateValue(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return formatCurrency(0)
  if (amount > 0 && amount < 0.01) {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  }
  return formatCurrency(amount)
}

export function TripFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  viagem = null,
  catalog = [],
  metas = [],
  submitting = false,
  deleting = false,
  onCreateGoal,
  defaultVincularMeta = false,
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [cotacao, setCotacao] = useState(null)
  const [destinosTotal, setDestinosTotal] = useState(null)
  const [destinosLoading, setDestinosLoading] = useState(false)
  const isEdit = Boolean(viagem)
  const isDomesticCurrency = form.moeda === 'BRL'

  const metaOptions = useMemo(
    () =>
      metas.map((meta) => ({
        value: meta.id,
        label: meta.nome,
        icon: <Target size={14} aria-hidden className="trip-form__meta-option-icon" />,
      })),
    [metas]
  )

  useEffect(() => {
    if (!open) return
    setError('')
    if (viagem) {
      setForm({
        destino: viagem.destino ?? '',
        destinoMeta: viagem.destinoMeta ?? null,
        moeda: viagem.moeda ?? 'USD',
        dataPrevista: viagem.dataPrevista ? new Date(viagem.dataPrevista) : null,
        vincularMeta: defaultVincularMeta || Boolean(viagem.metaId),
        metaId: viagem.metaId ?? null,
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, viagem, defaultVincularMeta])

  useEffect(() => {
    if (!open) return undefined

    let active = true
    setDestinosLoading(true)

    viagemService
      .listarDestinosViagem({ limit: 1 })
      .then((data) => {
        if (!active) return
        setDestinosTotal(data.total ?? data.destinos?.length ?? null)
      })
      .catch(() => {
        if (active) setDestinosTotal(null)
      })
      .finally(() => {
        if (active) setDestinosLoading(false)
      })

    return () => {
      active = false
    }
  }, [open])

  useEffect(() => {
    if (!open || !viagem?.destino || form.destinoMeta?.catalogId) return

    let active = true
    const seed = viagem.destino.split(',')[0]?.trim() || viagem.destino

    viagemService
      .listarDestinosViagem({ q: seed, limit: 10 })
      .then((data) => {
        if (!active) return

        const match =
          data.destinos?.find((item) => item.destino === viagem.destino) ??
          data.destinos?.find((item) => item.label === seed)

        if (!match) return

        setForm((prev) => ({
          ...prev,
          destino: match.destino,
          destinoMeta: {
            source: match.source ?? (match.geonameId ? 'geonames' : 'catalog'),
            geonameId: match.geonameId ?? null,
            catalogId: match.id,
            iata: match.iata,
            label: match.label,
            region: match.subtitle?.split(',')[0]?.trim() || null,
            countryCode: match.countryCode,
            countryName: match.countryName,
            moedaSugerida: match.moedaSugerida,
            domestic: match.domestic,
          },
        }))
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [open, viagem, form.destinoMeta?.catalogId])

  const searchDestinos = useCallback(async (query) => {
    const data = await viagemService.listarDestinosViagem({ q: query, limit: 20 })
    return data.destinos ?? []
  }, [])

  useEffect(() => {
    if (!open || !form.moeda || form.moeda === 'BRL') {
      setCotacao(null)
      return
    }
    let active = true
    moedaService
      .listarCotacoes([form.moeda])
      .then((data) => {
        if (!active) return
        setCotacao(data.cotacoes?.[0] ?? null)
      })
      .catch(() => {
        if (active) setCotacao(null)
      })
    return () => {
      active = false
    }
  }, [open, form.moeda])

  const selectedMeta = metas.find((meta) => meta.id === form.metaId)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.destinoMeta?.catalogId && !form.destinoMeta?.geonameId) {
      setError('Selecione um destino da lista de sugestões.')
      return
    }
    if (!form.dataPrevista) {
      setError('Selecione a data prevista.')
      return
    }
    if (form.vincularMeta && !form.metaId) {
      setError('Selecione uma meta para vincular.')
      return
    }

    const payload = {
      destino: form.destino.trim(),
      destinoMeta: form.destinoMeta,
      moeda: form.moeda,
      dataPrevista: form.dataPrevista.toISOString(),
      metaId: form.vincularMeta ? form.metaId : null,
    }

    try {
      await onSubmit?.(payload)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar a viagem.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="trip-form-modal">
      <form className="trip-form" onSubmit={handleSubmit} noValidate>
        <header className="trip-form__header">
          <div>
            <h2>{isEdit ? 'Editar Viagem' : 'Nova Viagem'}</h2>
            <p>Planeje sua próxima aventura</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="trip-form__body">
          <div className="trip-form__field trip-form__field--destination">
            <DestinationSearchPicker
              destino={form.destino}
              destinoMeta={form.destinoMeta}
              loading={destinosLoading}
              totalDestinos={destinosTotal}
              onSearch={searchDestinos}
              onChange={({ destino, destinoMeta, moedaSugerida }) =>
                setForm((prev) => ({
                  ...prev,
                  destino,
                  destinoMeta,
                  moeda:
                    moedaSugerida && catalog.some((item) => item.code === moedaSugerida)
                      ? moedaSugerida
                      : prev.moeda,
                }))
              }
              label={
                <FormFieldLabel icon={Globe} tone="purple">
                  Destino
                </FormFieldLabel>
              }
              placeholder="Ex: Vitória, Buenos Aires, Paris..."
            />
          </div>

          <div className="trip-form__field trip-form__field--currency">
            <CurrencySearchPicker
              catalog={catalog}
              value={form.moeda}
              onChange={(moeda) => setForm((prev) => ({ ...prev, moeda }))}
              exclude={[]}
              listMaxHeight="11rem"
              label={
                <FormFieldLabel icon={CircleDollarSign} tone="purple">
                  Moeda local
                </FormFieldLabel>
              }
            />

            {catalog.length === 0 ? (
              <p className="trip-form__hint">Carregando moedas disponíveis...</p>
            ) : null}

            {cotacao && !isDomesticCurrency ? (
              <div className="trip-form__rate-box">
                <TrendingUp size={16} aria-hidden className="trip-form__rate-icon" />
                <div className="trip-form__rate-copy">
                  <strong>
                    Cotação atual: {formatRateValue(cotacao.bid)} por 1 {cotacao.code}
                  </strong>
                  <span>
                    Atualizado{' '}
                    {cotacao.updatedAt
                      ? new Date(cotacao.updatedAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'recentemente'}
                  </span>
                </div>
                <Info size={14} aria-hidden className="trip-form__rate-info" />
              </div>
            ) : null}
          </div>

          <div className="trip-form__field">
            <DatePicker
              label={
                <FormFieldLabel icon={Calendar} tone="blue">
                  Data prevista
                </FormFieldLabel>
              }
              value={form.dataPrevista}
              onChange={(date) => setForm((prev) => ({ ...prev, dataPrevista: date }))}
              minDate={new Date()}
              placeholder="Selecione uma data futura"
            />
          </div>

          <section className="trip-form__section">
            <div className="trip-form__toggle-row">
              <FormFieldLabel icon={Link2} tone="purple">
                Vincular a uma meta financeira? <span className="trip-form__optional">(opcional)</span>
              </FormFieldLabel>
              <Toggle
                checked={form.vincularMeta}
                onChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    vincularMeta: checked,
                    metaId: checked ? prev.metaId : null,
                  }))
                }
              />
            </div>

            {form.vincularMeta ? (
              <div className="trip-form__nested">
                <Select
                  value={form.metaId}
                  onChange={(metaId) => setForm((prev) => ({ ...prev, metaId }))}
                  options={metaOptions}
                  placeholder="Selecione uma meta"
                />

                {selectedMeta ? (
                  <div className="trip-form__meta-card">
                    <Target size={16} aria-hidden className="trip-form__meta-card-icon" />
                    <div>
                      <strong>{selectedMeta.nome}</strong>
                      <span>
                        {formatCurrency(selectedMeta.valorAtual)} de{' '}
                        {formatCurrency(selectedMeta.valorAlvo)} (
                        {Math.round(Number(selectedMeta.percentual))}%)
                      </span>
                    </div>
                  </div>
                ) : null}

                <button type="button" className="trip-form__dashed-btn" onClick={onCreateGoal}>
                  <Plus size={14} aria-hidden />
                  Criar nova meta para esta viagem
                </button>
              </div>
            ) : null}
          </section>

          <section className="trip-form__section trip-form__section--muted">
            <div className="trip-form__toggle-row">
              <FormFieldLabel icon={Users} tone="purple">
                Esta viagem é de um grupo? <span className="trip-form__optional">(opcional)</span>
              </FormFieldLabel>
              <Toggle checked={false} disabled onChange={() => {}} />
            </div>

            <Select disabled value={null} onChange={() => {}} options={[]} placeholder="Selecione um grupo" />
            <p className="trip-form__hint">Você poderá convidar membros após criar a viagem.</p>
          </section>

          {error ? <p className="trip-form__error">{error}</p> : null}
        </div>

        <footer className="trip-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <div className="trip-form__footer-actions">
            {isEdit ? (
              <Button
                type="button"
                variant="ghost"
                className="trip-form__delete-btn"
                leftIcon={<Trash2 size={14} />}
                loading={deleting}
                onClick={() => onDelete?.(viagem)}
              >
                Excluir
              </Button>
            ) : null}
            <Button type="submit" variant="primary" loading={submitting}>
              {isEdit ? 'Salvar alterações' : 'Criar Viagem'}
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
