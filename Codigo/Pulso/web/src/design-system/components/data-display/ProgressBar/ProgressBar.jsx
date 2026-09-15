import { cn } from '../../../utils/cn.js'
import {
  getProgressFillPercent,
  getProgressPercent,
  getHealthLabel,
  resolveProgressVariant,
} from '../../../utils/progressUtils.js'
import { progressBarFillVariants, progressBarTrackVariants } from './ProgressBar.styles.jsx'

/**
 * ProgressBar — barra de progresso linear
 *
 * @param {number} value
 * @param {number} [max=100]
 * @param {'primary'|'success'|'warning'|'danger'|'info'} [variant='primary']
 * @param {'variant'|'health'} [colorMode='variant'] — health aplica cor por faixa (0–30 crítico…)
 * @param {'sm'|'md'|'lg'} [size='md'] — 4px / 8px / 12px
 * @param {boolean} [showLabel] — % à direita da barra
 * @param {string} [label] — texto acima à esquerda (ex: "R$ 1.407 de R$ 2.100")
 * @param {string} [helperText] — texto abaixo à direita (ex: "Faltam 550 XP")
 * @param {'default'|'labeled'|'xp'} [layout='default']
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  colorMode = 'variant',
  size = 'md',
  showLabel = false,
  label,
  helperText,
  layout = 'default',
  className,
  id,
}) => {
  const percent = getProgressPercent(value, max)
  const fillPercent = getProgressFillPercent(value, max)
  const resolvedVariant = resolveProgressVariant({ value, max, variant, colorMode })
  const displayPercent = Math.round(percent)
  const healthLabel = colorMode === 'health' ? getHealthLabel(percent) : null

  const barRow = (
    <div className={cn('flex items-center gap-3', layout === 'xp' && 'w-full')}>
      <div
        className={cn(progressBarTrackVariants({ size }), 'flex-1 min-w-0')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-labelledby={label ? `${id}-label` : undefined}
      >
        <div
          className={progressBarFillVariants({ variant: resolvedVariant })}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      {showLabel && layout !== 'xp' && (
        <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--ds-color-text)]">
          {displayPercent}%
        </span>
      )}
    </div>
  )

  if (layout === 'labeled' || layout === 'xp' || label || helperText) {
    return (
      <div className={cn('ds-progress-root w-full', className)}>
        {(label || (showLabel && layout === 'labeled')) && (
          <div className="mb-2 flex items-baseline justify-between gap-2">
            {label && (
              <span
                id={id ? `${id}-label` : undefined}
                className="text-sm text-[var(--ds-color-text-secondary)]"
              >
                {label}
              </span>
            )}
            {showLabel && layout === 'labeled' && (
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--ds-color-text)]">
                {displayPercent}%
              </span>
            )}
          </div>
        )}
        {barRow}
        {(helperText || healthLabel) && (
          <div className="mt-1.5 flex justify-between gap-2 text-xs text-[var(--ds-color-text-secondary)]">
            {healthLabel && (
              <span className={cn('font-medium', `ds-progress-label--${resolvedVariant}`)}>
                {healthLabel}
              </span>
            )}
            {helperText && <span className="ml-auto">{helperText}</span>}
          </div>
        )}
        {showLabel && layout === 'xp' && (
          <p className="mt-1 text-center text-xs font-semibold tabular-nums text-[var(--ds-color-text-secondary)]">
            {displayPercent}%
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('ds-progress-root w-full', className)}>
      {barRow}
    </div>
  )
}
