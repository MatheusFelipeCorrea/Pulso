import { publicAssets } from '@/constants/publicAssets'

const { recoverLight, recoverDark } = publicAssets.authHeroes

/** Ilustração hero — cadeado + envelope (tela recuperar senha) */
export function AuthHeroRecoverIllustration() {
  return (
    <div className="auth-hero-recover-illus" aria-hidden="true">
      <img
        src={recoverLight}
        alt=""
        className="auth-hero-recover-illus__img auth-hero-recover-illus__img--light"
        draggable={false}
      />
      <img
        src={recoverDark}
        alt=""
        className="auth-hero-recover-illus__img auth-hero-recover-illus__img--dark"
        draggable={false}
      />
    </div>
  )
}
