import { publicAssets } from '@/constants/publicAssets'

const { passwordSentLight, passwordSentDark } = publicAssets.authHeroes

/** Ilustração hero — envelope + senha (email de alteração enviado) */
export function AuthHeroPasswordSentIllustration() {
  return (
    <div className="auth-hero-password-sent-illus" aria-hidden="true">
      <img
        src={passwordSentLight}
        alt=""
        className="auth-hero-password-sent-illus__img auth-hero-password-sent-illus__img--light"
        draggable={false}
      />
      <img
        src={passwordSentDark}
        alt=""
        className="auth-hero-password-sent-illus__img auth-hero-password-sent-illus__img--dark"
        draggable={false}
      />
    </div>
  )
}
