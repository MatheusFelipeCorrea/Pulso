import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Plus, Users } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { ExpenseSplitSummaryCards } from '@/components/features/expense-split/ExpenseSplitSummaryCards.jsx'
import { ExpenseSplitCard } from '@/components/features/expense-split/ExpenseSplitCard.jsx'
import { ExpenseSplitHistoryRow } from '@/components/features/expense-split/ExpenseSplitHistoryRow.jsx'
import { ExpenseSplitFormModal } from '@/components/features/expense-split/ExpenseSplitFormModal.jsx'
import { ExpenseSplitDetailsModal } from '@/components/features/expense-split/ExpenseSplitDetailsModal.jsx'
import { DeleteExpenseSplitModal } from '@/components/features/expense-split/DeleteExpenseSplitModal.jsx'
import { ExpenseSplitReminderModal } from '@/components/features/expense-split/ExpenseSplitReminderModal.jsx'
import * as expenseSplitService from '@/services/expenseSplitService.js'
import { getParticipantesVisiveis } from '@/utils/expenseSplitUtils.js'

export default function ExpenseSplitPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [resumo, setResumo] = useState(null)
  const [loadingResumo, setLoadingResumo] = useState(true)

  const [ativas, setAtivas] = useState([])
  const [loadingAtivas, setLoadingAtivas] = useState(true)

  const [historico, setHistorico] = useState({ divisoes: [], total: 0, paginas: 1, pagina: 1 })
  const [loadingHistorico, setLoadingHistorico] = useState(true)
  const [historicoAberto, setHistoricoAberto] = useState(true)
  const [paginaHistorico, setPaginaHistorico] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsTarget, setDetailsTarget] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [lembreteOpen, setLembreteOpen] = useState(false)
  const [lembreteTarget, setLembreteTarget] = useState(null)
  const [criandoLembrete, setCriandoLembrete] = useState(false)

  const carregarResumo = useCallback(async (signal) => {
    setLoadingResumo(true)
    try {
      const data = await expenseSplitService.obterResumo({ signal })
      setResumo(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar resumo')
    } finally {
      if (!signal?.aborted) setLoadingResumo(false)
    }
  }, [])

  const carregarAtivas = useCallback(async (signal) => {
    setLoadingAtivas(true)
    try {
      const data = await expenseSplitService.listarAtivas({ signal })
      setAtivas(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar divisões ativas')
    } finally {
      if (!signal?.aborted) setLoadingAtivas(false)
    }
  }, [])

  const carregarHistorico = useCallback(async (signal) => {
    setLoadingHistorico(true)
    try {
      const data = await expenseSplitService.listarHistorico({ pagina: paginaHistorico }, { signal })
      setHistorico(data)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar histórico')
    } finally {
      if (!signal?.aborted) setLoadingHistorico(false)
    }
  }, [paginaHistorico])

  const recarregarTudo = useCallback(async () => {
    await Promise.all([carregarResumo(), carregarAtivas(), carregarHistorico()])
  }, [carregarResumo, carregarAtivas, carregarHistorico])

  useEffect(() => {
    const controller = new AbortController()
    carregarResumo(controller.signal)
    return () => controller.abort()
  }, [carregarResumo])

  useEffect(() => {
    const controller = new AbortController()
    carregarAtivas(controller.signal)
    return () => controller.abort()
  }, [carregarAtivas])

  useEffect(() => {
    const controller = new AbortController()
    carregarHistorico(controller.signal)
    return () => controller.abort()
  }, [carregarHistorico])

  const abrirNovo = () => {
    setSelected(null)
    setFormOpen(true)
  }

  const abrirEditar = (divisao) => {
    setSelected(divisao)
    setFormOpen(true)
  }

  const handleSalvar = async (payload) => {
    setSubmitting(true)
    try {
      if (selected) {
        await expenseSplitService.atualizarDivisao(selected.id, payload)
        toast.success('Divisão atualizada!')
      } else {
        await expenseSplitService.criarDivisao(payload)
        toast.success('Divisão criada!')
      }
      setFormOpen(false)
      setSelected(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao salvar divisão')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const abrirDetalhes = (divisao) => {
    setDetailsTarget(divisao)
    setDetailsOpen(true)
  }

  const abrirExcluir = (divisao) => {
    setDeleteTarget(divisao)
    setDeleteOpen(true)
  }

  const confirmarExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await expenseSplitService.excluirDivisao(deleteTarget.id)
      toast.success('Divisão excluída!')
      setDeleteOpen(false)
      setDeleteTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir divisão')
    } finally {
      setDeleting(false)
    }
  }

  const handleMarcarPago = async (divisao, participante) => {
    try {
      await expenseSplitService.marcarParticipantePago(divisao.id, participante.id)
      toast.success(`${participante.nome} marcado como pago!`)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao marcar pagamento')
    }
  }

  const abrirLembrete = (divisao) => {
    setLembreteTarget(divisao)
    setLembreteOpen(true)
  }

  const confirmarLembrete = async (payload) => {
    if (!lembreteTarget) return
    setCriandoLembrete(true)
    try {
      await expenseSplitService.criarLembreteCobranca(lembreteTarget.id, payload)
      toast.success('Lembrete de cobrança criado no Calendário!')
      setLembreteOpen(false)
      setLembreteTarget(null)
      await recarregarTudo()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao criar lembrete')
      throw err
    } finally {
      setCriandoLembrete(false)
    }
  }

  return (
    <div className="expense-split-page">
      <header className="expense-split-page__header">
        <div>
          <h1 className="expense-split-page__title">Divisão de Despesas</h1>
          <p className="expense-split-page__subtitle">
            Organize e acompanhe as contas divididas com amigos e familiares.
          </p>
        </div>
        <div className="expense-split-page__actions">
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={abrirNovo}>
            Nova Divisão
          </Button>
        </div>
      </header>

      <ExpenseSplitSummaryCards resumo={resumo} loading={loadingResumo} />

      <section className="expense-split-page__section">
        <h2 className="expense-split-page__section-title">Divisões ativas</h2>

        {loadingAtivas ? (
          <SpinnerDots center label="Carregando divisões..." />
        ) : ativas.length === 0 ? (
          <EmptyState
            size="compact"
            bordered
            icon={<Users size={28} strokeWidth={1.75} />}
            title="Nenhuma divisão ativa. Racha alguma conta!"
            description="Crie sua primeira divisão e acompanhe quem deve e quem já pagou."
            action={{ label: 'Criar divisão', onClick: abrirNovo, leftIcon: <Plus size={14} /> }}
          />
        ) : (
          <ul className="expense-split-page__grid">
            {ativas.map((divisao) => (
              <ExpenseSplitCard
                key={divisao.id}
                divisao={divisao}
                onView={abrirDetalhes}
                onEdit={abrirEditar}
                onDelete={abrirExcluir}
                onMarcarPago={handleMarcarPago}
                onCriarLembrete={abrirLembrete}
              />
            ))}
          </ul>
        )}
      </section>

      {historico.total > 0 ? (
        <section className="expense-split-page__section">
          <button
            type="button"
            className="expense-split-history__toggle"
            aria-expanded={historicoAberto}
            onClick={() => setHistoricoAberto((prev) => !prev)}
          >
            <h2 className="expense-split-page__section-title">Histórico</h2>
            <ChevronDown
              size={18}
              className={`expense-split-history__chevron${historicoAberto ? ' expense-split-history__chevron--open' : ''}`}
              aria-hidden
            />
          </button>

          {historicoAberto ? (
            <>
              {loadingHistorico ? (
                <SpinnerDots center label="Carregando histórico..." />
              ) : (
                <ul className="expense-split-history__list">
                  {historico.divisoes.map((divisao) => (
                    <ExpenseSplitHistoryRow key={divisao.id} divisao={divisao} onView={abrirDetalhes} />
                  ))}
                </ul>
              )}

              {historico.paginas > 1 ? (
                <Pagination
                  page={historico.pagina}
                  totalPages={historico.paginas}
                  onChange={setPaginaHistorico}
                />
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      <ExpenseSplitFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelected(null)
        }}
        onSubmit={handleSalvar}
        submitting={submitting}
        divisao={selected}
      />

      <ExpenseSplitDetailsModal
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setDetailsTarget(null)
        }}
        divisao={detailsTarget}
      />

      <DeleteExpenseSplitModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmarExcluir}
        divisao={deleteTarget}
        loading={deleting}
      />

      <ExpenseSplitReminderModal
        open={lembreteOpen}
        onClose={() => {
          setLembreteOpen(false)
          setLembreteTarget(null)
        }}
        onSubmit={confirmarLembrete}
        submitting={criandoLembrete}
        divisao={lembreteTarget}
        participantesPendentes={
          lembreteTarget
            ? getParticipantesVisiveis(lembreteTarget).filter((p) => p.status === 'PENDENTE')
            : []
        }
      />
    </div>
  )
}
