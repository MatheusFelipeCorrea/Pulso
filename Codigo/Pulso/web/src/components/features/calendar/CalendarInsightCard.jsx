import { ArrowDown, ArrowLeftRight, ArrowUp, Bot, List } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'

const METRIC_ICONS = {
  green: ArrowUp,
  red: ArrowDown,
  purple: ArrowLeftRight,
  blue: List,
}

function normalizeVariacao(variacao) {
  if (variacao?.tipo) return variacao
  if (variacao == null || Number.isNaN(variacao)) return null
  if (typeof variacao === 'number') {
    if (variacao === 0) return { tipo: 'igual' }
    return { tipo: 'percentual', valor: variacao }
  }
  return null
}

function formatVariacao(variacao) {
  const normalized = normalizeVariacao(variacao)
  if (!normalized?.tipo) return null

  switch (normalized.tipo) {
    case 'igual':
      return { text: 'Igual ao mês anterior', neutral: true }
    case 'sem_base':
      return { text: 'Sem lançamentos no mês anterior', neutral: true }
    case 'valor_novo':
      return {
        text: `↑ ${formatCurrency(normalized.valor)} vs mês anterior`,
        positivo: normalized.valor > 0,
      }
    case 'percentual': {
      const positivo = normalized.valor > 0
      return {
        text: `${positivo ? '↑' : '↓'} ${Math.abs(normalized.valor)}% vs mês anterior`,
        positivo,
      }
    }
    case 'contagem': {
      const positivo = normalized.valor > 0
      return {
        text: positivo
          ? `↑ ${normalized.valor} a mais que mês anterior`
          : `↓ ${Math.abs(normalized.valor)} a menos que mês anterior`,
        positivo,
      }
    }
    default:
      return null
  }
}

function MetricCell({ label, value, variacao, tone }) {
  const Icon = METRIC_ICONS[tone]
  const delta = formatVariacao(variacao)

  return (
    <div className={`calendar-insight__metric calendar-insight__metric--${tone}`}>
      <div className="calendar-insight__metric-head">
        <div className="calendar-insight__metric-icon" aria-hidden>
          <Icon size={16} strokeWidth={2.25} />
        </div>
        <p className="calendar-insight__metric-label">{label}</p>
      </div>
      <p className="calendar-insight__metric-value">{value}</p>
      {delta ? (
        <span
          className={`calendar-insight__metric-delta${
            delta.neutral ? ' calendar-insight__metric-delta--neutral' : ''
          }`}
        >
          {delta.text}
        </span>
      ) : null}
    </div>
  )
}

export function CalendarInsightCard({ resumo, loading, monthDate }) {
  const tituloMes = monthDate
    ? format(monthDate, 'MMMM/yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase())
    : ''

  if (loading) {
    return (
      <section className="calendar-insight calendar-insight--loading">
        <SpinnerDots center label="Carregando resumo..." />
      </section>
    )
  }

  return (
    <section className="calendar-insight">
      <header className="calendar-insight__header">
        <h2>Resumo de {tituloMes}</h2>
        <span className="calendar-insight__mascot" aria-hidden>
          <Bot size={28} strokeWidth={1.75} />
        </span>
      </header>

      <div className="calendar-insight__ai-slot">
        <p className="calendar-insight__ai-placeholder">
          <strong>Insights com IA em breve.</strong> Aqui você verá um resumo automático dos seus
          hábitos financeiros do mês. Por enquanto, acompanhe os números abaixo.
        </p>
      </div>

      <div className="calendar-insight__metrics">
        <MetricCell
          label="Receitas"
          value={formatCurrency(resumo?.receitasTotal ?? 0)}
          variacao={resumo?.variacaoReceitas}
          tone="green"
        />
        <MetricCell
          label="Despesas"
          value={formatCurrency(resumo?.despesasTotal ?? 0)}
          variacao={resumo?.variacaoDespesas}
          tone="red"
        />
        <MetricCell
          label="Saldo"
          value={formatCurrency(resumo?.saldo ?? 0)}
          variacao={resumo?.variacaoSaldo}
          tone="purple"
        />
        <MetricCell
          label="Transações"
          value={resumo?.totalTransacoes ?? 0}
          variacao={resumo?.variacaoTransacoes}
          tone="blue"
        />
      </div>

    </section>
  )
}
