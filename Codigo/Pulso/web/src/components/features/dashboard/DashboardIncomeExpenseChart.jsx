import { useMemo } from 'react'
import { addMonths, format, parseISO, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { MonthPicker } from '@/design-system/components/pickers/MonthPicker/MonthPicker.jsx'
import { useTheme } from '@/design-system/hooks/useTheme.js'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import {
  monthPickerParaPeriodo,
  periodoParaMonthPicker,
} from '@/utils/transactionRecurrence.js'

const CHART_THEME = {
  light: {
    tick: '#71717A',
    grid: '#E4E4E7',
    cursor: '#A1A1AA',
    incomeStroke: '#16A34A',
    incomeFillTop: 0.28,
    expenseStroke: '#DC2626',
    expenseFillTop: 0.22,
    activeDotStroke: '#FFFFFF',
  },
  dark: {
    tick: '#D4D4D8',
    grid: '#3F3F46',
    cursor: '#71717A',
    incomeStroke: '#34D399',
    incomeFillTop: 0.4,
    expenseStroke: '#F87171',
    expenseFillTop: 0.35,
    activeDotStroke: '#18181B',
  },
}

export function currentDashboardPeriodo() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}


function formatDiaLabel(dia) {
  try {
    return format(parseISO(`${dia}T12:00:00`), 'd/M', { locale: ptBR })
  } catch {
    return dia
  }
}

function formatDiaTooltip(dia) {
  try {
    return format(parseISO(`${dia}T12:00:00`), "dd 'de' MMMM", { locale: ptBR })
  } catch {
    return dia
  }
}

