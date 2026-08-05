import { ArrowDown, ArrowUp, Wallet } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { getBadgeDefinition } from '@/components/badges/badgeCatalog.js'
import { badgeKindFromRecurso } from '@/components/badges/enumMappers.js'

const CARD_CONFIG = {
  receitas: {
    icon: ArrowUp,
    className: 'tx-summary-card--income',
    valueClassName: 'tx-summary-card__value--default',
  },
  despesas: {
    icon: ArrowDown,
    className: 'tx-summary-card--expense',
    valueClassName: 'tx-summary-card__value--default',
  },
  saldo: {
    icon: Wallet,
    className: 'tx-summary-card--balance',
    valueClassName: 'tx-summary-card__value--balance',
  },
}

function SummaryCard({ label, meta, total, loading, tipo }) {
  const config = CARD_CONFIG[tipo]
  const Icon = config.icon

  if (loading) {
    return (
      <div className={`tx-summary-card ${config.className} tx-summary-card--loading`}>
        <SpinnerDots center label={`Carregando ${label.toLowerCase()}...`} />
      </div>
    )
  }

  return (
    <div className={`tx-summary-card ${config.className}`}>
      <div className="tx-summary-card__header">
        <div className="tx-summary-card__content">
          <p className="tx-summary-card__label">{label}</p>
          <p className={`tx-summary-card__value ${config.valueClassName}`}>
            {formatCurrency(Number(total))}
          </p>
          <p className="tx-summary-card__meta">{meta}</p>
        </div>
        <div className="tx-summary-card__icon" aria-hidden>
          <Icon size={20} strokeWidth={2.25} />
        </div>
      </div>
    </div>
  )
}

function nomeRecurso(recurso) {
  const kind = badgeKindFromRecurso(recurso)
  return kind ? getBadgeDefinition(kind)?.label ?? recurso : recurso
}

function buildBeneficioLabels(recurso) {
  const nome = nomeRecurso(recurso)
  return {
    saldo: `Saldo do período (${nome})`,
    entradas: 'Recargas no período',
    saidas: 'Gastos no período',
    entradasMeta: (qtd) => `${qtd} recarga${qtd === 1 ? '' : 's'} no período`,
    saidasMeta: (qtd) => `${qtd} compra${qtd === 1 ? '' : 's'} no período`,
  }
}

function buildContaLabels(recurso) {
  const nome = nomeRecurso(recurso)
  return {
    saldo: `Saldo do período (${nome})`,
    entradas: 'Receitas no período',
    saidas: 'Despesas no período',
    entradasMeta: (qtd) => `${qtd} receita${qtd === 1 ? '' : 's'} no período`,
    saidasMeta: (qtd) => `${qtd} despesa${qtd === 1 ? '' : 's'} no período`,
  }
}

function buildTodosLabels() {
  return {
    saldo: 'Saldo do período',
    entradas: 'Receitas no período',
    saidas: 'Despesas no período',
    entradasMeta: (qtd) => `${qtd} receita${qtd === 1 ? '' : 's'} no período`,
    saidasMeta: (qtd) => `${qtd} despesa${qtd === 1 ? '' : 's'} no período`,
  }
}

export function TransactionSummaryCards({ resumo, loading, recursoFiltro }) {
  const modoBeneficio = resumo?.modo === 'beneficio'
  const modoConta = resumo?.modo === 'conta'
  const modoCarteira = resumo?.modo === 'carteira'
  const modoAcumulado = modoBeneficio || modoConta || modoCarteira
  const recurso = recursoFiltro ?? resumo?.recursoCarteira ?? null

  if (modoAcumulado) {
    const labels = recurso
      ? modoBeneficio
        ? buildBeneficioLabels(recurso)
        : buildContaLabels(recurso)
      : buildTodosLabels()
    const qtdEntradas = resumo?.receitas?.quantidade ?? 0
    const qtdSaidas = resumo?.despesas?.quantidade ?? 0
    const saldoInicial = Number(resumo?.saldoInicialPeriodo ?? 0)
    const saldoMeta =
      saldoInicial > 0.009
        ? `inclui ${formatCurrency(saldoInicial)} do período anterior`
        : saldoInicial < -0.009
          ? `${formatCurrency(Math.abs(saldoInicial))} de saldo negativo anterior`
          : modoCarteira && !recurso
            ? 'saldo acumulado ao fim do período (todos os recursos)'
            : 'saldo acumulado ao fim do período filtrado'

    return (
      <div className="tx-summary-grid">
        <SummaryCard
          tipo="saldo"
          label={labels.saldo}
          total={resumo?.saldo ?? 0}
          meta={saldoMeta}
          loading={loading}
        />
        <SummaryCard
          tipo="receitas"
          label={labels.entradas}
          total={resumo?.receitas?.total ?? 0}
          meta={labels.entradasMeta(qtdEntradas)}
          loading={loading}
        />
        <SummaryCard
          tipo="despesas"
          label={labels.saidas}
          total={resumo?.despesas?.total ?? 0}
          meta={labels.saidasMeta(qtdSaidas)}
          loading={loading}
        />
      </div>
    )
  }

  const qtdReceitas = resumo?.receitas?.quantidade ?? 0
  const qtdDespesas = resumo?.despesas?.quantidade ?? 0

  return (
    <div className="tx-summary-grid">
      <SummaryCard
        tipo="saldo"
        label="Saldo do período"
        total={resumo?.saldo ?? 0}
        meta="receitas − despesas no período"
        loading={loading}
      />
      <SummaryCard
        tipo="receitas"
        label="Receitas"
        total={resumo?.receitas?.total ?? 0}
        meta={`${qtdReceitas} lançamento${qtdReceitas === 1 ? '' : 's'} no período`}
        loading={loading}
      />
      <SummaryCard
        tipo="despesas"
        label="Despesas"
        total={resumo?.despesas?.total ?? 0}
        meta={`${qtdDespesas} lançamento${qtdDespesas === 1 ? '' : 's'} no período`}
        loading={loading}
      />
    </div>
  )
}
