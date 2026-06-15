import {
  BarChart3,
  Lightbulb,
  Target,
} from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { GoalCategoriesDonut } from './GoalCategoriesDonut.jsx'
import { GoalRecentActivity } from './GoalRecentActivity.jsx'

export function GoalSidebar({ resumo, loading, onViewAllActivity }) {
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
        <h2>
          <Target size={16} aria-hidden />
          Resumo das metas
        </h2>
        <dl className="goals-sidebar__stats">
          <div>
            <dt>Total em metas</dt>
            <dd>{formatCurrency(resumo?.totalEmMetas ?? 0)}</dd>
          </div>
          <div>
            <dt>Total acumulado</dt>
            <dd>{formatCurrency(resumo?.totalAcumulado ?? 0)}</dd>
          </div>
          <div>
            <dt>Progresso médio</dt>
            <dd>{Number(resumo?.progressoMedio ?? 0).toFixed(1)}%</dd>
          </div>
          <div>
            <dt>Metas ativas</dt>
            <dd>{resumo?.metasAtivas ?? 0}</dd>
          </div>
        </dl>
      </section>

      <section className="goals-sidebar__card goals-sidebar__card--highlight">
        <h2>
          <Lightbulb size={16} aria-hidden />
          Sugestão de economia
        </h2>
        <p>
          Para atingir todas as suas metas no prazo, você precisa guardar{' '}
          <strong>{formatCurrency(resumo?.sugestaoMensal ?? 0)}/mês</strong>.
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
        <GoalRecentActivity
          items={atividade}
          onViewAll={onViewAllActivity}
        />
      </section>
    </aside>
  )
}
