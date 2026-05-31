import { publicAssets } from '@/constants/publicAssets'

const { resetLight, resetDark } = publicAssets.authHeroes

/** Ilustração hero — nova senha */
export function AuthHeroResetIllustration() {
  return (
    <div className="auth-hero-reset-illus" aria-hidden="true">
      <img
        src={resetLight}
        alt=""
        className="auth-hero-reset-illus__img auth-hero-reset-illus__img--light"
        draggable={false}
      />
      <img
        src={resetDark}
        alt=""
        className="auth-hero-reset-illus__img auth-hero-reset-illus__img--dark"
        draggable={false}
      />
    </div>
  )
}
