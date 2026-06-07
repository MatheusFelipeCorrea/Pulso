import { Link } from 'react-router-dom'
import { Check, LayoutGrid, Lock, Shield } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button } from '@/design-system/components'
import { AuthInfoAlert } from '@/components/features/auth/AuthInfoAlert'

export default function ResetPasswordSuccess() {
  return (
    <AuthLayout activeAuth="login" heroVariant="reset-password-success">
      <div className="auth-card auth-card--reset-success text-center">
        <div className="auth-card-icon">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h1 className="auth-card-title">
          Senha alterada{' '}
          <span className="text-[#7C3AED] dark:text-[#A78BFA]">com sucesso!</span>
        </h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Sua senha foi atualizada e sua conta está ainda mais segura.
        </p>

        <div className="auth-reset-success-tip">
          <AuthInfoAlert
            icon={Shield}
            message="Recomendamos que você não compartilhe sua senha com ninguém."
          />
        </div>

        <Link to="/login" className="auth-email-sent-cta block">
          <Button variant="primary" size="lg" fullWidth leftIcon={<LayoutGrid size={18} />}>
            Ir para o Dashboard
          </Button>
        </Link>

        <div className="auth-divider auth-divider--compact">
          <span>ou</span>
        </div>

        <Link to="/login" className="block">
          <Button variant="secondary" size="lg" fullWidth leftIcon={<Lock size={18} />}>
            Ir para o Login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
