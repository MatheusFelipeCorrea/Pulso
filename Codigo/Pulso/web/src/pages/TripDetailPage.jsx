import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { CurrencyFlag } from '@/components/features/trips/CurrencyFlag.jsx'
import { TripDetailGoalCard } from '@/components/features/trips/detail/TripDetailGoalCard.jsx'
import { TripDetailExpensesSection } from '@/components/features/trips/detail/TripDetailExpensesSection.jsx'
import { TripDetailObservationsSection } from '@/components/features/trips/detail/TripDetailObservationsSection.jsx'
import { TripDetailSummarySidebar } from '@/components/features/trips/detail/TripDetailSummarySidebar.jsx'
import { TripExpenseFormModal } from '@/components/features/trips/TripExpenseFormModal.jsx'
import { TripObservationFormModal } from '@/components/features/trips/TripObservationFormModal.jsx'
import { DeleteTripExpenseModal } from '@/components/features/trips/DeleteTripExpenseModal.jsx'
import { DeleteTripObservationModal } from '@/components/features/trips/DeleteTripObservationModal.jsx'
import { TripFormModal } from '@/components/features/trips/TripFormModal.jsx'
import { GoalFormModal } from '@/components/features/goals/GoalFormModal.jsx'
import * as moedaService from '@/services/moedaService.js'
import * as metaService from '@/services/metaService.js'
import * as viagemService from '@/services/viagemService.js'
import {
  buildCategoryBreakdown,
  calcTripTotalInCurrency,
  formatTripDetailDate,
} from '@/utils/tripDetailUtils.js'

