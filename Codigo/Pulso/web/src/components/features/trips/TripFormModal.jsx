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
import { getGoalIcon } from '@/utils/goalIconRules.js'
import * as moedaService from '@/services/moedaService.js'
import * as viagemService from '@/services/viagemService.js'

const emptyForm = () => ({
  destino: '',
  destinoMeta: null,
  moeda: 'BRL',
  dataPrevista: null,
  vincularMeta: false,
  metaId: null,
  viagemVinculadaId: null,
  vincularGrupo: false,
  grupoId: null,
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
  groupMode = false,
  grupo = null,
  existingTrips = [],
  grupos = [],
}) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [cotacao, setCotacao] = useState(null)
  const [destinosTotal, setDestinosTotal] = useState(null)
  const [destinosLoading, setDestinosLoading] = useState(false)
  const isEdit = Boolean(viagem) && !groupMode
  const isDomesticCurrency = form.moeda === 'BRL'
  const memberCount = grupo?.quantidadeMembros ?? grupo?.membros?.length ?? 0

  const metaOptions = useMemo(
    () =>
      metas.map((meta) => {
        const Icon = getGoalIcon(meta.nome)
        return {
          value: meta.id,
          label: meta.nome,
          icon: <Icon size={14} aria-hidden className="trip-form__meta-option-icon" />,
        }
      }),
    [metas]
  )

  const grupoOptions = useMemo(
    () =>
      (grupos ?? []).map((g) => ({
        value: g.id,
        label: g.nome,
      })),
    [grupos]
  )

  useEffect(() => {
    if (!open) return
    setError('')
    if (viagem && !groupMode) {
      setForm({
        destino: viagem.destino ?? '',
        destinoMeta: viagem.destinoMeta ?? null,
        moeda: viagem.moeda ?? 'USD',
        dataPrevista: viagem.dataPrevista ? new Date(viagem.dataPrevista) : null,
        vincularMeta: defaultVincularMeta || Boolean(viagem.metaId),
        metaId: viagem.metaId ?? null,
        viagemVinculadaId: null,
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, viagem, defaultVincularMeta, groupMode])

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

  const handleSelectExistingTrip = (trip) => {
    if (!trip) {
      setForm((prev) => ({ ...prev, viagemVinculadaId: null }))
      return
    }

    setForm((prev) => ({
      ...prev,
      destino: trip.destino ?? '',
      destinoMeta: trip.destinoMeta ?? null,
      moeda: trip.moeda ?? prev.moeda,
      dataPrevista: trip.dataPrevista ? new Date(trip.dataPrevista) : null,
      viagemVinculadaId: trip.id,
      vincularMeta: false,
      metaId: null,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.viagemVinculadaId && !form.destinoMeta?.catalogId && !form.destinoMeta?.geonameId) {
      setError('Selecione um destino da lista de sugestões ou uma viagem existente.')
      return
    }
    if (!form.dataPrevista) {
      setError('Selecione a data prevista.')
      return
    }
    if (!groupMode && form.vincularMeta && !form.metaId) {
      setError('Selecione uma meta para vincular.')
      return
    }

    if (!groupMode && form.vincularGrupo && !form.grupoId) {
      setError('Selecione um grupo para vincular.')
      return
    }

    const payload = {
      destino: form.destino.trim(),
      destinoMeta: form.destinoMeta,
      moeda: form.moeda,
      dataPrevista: form.dataPrevista.toISOString(),
      metaId: !groupMode && form.vincularMeta ? form.metaId : null,
      viagemId: form.viagemVinculadaId ?? null,
      grupoId: !groupMode && form.vincularGrupo ? form.grupoId : null,
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
            <h2>
              {groupMode ? 'Vincular viagem ao grupo' : isEdit ? 'Editar Viagem' : 'Nova Viagem'}
            </h2>
            {groupMode && grupo ? (
              <p className="trip-form__group-context">
                <Users size={14} aria-hidden />
                <span>
                  {grupo.nome} • {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
                </span>
              </p>
            ) : (
              <p>Planeje sua próxima aventura</p>
            )}
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
              existingTrips={groupMode ? existingTrips : []}
              linkedTripId={form.viagemVinculadaId}
              onSelectExistingTrip={groupMode ? handleSelectExistingTrip : undefined}
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
                  {groupMode ? 'Destino da viagem' : 'Destino'}
                </FormFieldLabel>
              }
              placeholder={
                groupMode
                  ? 'Vincule uma viagem existente ou busque um destino...'
                  : 'Ex: Vitória, Buenos Aires, Paris...'
              }
            />
          </div>

          <div className="trip-form__field trip-form__field--currency">
            <CurrencySearchPicker
              catalog={catalog}
              value={form.moeda}
              onChange={(moeda) =>
                setForm((prev) => ({
                  ...prev,
                  moeda,
                  viagemVinculadaId:
                    groupMode && prev.viagemVinculadaId ? null : prev.viagemVinculadaId,
                }))
              }
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
              onChange={(date) =>
                setForm((prev) => ({
                  ...prev,
                  dataPrevista: date,
                  viagemVinculadaId:
                    groupMode && prev.viagemVinculadaId ? null : prev.viagemVinculadaId,
                }))
              }
              minDate={new Date()}
              placeholder="Selecione uma data futura"
            />
          </div>

          {!groupMode ? (
            <>
              <section className="trip-form__section">
                <div className="trip-form__toggle-row">
                  <FormFieldLabel icon={Link2} tone="purple">
                    Vincular a uma meta financeira?{' '}
                    <span className="trip-form__optional">(opcional)</span>
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
                  <Toggle
                    checked={form.vincularGrupo}
                    disabled={!grupoOptions.length}
                    onChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        vincularGrupo: checked,
                        grupoId: checked ? prev.grupoId : null,
                      }))
                    }
                  />
                </div>

                {form.vincularGrupo ? (
                  <Select
                    value={form.grupoId}
                    onChange={(value) => setForm((prev) => ({ ...prev, grupoId: value }))}
                    options={grupoOptions}
                    placeholder="Selecione um grupo"
                  />
                ) : null}
                <p className="trip-form__hint">
                  {grupoOptions.length
                    ? 'A viagem será compartilhada com os membros do grupo selecionado.'
                    : 'Participe de um grupo para vincular viagens compartilhadas.'}
                </p>
              </section>
            </>
          ) : null}

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
              {groupMode ? 'Vincular viagem' : isEdit ? 'Salvar alterações' : 'Criar Viagem'}
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
