import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { User } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import {
  Button,
  InputText,
  InputPassword,
  Checkbox,
  useToast,
} from '@/design-system/components'
import { loginSchema } from '@/schemas/authSchemas'
import * as authService from '@/services/authService'
import { setUser } from '@/store/slices/authSlice'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function Login() {
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const toastShownRef = useRef(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [credentialsError, setCredentialsError] = useState('')
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      identificador: '',
      senha: '',
      lembrarMe: false,
    },
  })

  const identificador = watch('identificador')
  const senha = watch('senha')
  const canSubmit = identificador.trim().length > 0 && senha.length > 0 && !isSubmitting

  useEffect(() => {
    if (toastShownRef.current) return

    if (searchParams.get('verified') === 'true') {
      toastShownRef.current = true
      toast.success('Email verificado com sucesso! Faça login para continuar.')
    } else if (searchParams.get('verified') === 'already') {
      toastShownRef.current = true
      toast.info('Este email já estava verificado. Faça login para continuar.')
    }
  }, [searchParams, toast])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setCredentialsError('')
    setShowResendVerification(false)

    try {
      const result = await authService.login(data)
      authService.storeAuthTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      })
      dispatch(setUser(result.user))
      toast.success(`Bem-vindo de volta, ${result.user.nome}!`)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message =
        error.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
      const status = error.response?.status

      if (status === 403) {
        setShowResendVerification(true)
        const value = getValues('identificador').trim()
        if (value.includes('@')) {
          setPendingVerificationEmail(value.toLowerCase())
        }
      } else if (status === 401) {
        setCredentialsError(message)
      } else {
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    const email =
      pendingVerificationEmail ||
      (getValues('identificador').trim().includes('@')
        ? getValues('identificador').trim().toLowerCase()
        : '')

    if (!email) {
      toast.error('Informe seu e-mail para reenviar a verificação.')
      return
    }

    setIsResending(true)

    try {
      await authService.resendVerification(email)
      toast.success('Email de verificação reenviado!')
      navigate(`/register/email-sent?email=${encodeURIComponent(email)}`)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Não foi possível reenviar o email. Tente novamente.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout activeAuth="login" heroVariant="login">
      <div className="auth-card">
        <div className="auth-card-icon">
          <UserRound size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Bem-vindo de volta!</h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Acesse sua conta para continuar cuidando das suas finanças.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="auth-form-inputs">
            <Controller
              name="identificador"
              control={control}
              render={({ field }) => (
                <InputText
                  placeholder="E-mail ou Nome de Usuário"
                  leftIcon={<User size={20} />}
                  error={credentialsError || errors.identificador?.message}
                  value={field.value}
                  onChange={(e) => {
                    setCredentialsError('')
                    setShowResendVerification(false)
                    field.onChange(e)
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  autoComplete="username"
                />
              )}
            />

            <Controller
              name="senha"
              control={control}
              render={({ field }) => (
                <InputPassword
                  placeholder="Senha"
                  error={errors.senha?.message}
                  value={field.value}
                  onChange={(e) => {
                    setCredentialsError('')
                    field.onChange(e)
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          <div className="auth-login-options">
            <Controller
              name="lembrarMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label="Lembrar-me"
                />
              )}
            />
            <Link to="/forgot-password" className="auth-forgot-link">
              Esqueci minha senha
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {showResendVerification && (
          <div className="auth-login-resend">
            <p className="text-sm text-[var(--ds-color-text-secondary)]">
              Sua conta ainda não foi verificada.
            </p>
            <button
              type="button"
              className="auth-footer-link text-sm"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? 'Reenviando...' : 'Reenviar email de verificação'}
            </button>
          </div>
        )}

        <div className="auth-divider">
          <span>ou continue com</span>
        </div>

        <button type="button" className="auth-google-btn" onClick={authService.loginWithGoogle}>
          <GoogleIcon />
          Entrar com o Google
        </button>

        <p className="auth-card-footer">
          Ainda não possui uma conta?{' '}
          <Link to="/register" className="auth-footer-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
