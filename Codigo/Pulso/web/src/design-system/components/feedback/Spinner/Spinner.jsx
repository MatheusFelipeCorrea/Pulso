import { forwardRef } from 'react'
import { cn } from '../../../utils/cn.js'

/**
 * Spinner - Indicador de loading circular (SVG)
 * 
 * Conforme protótipo:
 * - Tamanhos: sm(16px), md(24px), lg(40px), xl(64px)
 * - Stroke width: 3px (sm/md), 4px (lg/xl)
 * - Track visível: #27272A (dark) / #E4E4E7 (light)
 * - Animação: rotação 360° infinita, linear, 1s
 * 
 * @component
 * @example
 * ```jsx
 * <Spinner />
 * <Spinner size="lg" variant="primary" />
 * <Spinner size="sm" variant="white" label="Carregando..." />
 * ```
 * 
 * @param {object} props
 * @param {('sm'|'md'|'lg'|'xl')} [props.size='md'] - Tamanho do spinner
 * @param {('primary'|'white'|'current'|'success'|'danger'|'warning')} [props.variant='primary']
 * @param {string} [props.label] - Texto acessível (screenreader only)
 * @param {boolean} [props.center=false] - Se deve centralizar na tela/container
 * @param {string} [props.className]
 */
export const Spinner = forwardRef(
  (
    {
      size = 'md',
      variant = 'primary',
      label,
      center = false,
      className,
      ...rest
    },
    ref
  ) => {
    // ============================================================
    // CONFIGURAÇÕES POR TAMANHO (conforme protótipo)
    // ============================================================
    const config = {
      sm: { dimension: 16, strokeWidth: 3 },
      md: { dimension: 24, strokeWidth: 3 },
      lg: { dimension: 40, strokeWidth: 4 },
      xl: { dimension: 64, strokeWidth: 4 },
    }[size]

    const { dimension, strokeWidth } = config
    const radius = (dimension - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // ============================================================
    // CORES POR VARIANTE
    // ============================================================
    const colors = {
      primary: '#7C3AED',
      white: '#FAFAFA',
      current: 'currentColor',
      success: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
    }

    const spinnerColor = colors[variant]

    // ============================================================
    // RENDER
    // ============================================================
    const spinner = (
      <span
        ref={ref}
        role="status"
        aria-label={label || 'Carregando'}
        className={cn('inline-block', className)}
        {...rest}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          fill="none"
          className="animate-spin"
          style={{ animationDuration: '1s', animationTimingFunction: 'linear' }}
        >
          {/* Track (círculo de fundo) */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="var(--ds-color-border)"
            strokeWidth={strokeWidth}
            opacity={0.2}
          />
          
          {/* Spinner (arco animado) */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={spinnerColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
            style={{
              transformOrigin: 'center',
            }}
          />
        </svg>
        
        {/* Texto acessível para screen readers */}
        <span className="sr-only">{label || 'Carregando...'}</span>
      </span>
    )

    if (center) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          {spinner}
        </div>
      )
    }

    return spinner
  }
)

Spinner.displayName = 'Spinner'
