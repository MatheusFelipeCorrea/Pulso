import { useCallback, useEffect, useRef, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Upload } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { DashboardBalanceSection } from '@/components/features/dashboard/DashboardBalanceSection.jsx'
import {
  currentDashboardPeriodo,
  DashboardIncomeExpenseChart,
} from '@/components/features/dashboard/DashboardIncomeExpenseChart.jsx'
import { DashboardCategoryDonut } from '@/components/features/dashboard/DashboardCategoryDonut.jsx'
import { DashboardRecentTransactions } from '@/components/features/dashboard/DashboardRecentTransactions.jsx'
import { DashboardFinancialHealth } from '@/components/features/dashboard/DashboardFinancialHealth.jsx'
import { DashboardActiveGoals } from '@/components/features/dashboard/DashboardActiveGoals.jsx'
import { DashboardBudgetAlerts } from '@/components/features/dashboard/DashboardBudgetAlerts.jsx'
import { ImportStatementModal } from '@/components/features/dashboard/ImportStatementModal.jsx'
import { useAppSelector } from '@/store/hooks'
import { getUserDisplayName } from '@/utils/userDisplayName.js'
import * as dashboardService from '@/services/dashboardService.js'

function currentPeriodo() {
  return currentDashboardPeriodo()
}

function formatPeriodoResumo(periodo) {
  try {
    const label = format(parseISO(`${periodo}-01T12:00:00`), "MMMM 'de' yyyy", { locale: ptBR })
    return periodo === currentPeriodo()
      ? 'Aqui está o resumo das suas finanças deste mês.'
      : `Resumo de ${label}.`
  } catch {
    return 'Aqui está o resumo das suas finanças.'
  }
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [periodo, setPeriodo] = useState(currentPeriodo)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [importOpen, setImportOpen] = useState(false)

  const carregar = useCallback(async (signal) => {
    setLoading(true)
    try {
      const payload = await dashboardService.obterDashboard({ mes: periodo }, { signal })
      setData(payload)
    } catch (err) {
      if (signal?.aborted) return
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar dashboard')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [periodo])

  useEffect(() => {
    const controller = new AbortController()
    carregar(controller.signal)
    return () => controller.abort()
  }, [carregar])

  const firstName = getUserDisplayName(user?.nome).split(' ')[0]

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <div>
          <h1>Olá, {firstName}! 👋</h1>
          <p>{formatPeriodoResumo(periodo)}</p>
        </div>

        <div className="dashboard-page__actions">
          <Button variant="secondary" leftIcon={<Upload size={18} />} onClick={() => setImportOpen(true)}>
            Importar extrato
          </Button>
        </div>
      </header>

      <DashboardBudgetAlerts alertas={data?.alertasOrcamento ?? []} periodo={periodo} />

      <DashboardBalanceSection
        saldoTotal={data?.saldoTotal}
        recursos={data?.recursos ?? []}
        loading={loading}
      />

      <div className="dashboard-page__charts">
        <DashboardIncomeExpenseChart
          data={data?.receitasDespesas}
          loading={loading}
          periodo={periodo}
          onChangePeriodo={setPeriodo}
        />
        <DashboardCategoryDonut categorias={data?.gastosPorCategoria ?? []} loading={loading} />
      </div>

      <div className="dashboard-page__bottom">
        <DashboardRecentTransactions transacoes={data?.ultimasTransacoes ?? []} loading={loading} />
        <DashboardFinancialHealth saude={data?.saudeFinanceira} loading={loading} />
      </div>

      <DashboardActiveGoals metas={data?.metasAtivas ?? []} loading={loading} />

      <ImportStatementModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => carregar()}
      />
    </div>
  )
}