export default function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [viagem, setViagem] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [catalogMap, setCatalogMap] = useState({})
  const [metas, setMetas] = useState([])
  const [cotacao, setCotacao] = useState(null)
  const [loading, setLoading] = useState(true)

  const [tripFormOpen, setTripFormOpen] = useState(false)
  const [tripFormLinkMeta, setTripFormLinkMeta] = useState(false)
  const [tripSubmitting, setTripSubmitting] = useState(false)

  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [goalSubmitting, setGoalSubmitting] = useState(false)

  const [expenseOpen, setExpenseOpen] = useState(false)
  const [expenseTarget, setExpenseTarget] = useState(null)
  const [expenseSubmitting, setExpenseSubmitting] = useState(false)

  const [deleteExpenseOpen, setDeleteExpenseOpen] = useState(false)
  const [deleteExpenseTarget, setDeleteExpenseTarget] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(false)

  const [observationOpen, setObservationOpen] = useState(false)
  const [observationTarget, setObservationTarget] = useState(null)
  const [observationSubmitting, setObservationSubmitting] = useState(false)

  const [deleteObservationOpen, setDeleteObservationOpen] = useState(false)
  const [deleteObservationTarget, setDeleteObservationTarget] = useState(null)
  const [deletingObservation, setDeletingObservation] = useState(false)

  const [mediaPassagem, setMediaPassagem] = useState(null)
  const [mediaPassagemLoading, setMediaPassagemLoading] = useState(false)

  const carregar = useCallback(async () => {
    const [viagemData, catalogData, metasData] = await Promise.all([
      viagemService.buscarViagem(id),
      moedaService.obterCatalogo(),
      metaService.buscarMetas({ status: 'ATIVA', limite: 50, pagina: 1 }),
    ])

    const moedas = catalogData.moedas ?? []
    setViagem(viagemData)
    setCatalog(moedas)
    setCatalogMap(Object.fromEntries(moedas.map((item) => [item.code, item])))
    setMetas(metasData.metas ?? metasData ?? [])

    if (viagemData.moeda && viagemData.moeda !== 'BRL') {
      const rates = await moedaService.listarCotacoes([viagemData.moeda])
      setCotacao(rates.cotacoes?.[0] ?? null)
    } else {
      setCotacao(null)
    }
  }, [id])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    carregar()
      .catch((err) => {
        if (controller.signal.aborted) return
        toast.error(err.response?.data?.message ?? 'Erro ao carregar viagem')
        navigate('/trips', { replace: true })
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [carregar, navigate, toast])

  useEffect(() => {
    if (!viagem?.id) return undefined

    const controller = new AbortController()
    setMediaPassagemLoading(true)

    viagemService
      .obterMediaPassagem(viagem.id, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setMediaPassagem(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setMediaPassagem(null)
      })
      .finally(() => {
        if (!controller.signal.aborted) setMediaPassagemLoading(false)
      })

    return () => controller.abort()
  }, [viagem?.id])

  const currencyMeta = catalogMap[viagem?.moeda] ?? { code: viagem?.moeda, name: viagem?.moeda }
  const breakdown = useMemo(
    () => buildCategoryBreakdown(viagem?.despesas ?? []),
    [viagem?.despesas]
  )
  const totalMoeda = useMemo(
    () => calcTripTotalInCurrency(viagem?.totalBrl, viagem?.moeda, cotacao?.bid),
    [viagem?.totalBrl, viagem?.moeda, cotacao?.bid]
  )

  const openNewExpense = () => {
    setExpenseTarget(null)
    setExpenseOpen(true)
  }

  const openEditExpense = (despesa) => {
    setExpenseTarget(despesa)
    setExpenseOpen(true)
  }

  const openDeleteExpense = (despesa) => {
    setDeleteExpenseTarget(despesa)
    setDeleteExpenseOpen(true)
  }

  const handleExpenseSubmit = async (payload) => {
    setExpenseSubmitting(true)
    try {
      const updated = expenseTarget
        ? await viagemService.editarDespesa(viagem.id, expenseTarget.id, payload)
        : await viagemService.criarDespesa(viagem.id, payload)

      setViagem(updated)
      toast.success(expenseTarget ? 'Pretensão atualizada!' : 'Pretensão adicionada!')
      setExpenseOpen(false)
      setExpenseTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Não foi possível salvar a pretensão')
      throw err
    } finally {
      setExpenseSubmitting(false)
    }
  }

  const confirmDeleteExpense = async () => {
    if (!deleteExpenseTarget || !viagem) return
    setDeletingExpense(true)
    try {
      const updated = await viagemService.excluirDespesa(viagem.id, deleteExpenseTarget.id)
      setViagem(updated)
      toast.success('Pretensão removida!')
      setDeleteExpenseOpen(false)
      setDeleteExpenseTarget(null)
      setExpenseOpen(false)
      setExpenseTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir pretensão')
    } finally {
      setDeletingExpense(false)
    }
  }

  const openNewObservation = () => {
    setObservationTarget(null)
    setObservationOpen(true)
  }

  const openEditObservation = (observacao) => {
    setObservationTarget(observacao)
    setObservationOpen(true)
  }

  const openDeleteObservation = (observacao) => {
    setDeleteObservationTarget(observacao)
    setDeleteObservationOpen(true)
  }

  const handleObservationSubmit = async (payload) => {
    setObservationSubmitting(true)
    try {
      const updated = observationTarget
        ? await viagemService.editarObservacao(viagem.id, observationTarget.id, payload)
        : await viagemService.criarObservacao(viagem.id, payload)

      setViagem(updated)
      toast.success(observationTarget ? 'Observação atualizada!' : 'Observação adicionada!')
      setObservationOpen(false)
      setObservationTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Não foi possível salvar a observação')
      throw err
    } finally {
      setObservationSubmitting(false)
    }
  }

  const confirmDeleteObservation = async () => {
    if (!deleteObservationTarget || !viagem) return
    setDeletingObservation(true)
    try {
      const updated = await viagemService.excluirObservacao(viagem.id, deleteObservationTarget.id)
      setViagem(updated)
      toast.success('Observação removida!')
      setDeleteObservationOpen(false)
      setDeleteObservationTarget(null)
      setObservationOpen(false)
      setObservationTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir observação')
    } finally {
      setDeletingObservation(false)
    }
  }

  const openLinkGoal = () => {
    setTripFormLinkMeta(true)
    setTripFormOpen(true)
  }

  const handleTripSave = async (payload) => {
    if (!viagem) return
    setTripSubmitting(true)
    try {
      await viagemService.editarViagem(viagem.id, payload)
      await carregar()
      toast.success('Viagem atualizada!')
      setTripFormOpen(false)
      setTripFormLinkMeta(false)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Não foi possível atualizar a viagem')
      throw err
    } finally {
      setTripSubmitting(false)
    }
  }

  const handleCreateGoal = async (payload) => {
    setGoalSubmitting(true)
    try {
      await metaService.criarMeta(payload)
      toast.success('Meta criada!')
      setGoalFormOpen(false)
      const metasData = await metaService.buscarMetas({ status: 'ATIVA', limite: 50, pagina: 1 })
      setMetas(metasData.metas ?? metasData ?? [])
    } finally {
      setGoalSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="trip-detail-page trip-detail-page--loading">
        <SpinnerDots center label="Carregando viagem..." />
      </div>
    )
  }

  if (!viagem) return null

  return (
    <div className="trip-detail-page">
      <Link to="/trips" className="trip-detail-page__back">
        <ArrowLeft size={14} aria-hidden />
        Voltar para Viagens
      </Link>

      <header className="trip-detail-page__header">
        <h1>Viagem: {viagem.destino}</h1>
        <div className="trip-detail-page__badges">
          <span className="trip-detail-page__badge trip-detail-page__badge--currency">
            <CurrencyFlag code={viagem.moeda} size={16} />
            {viagem.moeda} - {currencyMeta.name}
          </span>
          <span className="trip-detail-page__badge trip-detail-page__badge--date">
            <Calendar size={13} aria-hidden />
            Data prevista: {formatTripDetailDate(viagem.dataPrevista)}
          </span>
        </div>
      </header>

      <div className="trip-detail-page__layout">
        <div className="trip-detail-page__main">
          <TripDetailGoalCard meta={viagem.meta} onLinkGoal={openLinkGoal} />
          <TripDetailExpensesSection
            despesas={viagem.despesas}
            totalBrl={viagem.totalBrl}
            onAdd={openNewExpense}
            onEdit={openEditExpense}
            onDelete={openDeleteExpense}
          />
          <TripDetailObservationsSection
            observacoes={viagem.observacoes}
            onAdd={openNewObservation}
            onEdit={openEditObservation}
            onDelete={openDeleteObservation}
          />
        </div>

        <TripDetailSummarySidebar
          moeda={viagem.moeda}
          totalBrl={viagem.totalBrl}
          totalMoeda={totalMoeda}
          rateBid={cotacao?.bid ?? (viagem.moeda === 'BRL' ? 1 : null)}
          rateUpdatedAt={cotacao?.updatedAt}
          breakdown={breakdown}
          mediaPassagem={mediaPassagem}
          mediaPassagemLoading={mediaPassagemLoading}
        />
      </div>

      <TripExpenseFormModal
        open={expenseOpen}
        onClose={() => {
          setExpenseOpen(false)
          setExpenseTarget(null)
        }}
        viagem={viagem}
        despesa={expenseTarget}
        totalAtual={Number(viagem.totalBrl)}
        submitting={expenseSubmitting}
        onSubmit={handleExpenseSubmit}
        onDelete={() => openDeleteExpense(expenseTarget)}
      />

      <DeleteTripExpenseModal
        open={deleteExpenseOpen}
        onClose={() => {
          setDeleteExpenseOpen(false)
          setDeleteExpenseTarget(null)
        }}
        onConfirm={confirmDeleteExpense}
        despesa={deleteExpenseTarget}
        loading={deletingExpense}
      />

      <TripObservationFormModal
        open={observationOpen}
        onClose={() => {
          setObservationOpen(false)
          setObservationTarget(null)
        }}
        viagem={viagem}
        observacao={observationTarget}
        submitting={observationSubmitting}
        onSubmit={handleObservationSubmit}
        onDelete={() => openDeleteObservation(observationTarget)}
      />

      <DeleteTripObservationModal
        open={deleteObservationOpen}
        onClose={() => {
          setDeleteObservationOpen(false)
          setDeleteObservationTarget(null)
        }}
        onConfirm={confirmDeleteObservation}
        observacao={deleteObservationTarget}
        loading={deletingObservation}
      />

      <TripFormModal
        open={tripFormOpen}
        onClose={() => {
          setTripFormOpen(false)
          setTripFormLinkMeta(false)
        }}
        onSubmit={handleTripSave}
        viagem={viagem}
        catalog={catalog}
        metas={metas}
        submitting={tripSubmitting}
        defaultVincularMeta={tripFormLinkMeta}
        onCreateGoal={() => setGoalFormOpen(true)}
      />

      <GoalFormModal
        open={goalFormOpen}
        onClose={() => setGoalFormOpen(false)}
        onSubmit={handleCreateGoal}
        submitting={goalSubmitting}
      />
    </div>
  )
}
