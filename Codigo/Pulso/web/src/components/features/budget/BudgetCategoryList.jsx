import { BudgetCategoryItem } from './BudgetCategoryItem.jsx'

export function BudgetCategoryList({ categorias = [] }) {
  if (categorias.length === 0) return null

  return (
    <section className="budget-section">
      <h2 className="budget-section__title">Orçamento por categoria</h2>

      <div className="budget-category-table">
        <div className="budget-category-table__scroll">
          <div className="budget-category-table__body">
            {categorias.map((categoria) => (
              <BudgetCategoryItem key={categoria.categoriaId} categoria={categoria} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
