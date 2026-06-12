import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Copy, Pencil } from 'lucide-react'

import { Button } from '@/design-system/components/buttons/Button/Button.jsx'

import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'

import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'

import { TransactionFilters } from '@/components/features/transactions/TransactionFilters.jsx'

import { BudgetSummaryCards } from '@/components/features/budget/BudgetSummaryCards.jsx'

import { BudgetCategoryList } from '@/components/features/budget/BudgetCategoryList.jsx'

import { BudgetCategoriesWithoutLimit } from '@/components/features/budget/BudgetCategoriesWithoutLimit.jsx'

import { BudgetEditModal } from '@/components/features/budget/BudgetEditModal.jsx'

import { useTransactionFilterOptions } from '@/hooks/useTransactionFilterOptions.js'

import * as budgetService from '@/services/budgetService.js'

import { filtrarCategoriasOrcamento } from '@/utils/budgetFilterUtils.js'

import {

  mesReferenciaAnterior,

  periodoToMesReferencia,

} from '@/utils/budgetUtils.js'

import { periodoParaDateRange } from '@/utils/dateRangeFilterUtils.js'

import {

  DEFAULT_TRANSACTION_FILTROS,

  filtrosTransacaoIguais,

  periodoFromFiltros,

} from '@/utils/transactionFilters.js'



const MES_QUERY_REGEX = /^\d{4}-\d{2}$/

