import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Tags } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Pagination } from '@/design-system/components/navigation/Pagination/Pagination.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { TransactionSummaryCards } from '@/components/features/transactions/TransactionSummaryCards.jsx'
import { TransactionFilters } from '@/components/features/transactions/TransactionFilters.jsx'
import { TransactionList } from '@/components/features/transactions/TransactionList.jsx'
import { TransactionFormModal } from '@/components/features/transactions/TransactionFormModal.jsx'
import { CategoryManageModal } from '@/components/features/categories/CategoryManageModal.jsx'
import { DeleteTransactionModal } from '@/components/features/transactions/DeleteTransactionModal.jsx'
import * as transactionService from '@/services/transactionService.js'
import * as tagService from '@/services/tagService.js'
import { useTransactionFilterOptions } from '@/hooks/useTransactionFilterOptions.js'
import {
  DEFAULT_TRANSACTION_FILTROS,
  filtrosTransacaoIguais,
} from '@/utils/transactionFilters.js'

export default function TransactionsPage() {
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [filtros, setFiltros] = useState(() => DEFAULT_TRANSACTION_FILTROS())
  const [filtrosAtivos, setFiltrosAtivos] = useState(() => DEFAULT_TRANSACTION_FILTROS())
  const [pagina, setPagina] = useState(1)

  const filtrosPendentes = useMemo(
    () => !filtrosTransacaoIguais(filtros, filtrosAtivos),
    [filtros, filtrosAtivos]
  )

  const [transacoes, setTransacoes] = useState([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalItens, setTotalItens] = useState(0)
  const [resumo, setResumo] = useState(null)

  const {
    data: opcoesFiltro,
    loading: opcoesLoading,
    reload: reloadOpcoesFiltro,
  } = useTransactionFilterOptions()

  const [loadingList, setLoadingList] = useState(true)
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [loadingFilter, setLoadingFilter] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedTx, setSelectedTx] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        periodo: filtrosAtivos.periodo,
        categoria: filtrosAtivos.categoria,
        tipo: filtrosAtivos.tipo,
        recurso: filtrosAtivos.recurso,
        busca: filtrosAtivos.busca,
        pagina,
      }),
    [filtrosAtivos, pagina]
  )

  const carregarDados = useCallback(async (signal) => {
    setLoadingList(true)
    setLoadingResumo(true)

    try {
      const queryFiltros = { ...filtrosAtivos, pagina, limite: 10 }
      const [lista, resumoData] = await Promise.all([
        transactionService.buscarTransacoes(queryFiltros, { signal }),
        transactionService.obterResumo(filtrosAtivos, { signal }),
      ])

      if (signal?.aborted) return

      setTransacoes(lista.transacoes)
      setTotalPaginas(lista.paginas)
      setTotalItens(lista.total)
      setResumo(resumoData)
    } catch (err) {
      if (signal?.aborted || err.code === 'ERR_CANCELED') return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar transações')
    } finally {
      if (!signal?.aborted) {
        setLoadingList(false)
        setLoadingResumo(false)
        setLoadingFilter(false)
      }
    }
  }, [filtrosAtivos, pagina])

  useEffect(() => {
    const controller = new AbortController()
    carregarDados(controller.signal)
    return () => controller.abort()
  }, [queryKey, carregarDados])

  const handleFiltrosChange = (novos) => {
    setFiltros(novos)
  }

  const handleFiltrar = () => {
    setLoadingFilter(true)
    setFiltrosAtivos({ ...filtros })
    setPagina(1)
  }

  const handleLimpar = () => {
    const defaults = DEFAULT_TRANSACTION_FILTROS()
    setLoadingFilter(true)
    setFiltros(defaults)
    setFiltrosAtivos(defaults)
    setPagina(1)
  }

  const abrirCriar = () => {
    setModalMode('create')
    setSelectedTx(null)
    setModalOpen(true)
  }

  const abrirEditar = (tx) => {
    setModalMode('edit')
    setSelectedTx(tx)
    setModalOpen(true)
  }

  const abrirExcluir = (tx) => {
    setDeleteTarget(tx)
    setDeleteOpen(true)
  }

  const resolverTags = async (tagIds = [], tagNames = []) => {
    const ids = [...tagIds]
    for (const nome of tagNames) {
      const tag = await tagService.criarTag(nome)
      ids.push(tag.id)
    }
    return [...new Set(ids)]
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      const tags = await resolverTags(payload.tags, payload.tagNames)
      const body = {
        tipo: payload.tipo,
        categoriaId: payload.categoriaId,
        recurso: payload.recurso,
        valor: payload.valor,
        descricao: payload.descricao,
        data: payload.data,
        tags,
        recorrente: payload.recorrente,
        regraRecorrencia: payload.regraRecorrencia,
      }

      if (modalMode === 'edit' && selectedTx) {
        await transactionService.atualizarTransacao(selectedTx.id, body)
        toast.success('Transação atualizada com sucesso!')
      } else {
        await transactionService.criarTransacao(body)
        toast.success(
          payload.recorrente
            ? 'Transação recorrente criada! Ela será gerada automaticamente 🔄'
            : 'Transação criada com sucesso! 💜'
        )
      }

      setModalOpen(false)
      await carregarDados()
      await reloadOpcoesFiltro()
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Erro ao salvar transação'
      toast.error(msg)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async ({ excluirFuturas, transacaoId }) => {
    setDeleting(true)
    try {
      const id = transacaoId ?? deleteTarget?.id
      await transactionService.excluirTransacao(id, excluirFuturas)
      toast.success('Transação excluída')
      setDeleteOpen(false)
      setModalOpen(false)
      setDeleteTarget(null)
      await carregarDados()
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Erro ao excluir transação')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="tx-page">
      <header className="tx-page__header">
        <div>
          <h1 className="tx-page__title">Transações</h1>
          <p className="tx-page__subtitle">Gerencie todas as suas receitas e despesas.</p>
        </div>
        <div className="tx-page__header-actions">
          <Button
            variant="secondary"
            size="md"
            className="shrink-0 whitespace-nowrap"
            leftIcon={<Tags size={18} />}
            onClick={() => setCategoryModalOpen(true)}
          >
            Categorias
          </Button>
          <Button
            variant="primary"
            size="md"
            className="tx-page__cta shrink-0 whitespace-nowrap"
            leftIcon={<Plus size={18} />}
            onClick={abrirCriar}
          >
            Nova Transação
          </Button>
        </div>
      </header>

      <TransactionFilters
        filtros={filtros}
        filtrosAtivos={filtrosAtivos}
        opcoes={opcoesFiltro}
        opcoesLoading={opcoesLoading}
        onChange={handleFiltrosChange}
        onFiltrar={handleFiltrar}
        onLimpar={handleLimpar}
        filtrosPendentes={filtrosPendentes}
        loading={loadingFilter}
      />

      <TransactionSummaryCards resumo={resumo} loading={loadingResumo} />

      <TransactionList
        transacoes={transacoes}
        loading={loadingList}
        onEdit={abrirEditar}
        onDelete={abrirExcluir}
      />

      {totalPaginas > 1 ? (
        <Pagination
          page={pagina}
          totalPages={totalPaginas}
          totalItems={totalItens}
          onChange={setPagina}
          showInfo
          className="tx-page__pagination"
        />
      ) : null}

      <TransactionFormModal
        open={modalOpen}
        mode={modalMode}
        transacao={selectedTx}
        opcoes={opcoesFiltro}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={() => {
          setDeleteTarget(selectedTx)
          setDeleteOpen(true)
        }}
        submitting={submitting}
      />

      <DeleteTransactionModal
        open={deleteOpen}
        transacao={deleteTarget}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      <CategoryManageModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onChanged={reloadOpcoesFiltro}
        tipoInicial={filtrosAtivos.tipo === 'RECEITA' ? 'RECEITA' : 'DESPESA'}
      />
    </div>
  )
}
