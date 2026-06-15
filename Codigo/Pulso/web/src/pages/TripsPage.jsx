import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { TripQuickConverter } from '@/components/features/trips/TripQuickConverter.jsx'
import { TripFavoriteCurrencies } from '@/components/features/trips/TripFavoriteCurrencies.jsx'
import { TripList } from '@/components/features/trips/TripList.jsx'
import { TripExchangeChart } from '@/components/features/trips/TripExchangeChart.jsx'
import { TripFormModal } from '@/components/features/trips/TripFormModal.jsx'
import { GoalFormModal } from '@/components/features/goals/GoalFormModal.jsx'
import { AddFavoriteCurrencyModal } from '@/components/features/trips/AddFavoriteCurrencyModal.jsx'
import { DeleteTripModal } from '@/components/features/trips/DeleteTripModal.jsx'
import * as moedaService from '@/services/moedaService.js'
import * as viagemService from '@/services/viagemService.js'
import * as metaService from '@/services/metaService.js'

function formatRatesStatus(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  const diffMin = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000))
  const relative = diffMin <= 1 ? 'há 1 min' : `há ${diffMin} min`
  const full = date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `Atualizado ${relative} · ${full}`
}

export default function TripsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [catalog, setCatalog] = useState([])
  const [favoritas, setFavoritas] = useState([])
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null)
  const [viagens, setViagens] = useState([])
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [goalSubmitting, setGoalSubmitting] = useState(false)

  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false)
  const [favoriteSubmitting, setFavoriteSubmitting] = useState(false)

  const [deleteTripOpen, setDeleteTripOpen] = useState(false)
  const [deleteTripTarget, setDeleteTripTarget] = useState(null)

  const catalogMap = useMemo(
    () => Object.fromEntries(catalog.map((item) => [item.code, item])),
    [catalog]
  )

  const recarregar = useCallback(async () => {
    const [catalogData, favoritasData, viagensData, metasData] = await Promise.all([
      moedaService.obterCatalogo(),
      moedaService.listarFavoritas(),
      viagemService.listarViagens(),
      metaService.buscarMetas({ status: 'ATIVA', limite: 50, pagina: 1 }),
    ])

    setCatalog(catalogData.moedas ?? [])
    setFavoritas(favoritasData.favoritas ?? [])
    setRatesUpdatedAt(favoritasData.atualizadoEm ?? null)
    setViagens(viagensData ?? [])
    setMetas(metasData.metas ?? metasData ?? [])
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    recarregar()
      .catch((err) => {
        if (!controller.signal.aborted) {
          toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar viagens')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [recarregar])

  const abrirNova = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const abrirEditar = (viagem) => {
    setSelected(viagem)
    setFormOpen(true)
  }

  const abrirDetalhes = (viagem) => {
    navigate(`/trips/${viagem.id}`)
  }

  const handleSalvar = async (payload) => {
    setSubmitting(true)
    try {
      if (selected) {
        await viagemService.editarViagem(selected.id, payload)
        toast.success('Viagem atualizada!')
      } else {
        await viagemService.criarViagem(payload)
        toast.success('Viagem criada!')
      }
      setFormOpen(false)
      setSelected(null)
      await recarregar()
    } finally {
      setSubmitting(false)
    }
  }

  const abrirExcluirViagem = (viagem) => {
    setDeleteTripTarget(viagem)
    setDeleteTripOpen(true)
  }

  const confirmarExcluirViagem = async () => {
    if (!deleteTripTarget) return
    setDeleting(true)
    try {
      await viagemService.excluirViagem(deleteTripTarget.id)
      toast.success('Viagem excluída!')
      setDeleteTripOpen(false)
      setDeleteTripTarget(null)
      setFormOpen(false)
      setSelected(null)
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir viagem')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleFavorite = async (codigo) => {
    try {
      const data = await moedaService.removerFavorita(codigo)
      setFavoritas(data.favoritas ?? [])
      setRatesUpdatedAt(data.atualizadoEm ?? null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao atualizar favoritos')
    }
  }

  const handleAddFavorite = async (codigo) => {
    setFavoriteSubmitting(true)
    try {
      const data = await moedaService.adicionarFavorita(codigo)
      setFavoritas(data.favoritas ?? [])
      setRatesUpdatedAt(data.atualizadoEm ?? null)
      toast.success('Moeda adicionada aos favoritos!')
      setFavoriteModalOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Não foi possível adicionar a moeda')
      throw err
    } finally {
      setFavoriteSubmitting(false)
    }
  }

  const handleCriarMeta = async (payload) => {
    setGoalSubmitting(true)
    try {
      await metaService.criarMeta(payload)
      toast.success('Meta criada!')
      setGoalFormOpen(false)
      const metasData = await metaService.buscarMetas({ status: 'ATIVA', limite: 50, pagina: 1 })
      setMetas(metasData.metas ?? [])
    } finally {
      setGoalSubmitting(false)
    }
  }

  return (
    <div className="trips-page">
      <header className="trips-page__header">
        <div>
          <h1 className="trips-page__title">Viagens e Moedas</h1>
          <p className="trips-page__subtitle">
            Acompanhe cotações, converta moedas e planeje suas viagens.
          </p>
          {ratesUpdatedAt ? (
            <span className="trips-page__status">{formatRatesStatus(ratesUpdatedAt)}</span>
          ) : null}
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={abrirNova}>
          Nova Viagem
        </Button>
      </header>

      <TripQuickConverter
        catalog={catalog}
        favoritas={favoritas}
        ratesUpdatedAt={ratesUpdatedAt}
      />

      <TripFavoriteCurrencies
        favoritas={favoritas}
        catalog={catalog}
        onToggleFavorite={handleToggleFavorite}
        onAddFavorite={() => setFavoriteModalOpen(true)}
      />

      <div className="trips-page__bottom">
        <TripList
          viagens={viagens}
          loading={loading}
          catalogMap={catalogMap}
          onNew={abrirNova}
          onDetails={abrirDetalhes}
          onEdit={abrirEditar}
          onDelete={abrirExcluirViagem}
        />
        <TripExchangeChart catalog={catalog} />
      </div>

      <TripFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelected(null)
        }}
        onSubmit={handleSalvar}
        onDelete={abrirExcluirViagem}
        viagem={selected}
        catalog={catalog}
        metas={metas}
        submitting={submitting}
        deleting={deleting}
        onCreateGoal={() => setGoalFormOpen(true)}
      />

      <AddFavoriteCurrencyModal
        open={favoriteModalOpen}
        onClose={() => setFavoriteModalOpen(false)}
        onSubmit={handleAddFavorite}
        catalog={catalog}
        favoritas={favoritas}
        submitting={favoriteSubmitting}
      />

      <GoalFormModal
        open={goalFormOpen}
        onClose={() => setGoalFormOpen(false)}
        onSubmit={handleCriarMeta}
        submitting={goalSubmitting}
      />

      <DeleteTripModal
        open={deleteTripOpen}
        onClose={() => {
          setDeleteTripOpen(false)
          setDeleteTripTarget(null)
        }}
        onConfirm={confirmarExcluirViagem}
        viagem={deleteTripTarget}
        loading={deleting}
      />
    </div>
  )
}
