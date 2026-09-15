import { forwardRef } from 'react'
import { cn } from '../../../utils/cn.js'

/**
 * SpinnerDots - Indicador de loading com 3 pontos pulsando
 * 
 * Conforme protótipo:
 * - 3 pontos de 8px cada
 * - Espaçamento: 8px entre eles
 * - Cor: #A1A1AA
 * - Animação: pulse em sequência (1.2s, ease-in-out)
 * 
 * @component
 * @example
 * ```jsx
 * <SpinnerDots />
 * <SpinnerDots label="Buscando transações..." />
 * ```
 * 
 * @param {object} props
 * @param {string} [props.label] - Texto acessível (screenreader only)
 * @param {boolean} [props.center=false] - Se deve centralizar na tela/container
 * @param {string} [props.className]
 */
export const SpinnerDots = forwardRef(
  (
    {
      label,
      center = false,
      className,
      ...rest
    },
    ref
  ) => {
    // ============================================================
    // RENDER
    // ============================================================
    const dots = (
      <span
        ref={ref}
        role="status"
        aria-label={label || 'Carregando'}
        className={cn('inline-flex items-center gap-2', className)}
        {...rest}
      >
        {/* Dot 1 */}
        <span
          className="w-2 h-2 rounded-full bg-[var(--ds-color-placeholder)]"
          style={{
            animation: 'pulse-dot 1.2s ease-in-out infinite',
            animationDelay: '0s',
          }}
        />
        
        {/* Dot 2 */}
        <span
          className="w-2 h-2 rounded-full bg-[var(--ds-color-placeholder)]"
          style={{
            animation: 'pulse-dot 1.2s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        />
        
        {/* Dot 3 */}
        <span
          className="w-2 h-2 rounded-full bg-[var(--ds-color-placeholder)]"
          style={{
            animation: 'pulse-dot 1.2s ease-in-out infinite',
            animationDelay: '0.4s',
          }}
        />
        
        {/* Texto acessível para screen readers */}
        <span className="sr-only">{label || 'Carregando...'}</span>
      </span>
    )

    if (center) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          {dots}
        </div>
      )
    }

    return dots
  }
)

SpinnerDots.displayName = 'SpinnerDots'
