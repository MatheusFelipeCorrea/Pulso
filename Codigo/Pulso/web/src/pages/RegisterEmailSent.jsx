import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button, useToast } from '@/design-system/components'
import { AuthInfoAlert } from '@/components/features/auth/AuthInfoAlert'
import * as authService from '@/services/authService'

export default function RegisterEmailSent() {
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const email = searchParams.get('email') || ''
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (!email) {
      toast.error('Email não informado. Volte ao cadastro e tente novamente.')
      return
    }

    setIsResending(true)

    try {
      await authService.resendVerification(email)
      toast.success('Email de verificação reenviado!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao reenviar email.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout activeAuth="register" heroVariant="email-sent">
      <div className="auth-card auth-card--email-sent text-center">
        <div className="auth-card-icon auth-card-icon--outline">
          <Mail size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Email Enviado!</h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Enviamos um email de confirmação para o endereço:
        </p>

        <p className="auth-email-display">{email || 'seu@email.com'}</p>

        <div className="auth-email-sent-alert">
          <AuthInfoAlert
            icon={Mail}
            title="Não recebeu o email?"
            message="Verifique sua caixa de entrada, spam ou lixo eletrônico."
          />
        </div>

        <p className="auth-email-sent-note">
          Clique no link do email para ativar sua conta e desbloquear todas as funcionalidades do Pulso.
        </p>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          className="auth-email-resend-btn"
          loading={isResending}
          disabled={isResending || !email}
          onClick={handleResend}
        >
          {isResending ? 'Reenviando...' : 'Reenviar email de verificação'}
        </Button>

        <Link to="/login" className="auth-email-sent-cta block">
          <Button variant="primary" size="lg" fullWidth>
            Ir para o Login
          </Button>
        </Link>

        <Link to="/register" className="auth-email-sent-back auth-footer-link inline-block text-sm">
          ← Voltar para o Cadastro
        </Link>
      </div>
    </AuthLayout>
  )
}
