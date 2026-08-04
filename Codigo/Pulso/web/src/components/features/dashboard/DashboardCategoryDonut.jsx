import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

const TOP_N = 5
const OUTROS_COLOR = '#6366f1'
const OUTROS_ID = 'outros'
const CHART_SIZE = 200
const CHART_CENTER = CHART_SIZE / 2
const CHART_RADIUS = 70
const CHART_STROKE = 18
const SEGMENT_GAP = 4

function round1(n) {
  return Math.round(Number(n) * 10) / 10
}

function buildDonutData(categorias) {
  const total = categorias.reduce((acc, c) => acc + Number(c.total), 0)
  if (total <= 0) {
    return { chartSegments: [], displaySegments: [], outros: null, restCount: 0, total: 0, topShare: 0 }
  }

  const top = categorias.slice(0, TOP_N)
  const rest = categorias.slice(TOP_N)
  const restTotal = rest.reduce((acc, c) => acc + Number(c.total), 0)

  const chartSegments = top.map((cat) => ({
    id: cat.categoriaId,
    nome: cat.nome,
    icone: cat.icone,
    cor: cat.cor,
    total: Number(cat.total),
    percentual: Number(cat.percentual) || round1((Number(cat.total) / total) * 100),
  }))

  const topShare = round1((chartSegments.reduce((acc, s) => acc + s.total, 0) / total) * 100)

  const outros =
    restTotal > 0
      ? {
          id: OUTROS_ID,
          total: restTotal,
          percentual: round1((restTotal / total) * 100),
          count: rest.length,
          cor: OUTROS_COLOR,
        }
      : null

  const displaySegments =
    outros != null
      ? [
          ...chartSegments,
          {
            id: outros.id,
            nome: 'Outros',
            icone: 'Tag',
            cor: outros.cor,
            total: outros.total,
            percentual: outros.percentual,
          },
        ]
      : chartSegments

  return { chartSegments, displaySegments, outros, restCount: rest.length, total, topShare }
}

function formatDonutCenterTotal(total) {
  const n = Number(total)
  if (!Number.isFinite(n) || n === 0) return 'R$ 0'

  const formatted = formatCurrency(n)
  if (formatted.length <= 12) return formatted

  return `R$ ${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
}

function DonutChart({ segments, total, activeId, onHover }) {
  const circumference = 2 * Math.PI * CHART_RADIUS
  let offset = 0
  const gap = segments.length > 1 ? SEGMENT_GAP : 0

  return (
    <svg
      viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
      role="img"
      aria-label="Distribuição dos principais gastos por categoria"
      onMouseLeave={() => onHover?.(null)}
    >
      <circle
        className="dashboard-donut__track"
        cx={CHART_CENTER}
        cy={CHART_CENTER}
        r={CHART_RADIUS}
        fill="none"
        strokeWidth={CHART_STROKE}
      />

      {segments.map((segment) => {
        const fraction = segment.total / total
        const segmentLength = circumference * fraction
        const visibleLength = gap > 0 ? Math.max(0, segmentLength - gap) : segmentLength
        const dasharray = `${visibleLength} ${circumference - visibleLength}`
        const dashoffset = -offset
        const isActive = !activeId || activeId === segment.id

        offset += segmentLength

        return (
          <circle
            key={segment.id}
            cx={CHART_CENTER}
            cy={CHART_CENTER}
            r={CHART_RADIUS}
            fill="none"
            stroke={segment.cor}
            strokeWidth={isActive && activeId ? CHART_STROKE + 2 : CHART_STROKE}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            opacity={isActive ? 1 : 0.28}
            className="dashboard-donut__segment"
            transform={`rotate(-90 ${CHART_CENTER} ${CHART_CENTER})`}
            onMouseEnter={() => onHover?.(segment.id)}
          />
        )
      })}

      <text x={CHART_CENTER} y={CHART_CENTER - 8} textAnchor="middle" className="dashboard-donut__total-label">
        Gastos
      </text>
      <text x={CHART_CENTER} y={CHART_CENTER + 10} textAnchor="middle" className="dashboard-donut__total-value">
        {formatDonutCenterTotal(total)}
      </text>
    </svg>
  )
}

function DonutLegendRow({ segment, active, onEnter, onLeave }) {
  return (
    <li
      className={`dashboard-donut__legend-row${active ? ' is-active' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span
        className="dashboard-donut__legend-icon"
        style={{
          color: segment.cor,
          background: `color-mix(in srgb, ${segment.cor} 16%, transparent)`,
        }}
        aria-hidden
      >
        {resolveBadgeIcon(segment.icone, { size: 14 })}
      </span>

      <span className="dashboard-donut__legend-name">{segment.nome}</span>

      <strong className="dashboard-donut__legend-value">{formatCurrency(segment.total)}</strong>

      <span
        className="dashboard-donut__legend-pill"
        style={{
          color: segment.cor,
          background: `color-mix(in srgb, ${segment.cor} 14%, transparent)`,
        }}
      >
        {segment.percentual}%
      </span>
    </li>
  )
}

