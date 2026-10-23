import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { DebtSummaryCards } from '@/components/features/debts/DebtSummaryCards.jsx'
import { DebtTabs } from '@/components/features/debts/DebtTabs.jsx'
import { DebtFilters } from '@/components/features/debts/DebtFilters.jsx'
import { DebtList } from '@/components/features/debts/DebtList.jsx'
import { DebtFormModal } from '@/components/features/debts/DebtFormModal.jsx'
import { DebtPaymentModal } from '@/components/features/debts/DebtPaymentModal.jsx'
import { SettleDebtModal } from '@/components/features/debts/SettleDebtModal.jsx'
import { DeleteDebtModal } from '@/components/features/debts/DeleteDebtModal.jsx'
import { ReopenDebtModal } from '@/components/features/debts/ReopenDebtModal.jsx'
import { DebtDetailsModal } from '@/components/features/debts/DebtDetailsModal.jsx'
import * as debtService from '@/services/debtService.js'
import {
  buildApiFiltros,
  DEBT_TABS,
  DEFAULT_DEBT_FILTROS,
  filtrosDividaIguais,
} from '@/utils/debtFilters.js'
import { isDividaQuitada } from '@/utils/debtBalanceUtils.js'

export default function DebtsPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const listaRequestRef = useRef(0)

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

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentTarget, setPaymentTarget] = useState(null)
  const [paying, setPaying] = useState(false)

  const [settleOpen, setSettleOpen] = useState(false)
  const [settleTarget, setSettleTarget] = useState(null)
  const [settling, setSettling] = useState(false)

  const [reopenOpen, setReopenOpen] = useState(false)
  const [reopenTarget, setReopenTarget] = useState(null)
  const [reopening, setReopening] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [deletePaymentOpen, setDeletePaymentOpen] = useState(false)
  const [deletePaymentTarget, setDeletePaymentTarget] = useState(null)
  const [deletingPayment, setDeletingPayment] = useState(false)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTarget, setDetailsTarget] = useState(null)

  const filtrosPendentes = useMemo(
    () => !filtrosDividaIguais(filtros, filtrosAplicados),
    [filtros, filtrosAplicados]
  )

  const apiFiltros = useMemo(
    () => buildApiFiltros(tabAtiva, filtrosAplicados),
    [tabAtiva, filtrosAplicados]
  )

  const dividasVisiveis = useMemo(() => {
    const dividas = lista.dividas ?? []

    if (tabAtiva === DEBT_TABS.QUITADAS) {
      return dividas.filter((divida) => isDividaQuitada(divida))
    }

    return dividas.filter(
      (divida) => !isDividaQuitada(divida) && divida.direcao === tabAtiva
    )
  }, [lista.dividas, tabAtiva])

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
      const requestId = ++listaRequestRef.current
      setLoadingLista(true)
      try {
        const data = await debtService.buscarDividas(apiFiltros, { signal })
        if (signal?.aborted || requestId !== listaRequestRef.current) return
        setLista(data)
      } catch (err) {
        if (signal?.aborted || requestId !== listaRequestRef.current) return
        toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar dívidas')
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
      debtService.obterResumo(),
      debtService.buscarDividas(apiFiltros),
    ])
    if (requestId !== listaRequestRef.current) return
    setResumo(resumoData)
    setLista(listaData)
    setDetailsTarget((current) => {
      if (!current) return null
      const atualizada = listaData.dividas.find((item) => item.id === current.id)
      if (!atualizada) setDetailsOpen(false)
      return atualizada ?? null
    })
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
    setLista({ dividas: [], total: 0, paginas: 1, pagina: 1 })
    setTabAtiva(tab)
    setFiltros((prev) => ({ ...prev, pagina: 1, status: tab === DEBT_TABS.QUITADAS ? '' : prev.status }))
    setFiltrosAplicados((prev) => ({
      ...prev,
      pagina: 1,
      status: tab === DEBT_TABS.QUITADAS ? '' : prev.status,
    }))
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

  const abrirPagamento = (divida) => {
    setPaymentTarget(divida)
    setPaymentOpen(true)
  }

  const confirmarPagamento = async (payload) => {
    if (!paymentTarget) return
    setPaying(true)
    try {
      const result = await debtService.registrarPagamento(paymentTarget.id, payload)
      const quitou = result.divida?.quitada
      toast.success(
        quitou
          ? 'Pagamento registrado e dívida quitada (saldo zerou).'
          : 'Pagamento parcial registrado!'
      )
      setPaymentOpen(false)
      setPaymentTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao registrar pagamento')
      throw err
    } finally {
      setPaying(false)
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
      toast.success('Pagamento registrado e dívida quitada!')
      setSettleOpen(false)
      setSettleTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao quitar dívida')
    } finally {
      setSettling(false)
    }
  }

  const abrirReabrir = (divida) => {
    setReopenTarget(divida)
    setReopenOpen(true)
  }

  const confirmarReabrir = async () => {
    if (!reopenTarget) return
    setReopening(true)
    try {
      await debtService.reabrirDivida(reopenTarget.id)
      toast.success('Dívida reaberta!')
      setReopenOpen(false)
      setReopenTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao reabrir dívida')
    } finally {
      setReopening(false)
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

  const abrirDetalhes = (divida) => {
    setDetailsTarget(divida)
    setDetailsOpen(true)
  }

  const abrirExcluirPagamento = (divida, pagamento) => {
    setDeletePaymentTarget({ divida, pagamento })
    setDeletePaymentOpen(true)
  }

  const confirmarExcluirPagamento = async () => {
    if (!deletePaymentTarget) return
    setDeletingPayment(true)
    try {
      await debtService.excluirPagamento(
        deletePaymentTarget.divida.id,
        deletePaymentTarget.pagamento.id
      )
      toast.success('Pagamento removido!')
      setDeletePaymentOpen(false)
      setDeletePaymentTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao remover pagamento')
    } finally {
      setDeletingPayment(false)
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

      <DebtSummaryCards
        resumo={resumo}
        loading={loadingResumo}
        onSelectTab={handleTabChange}
      />

      <DebtTabs
        tabAtiva={tabAtiva}
        onChangeTab={handleTabChange}
        contadores={resumo?.contadores}
      />

      <DebtFilters
        filtros={filtros}
        filtrosAplicados={filtrosAplicados}
        filtrosPendentes={filtrosPendentes}
        loading={loadingFilter}
        tabAtiva={tabAtiva}
        onChange={setFiltros}
        onFiltrar={handleFiltrar}
        onLimpar={handleLimpar}
      />

      <DebtList
        dividas={dividasVisiveis}
        loading={loadingLista || loadingFilter}
        tabAtiva={tabAtiva}
        onNew={abrirNovo}
        onEdit={abrirEditar}
        onSettle={abrirQuitar}
        onDelete={abrirExcluir}
        onPayment={abrirPagamento}
        onReopen={abrirReabrir}
        onView={abrirDetalhes}
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

      <DebtPaymentModal
        open={paymentOpen}
        onClose={() => {
          setPaymentOpen(false)
          setPaymentTarget(null)
        }}
        onSubmit={confirmarPagamento}
        submitting={paying}
        divida={paymentTarget}
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

      <ReopenDebtModal
        open={reopenOpen}
        onClose={() => {
          setReopenOpen(false)
          setReopenTarget(null)
        }}
        onConfirm={confirmarReabrir}
        divida={reopenTarget}
        loading={reopening}
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

      <DebtDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setDetailsTarget(null)
        }}
        divida={detailsTarget}
        onDeletePayment={abrirExcluirPagamento}
        deletingPaymentId={deletingPayment ? deletePaymentTarget?.pagamento?.id : null}
      />

      <ConfirmModal
        isOpen={deletePaymentOpen}
        onClose={() => {
          setDeletePaymentOpen(false)
          setDeletePaymentTarget(null)
        }}
        onConfirm={confirmarExcluirPagamento}
        title="Remover pagamento?"
        message={
          deletePaymentTarget
            ? `Remover pagamento de ${formatCurrency(deletePaymentTarget.pagamento.valor)}?`
            : ''
        }
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        tone="danger"
        loading={deletingPayment}
      />
    </div>
  )
}