export default function BudgetPage() {

  const toast = useToast()
  const [searchParams] = useSearchParams()

  const [filtros, setFiltros] = useState(() => DEFAULT_TRANSACTION_FILTROS())

  const [filtrosAtivos, setFiltrosAtivos] = useState(() => DEFAULT_TRANSACTION_FILTROS())

  const [loadingFilter, setLoadingFilter] = useState(false)



  const filtrosPendentes = useMemo(

    () => !filtrosTransacaoIguais(filtros, filtrosAtivos),

    [filtros, filtrosAtivos]

  )



  const {

    data: opcoesFiltro,

    loading: opcoesLoading,

  } = useTransactionFilterOptions()



  const [status, setStatus] = useState(null)

  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)

  const [preselectCategoriaId, setPreselectCategoriaId] = useState(null)

  const [submitting, setSubmitting] = useState(false)

  const [copying, setCopying] = useState(false)



  const carregar = useCallback(async (signal) => {

    setLoading(true)

    try {

      const data = await budgetService.obterStatusOrcamento(
        periodoFromFiltros(filtrosAtivos),
        { signal }
      )

      setStatus(data)

    } catch (err) {

      if (signal?.aborted || err.code === 'ERR_CANCELED') return

      toast.error(err.response?.data?.message ?? 'Erro ao carregar orçamento')

    } finally {

      if (!signal?.aborted) {

        setLoading(false)

        setLoadingFilter(false)

      }

    }

  }, [filtrosAtivos.dataInicio, filtrosAtivos.dataFim])



  useEffect(() => {
    const mes = searchParams.get('mes')
    if (!mes || !MES_QUERY_REGEX.test(mes)) return
    const { start, end } = periodoParaDateRange(mes)
    setFiltros((prev) =>
      prev.dataInicio?.getTime() === start.getTime() && prev.dataFim?.getTime() === end.getTime()
        ? prev
        : { ...prev, dataInicio: start, dataFim: end }
    )
    setFiltrosAtivos((prev) =>
      prev.dataInicio?.getTime() === start.getTime() && prev.dataFim?.getTime() === end.getTime()
        ? prev
        : { ...prev, dataInicio: start, dataFim: end }
    )
  }, [searchParams])

  useEffect(() => {

    const controller = new AbortController()

    carregar(controller.signal)

    return () => controller.abort()

  }, [filtrosAtivos.dataInicio, filtrosAtivos.dataFim, carregar])



  const categoriasFiltradas = useMemo(

    () => filtrarCategoriasOrcamento(status?.categorias ?? [], filtrosAtivos),

    [status?.categorias, filtrosAtivos]

  )



  const categoriasSemOrcamentoFiltradas = useMemo(

    () => filtrarCategoriasOrcamento(status?.categoriasSemOrcamento ?? [], filtrosAtivos),

    [status?.categoriasSemOrcamento, filtrosAtivos]

  )



  const handleFiltrosChange = (novos) => {

    setFiltros(novos)

  }



  const handleFiltrar = () => {

    if (periodoFromFiltros(filtros) !== periodoFromFiltros(filtrosAtivos)) {

      setLoadingFilter(true)

    }

    setFiltrosAtivos({ ...filtros })

  }



  const handleLimpar = () => {

    const defaults = DEFAULT_TRANSACTION_FILTROS()

    if (periodoFromFiltros(defaults) !== periodoFromFiltros(filtrosAtivos)) {

      setLoadingFilter(true)

    }

    setFiltros(defaults)

    setFiltrosAtivos(defaults)

  }



  const abrirModal = (categoriaId = null) => {

    setPreselectCategoriaId(categoriaId)

    setModalOpen(true)

  }



  const handleSalvar = async (payload) => {

    setSubmitting(true)

    try {

      await budgetService.salvarOrcamentos(payload)

      toast.success('Limites de orçamento salvos com sucesso!')

      setModalOpen(false)

      await carregar()

    } catch (err) {

      toast.error(err.response?.data?.message ?? 'Erro ao salvar limites')

      throw err

    } finally {

      setSubmitting(false)

    }

  }



  const handleCopiarMesAnterior = async () => {
    if (copying) return

    setCopying(true)

    try {

      const periodo = periodoFromFiltros(filtrosAtivos)

      const resultado = await budgetService.copiarOrcamento({

        mesOrigem: mesReferenciaAnterior(periodo),

        mesDestino: periodoToMesReferencia(periodo),

      })

      toast.success(`Orçamento copiado com sucesso (${resultado.quantidadeCopiada} categorias).`)

      await carregar()

    } catch (err) {

      const msg = err.response?.data?.message ?? 'Erro ao copiar orçamento'

      if (err.response?.status === 404) {

        toast.info('Nenhum orçamento encontrado no mês anterior.')

      } else if (err.response?.status === 409) {

        toast.warning(msg)

      } else {

        toast.error(msg)

      }

    } finally {

      setCopying(false)

    }

  }



  const semOrcamento = !loading && (status?.categorias?.length ?? 0) === 0



  return (

    <div className="budget-page">

      <header className="budget-page__header">
        <div>
          <h1 className="budget-page__title">Orçamento Mensal</h1>
          <p className="budget-page__subtitle">
            Defina limites por categoria e acompanhe seus gastos no período.
          </p>
        </div>

        <div className="budget-page__actions">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Pencil size={16} />}
            onClick={() => abrirModal()}
          >
            Editar limites
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



      <BudgetSummaryCards resumo={status?.resumo} loading={loading} />



      {semOrcamento ? (
        <EmptyState
          className="budget-page__empty"
          title="Nenhum limite definido para este mês"
          description="Você pode reaproveitar os limites do mês anterior ou começar um orçamento novo. Os limites são salvos por mês; os gastos sempre vêm das transações do período selecionado."
          action={{
            label: copying ? 'Copiando...' : 'Usar limites do mês anterior',
            onClick: handleCopiarMesAnterior,
            leftIcon: <Copy size={16} />,
          }}
          secondaryAction={{
            label: 'Definir do zero',
            onClick: () => abrirModal(),
            leftIcon: <Pencil size={16} />,
          }}
        />
      ) : (

        <BudgetCategoryList categorias={categoriasFiltradas} />

      )}



      <BudgetCategoriesWithoutLimit

        categorias={categoriasSemOrcamentoFiltradas}

        onDefinirLimite={abrirModal}

      />



      {!loading && (status?.categoriasSemOrcamento?.length ?? 0) > 0 ? (

        <p className="budget-page__tip">

          Dica: defina limites para todas as categorias e tenha mais controle sobre seus gastos.

        </p>

      ) : null}



      <BudgetEditModal

        open={modalOpen}

        onClose={() => setModalOpen(false)}

        mesReferencia={periodoToMesReferencia(periodoFromFiltros(filtrosAtivos))}

        categoriasComLimite={status?.categorias ?? []}

        categoriasSemOrcamento={status?.categoriasSemOrcamento ?? []}

        rendaMensal={status?.rendaMensalPlanejada ?? 0}

        preselectCategoriaId={preselectCategoriaId}

        onSalvar={handleSalvar}

        submitting={submitting}

      />

    </div>

  )

}


