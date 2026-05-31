/** Ilustração inferior do hero — cards em código (linha + donut) */
export function AuthHeroIllustration() {
  const linePath =
    'M0 58 C24 58, 40 48, 56 34 S96 18, 118 30 S156 14, 178 26 S216 12, 248 20 S272 10, 280 16'
  const areaPath = `${linePath} L280 80 L0 80 Z`

  return (
    <div className="auth-hero-illustration" aria-hidden="true">
      <div className="auth-hero-illustration__stage">
        {/* Card gráfico de linha */}
        <div className="auth-illus-line-card">
          <div className="auth-illus-skeleton">
            <span className="auth-illus-skeleton__bar auth-illus-skeleton__bar--lg" />
            <span className="auth-illus-skeleton__bar auth-illus-skeleton__bar--sm" />
          </div>

          <div className="auth-illus-line-chart-wrap">
            {/* Linha — modo claro */}
            <svg
              className="auth-illus-line-chart auth-illus-chart--light"
            viewBox="0 0 280 80"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="heroAreaGradLight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="heroLineGradLight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <filter id="heroLineGlowLight" x="-8%" y="-40%" width="116%" height="180%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d={areaPath} fill="url(#heroAreaGradLight)" />
            <path
              d={linePath}
              stroke="url(#heroLineGradLight)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#heroLineGlowLight)"
            />
            <circle cx="56" cy="34" r="2.5" fill="#7C3AED" />
            <circle cx="118" cy="30" r="6" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
            <circle cx="178" cy="26" r="2.5" fill="#7C3AED" />
            <circle cx="248" cy="20" r="6" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
            </svg>

            {/* Linha — modo escuro (neon glow) */}
            <svg
              className="auth-illus-line-chart auth-illus-chart--dark"
            viewBox="0 0 280 80"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="heroAreaGradDark" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.18" />
                <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
              <filter id="heroLineGlowDark" x="-12%" y="-60%" width="124%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path d={areaPath} fill="url(#heroAreaGradDark)" />
            <path
              d={linePath}
              stroke="#A78BFA"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#heroLineGlowDark)"
            />
            <circle cx="56" cy="34" r="2" fill="#A78BFA" opacity="0.7" />
            <circle cx="118" cy="30" r="5.5" fill="#FAFAFA" />
            <circle cx="178" cy="26" r="2" fill="#A78BFA" opacity="0.7" />
            <circle cx="248" cy="20" r="5.5" fill="#FAFAFA" />
            </svg>
          </div>

          <span className="auth-illus-accent auth-illus-accent--line-left" />
        </div>

        {/* Card donut sobreposto */}
        <div className="auth-illus-donut-card">
          {/* Donut — modo claro (multicolorido) */}
          <svg
            className="auth-illus-donut auth-illus-chart--light"
            viewBox="0 0 72 72"
            aria-hidden="true"
          >
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#E4E4E7"
              strokeWidth="10"
              strokeDasharray="38 127"
              transform="rotate(-90 36 36)"
            />
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="10"
              strokeDasharray="42 127"
              strokeDashoffset="-38"
              transform="rotate(-90 36 36)"
            />
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="10"
              strokeDasharray="36 127"
              strokeDashoffset="-80"
              transform="rotate(-90 36 36)"
            />
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#C4B5FD"
              strokeWidth="10"
              strokeDasharray="32 127"
              strokeDashoffset="-116"
              transform="rotate(-90 36 36)"
            />
            <text x="36" y="36" textAnchor="middle">
              <tspan x="36" dy="-2.5" className="auth-illus-donut-value-svg auth-illus-donut-value-svg--light">
                R$ 8.450,00
              </tspan>
              <tspan x="36" dy="8.5" className="auth-illus-donut-label-svg auth-illus-donut-label-svg--light">
                Total
              </tspan>
            </text>
          </svg>

          {/* Donut — modo escuro (roxo + cinza) */}
          <svg
            className="auth-illus-donut auth-illus-chart--dark"
            viewBox="0 0 72 72"
            aria-hidden="true"
          >
            <defs>
              <filter id="heroDonutGlowDark" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#3F3F46"
              strokeWidth="10"
            />
            <circle
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="10"
              strokeDasharray="122 163"
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
              filter="url(#heroDonutGlowDark)"
            />
            <text x="36" y="36" textAnchor="middle">
              <tspan x="36" dy="-2.5" className="auth-illus-donut-value-svg auth-illus-donut-value-svg--dark">
                R$ 8.450,00
              </tspan>
              <tspan x="36" dy="8.5" className="auth-illus-donut-label-svg auth-illus-donut-label-svg--dark">
                Total
              </tspan>
            </text>
          </svg>

          <span className="auth-illus-accent auth-illus-accent--donut-right" />
          <span className="auth-illus-accent auth-illus-accent--donut-bottom" />
        </div>
      </div>
    </div>
  )
}
