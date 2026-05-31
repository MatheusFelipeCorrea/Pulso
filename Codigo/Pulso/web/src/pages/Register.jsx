import { Link, useNavigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Mail, User } from 'lucide-react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import {
  Button,
  InputText,
  InputPassword,
  Checkbox,
  useToast,
} from '@/design-system/components'
import { registerSchema } from '@/schemas/authSchemas'
import * as authService from '@/services/authService'

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

export default function Register() {
  const toast = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailServerError, setEmailServerError] = useState('')

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      aceitarTermos: false,
    },
  })

  const aceitarTermos = watch('aceitarTermos')
  const canSubmit = isValid && aceitarTermos && !isSubmitting

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setEmailServerError('')

    try {
      const result = await authService.register(data)
      navigate(`/register/email-sent?email=${encodeURIComponent(result.email)}`)
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar. Tente novamente.'

      if (error.response?.status === 409) {
        setEmailServerError(message)
      } else {
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const termsLabel = (
    <span className="text-sm leading-snug text-[var(--ds-color-text-secondary)]">
      Eu aceito os{' '}
      <Link to="/termos" target="_blank" rel="noopener noreferrer" className="auth-terms-link" onClick={(e) => e.stopPropagation()}>
        Termos de Uso
      </Link>{' '}
      e a{' '}
      <Link to="/privacidade" target="_blank" rel="noopener noreferrer" className="auth-terms-link" onClick={(e) => e.stopPropagation()}>
        Política de Privacidade
      </Link>
      .
    </span>
  )

  return (
    <AuthLayout activeAuth="register">
      <div className="auth-card">
        <div className="auth-card-icon">
          <UserRound size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Crie sua conta</h1>
        <p className="auth-card-subtitle">
          Preencha os dados abaixo para começar a usar o Pulso.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="auth-form-inputs">
            <Controller
              name="nome"
              control={control}
              render={({ field }) => (
                <InputText
                  placeholder="Nome completo"
                  leftIcon={<User size={20} />}
                  error={errors.nome?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText
                  type="email"
                  placeholder="E-mail"
                  leftIcon={<Mail size={20} />}
                  error={emailServerError || errors.email?.message}
                  value={field.value}
                  onChange={(e) => {
                    setEmailServerError('')
                    field.onChange(e)
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
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
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />

            <Controller
              name="confirmarSenha"
              control={control}
              render={({ field }) => (
                <InputPassword
                  placeholder="Confirmar senha"
                  error={errors.confirmarSenha?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          <Controller
            name="aceitarTermos"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                label={termsLabel}
                error={errors.aceitarTermos?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="auth-divider">
          <span>ou cadastre-se com</span>
        </div>

        <button type="button" className="auth-google-btn" onClick={authService.loginWithGoogle}>
          <GoogleIcon />
          Cadastrar com Google
        </button>

        <p className="auth-card-footer">
          Já possui uma conta?{' '}
          <Link to="/login" className="auth-footer-link">
            Fazer Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
