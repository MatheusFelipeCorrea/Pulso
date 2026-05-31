import { publicAssets } from '@/constants/publicAssets'

const { emailLight, emailDark } = publicAssets.authHeroes

/** Ilustração hero — envelope 3D (tela email enviado) */
export function AuthHeroEmailIllustration() {
  return (
    <div className="auth-hero-email-illus" aria-hidden="true">
      <img
        src={emailLight}
        alt=""
        className="auth-hero-email-illus__img auth-hero-email-illus__img--light"
        draggable={false}
      />
      <img
        src={emailDark}
        alt=""
        className="auth-hero-email-illus__img auth-hero-email-illus__img--dark"
        draggable={false}
      />
    </div>
  )
}
