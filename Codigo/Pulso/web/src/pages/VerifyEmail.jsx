import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Loader2, Mail, XCircle } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button, Alert, InputText, useToast } from '@/design-system/components'
import * as authService from '@/services/authService'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const handledRef = useRef(false)

  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (handledRef.current || !token) return
    handledRef.current = true

    const verify = async () => {
      try {
        const result = await authService.verifyEmail(token)

        const verifiedParam = result.alreadyVerified ? 'already' : 'true'
        navigate(`/login?verified=${verifiedParam}`, { replace: true })
      } catch (error) {
        const message =
          error.response?.data?.message || 'Não foi possível verificar seu email.'
        setErrorMessage(message)
        setIsExpired(message.toLowerCase().includes('expirado'))
        setStatus('error')
      }
    }

    if (!token) {
      setErrorMessage('Link de verificação inválido.')
      setStatus('error')
      return
    }

    verify()
  }, [navigate, token])

  const handleResend = async (event) => {
    event.preventDefault()

    if (!resendEmail.trim()) {
      toast.error('Informe seu email para reenviar a verificação.')
      return
    }

    setIsResending(true)

    try {
      await authService.resendVerification(resendEmail.trim())
      toast.success('Email de verificação reenviado!')
      navigate(`/register/email-sent?email=${encodeURIComponent(resendEmail.trim())}`, {
        replace: true,
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao reenviar email.')
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'loading') {
    return (
      <AuthLayout activeAuth="register" heroVariant="email-sent">
        <div className="auth-card auth-card--email-sent flex flex-col items-center justify-center py-14 text-center">
          <Loader2
            className="animate-spin text-[#7C3AED]"
            size={40}
            strokeWidth={1.75}
          />
          <h1 className="auth-card-title mt-6">Verificando seu email...</h1>
          <p className="auth-card-subtitle auth-card-subtitle--wide mt-2">
            Aguarde enquanto confirmamos seu cadastro.
          </p>
        </div>
      </AuthLayout>
    )
  }

  if (status === 'error') {
    return (
      <AuthLayout activeAuth="register" heroVariant="email-sent">
        <div className="auth-card auth-card--email-sent text-center">
          <div className="auth-card-icon auth-card-icon--outline auth-card-icon--error">
            <XCircle size={28} strokeWidth={1.75} />
          </div>
          <h1 className="auth-card-title">Não foi possível verificar</h1>
          <p className="auth-card-subtitle auth-card-subtitle--wide">{errorMessage}</p>

          <div className="auth-email-sent-alert mt-6">
            <Alert
              type={isExpired ? 'warning' : 'error'}
              title={isExpired ? 'Link expirado' : 'Link inválido'}
              message={
                isExpired
                  ? 'Solicite um novo email de verificação abaixo.'
                  : 'Verifique se copiou o link completo ou solicite um novo email.'
              }
            />
          </div>

          <form onSubmit={handleResend} className="auth-verify-resend-form">
            <InputText
              type="email"
              placeholder="Seu email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              leftIcon={<Mail size={20} />}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isResending}
              disabled={isResending}
            >
              {isResending ? 'Reenviando...' : 'Reenviar email de verificação'}
            </Button>
          </form>

          <Link to="/register" className="auth-email-sent-back auth-footer-link inline-block text-sm">
            ← Voltar para o Cadastro
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout activeAuth="register" heroVariant="email-sent">
      <div className="auth-card auth-card--email-sent flex flex-col items-center py-12 text-center">
        <CheckCircle2 className="text-[#10B981]" size={48} strokeWidth={1.75} />
        <p className="mt-4 text-sm text-[var(--ds-color-text-secondary)]">Redirecionando...</p>
      </div>
    </AuthLayout>
  )
}
