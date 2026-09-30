import { formatCurrency } from '@/design-system/utils/formatCurrency.js'

const SEGMENTS = [
  { key: 'curtoPrazo', color: '#7C3AED', label: 'Curto prazo' },
  { key: 'longoPrazo', color: '#3B82F6', label: 'Longo prazo' },
  { key: 'concluidas', color: '#22C55E', label: 'Concluídas' },
  { key: 'pausadas', color: '#F59E0B', label: 'Pausadas' },
]

export function GoalCategoriesDonut({ categorias = {} }) {
  const values = SEGMENTS.map((segment) => ({
    ...segment,
    quantidade: categorias[segment.key]?.quantidade ?? 0,
    total: Number(categorias[segment.key]?.total ?? 0),
  }))

  const sum = values.reduce((acc, item) => acc + item.total, 0)
  const radius = 42
  const circumference = 2 * Math.PI * radius

  let offset = 0

  return (
    <div className="goals-donut">
      <div className="goals-donut__chart" aria-hidden>
        <svg viewBox="0 0 120 120" role="img" aria-label="Distribuição das metas por categoria">
          <circle
            className="goals-donut__track"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="14"
          />
          {sum > 0
            ? values.map((item) => {
                const fraction = item.total / sum
                const length = circumference * fraction
                const dasharray = `${length} ${circumference - length}`
                const dashoffset = -offset
                offset += length
                return (
                  <circle
                    key={item.key}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="14"
                    strokeDasharray={dasharray}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="butt"
                    transform="rotate(-90 60 60)"
                  />
                )
              })
            : null}
        </svg>
      </div>

      <div className="goals-donut__legend">
        {values.map((item) => (
          <div key={item.key} className="goals-donut__legend-row">
            <span className="goals-donut__dot" style={{ background: item.color }} />
            <span className="goals-donut__legend-label">
              {item.label} ({item.quantidade})
            </span>
            <strong>{formatCurrency(item.total)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
