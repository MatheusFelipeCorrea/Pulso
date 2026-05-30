import { Pause, AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn.js'
import {
  getProgressFillPercent,
  getProgressPercent,
  getHealthLabel,
  resolveProgressVariant,
} from '../../../utils/progressUtils.js'
import {
  SIZE_PX,
  progressCircleLabelVariants,
  progressCircleVariants,
} from './ProgressCircle.styles.jsx'

const STROKE_RATIO = 0.08

/**
 * ProgressCircle — anel SVG com conteúdo central
 *
 * @param {'default'|'loading'|'complete'|'empty'|'indeterminate'|'paused'|'error'} [state='default']
 * @param {'sm'|'md'|'lg'|'xl'|number} [size='md']
 */
export const ProgressCircle = ({
  value = 0,
  max = 100,
  variant = 'primary',
  colorMode = 'variant',
  size = 'md',
  strokeWidth: strokeWidthProp,
  state = 'default',
  label,
  children,
  className,
}) => {
  const dimension = typeof size === 'number' ? size : SIZE_PX[size] ?? SIZE_PX.md
  const strokeWidth = strokeWidthProp ?? Math.max(3, Math.round(dimension * STROKE_RATIO))
  const radius = dimension / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const center = dimension / 2

  const percent = getProgressPercent(value, max)
  const fillPercent = getProgressFillPercent(value, max)
  const resolvedVariant = resolveProgressVariant({ value, max, variant, colorMode })

  const effectiveState =
    state === 'default' && fillPercent >= 100 ? 'complete' : state === 'default' && value <= 0 ? 'empty' : state

  const displayVariant =
    effectiveState === 'complete' ? 'success' : effectiveState === 'error' ? 'danger' : resolvedVariant

  const progressOffset =
    effectiveState === 'indeterminate' || effectiveState === 'loading'
      ? circumference * 0.75
      : circumference * (1 - fillPercent / 100)

  const defaultCenter =
    children ??
    (effectiveState === 'paused' ? (
      <Pause size={dimension * 0.22} className="text-[var(--ds-color-primary)]" aria-hidden />
    ) : effectiveState === 'error' ? (
      <AlertCircle size={dimension * 0.22} className="text-[var(--ds-color-danger)]" aria-hidden />
    ) : effectiveState === 'loading' || effectiveState === 'indeterminate' ? null : (
      <span className="ds-progress-circle__value tabular-nums">
        {Math.round(percent)}
        <span className="ds-progress-circle__suffix">%</span>
      </span>
    ))

  const healthLabel = colorMode === 'health' && !label ? getHealthLabel(percent) : null

  return (
    <div
      className={cn(progressCircleVariants({ size: typeof size === 'string' ? size : 'md' }), className)}
      style={typeof size === 'number' ? { '--ds-progress-circle-size': `${dimension}px` } : undefined}
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={effectiveState === 'indeterminate' ? undefined : value}
        aria-busy={effectiveState === 'loading' || effectiveState === 'indeterminate'}
      >
        <svg
          width={dimension}
          height={dimension}
          className={cn(
            'ds-progress-circle__svg -rotate-90',
            effectiveState === 'indeterminate' && 'ds-progress-circle__svg--indeterminate'
          )}
          aria-hidden
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="ds-progress-circle__track"
            fill="none"
            strokeWidth={strokeWidth}
          />
          {effectiveState !== 'loading' && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              className={cn('ds-progress-circle__fill', `ds-progress-circle__fill--${displayVariant}`)}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              style={{
                transition: 'stroke-dashoffset 500ms ease',
              }}
            />
          )}
        </svg>
        {defaultCenter && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {defaultCenter}
          </div>
        )}
      </div>
      {(label || healthLabel) && (
        <span className={progressCircleLabelVariants({ variant: displayVariant })}>
          {label ?? healthLabel}
        </span>
      )}
    </div>
  )
}
