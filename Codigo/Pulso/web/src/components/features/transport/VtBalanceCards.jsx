import {
  ArrowDown,
  ArrowUp,
  Bus,
  Hourglass,
  Ticket,
  Wallet,
} from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { Skeleton } from '@/design-system/components/feedback/Skeleton/Skeleton.jsx'
import { calcularResetVt, formatDateBR } from '@/utils/transportUtils.js'

function Metric({
  icon: Icon,
  iconClass,
  label,
  value,
  subtext,
  loading,
  iconSolid = false,
  className = '',
}) {
  if (loading) {
    return (
      <div className={`vt-metric ${className}`.trim()}>
        <Skeleton variant="circle" className="vt-metric__skeleton-icon" />
        <Skeleton variant="text" className="!w-20 !mx-auto" />
        <Skeleton variant="text" className="!w-24 !h-7 !mx-auto" />
        <Skeleton variant="text" className="!w-28 !mx-auto" />
      </div>
    )
  }

  return (
    <div className={`vt-metric ${className}`.trim()}>
      <div
        className={`vt-metric__icon ${iconClass}${iconSolid ? ' vt-metric__icon--solid' : ''}`}
        aria-hidden
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="vt-metric__label">{label}</p>
      <p className="vt-metric__value">{value}</p>
      {subtext ? <p className="vt-metric__sub">{subtext}</p> : null}
    </div>
  )
}

function VtResetCountdownCard({ proximaRecarga, periodo, loading }) {
  if (loading) {
    return (
      <div className="vt-balance-card vt-balance-card--next">
        <Skeleton variant="text" className="!w-32" />
        <Skeleton variant="text" className="!w-40 !h-8" />
        <Skeleton variant="text" className="!w-full !h-8" />
        <Skeleton variant="text" className="!w-44" />
      </div>
    )
  }

  const reset = proximaRecarga ?? calcularResetVt(periodo)
  const progresso = reset.progresso ?? 0

  return (
    <div className="vt-balance-card vt-balance-card--next">
      <h3 className="vt-balance-card__title vt-balance-card__title--next">
        <Hourglass size={18} aria-hidden />
        Próxima recarga
      </h3>

      <p className="vt-next-sale__status">
        <Hourglass size={16} aria-hidden className="vt-next-sale__status-icon" />
        {reset.status}
      </p>

      {reset.isMesAtual !== false ? (
        <div
          className="vt-countdown-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
          aria-label={`Progresso até a recarga: ${progresso}%`}
        >
          <div className="vt-countdown-bar__fill" style={{ width: `${Math.max(progresso, progresso > 0 ? 8 : 0)}%` }}>
            {progresso >= 15 ? (
              <span className="vt-countdown-bar__label">{progresso}%</span>
            ) : null}
          </div>
          {progresso < 15 && progresso > 0 ? (
            <span className="vt-countdown-bar__label vt-countdown-bar__label--outside">
              {progresso}%
            </span>
          ) : null}
        </div>
      ) : null}

      <p className="vt-next-sale__date">
        Data da próxima recarga:{' '}
        <strong className="vt-next-sale__date-value">
          {formatDateBR(reset.dataReset)}
        </strong>
      </p>
    </div>
  )
}

export function VtBalanceCards({ saldo, periodo, loading }) {
  const passagens = saldo?.passagensUsadas ?? 0

  return (
    <div className="vt-balance-grid">
      <div className="vt-balance-card vt-balance-card--main">
        <h3 className="vt-balance-card__title vt-balance-card__title--main">
          <Bus size={18} aria-hidden />
          Saldo do mês
        </h3>
        <div className="vt-metrics-row">
          <div className="vt-metrics-row__group">
            <Metric
              loading={loading}
              icon={ArrowDown}
              iconClass="vt-metric__icon--accent"
              label="Recebido"
              value={formatCurrency(Number(saldo?.recebido ?? 0))}
              subtext="Valor recebido este mês"
            />
            <Metric
              loading={loading}
              icon={Ticket}
              iconClass="vt-metric__icon--accent"
              label="Usado"
              value={formatCurrency(Number(saldo?.usado ?? 0))}
              subtext={`${passagens} passagen${passagens === 1 ? '' : 's'}`}
            />
            <Metric
              loading={loading}
              icon={ArrowUp}
              iconClass="vt-metric__icon--accent"
              label="Vendido (nominal)"
              value={formatCurrency(Number(saldo?.vendidoNominal ?? 0))}
              subtext="Valor nominal total"
            />
          </div>
          <Metric
            loading={loading}
            icon={Wallet}
            iconClass="vt-metric__icon--accent"
            label="Saldo restante"
            value={formatCurrency(Number(saldo?.saldoRestante ?? 0))}
            subtext="Disponível para uso"
            iconSolid
            className="vt-metric--total"
          />
        </div>
      </div>

      <VtResetCountdownCard
        proximaRecarga={saldo?.proximaRecarga}
        periodo={periodo}
        loading={loading}
      />
    </div>
  )
}
