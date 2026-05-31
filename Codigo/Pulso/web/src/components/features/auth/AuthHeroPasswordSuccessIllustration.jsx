import { publicAssets } from '@/constants/publicAssets'

const { success } = publicAssets.authHeroes

/** Ilustração hero — cadeado + escudo (senha alterada com sucesso) */
export function AuthHeroPasswordSuccessIllustration() {
  return (
    <div className="auth-hero-success-illus" aria-hidden="true">
      <img
        src={success}
        alt=""
        className="auth-hero-success-illus__img"
        draggable={false}
      />
    </div>
  )
}
