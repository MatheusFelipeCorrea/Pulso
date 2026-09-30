import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { InputSearch } from '@/design-system/components/inputs/InputSearch/InputSearch.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { GoalTabs } from '@/components/features/goals/GoalTabs.jsx'
import { GoalList } from '@/components/features/goals/GoalList.jsx'
import { GoalSidebar } from '@/components/features/goals/GoalSidebar.jsx'
import { GoalFormModal } from '@/components/features/goals/GoalFormModal.jsx'
import { GoalContributionModal } from '@/components/features/goals/GoalContributionModal.jsx'
import { DeleteGoalModal } from '@/components/features/goals/DeleteGoalModal.jsx'
import * as metaService from '@/services/metaService.js'
import { buildApiFiltros, DEFAULT_GOAL_FILTROS, GOAL_TABS } from '@/utils/goalFilters.js'

export default function GoalsPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const listaRequestRef = useRef(0)

  const [tabAtiva, setTabAtiva] = useState(GOAL_TABS.TODAS)
  const [filtros, setFiltros] = useState(() => DEFAULT_GOAL_FILTROS())
  const [filtrosAplicados, setFiltrosAplicados] = useState(() => DEFAULT_GOAL_FILTROS())
  const [loadingFilter, setLoadingFilter] = useState(false)

  const [resumo, setResumo] = useState(null)
  const [lista, setLista] = useState({ metas: [], total: 0, paginas: 1, pagina: 1 })
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [loadingLista, setLoadingLista] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [contributionOpen, setContributionOpen] = useState(false)
  const [contributionTarget, setContributionTarget] = useState(null)
  const [contributing, setContributing] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deletingAporteId, setDeletingAporteId] = useState(null)

  const apiFiltros = useMemo(
    () => buildApiFiltros(tabAtiva, filtrosAplicados),
    [tabAtiva, filtrosAplicados]
  )

  const carregarResumo = useCallback(async (signal) => {
    setLoadingResumo(true)
    try {
      const data = await metaService.obterResumo({ signal })
      setResumo(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar resumo')
    } finally {
      if (!signal?.aborted) setLoadingResumo(false)
    }
  }, [])

  const carregarLista = useCallback(
    async (signal) => {
      const requestId = ++listaRequestRef.current
      setLoadingLista(true)
      try {
        const data = await metaService.buscarMetas(apiFiltros, { signal })
        if (signal?.aborted || requestId !== listaRequestRef.current) return
        setLista(data)
      } catch (err) {
        if (signal?.aborted || requestId !== listaRequestRef.current) return
        toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar metas')
      } finally {
        if (!signal?.aborted && requestId === listaRequestRef.current) {
          setLoadingLista(false)
          setLoadingFilter(false)
        }
      }
    },
    [apiFiltros]
  )

  const recarregarTudo = useCallback(async () => {
    const requestId = ++listaRequestRef.current
    const [resumoData, listaData] = await Promise.all([
      metaService.obterResumo(),
      metaService.buscarMetas(apiFiltros),
    ])
    if (requestId !== listaRequestRef.current) return
    setResumo(resumoData)
    setLista(listaData)
  }, [apiFiltros])

  useEffect(() => {
    const controller = new AbortController()
    carregarResumo(controller.signal)
    return () => controller.abort()
  }, [carregarResumo])

  useEffect(() => {
    const controller = new AbortController()
    carregarLista(controller.signal)
    return () => controller.abort()
  }, [carregarLista])

  const handleTabChange = (tab) => {
    listaRequestRef.current += 1
    setLoadingLista(true)
    setLista({ metas: [], total: 0, paginas: 1, pagina: 1 })
    setTabAtiva(tab)
    setFiltros((prev) => ({ ...prev, pagina: 1 }))
    setFiltrosAplicados((prev) => ({ ...prev, pagina: 1 }))
  }

  const handleFiltrar = () => {
    setLoadingFilter(true)
    setFiltrosAplicados({ ...filtros, pagina: 1 })
    setFiltros((prev) => ({ ...prev, pagina: 1 }))
  }

  const abrirNova = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const abrirEditar = (meta) => {
    setSelected(meta)
    setFormOpen(true)
  }

  const handleSalvar = async (payload) => {
    setSubmitting(true)
    try {
      if (selected) {
        await metaService.atualizarMeta(selected.id, payload)
        toast.success('Meta atualizada!')
      } else {
        await metaService.criarMeta(payload)
        toast.success('Meta criada!')
      }
      setFormOpen(false)
      setSelected(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar meta')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const abrirAporte = (meta) => {
    setContributionTarget(meta)
    setContributionOpen(true)
  }

  const confirmarAporte = async (payload) => {
    if (!contributionTarget) return
    setContributing(true)
    try {
      const result = await metaService.registrarAporte(contributionTarget.id, payload)
      const concluiu = result.meta?.status === 'CONCLUIDA'
      toast.success(
        concluiu ? 'Aporte registrado e meta concluída!' : 'Aporte registrado com sucesso!'
      )
      setContributionOpen(false)
      setContributionTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao registrar aporte')
      throw err
    } finally {
      setContributing(false)
    }
  }

  const abrirExcluir = (meta) => {
    setDeleteTarget(meta)
    setDeleteOpen(true)
  }

  const handleExcluirAporte = async (aporte) => {
    if (!selected) return
    setDeletingAporteId(aporte.id)
    try {
      const metaAtualizada = await metaService.excluirAporte(selected.id, aporte.id)
      setSelected(metaAtualizada)
      toast.success(
        metaAtualizada.status === 'ATIVA'
          ? 'Aporte removido. Meta reaberta.'
          : 'Aporte removido.'
      )
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao remover aporte')
    } finally {
      setDeletingAporteId(null)
    }
  }

  const confirmarExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await metaService.excluirMeta(deleteTarget.id)
      toast.success('Meta excluída!')
      setDeleteOpen(false)
      setDeleteTarget(null)
      setFormOpen(false)
      setSelected(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir meta')
    } finally {
      setDeleting(false)
    }
  }

  const handlePausar = async (meta) => {
    try {
      await metaService.pausarMeta(meta.id)
      toast.success('Meta pausada!')
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao pausar meta')
    }
  }

  const handleRetomar = async (meta) => {
    try {
      await metaService.retomarMeta(meta.id)
      toast.success('Meta retomada!')
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao retomar meta')
    }
  }

  return (
    <div className="goals-page">
      <header className="goals-page__header">
        <div>
          <h1 className="goals-page__title">Metas Financeiras</h1>
          <p className="goals-page__subtitle">Acompanhe suas metas e realize seus sonhos.</p>
        </div>
        <div className="goals-page__actions">
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={abrirNova}>
            Nova Meta
          </Button>
        </div>
      </header>

      <div className="goals-page__layout">
        <div className="goals-page__main">
          <div className="goals-page__panel">
            <div className="goals-page__toolbar">
              <GoalTabs
                tabAtiva={tabAtiva}
                onChangeTab={handleTabChange}
                contadores={resumo?.contadores}
              />
              <div className="goals-page__search">
                <InputSearch
                  value={filtros.busca}
                  onChange={(busca) => setFiltros((prev) => ({ ...prev, busca }))}
                  placeholder="Buscar por nome da meta..."
                  size="compact"
                />
                <Button variant="primary" size="sm" onClick={handleFiltrar} loading={loadingFilter}>
                  Filtrar
                </Button>
              </div>
            </div>

            <GoalList
            metas={lista.metas}
            loading={loadingLista || loadingFilter}
            tabAtiva={tabAtiva}
            onNew={abrirNova}
            onContribution={abrirAporte}
            onEdit={abrirEditar}
            onPause={handlePausar}
            onResume={handleRetomar}
            onDelete={abrirExcluir}
          />

          {lista.paginas > 1 ? (
            <Pagination
              className="goals-page__pagination"
              page={lista.pagina}
              totalPages={lista.paginas}
              onChange={(pagina) => {
                setFiltros((prev) => ({ ...prev, pagina }))
                setFiltrosAplicados((prev) => ({ ...prev, pagina }))
              }}
            />
            ) : null}
          </div>
        </div>

        <GoalSidebar resumo={resumo} loading={loadingResumo} />
      </div>

      <GoalFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelected(null)
        }}
        onSubmit={handleSalvar}
        onDelete={abrirExcluir}
        onDeleteAporte={handleExcluirAporte}
        deletingAporteId={deletingAporteId}
        meta={selected}
        submitting={submitting}
        deleting={deleting}
      />

      <GoalContributionModal
        open={contributionOpen}
        onClose={() => {
          setContributionOpen(false)
          setContributionTarget(null)
        }}
        onSubmit={confirmarAporte}
        meta={contributionTarget}
        submitting={contributing}
      />

      <DeleteGoalModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmarExcluir}
        meta={deleteTarget}
        loading={deleting}
      />
    </div>
  )
}
