import { AlertTriangle } from 'lucide-react'
import { formatComprometimentoPercentual } from '@/utils/purchasePlanningUtils.js'

export function PurchasePlanningAlert({ mediaImpactoRenda }) {
  const percentual = Math.min(100, Math.max(0, Number(mediaImpactoRenda ?? 0)))
  const ringRadius = 26
  const circumference = 2 * Math.PI * ringRadius
  const dash = (percentual / 100) * circumference

  return (
    <div className="pp-alert" role="alert">
      <span className="pp-alert__icon" aria-hidden>
        <AlertTriangle size={18} />
      </span>
      <div className="pp-alert__content">
        <strong>Suas parcelas atuais comprometem {formatComprometimentoPercentual(percentual)} da sua renda.</strong>
        <p>Cuidado ao assumir novas parcelas — revise prioridades antes de comprar.</p>
      </div>
      <div className="pp-alert__ring" aria-hidden>
        <svg viewBox="0 0 64 64">
          <circle
            className="pp-alert__ring-track"
            cx="32"
            cy="32"
            r={ringRadius}
            fill="none"
            strokeWidth="6"
          />
          <circle
            className="pp-alert__ring-fill"
            cx="32"
            cy="32"
            r={ringRadius}
            fill="none"
            strokeWidth="6"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
          />
        </svg>
        <span className="pp-alert__ring-value">{formatComprometimentoPercentual(percentual)}</span>
      </div>
    </div>
  )
}
