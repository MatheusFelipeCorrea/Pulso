import { Shield, Wallet } from 'lucide-react'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { TRIP_EXPENSE_CATEGORY_COLORS } from '@/utils/tripExpenseCategories.js'
import { formatTripRateUpdatedAt } from '@/utils/tripDetailUtils.js'
import { TripDetailCategoryBadge } from './TripDetailCategoryBadge.jsx'
import { TripOriginPicker } from './TripOriginPicker.jsx'
import { TripTransportPriceInsights } from './TripTransportPriceInsights.jsx'

function formatForeignAmount(value, moeda) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'

  if (moeda === 'BRL') {
    return formatCurrency(amount)
  }

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: moeda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function TripDetailSummarySidebar({
  moeda,
  totalBrl,
  totalMoeda,
  rateBid,
  rateUpdatedAt,
  breakdown = [],
  mediaPassagem = null,
  mediaPassagemLoading = false,
  tripOriginId,
  tripOriginOptions = [],
  onTripOriginChange,
}) {
  const rateLabel =
    moeda === 'BRL'
      ? '1 BRL = 1,00 BRL'
      : Number.isFinite(Number(rateBid))
        ? `1 ${moeda} = ${formatCurrency(rateBid)}`
        : 'Cotação indisponível'

  const updatedLabel = formatTripRateUpdatedAt(rateUpdatedAt)

  return (
    <aside className="trip-detail-page__sidebar">
      <section className="trip-detail-page__card trip-detail-page__summary-panel">
        <div className="trip-detail-page__summary-head">
          <Wallet size={18} aria-hidden />
          <h2>Resumo da viagem</h2>
        </div>

        <div className="trip-detail-page__summary-totals">
          <div>
            <span>Total na moeda ({moeda})</span>
            <strong className="is-primary">{formatForeignAmount(totalMoeda, moeda)}</strong>
          </div>
          <div>
            <span>Total convertido (BRL)</span>
            <strong className="is-success">{formatCurrency(totalBrl)}</strong>
          </div>
        </div>

        <div className="trip-detail-page__rate-block">
          <span className="trip-detail-page__rate-label">Cotação utilizada</span>
          <div className="trip-detail-page__rate-row">
            <strong>{rateLabel}</strong>
            <span className="trip-detail-page__rate-badge">{moeda}</span>
          </div>
          {updatedLabel ? (
            <span className="trip-detail-page__rate-updated">Atualizado em {updatedLabel}</span>
          ) : null}
        </div>

        <TripOriginPicker
          value={tripOriginId}
          onChange={onTripOriginChange}
          options={tripOriginOptions}
          disabled={mediaPassagemLoading}
        />

        <TripTransportPriceInsights loading={mediaPassagemLoading} data={mediaPassagem} />

        {breakdown.length > 0 ? (
          <>
            <div className="trip-detail-page__divider" role="separator" />
            <h3 className="trip-detail-page__breakdown-title">Breakdown por categoria</h3>
            <ul className="trip-detail-page__breakdown-list">
              {breakdown.map((item) => (
                <li key={item.categoria}>
                  <div className="trip-detail-page__breakdown-head">
                    <TripDetailCategoryBadge categoria={item.categoria} label={item.label} />
                    <strong>{item.percentual.toFixed(1).replace('.', ',')}%</strong>
                  </div>
                  <div
                    className="trip-detail-page__breakdown-bar-wrap"
                    style={{
                      '--trip-breakdown-color':
                        TRIP_EXPENSE_CATEGORY_COLORS[item.categoria] ?? 'var(--ds-color-primary)',
                    }}
                  >
                    <ProgressBar
                      value={item.percentual}
                      max={100}
                      size="sm"
                      className="trip-detail-page__breakdown-bar"
                    />
                  </div>
                  <small>{formatCurrency(item.valor)}</small>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="trip-detail-page__breakdown-note">
          <Shield size={13} aria-hidden />
          As cotações são atualizadas automaticamente com dados do mercado.
        </p>
      </section>
    </aside>
  )
}
