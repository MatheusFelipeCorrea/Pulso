import { Link, useNavigate } from 'react-router-dom'
import { UserRound, Mail, ArrowLeft, User, Info } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button, InputText } from '@/design-system/components'
import { AuthInfoAlert } from '@/components/features/auth/AuthInfoAlert'
import { forgotPasswordSchema } from '@/schemas/authSchemas'
import * as authService from '@/services/authService'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  })

  const email = watch('email')
  const canSubmit = isValid && email.trim() && !isSubmitting

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await authService.forgotPassword(data.email)
      navigate(`/forgot-password/email-sent?email=${encodeURIComponent(data.email.trim().toLowerCase())}`)
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          'Erro ao enviar email de recuperação. Tente novamente.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout activeAuth="login" heroVariant="forgot-password">
      <div className="auth-card auth-card--forgot-password">
        <div className="auth-card-icon auth-card-icon--outline">
          <UserRound size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Recupere sua Senha</h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Informe seu Email para receber um link de Recuperação.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="auth-form-inputs">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputText
                  type="email"
                  placeholder="E-mail"
                  leftIcon={<User size={20} />}
                  error={submitError || errors.email?.message}
                  value={field.value}
                  onChange={(e) => {
                    setSubmitError('')
                    field.onChange(e)
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  autoComplete="email"
                />
              )}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit}
            leftIcon={<Mail size={18} strokeWidth={2} />}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Link De Recuperação'}
          </Button>
        </form>

        <Link to="/login" className="auth-forgot-back inline-flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} strokeWidth={2} />
          Voltar para o Login
        </Link>

        <div className="auth-forgot-info">
          <AuthInfoAlert
            icon={Info}
            message="Enviaremos um link para redefinir sua senha. Verifique sua caixa de entrada e spam."
          />
        </div>
      </div>
    </AuthLayout>
  )
}
