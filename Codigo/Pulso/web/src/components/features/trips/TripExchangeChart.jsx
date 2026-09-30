import { useEffect, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { buildCurrencySelectOptions } from '@/components/features/trips/CurrencyFlag.jsx'
import * as moedaService from '@/services/moedaService.js'

const PERIODS = [
  { key: 7, label: '7d' },
  { key: 30, label: '30d' },
  { key: 90, label: '90d' },
]

function formatChartDate(isoDate) {
  if (!isoDate) return ''
  try {
    return format(parseISO(isoDate), 'd MMM', { locale: ptBR })
  } catch {
    return isoDate
  }
}

function formatTooltipDate(isoDate) {
  if (!isoDate) return ''
  try {
    return format(parseISO(isoDate), 'dd/MM', { locale: ptBR })
  } catch {
    return isoDate
  }
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const point = payload[0]
  const date = point?.payload?.date

  return (
    <div className="trips-chart__tooltip">
      <span className="trips-chart__tooltip-label">{date ? formatTooltipDate(date) : ''}</span>
      <strong className="trips-chart__tooltip-value">{formatCurrency(point.value)}</strong>
    </div>
  )
}

export function TripExchangeChart({ catalog = [] }) {
  const foreign = useMemo(
    () => catalog.filter((item) => item.code !== 'BRL'),
    [catalog]
  )
  const [codigo, setCodigo] = useState('USD')
  const [dias, setDias] = useState(30)
  const [historico, setHistorico] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const options = useMemo(() => buildCurrencySelectOptions(foreign), [foreign])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    moedaService
      .obterHistorico({ codigo, dias })
      .then((data) => {
        if (!active) return
        setHistorico(data)
      })
      .catch((err) => {
        if (!active) return
        setHistorico(null)
        setError(err.response?.data?.message ?? 'Não foi possível carregar o histórico.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [codigo, dias])

  const chartData = useMemo(
    () =>
      historico?.pontos?.map((point) => ({
        date: point.date,
        dateLabel: formatChartDate(point.date),
        bid: point.bid,
      })) ?? [],
    [historico]
  )

  const hasChartData = chartData.length > 1

  return (
    <section className="trips-chart">
      <div className="trips-chart__head">
        <h2>Histórico de cotação</h2>
        <Select
          className="trips-chart__select"
          value={codigo}
          onChange={setCodigo}
          options={options}
        />
      </div>

      <div className="trips-chart__tabs" role="tablist" aria-label="Período do histórico">
        {PERIODS.map((period) => (
          <button
            key={period.key}
            type="button"
            role="tab"
            aria-selected={dias === period.key}
            className={dias === period.key ? 'is-active' : ''}
            onClick={() => setDias(period.key)}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="trips-chart__canvas">
        {loading ? (
          <p className="trips-chart__loading">Carregando histórico...</p>
        ) : error ? (
          <p className="trips-chart__error">{error}</p>
        ) : !hasChartData ? (
          <p className="trips-chart__error">Histórico indisponível para esta moeda.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tripRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ds-color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--ds-color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--ds-color-border)" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11 }}
                stroke="var(--ds-color-text-secondary)"
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="var(--ds-color-text-secondary)"
                domain={['auto', 'auto']}
                tickFormatter={(value) =>
                  Number(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: 'var(--ds-color-primary)',
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
                wrapperStyle={{ outline: 'none', zIndex: 2 }}
                contentStyle={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                }}
                labelStyle={{ display: 'none' }}
                itemStyle={{ display: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="bid"
                stroke="var(--ds-color-primary)"
                fill="url(#tripRateGradient)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--ds-color-primary)', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: 'var(--ds-color-primary)', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {historico?.resumo ? (
        <dl className="trips-chart__stats">
          <div>
            <dt>Cotação atual</dt>
            <dd>{formatCurrency(historico.resumo.atual)}</dd>
          </div>
          <div>
            <dt>Mínima ({dias}d)</dt>
            <dd>{formatCurrency(historico.resumo.minima)}</dd>
          </div>
          <div>
            <dt>Máxima ({dias}d)</dt>
            <dd>{formatCurrency(historico.resumo.maxima)}</dd>
          </div>
          <div>
            <dt>Variação ({dias}d)</dt>
            <dd className={Number(historico.resumo.variacao) >= 0 ? 'is-up' : 'is-down'}>
              {Number(historico.resumo.variacao) >= 0 ? '+' : ''}
              {historico.resumo.variacao}%
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="trips-chart__note">
        As cotações são atualizadas automaticamente com dados do mercado (AwesomeAPI), com cache de 5 minutos.
      </p>
    </section>
  )
}
