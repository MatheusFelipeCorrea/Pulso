import {
  BarChart3,
  Lightbulb,
  PieChart,
} from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatComprometimentoPercentual } from '@/utils/purchasePlanningUtils.js'
import { PurchaseCategoryDonut } from './PurchaseCategoryDonut.jsx'

export function PurchasePlanningSidebar({ resumo, loading }) {
  if (loading) {
    return (
      <aside className="pp-sidebar pp-sidebar--loading">
        <SpinnerDots center label="Carregando resumo..." />
      </aside>
    )
  }

  const dicas = resumo?.dicas ?? []

  return (
    <aside className="pp-sidebar">
      <section className="pp-sidebar__card">
        <h2>
          <PieChart size={16} aria-hidden />
          Resumo do planejamento
        </h2>
        <dl className="pp-sidebar__stats">
          <div>
            <dt>Total desejado</dt>
            <dd>{formatCurrency(resumo?.totalValor ?? 0)}</dd>
          </div>
          <div>
            <dt>Impacto médio na renda</dt>
            <dd>{formatComprometimentoPercentual(resumo?.mediaImpactoRenda ?? 0)}</dd>
          </div>
          <div>
            <dt>Itens na lista</dt>
            <dd>
              {resumo?.totalItens ?? 0} {(resumo?.totalItens ?? 0) === 1 ? 'item' : 'itens'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="pp-sidebar__card pp-sidebar__card--highlight">
        <h2>
          <BarChart3 size={16} aria-hidden />
          Breakdown por categoria
        </h2>
        <PurchaseCategoryDonut categorias={resumo?.categorias ?? {}} />
      </section>

      {dicas.length ? (
        <section className="pp-sidebar__card">
          <h2>
            <Lightbulb size={16} aria-hidden />
            Dicas inteligentes
          </h2>
          <ul className="pp-sidebar__tips">
            {dicas.slice(0, 3).map((dica) => (
              <li key={dica.id}>{dica.texto}</li>
            ))}
          </ul>
          {dicas.length > 3 ? (
            <Button type="button" variant="secondary" size="sm" className="pp-sidebar__tips-btn" disabled>
              Ver todas as dicas
            </Button>
          ) : null}
        </section>
      ) : null}
    </aside>
  )
}
