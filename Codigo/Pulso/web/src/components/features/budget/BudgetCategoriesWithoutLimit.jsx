import { Plus } from 'lucide-react'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { BudgetTruncatedLabel } from './BudgetTruncatedLabel.jsx'

export function BudgetCategoriesWithoutLimit({ categorias = [], onDefinirLimite }) {
  if (categorias.length === 0) return null

  return (
    <section className="budget-section budget-section--muted">
      <div className="budget-section__head">
        <h2 className="budget-section__title">Categorias sem orçamento definido</h2>
        <p className="budget-section__subtitle">
          Estas categorias ainda não possuem limite definido.
        </p>
      </div>

      <div className="budget-without-limit-scroll">
        {categorias.map((categoria) => (
          <article
            key={categoria.id}
            className="budget-without-limit-card"
            style={{ '--budget-cat-color': categoria.cor }}
          >
            <div className="budget-without-limit-card__main">
              <span className="budget-without-limit-card__icon" aria-hidden>
                {resolveBadgeIcon(categoria.icone ?? 'Tag', { size: 16 })}
              </span>
              <BudgetTruncatedLabel
                text={categoria.nome}
                className="budget-without-limit-card__name"
                as="strong"
              />
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => onDefinirLimite?.(categoria.id)}
              className="budget-without-limit-card__action"
            >
              Definir limite
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}
