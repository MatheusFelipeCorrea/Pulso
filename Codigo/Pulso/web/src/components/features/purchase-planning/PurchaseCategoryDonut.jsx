import { CATEGORIA_SEGMENTS } from '@/utils/purchasePlanningUtils.js'

export function PurchaseCategoryDonut({ categorias = {} }) {
  const values = CATEGORIA_SEGMENTS.map((segment) => ({
    ...segment,
    total: Number(categorias[segment.key]?.total ?? 0),
  }))

  const sum = values.reduce((acc, item) => acc + item.total, 0)
  const radius = 42
  const circumference = 2 * Math.PI * radius

  let offset = 0

  return (
    <div className="pp-donut">
      <div className="pp-donut__chart" aria-hidden>
        <svg viewBox="0 0 120 120" role="img" aria-label="Distribuição dos itens por categoria">
          <circle
            className="pp-donut__track"
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

      <div className="pp-donut__legend">
        {values.map((item) => {
          const percentual = sum > 0 ? Math.round((item.total / sum) * 100) : 0
          return (
            <div key={item.key} className="pp-donut__legend-row">
              <span className="pp-donut__dot" style={{ background: item.color }} />
              <span className="pp-donut__legend-label">{item.label}</span>
              <strong>{percentual}%</strong>
            </div>
          )
        })}
      </div>

      <p className="pp-donut__caption">Baseado no valor total dos itens desejados</p>
    </div>
  )
}