export function DashboardCategoryDonut({ categorias = [], loading }) {
  const [activeId, setActiveId] = useState(null)
  const { chartSegments, displaySegments, outros, restCount, total, topShare } = useMemo(
    () => buildDonutData(categorias),
    [categorias]
  )

  if (loading) {
    return (
      <section className="dashboard-card dashboard-card--chart dashboard-card--donut">
        <SpinnerDots center label="Carregando categorias..." />
      </section>
    )
  }

  return (
    <section className="dashboard-card dashboard-card--chart dashboard-card--donut">
      <header className="dashboard-card__header">
        <div className="dashboard-donut__heading">
          <h2>Gastos por categoria</h2>
          {total > 0 ? (
            <p className="dashboard-donut__subtitle">
              {outros
                ? `Top ${chartSegments.length} somam ${topShare}% · +${restCount} categorias ${outros.percentual}%`
                : `Top ${chartSegments.length} representam ${topShare}% do total`}
            </p>
          ) : null}
        </div>
        <Link to="/budget" className="dashboard-card__link">
          Ver todas categorias
        </Link>
      </header>

      <div className="dashboard-donut">
        <div className="dashboard-donut__visual">
          <div className="dashboard-donut__chart">
            {total > 0 ? (
              <DonutChart
                segments={displaySegments}
                total={total}
                activeId={activeId}
                onHover={setActiveId}
              />
            ) : (
              <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
                <circle
                  className="dashboard-donut__track"
                  cx={CHART_CENTER}
                  cy={CHART_CENTER}
                  r={CHART_RADIUS}
                  fill="none"
                  strokeWidth={CHART_STROKE}
                />
                <text
                  x={CHART_CENTER}
                  y={CHART_CENTER + 4}
                  textAnchor="middle"
                  className="dashboard-donut__empty-label"
                >
                  Sem dados
                </text>
              </svg>
            )}
          </div>
        </div>

        <div className="dashboard-donut__details">
          <ul className="dashboard-donut__legend">
            {chartSegments.length === 0 ? (
              <li className="dashboard-empty-inline">Nenhuma despesa categorizada no mês.</li>
            ) : (
              chartSegments.map((segment) => (
                <DonutLegendRow
                  key={segment.id}
                  segment={segment}
                  active={activeId === segment.id}
                  onEnter={() => setActiveId(segment.id)}
                  onLeave={() => setActiveId(null)}
                />
              ))
            )}
          </ul>

          {outros ? (
            <div
              className={`dashboard-donut__outros${activeId === OUTROS_ID ? ' is-active' : ''}`}
              onMouseEnter={() => setActiveId(OUTROS_ID)}
              onMouseLeave={() => setActiveId(null)}
            >
              <span className="dashboard-donut__outros-label">
                +{restCount} {restCount === 1 ? 'categoria' : 'categorias'}
              </span>
              <strong>{formatCurrency(outros.total)}</strong>
              <span className="dashboard-donut__outros-pill">{outros.percentual}%</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
