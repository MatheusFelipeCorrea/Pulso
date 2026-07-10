import {
  CheckCircle2,
  FileText,
  Lightbulb,
} from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import {
  COMPROMETIMENTO_COLORS,
  formatComprometimentoPercentual,
  getComprometimentoNivel,
} from '@/utils/purchasePlanningUtils.js'
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
  const impactoNivel = getComprometimentoNivel(resumo?.mediaImpactoRenda ?? 0)

  return (
    <aside className="pp-sidebar">
      <section className="pp-sidebar__card">
        <h2>
          <FileText size={16} aria-hidden />
          Resumo do planejamento
        </h2>
        <dl className="pp-sidebar__stats">
          <div>
            <dt>Total dos itens desejados</dt>
            <dd className="pp-value-accent">{formatCurrency(resumo?.totalValor ?? 0)}</dd>
          </div>
          <div>
            <dt>Impacto médio na renda</dt>
            <dd style={{ color: COMPROMETIMENTO_COLORS[impactoNivel] }}>
              {formatComprometimentoPercentual(resumo?.mediaImpactoRenda ?? 0)}
            </dd>
          </div>
          <div>
            <dt>Qtde. de itens</dt>
            <dd>
              {resumo?.totalItens ?? 0} {(resumo?.totalItens ?? 0) === 1 ? 'item' : 'itens'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="pp-sidebar__card pp-sidebar__card--highlight">
        <h2>Breakdown por categoria</h2>
        <PurchaseCategoryDonut categorias={resumo?.categorias ?? {}} />
      </section>

      {dicas.length ? (
        <section className="pp-sidebar__card">
          <h2>
            <Lightbulb size={16} aria-hidden />
            Dicas inteligentes
          </h2>
          <ul className="pp-sidebar__tips">
            {dicas.map((dica) => (
              <li key={dica.id}>
                <CheckCircle2 size={14} aria-hidden />
                <span>{dica.texto}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  )
}
