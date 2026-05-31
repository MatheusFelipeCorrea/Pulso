import { Link, useSearchParams } from 'react-router-dom'
import { Mail, ArrowLeft, Shield } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/design-system/components'
import { AuthInfoAlert } from '@/components/features/auth/AuthInfoAlert'

export default function ForgotPasswordEmailSent() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <AuthLayout activeAuth="login" heroVariant="forgot-password-sent">
      <div className="auth-card auth-card--email-sent auth-card--password-reset-sent text-center">
        <div className="auth-card-icon auth-card-icon--outline">
          <Mail size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Email Enviado!</h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Enviamos um email de alteração de senha para o endereço:
        </p>

        <div className="auth-email-display auth-email-display--row">
          <Mail size={18} strokeWidth={2} className="auth-email-display__icon" aria-hidden="true" />
          <span className="auth-email-display__text">{email || 'seu@email.com'}</span>
        </div>

        <div className="auth-email-sent-alert">
          <AuthInfoAlert
            icon={Mail}
            title="Não recebeu o email?"
            message="Verifique sua caixa de entrada, spam ou lixo eletrônico."
          />
        </div>

        <p className="auth-email-sent-note">
          Clique no link do email para alterar sua senha.
        </p>

        <Link to="/login" className="auth-email-sent-cta block">
          <Button variant="primary" size="lg" fullWidth leftIcon={<Mail size={18} />}>
            Ir para o Login
          </Button>
        </Link>

        <Link to="/login" className="auth-email-sent-back auth-forgot-back text-sm">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Voltar para o Login
        </Link>

        <p className="auth-forgot-expiry-badge">
          <Shield size={14} strokeWidth={2} aria-hidden="true" />
          Este link expira em 1 hora por segurança.
        </p>
      </div>
    </AuthLayout>
  )
}
