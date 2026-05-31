import { Link } from 'react-router-dom'
import { publicAssets } from '@/constants/publicAssets'

const { logoLight, logoDark, icon } = publicAssets.brand

/** Proporção dos PNGs oficiais (~2390×726) — evita layout shift */
const LOGO_ASPECT = 2390 / 726

/** Ícone Pulso — só o coração (favicon / espaços compactos) */
export function PulsoLogoMark({ size = 32, className = '' }) {
  return (
    <img
      src={icon}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      aria-hidden="true"
    />
  )
}

export function PulsoBrand({ to = '/', showTagline = true, className = '' }) {
  const logoHeight = 32
  const logoWidth = Math.round(logoHeight * LOGO_ASPECT)

  const content = (
    <div className={`pulso-brand ${className}`.trim()}>
      <img
        src={logoLight}
        alt="Pulso"
        width={logoWidth}
        height={logoHeight}
        className="pulso-brand__logo pulso-brand__logo--light"
      />
      <img
        src={logoDark}
        alt="Pulso"
        width={logoWidth}
        height={logoHeight}
        className="pulso-brand__logo pulso-brand__logo--dark"
      />
      {showTagline && (
        <span className="pulso-brand__tagline">Seu monitoramento financeiro</span>
      )}
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="pulso-brand-link">
        {content}
      </Link>
    )
  }

  return content
}
