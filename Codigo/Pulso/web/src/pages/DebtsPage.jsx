import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { DebtSummaryCards } from '@/components/features/debts/DebtSummaryCards.jsx'
import { DebtTabs } from '@/components/features/debts/DebtTabs.jsx'
import { DebtFilters } from '@/components/features/debts/DebtFilters.jsx'
import { DebtList } from '@/components/features/debts/DebtList.jsx'
import { DebtFormModal } from '@/components/features/debts/DebtFormModal.jsx'
import { SettleDebtModal } from '@/components/features/debts/SettleDebtModal.jsx'
import { DeleteDebtModal } from '@/components/features/debts/DeleteDebtModal.jsx'
import * as debtService from '@/services/debtService.js'
import {
  buildApiFiltros,
  DEBT_TABS,
  DEFAULT_DEBT_FILTROS,
  filtrosDividaIguais,
} from '@/utils/debtFilters.js'

export default function DebtsPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [tabAtiva, setTabAtiva] = useState(DEBT_TABS.ME_DEVEM)
  const [filtros, setFiltros] = useState(() => DEFAULT_DEBT_FILTROS())
  const [filtrosAplicados, setFiltrosAplicados] = useState(() => DEFAULT_DEBT_FILTROS())
  const [loadingFilter, setLoadingFilter] = useState(false)

  const [resumo, setResumo] = useState(null)
  const [lista, setLista] = useState({ dividas: [], total: 0, paginas: 1, pagina: 1 })
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [loadingLista, setLoadingLista] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [settleOpen, setSettleOpen] = useState(false)
  const [settleTarget, setSettleTarget] = useState(null)
  const [settling, setSettling] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtrosPendentes = useMemo(
    () => !filtrosDividaIguais(filtros, filtrosAplicados),
    [filtros, filtrosAplicados]
  )

  const apiFiltros = useMemo(
    () => buildApiFiltros(tabAtiva, filtrosAplicados),
    [tabAtiva, filtrosAplicados]
  )

  const carregarResumo = useCallback(async (signal) => {
    setLoadingResumo(true)
    try {
      const data = await debtService.obterResumo({ signal })
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
      setLoadingLista(true)
      try {
        const data = await debtService.buscarDividas(apiFiltros, { signal })
        setLista(data)
      } catch (err) {
        if (signal?.aborted) return
        toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar dívidas')
      } finally {
        if (!signal?.aborted) {
          setLoadingLista(false)
          setLoadingFilter(false)
        }
      }
    },
    [apiFiltros]
  )

  const recarregarTudo = useCallback(async () => {
    const [resumoData, listaData] = await Promise.all([
      debtService.obterResumo(),
      debtService.buscarDividas(apiFiltros),
    ])
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
    setTabAtiva(tab)
    setFiltros((prev) => ({ ...prev, pagina: 1 }))
    setFiltrosAplicados((prev) => ({ ...prev, pagina: 1 }))
  }

  const handleFiltrar = () => {
    setLoadingFilter(true)
    setFiltrosAplicados({ ...filtros, pagina: 1 })
    setFiltros((prev) => ({ ...prev, pagina: 1 }))
  }

  const handleLimpar = () => {
    setLoadingFilter(true)
    const limpos = DEFAULT_DEBT_FILTROS()
    setFiltros(limpos)
    setFiltrosAplicados(limpos)
  }

  const abrirNovo = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const abrirEditar = (divida) => {
    setSelected(divida)
    setFormOpen(true)
  }

  const handleSalvar = async (payload) => {
    setSubmitting(true)
    try {
      if (selected) {
        await debtService.atualizarDivida(selected.id, payload)
        toast.success('Empréstimo atualizado!')
      } else {
        await debtService.criarDivida(payload)
        toast.success('Empréstimo registrado!')
      }
      setFormOpen(false)
      setSelected(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar empréstimo')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const abrirQuitar = (divida) => {
    setSettleTarget(divida)
    setSettleOpen(true)
  }

  const confirmarQuitar = async () => {
    if (!settleTarget) return
    setSettling(true)
    try {
      await debtService.quitarDivida(settleTarget.id)
      toast.success('Dívida marcada como quitada!')
      setSettleOpen(false)
      setSettleTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao quitar dívida')
    } finally {
      setSettling(false)
    }
  }

  const abrirExcluir = (divida) => {
    setDeleteTarget(divida)
    setDeleteOpen(true)
  }

  const confirmarExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await debtService.excluirDivida(deleteTarget.id)
      toast.success('Dívida excluída!')
      setDeleteOpen(false)
      setDeleteTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir dívida')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="debts-page">
      <header className="debts-page__header">
        <div>
          <h1 className="debts-page__title">Dívidas</h1>
          <p className="debts-page__subtitle">
            Acompanhe quem te deve e o que você deve
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={abrirNovo}>
          Novo Empréstimo
        </Button>
      </header>

      <DebtSummaryCards resumo={resumo} loading={loadingResumo} />

      <DebtTabs tabAtiva={tabAtiva} onChangeTab={handleTabChange} />

      <DebtFilters
        filtros={filtros}
        filtrosAplicados={filtrosAplicados}
        filtrosPendentes={filtrosPendentes}
        loading={loadingFilter}
        onChange={setFiltros}
        onFiltrar={handleFiltrar}
        onLimpar={handleLimpar}
      />

      <DebtList
        dividas={lista.dividas}
        loading={loadingLista || loadingFilter}
        tabAtiva={tabAtiva}
        onNew={abrirNovo}
        onEdit={abrirEditar}
        onSettle={abrirQuitar}
        onDelete={abrirExcluir}
      />

      {lista.paginas > 1 ? (
        <Pagination
          className="debts-page__pagination"
          page={lista.pagina}
          totalPages={lista.paginas}
          onChange={(pagina) => {
            setFiltros((prev) => ({ ...prev, pagina }))
            setFiltrosAplicados((prev) => ({ ...prev, pagina }))
          }}
        />
      ) : null}

      <DebtFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelected(null)
        }}
        onSubmit={handleSalvar}
        submitting={submitting}
        divida={selected}
      />

      <SettleDebtModal
        open={settleOpen}
        onClose={() => {
          setSettleOpen(false)
          setSettleTarget(null)
        }}
        onConfirm={confirmarQuitar}
        divida={settleTarget}
        loading={settling}
      />

      <DeleteDebtModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmarExcluir}
        divida={deleteTarget}
        loading={deleting}
      />
    </div>
  )
}
