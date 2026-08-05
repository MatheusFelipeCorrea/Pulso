import { useCallback, useEffect, useRef, useState } from 'react'
import { Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { PurchasePlanningAlert } from '@/components/features/purchase-planning/PurchasePlanningAlert.jsx'
import { PurchasePlanningSidebar } from '@/components/features/purchase-planning/PurchasePlanningSidebar.jsx'
import { PurchaseItemCard } from '@/components/features/purchase-planning/PurchaseItemCard.jsx'
import { PurchaseItemFormModal } from '@/components/features/purchase-planning/PurchaseItemFormModal.jsx'
import { LinkGoalModal } from '@/components/features/purchase-planning/LinkGoalModal.jsx'
import { PurchaseRecentTable } from '@/components/features/purchase-planning/PurchaseRecentTable.jsx'
import { PurchaseHistoryModal } from '@/components/features/purchase-planning/PurchaseHistoryModal.jsx'
import { shouldShowImpactAlert } from '@/utils/purchasePlanningUtils.js'
import * as purchasePlanningService from '@/services/purchasePlanningService.js'

export default function PurchasePlanningPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [painel, setPainel] = useState({ resumo: null, itens: [], comprados: [] })
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [linkOpen, setLinkOpen] = useState(false)
  const [linkTarget, setLinkTarget] = useState(null)
  const [linking, setLinking] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [buyOpen, setBuyOpen] = useState(false)
  const [buyTarget, setBuyTarget] = useState(null)
  const [buyingId, setBuyingId] = useState(null)

  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyTarget, setHistoryTarget] = useState(null)

  const carregarPainel = useCallback(async (signal) => {
    setLoading(true)
    try {
      const data = await purchasePlanningService.listarPainel({ signal })
      if (signal?.aborted) return
      setPainel(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar planejamento')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    carregarPainel(controller.signal)
    return () => controller.abort()
  }, [carregarPainel])

  const recarregar = useCallback(async () => {
    const data = await purchasePlanningService.listarPainel()
    setPainel(data)
  }, [])

  const abrirNovo = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const abrirEditar = (item) => {
    setSelected(item)
    setFormOpen(true)
  }

  const handleSalvar = async (payload, imageFile) => {
    setSubmitting(true)
    try {
      let saved
      if (selected) {
        saved = await purchasePlanningService.editarItem(selected.id, payload)
        toast.success('Item atualizado!')
      } else {
        saved = await purchasePlanningService.criarItem(payload)
        toast.success('Item adicionado à lista!')
      }

      if (imageFile && saved?.id) {
        await purchasePlanningService.enviarImagemItem(saved.id, imageFile)
      }

      setFormOpen(false)
      setSelected(null)
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar item')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const abrirVincular = (item) => {
    setLinkTarget(item)
    setLinkOpen(true)
  }

  const confirmarVincular = async (payload) => {
    if (!linkTarget) return
    setLinking(true)
    try {
      await purchasePlanningService.vincularMeta(linkTarget.id, payload)
      toast.success('Meta vinculada!')
      setLinkOpen(false)
      setLinkTarget(null)
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao vincular meta')
      throw err
    } finally {
      setLinking(false)
    }
  }

  const handleDesvincular = async (item) => {
    try {
      await purchasePlanningService.desvincularMeta(item.id)
      toast.success('Meta desvinculada!')
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao desvincular meta')
    }
  }

  const abrirExcluir = (item) => {
    setDeleteTarget(item)
    setDeleteOpen(true)
  }

  const confirmarExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await purchasePlanningService.excluirItem(deleteTarget.id)
      toast.success('Item excluído!')
      setDeleteOpen(false)
      setDeleteTarget(null)
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir item')
    } finally {
      setDeleting(false)
    }
  }

  const abrirComprar = (item) => {
    setBuyTarget(item)
    setBuyOpen(true)
  }

  const confirmarComprar = async () => {
    if (!buyTarget) return
    setBuyingId(buyTarget.id)
    try {
      await purchasePlanningService.marcarComprado(buyTarget.id)
      toast.success('Compra registrada! Transação criada automaticamente.')
      setBuyOpen(false)
      setBuyTarget(null)
      await recarregar()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao registrar compra')
    } finally {
      setBuyingId(null)
    }
  }

  const abrirHistorico = (item) => {
    setHistoryTarget(item)
    setHistoryOpen(true)
  }

  const resumo = painel.resumo
  const itens = painel.itens ?? []
  const comprados = painel.comprados ?? []
  const showAlert = shouldShowImpactAlert(resumo?.mediaImpactoRenda)

  return (
    <div className="purchase-planning-page">
      <header className="purchase-planning-page__header">
        <div>
          <h1 className="purchase-planning-page__title">Planejamento de Compra</h1>
          <p className="purchase-planning-page__subtitle">
            Planeje suas compras de forma inteligente e sem comprometer seu futuro.
          </p>
        </div>
        <div className="purchase-planning-page__actions">
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={abrirNovo}>
            Novo Item
          </Button>
        </div>
      </header>

      {showAlert ? <PurchasePlanningAlert mediaImpactoRenda={resumo.mediaImpactoRenda} /> : null}

      <div className="purchase-planning-page__layout">
        <div className="purchase-planning-page__main">
          <section className="purchase-planning-page__section">
            <div className="purchase-planning-page__panel-head">
              <h2>Itens desejados</h2>
            </div>

            {loading ? (
              <div className="purchase-planning-page__loading">
                <SpinnerDots center label="Carregando itens..." />
              </div>
            ) : itens.length ? (
              <ul className="pp-item-list" role="list">
                {itens.map((item) => (
                  <PurchaseItemCard
                    key={item.id}
                    item={item}
                    sobraMensal={resumo?.sobraMensal ?? 0}
                    buying={buyingId === item.id}
                    onLinkGoal={abrirVincular}
                    onBuy={abrirComprar}
                    onEdit={abrirEditar}
                    onDelete={abrirExcluir}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                className="purchase-planning-page__empty"
                icon={<ShoppingCart size={28} />}
                title="Nenhum item na lista"
                description="Adicione o que você deseja comprar e acompanhe quanto tempo levará para realizar."
                action={{
                  label: 'Adicionar item',
                  onClick: abrirNovo,
                  leftIcon: <Plus size={16} />,
                }}
              />
            )}
          </section>

          <section className="purchase-planning-page__panel purchase-planning-page__panel--recent">
            <div className="purchase-planning-page__panel-head">
              <h2>Comprados recentemente</h2>
            </div>
            <PurchaseRecentTable comprados={comprados} onViewDetails={abrirHistorico} />
          </section>
        </div>

        <PurchasePlanningSidebar resumo={resumo} loading={loading} />
      </div>

      <PurchaseItemFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelected(null)
        }}
        onSubmit={handleSalvar}
        item={selected}
        submitting={submitting}
        rendaMensal={resumo?.rendaMensal}
      />

      <LinkGoalModal
        open={linkOpen}
        onClose={() => {
          setLinkOpen(false)
          setLinkTarget(null)
        }}
        onSubmit={confirmarVincular}
        item={linkTarget}
        submitting={linking}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmarExcluir}
        title="Excluir item?"
        message={
          deleteTarget
            ? `Remover "${deleteTarget.nome}" (${formatCurrency(deleteTarget.valorEstimado)}) da lista?`
            : ''
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        tone="danger"
        loading={deleting}
      />

      <ConfirmModal
        isOpen={buyOpen}
        onClose={() => {
          setBuyOpen(false)
          setBuyTarget(null)
        }}
        onConfirm={confirmarComprar}
        title="Registrar compra?"
        message={
          buyTarget
            ? `Marcar "${buyTarget.nome}" como comprado por ${formatCurrency(buyTarget.valorEstimado)}? Uma despesa será registrada automaticamente.`
            : ''
        }
        confirmLabel="Comprei!"
        cancelLabel="Cancelar"
        tone="primary"
        loading={Boolean(buyingId)}
      />

      <PurchaseHistoryModal
        open={historyOpen}
        onClose={() => {
          setHistoryOpen(false)
          setHistoryTarget(null)
        }}
        item={historyTarget}
      />
    </div>
  )
}
