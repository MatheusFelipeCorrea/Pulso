import { AlertTriangle, CalendarClock, CheckCircle2, XCircle } from 'lucide-react'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  COMPROMETIMENTO_COLORS,
  COMPROMETIMENTO_NIVEL,
  calcComprometimentoParcela,
  formatComprometimentoPercentual,
} from '@/utils/purchasePlanningUtils.js'

const NIVEL_ICON = {
  [COMPROMETIMENTO_NIVEL.SAUDAVEL]: CheckCircle2,
  [COMPROMETIMENTO_NIVEL.ATENCAO]: AlertTriangle,
  [COMPROMETIMENTO_NIVEL.ARRISCADO]: XCircle,
}

const GAUGE_MAX = 40

export function PurchaseInstallmentGauge({ valorEstimado, parcelas, rendaMensal }) {
  const { parcela, percentual, nivel } = calcComprometimentoParcela(
    valorEstimado,
    parcelas,
    rendaMensal
  )
  const tone = COMPROMETIMENTO_COLORS[nivel]
  const StatusIcon = NIVEL_ICON[nivel]
  const markerPosition = Math.min(100, (percentual / GAUGE_MAX) * 100)

  return (
    <div className="pp-form__simulation">
      <div className="pp-form__simulation-box">
        <span className="pp-form__simulation-icon" aria-hidden>
          <CalendarClock size={18} />
        </span>
        <div className="pp-form__simulation-copy">
          <strong>
            {parcelas}x de {formatCurrency(parcela)}
          </strong>
          <span>
            Compromete{' '}
            <strong style={{ color: tone }}>{formatComprometimentoPercentual(percentual)}</strong>{' '}
            da sua renda mensal
          </span>
        </div>
        <span className="pp-form__simulation-status" style={{ color: tone }} aria-hidden>
          <StatusIcon size={18} />
        </span>
      </div>

      <div className="pp-form__gauge">
        <span className="pp-form__gauge-label">Nível de comprometimento</span>
        <div className="pp-form__gauge-track">
          <span
            className="pp-form__gauge-marker"
            style={{ left: `${markerPosition}%` }}
          >
            <span className="pp-form__gauge-marker-tooltip">
              {formatComprometimentoPercentual(percentual)}
            </span>
          </span>
        </div>
        <div className="pp-form__gauge-legend">
          <span className="pp-form__gauge-legend-item pp-form__gauge-legend-item--saudavel">
            <CheckCircle2 size={14} aria-hidden />
            <span>
              <strong>Até 20%</strong>
              <small>Saudável</small>
            </span>
          </span>
          <span className="pp-form__gauge-legend-item pp-form__gauge-legend-item--atencao">
            <AlertTriangle size={14} aria-hidden />
            <span>
              <strong>21% a 30%</strong>
              <small>Atenção</small>
            </span>
          </span>
          <span className="pp-form__gauge-legend-item pp-form__gauge-legend-item--arriscado">
            <XCircle size={14} aria-hidden />
            <span>
              <strong>Acima de 30%</strong>
              <small>Arriscado</small>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