function formatAxisCurrency(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 'R$\u00A00'

  const abs = Math.abs(n)
  if (abs >= 1000) {
    const k = abs / 1000
    const formatted = Number.isInteger(k)
      ? String(k)
      : k.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
    return `R$\u00A0${formatted}k`
  }

  return `R$\u00A0${abs.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function round2(n) {
  return Math.round(Number(n) * 100) / 100
}

function buildSerieCompleta(serie, periodo) {
  if (!periodo || !/^\d{4}-\d{2}$/.test(periodo)) return serie

  const [year, month] = periodo.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const map = Object.fromEntries(serie.map((item) => [item.dia, item]))

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const dia = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return map[dia] ?? { dia, receitas: 0, despesas: 0 }
  })
}

function buildSerieSemanal(serieDiaria) {
  if (serieDiaria.length <= 14) return serieDiaria

  const buckets = []
  for (let i = 0; i < serieDiaria.length; i += 7) {
    const chunk = serieDiaria.slice(i, i + 7)
    if (!chunk.length) continue

    buckets.push({
      dia: chunk[0].dia,
      diaFim: chunk[chunk.length - 1].dia,
      receitas: round2(chunk.reduce((sum, item) => sum + item.receitas, 0)),
      despesas: round2(chunk.reduce((sum, item) => sum + item.despesas, 0)),
    })
  }

  return buckets
}

function formatPeriodoLabel(item) {
  if (item.diaFim && item.diaFim !== item.dia) {
    return `${formatDiaLabel(item.dia)} – ${formatDiaLabel(item.diaFim)}`
  }
  return formatDiaLabel(item.dia)
}

function IncomeExpenseTooltip({ active, payload, label, isWeekly }) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload
  const receitas = Number(payload.find((p) => p.dataKey === 'receitas')?.value ?? 0)
  const despesas = Number(payload.find((p) => p.dataKey === 'despesas')?.value ?? 0)

  const titulo = isWeekly && point?.diaFim
    ? `${formatDiaTooltip(point.dia)} – ${formatDiaTooltip(point.diaFim)}`
    : formatDiaTooltip(label)

  return (
    <div className="dashboard-flow-chart__tooltip">
      <span className="dashboard-flow-chart__tooltip-date">{titulo}</span>
      <div className="dashboard-flow-chart__tooltip-row dashboard-flow-chart__tooltip-row--income">
        <span>Receitas</span>
        <strong>{formatCurrency(receitas)}</strong>
      </div>
      <div className="dashboard-flow-chart__tooltip-row dashboard-flow-chart__tooltip-row--expense">
        <span>Despesas</span>
        <strong>{formatCurrency(despesas)}</strong>
      </div>
    </div>
  )
}

function DashboardChartMonthNav({ periodo, onChangePeriodo, disabled }) {
  const monthDate = parseISO(`${periodo}-01T12:00:00`)
  const isCurrentMonth = periodo === currentDashboardPeriodo()

  const goPrev = () => {
    const prev = subMonths(monthDate, 1)
    onChangePeriodo?.(
      monthPickerParaPeriodo({ year: prev.getFullYear(), month: prev.getMonth() + 1 })
    )
  }

  const goNext = () => {
    if (isCurrentMonth) return
    const next = addMonths(monthDate, 1)
    onChangePeriodo?.(
      monthPickerParaPeriodo({ year: next.getFullYear(), month: next.getMonth() + 1 })
    )
  }

  return (
    <div className="dashboard-flow-chart__period-controls">
      <nav className="dashboard-flow-chart__month-bar" aria-label="Período do gráfico">
        <button
          type="button"
          className="dashboard-flow-chart__month-arrow"
          onClick={goPrev}
          disabled={disabled}
          aria-label="Mês anterior"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        <MonthPicker
          className="dashboard-flow-chart__month-picker"
          value={periodoParaMonthPicker(periodo)}
          onChange={(value) => onChangePeriodo?.(monthPickerParaPeriodo(value))}
          monthDisplay="compact"
          disableFuture
          disabled={disabled}
        />

        <button
          type="button"
          className="dashboard-flow-chart__month-arrow"
          onClick={goNext}
          disabled={disabled || isCurrentMonth}
          aria-label="Próximo mês"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </nav>
    </div>
  )
}

export function DashboardIncomeExpenseChart({ data, loading, periodo, onChangePeriodo }) {
  const { theme } = useTheme()
  const palette = CHART_THEME[theme === 'dark' ? 'dark' : 'light']

  const { chartSerie, isWeekly } = useMemo(() => {
    const diaria = buildSerieCompleta(data?.serie ?? [], periodo)
    const semanal = buildSerieSemanal(diaria)
    return {
      chartSerie: semanal,
      isWeekly: semanal.length !== diaria.length,
    }
  }, [data?.serie, periodo])

  const receitasTotal = Number(data?.receitasTotal ?? 0)
  const despesasTotal = Number(data?.despesasTotal ?? 0)
  const hasMovement = chartSerie.some((item) => item.receitas > 0 || item.despesas > 0)

  return (
    <section className="dashboard-card dashboard-card--chart dashboard-flow-chart">
      <header className="dashboard-flow-chart__header">
        <div className="dashboard-flow-chart__toolbar">
          <h2 className="dashboard-flow-chart__title">Receitas x Despesas</h2>

          <div className="dashboard-flow-chart__actions">
            <DashboardChartMonthNav
              periodo={periodo}
              onChangePeriodo={onChangePeriodo}
              disabled={loading}
            />

            <Link to="/transactions" className="dashboard-card__link">
              Ver relatório
            </Link>
          </div>
        </div>

        <div className="dashboard-flow-chart__metrics" aria-busy={loading}>
          <div className="dashboard-flow-chart__metric dashboard-flow-chart__metric--income">
            <span className="dashboard-flow-chart__metric-dot" aria-hidden />
            <span className="dashboard-flow-chart__metric-label">Receitas</span>
            <strong>{loading ? '—' : formatCurrency(receitasTotal)}</strong>
          </div>

          <span className="dashboard-flow-chart__metrics-divider" aria-hidden />

          <div className="dashboard-flow-chart__metric dashboard-flow-chart__metric--expense">
            <span className="dashboard-flow-chart__metric-dot" aria-hidden />
            <span className="dashboard-flow-chart__metric-label">Despesas</span>
            <strong>{loading ? '—' : formatCurrency(despesasTotal)}</strong>
          </div>
        </div>
      </header>

      <div className="dashboard-flow-chart__canvas">
        {loading ? (
          <SpinnerDots center label="Carregando gráfico..." />
        ) : !hasMovement ? (
          <p className="dashboard-empty-inline">Sem movimentação neste mês.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartSerie} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.incomeStroke} stopOpacity={palette.incomeFillTop} />
                  <stop offset="100%" stopColor={palette.incomeStroke} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashboardExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.expenseStroke} stopOpacity={palette.expenseFillTop} />
                  <stop offset="100%" stopColor={palette.expenseStroke} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={palette.grid} vertical={false} strokeDasharray="4 6" />

              <XAxis
                dataKey="dia"
                tickFormatter={(dia, index) => formatPeriodoLabel(chartSerie[index] ?? { dia })}
                tick={{ fill: palette.tick, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
                dy={8}
              />

              <YAxis
                tick={{ fill: palette.tick, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxisCurrency}
                width={66}
              />

              <Tooltip
                content={<IncomeExpenseTooltip isWeekly={isWeekly} />}
                cursor={{ stroke: palette.cursor, strokeWidth: 1, strokeDasharray: '4 4' }}
                wrapperStyle={{ outline: 'none', zIndex: 2 }}
                contentStyle={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                }}
              />

              <Area
                type="monotone"
                dataKey="despesas"
                name="Despesas"
                stroke={palette.expenseStroke}
                fill="url(#dashboardExpenseGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: palette.expenseStroke,
                  stroke: palette.activeDotStroke,
                  strokeWidth: 2,
                }}
              />

              <Area
                type="monotone"
                dataKey="receitas"
                name="Receitas"
                stroke={palette.incomeStroke}
                fill="url(#dashboardIncomeGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: palette.incomeStroke,
                  stroke: palette.activeDotStroke,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {!loading && hasMovement ? (
        <div className="dashboard-flow-chart__footer">
          <div className="dashboard-flow-chart__legend" aria-hidden>
            <span className="dashboard-flow-chart__legend-item dashboard-flow-chart__legend-item--income">
              Receitas
            </span>
            <span className="dashboard-flow-chart__legend-item dashboard-flow-chart__legend-item--expense">
              Despesas
            </span>
          </div>
          {isWeekly ? (
            <span className="dashboard-flow-chart__hint">Totais agrupados por semana</span>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
