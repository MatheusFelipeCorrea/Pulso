import {
  getTripExpenseCategoryIcon,
  TRIP_EXPENSE_CATEGORY_COLORS,
  TRIP_EXPENSE_CATEGORY_MAP,
} from '@/utils/tripExpenseCategories.js'

export function TripDetailCategoryBadge({ categoria, label }) {
  const meta = TRIP_EXPENSE_CATEGORY_MAP[categoria]
  const Icon = getTripExpenseCategoryIcon(categoria)
  const color = TRIP_EXPENSE_CATEGORY_COLORS[categoria] ?? 'var(--ds-color-primary)'

  return (
    <span
      className="trip-detail-page__category"
      style={{ '--trip-category-color': color }}
    >
      <span className="trip-detail-page__category-icon" aria-hidden>
        <Icon size={14} />
      </span>
      {label ?? meta?.tableLabel ?? categoria}
    </span>
  )
}
