import {
  TRIP_EXPENSE_CATEGORIES,
  getTripExpenseCategoryColor,
  getTripExpenseCategoryIcon,
} from './tripExpenseCategories.js'

export function buildTripExpenseCategorySelectIcon(key, size = 16) {
  const Icon = getTripExpenseCategoryIcon(key)
  const color = getTripExpenseCategoryColor(key)

  return (
    <span
      className="trip-expense-category-select-icon"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      <Icon size={size} aria-hidden />
    </span>
  )
}

export function buildTripExpenseCategorySelectOptions() {
  return TRIP_EXPENSE_CATEGORIES.map((item) => ({
    value: item.key,
    label: item.tableLabel,
    icon: buildTripExpenseCategorySelectIcon(item.key),
  }))
}
