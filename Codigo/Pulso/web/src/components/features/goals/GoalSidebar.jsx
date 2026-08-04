import {
  BarChart3,
  DollarSign,
  Info,
  PieChart,
  Target,
  TrendingUp,
} from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { GoalCategoriesDonut } from './GoalCategoriesDonut.jsx'
import { GoalRecentActivity } from './GoalRecentActivity.jsx'

export function GoalSidebar({ resumo, loading }) {
  if (loading) {
    return (
      <aside className="goals-sidebar goals-sidebar--loading">
        <SpinnerDots center label="Carregando resumo..." />
      </aside>
    )
  }

  const categorias = resumo?.categorias ?? {}
  const atividade = resumo?.atividadeRecente ?? []

  return (
    <aside className="goals-sidebar">
      <section className="goals-sidebar__card">
        <h2>Resumo das metas</h2>
        <dl className="goals-sidebar__stats">
          <div className="goals-sidebar__stat">
            <span className="goals-sidebar__stat-icon goals-sidebar__stat-icon--target" aria-hidden>
              <Target size={18} />
            </span>
            <div className="goals-sidebar__stat-body">
              <dt>Total em metas</dt>
              <dd>{formatCurrency(resumo?.totalEmMetas ?? 0)}</dd>
            </div>
          </div>
          <div className="goals-sidebar__stat">
            <span className="goals-sidebar__stat-icon goals-sidebar__stat-icon--accumulated" aria-hidden>
              <DollarSign size={18} />
            </span>
            <div className="goals-sidebar__stat-body">
              <dt>Total acumulado</dt>
              <dd>{formatCurrency(resumo?.totalAcumulado ?? 0)}</dd>
            </div>
          </div>
          <div className="goals-sidebar__stat">
            <span className="goals-sidebar__stat-icon goals-sidebar__stat-icon--progress" aria-hidden>
              <TrendingUp size={18} />
            </span>
            <div className="goals-sidebar__stat-body">
              <dt>Progresso médio</dt>
              <dd>{Number(resumo?.progressoMedio ?? 0).toFixed(1)}%</dd>
            </div>
          </div>
          <div className="goals-sidebar__stat">
            <span className="goals-sidebar__stat-icon goals-sidebar__stat-icon--active" aria-hidden>
              <PieChart size={18} />
            </span>
            <div className="goals-sidebar__stat-body">
              <dt>Metas ativas</dt>
              <dd>{resumo?.metasAtivas ?? 0}</dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="goals-sidebar__card goals-sidebar__card--highlight">
        <h2>
          <span>Sugestão de economia</span>
          <Info size={16} aria-hidden />
        </h2>
        <p className="goals-sidebar__highlight-label">
          Para atingir todas as suas metas no prazo, você precisa guardar
        </p>
        <p className="goals-sidebar__highlight-value">
          {formatCurrency(resumo?.sugestaoMensal ?? 0)}
          <span>/mês</span>
        </p>
        <span className="goals-sidebar__tip">Você está no caminho certo! 🚀</span>
      </section>

      <section className="goals-sidebar__card">
        <h2>
          <BarChart3 size={16} aria-hidden />
          Categorias das metas
        </h2>
        <GoalCategoriesDonut categorias={categorias} />
      </section>

      <section className="goals-sidebar__card goals-sidebar__card--activity">
        <GoalRecentActivity items={atividade} />
      </section>
    </aside>
  )
}
