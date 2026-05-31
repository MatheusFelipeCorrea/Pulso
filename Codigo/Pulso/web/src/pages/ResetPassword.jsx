import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserRound, ArrowLeft, Shield, Loader2, XCircle, Check } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '@/components/layouts/AuthLayout'
import { Button, InputPassword, Alert, useToast } from '@/design-system/components'
import { resetPasswordSchema } from '@/schemas/authSchemas'
import * as authService from '@/services/authService'

const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'Mínimo de 8 caracteres',
    test: (value) => value.length >= 8,
  },
  {
    id: 'upper',
    label: 'Uma letra maiúscula',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'number',
    label: 'Um número',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'special',
    label: 'Um caractere especial',
    test: (value) => /[@$!%*?&#]/.test(value),
  },
]

function getPasswordStrength(password) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length

  if (!password) {
    return { label: 'Fraca', color: '#EF4444', segments: 0, fillColor: '#EF4444' }
  }

  if (passed <= 1) {
    return { label: 'Fraca', color: '#EF4444', segments: 1, fillColor: '#EF4444' }
  }

  if (passed <= 3) {
    return { label: 'Média', color: '#F59E0B', segments: 2, fillColor: '#7C3AED' }
  }

  return { label: 'Forte', color: '#10B981', segments: 4, fillColor: '#10B981' }
}

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const validatedRef = useRef(false)

  const [pageStatus, setPageStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      senha: '',
      confirmarSenha: '',
    },
  })

  const senha = watch('senha')
  const confirmarSenha = watch('confirmarSenha')

  const strength = useMemo(() => getPasswordStrength(senha), [senha])

  const allRulesPassed = PASSWORD_RULES.every((rule) => rule.test(senha))
  const passwordsMatch = senha && confirmarSenha && senha === confirmarSenha
  const canSubmit = allRulesPassed && passwordsMatch && !isSubmitting

  useEffect(() => {
    if (validatedRef.current || !token) return
    validatedRef.current = true

    const validate = async () => {
      try {
        await authService.validateResetToken(token)
        setPageStatus('ready')
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || 'Link expirado ou inválido.'
        )
        setPageStatus('error')
      }
    }

    if (!token) {
      setErrorMessage('Link de recuperação inválido.')
      setPageStatus('error')
      return
    }

    validate()
  }, [token])

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      await authService.resetPassword({ token, ...data })
      navigate('/reset-password/success', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageStatus === 'loading') {
    return (
      <AuthLayout activeAuth="login" heroVariant="reset-password">
        <div className="auth-card flex flex-col items-center justify-center py-14 text-center">
          <Loader2 className="animate-spin text-[#7C3AED]" size={40} strokeWidth={1.75} />
          <h1 className="auth-card-title mt-6">Validando link...</h1>
          <p className="auth-card-subtitle auth-card-subtitle--wide mt-2">
            Aguarde enquanto verificamos seu link de recuperação.
          </p>
        </div>
      </AuthLayout>
    )
  }

  if (pageStatus === 'error') {
    return (
      <AuthLayout activeAuth="login" heroVariant="reset-password">
        <div className="auth-card text-center">
          <div className="auth-card-icon auth-card-icon--outline auth-card-icon--error">
            <XCircle size={28} strokeWidth={1.75} />
          </div>
          <h1 className="auth-card-title">Link expirado ou inválido</h1>
          <p className="auth-card-subtitle auth-card-subtitle--wide">{errorMessage}</p>

          <div className="auth-email-sent-alert mt-6">
            <Alert
              type="warning"
              title="O que fazer?"
              message="Solicite um novo link de recuperação para continuar."
            />
          </div>

          <Link to="/forgot-password" className="auth-email-sent-cta mt-8 block">
            <Button variant="primary" size="lg" fullWidth>
              Solicitar novo link
            </Button>
          </Link>

          <Link to="/login" className="auth-forgot-back text-sm">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Voltar para o Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout activeAuth="login" heroVariant="reset-password">
      <div className="auth-card auth-card--reset-password">
        <div className="auth-card-icon auth-card-icon--outline">
          <UserRound size={28} strokeWidth={1.75} />
        </div>
        <h1 className="auth-card-title">Altere sua Senha</h1>
        <p className="auth-card-subtitle auth-card-subtitle--wide">
          Crie uma nova senha forte para sua conta.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="auth-form-inputs">
            <Controller
              name="senha"
              control={control}
              render={({ field }) => (
                <div>
                  <InputPassword
                    placeholder="Nova senha"
                    error={errors.senha?.message}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    autoComplete="new-password"
                  />

                  {senha && (
                    <div className="auth-password-strength">
                      <p className="auth-password-strength__label">
                        Força da senha:{' '}
                        <strong style={{ color: strength.color }}>{strength.label}</strong>
                      </p>
                      <div className="auth-password-strength__bar" aria-hidden="true">
                        {[0, 1, 2, 3].map((index) => (
                          <span
                            key={index}
                            className="auth-password-strength__segment"
                            style={{
                              backgroundColor:
                                index < strength.segments ? strength.fillColor : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            />

            <Controller
              name="confirmarSenha"
              control={control}
              render={({ field }) => (
                <InputPassword
                  placeholder="Confirmar nova senha"
                  error={errors.confirmarSenha?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  autoComplete="new-password"
                />
              )}
            />
          </div>

          <div className="auth-password-rules">
            <p className="auth-password-rules__title">Sua senha deve conter:</p>
            <ul className="auth-password-rules__grid">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(senha)
                return (
                  <li
                    key={rule.id}
                    className={`auth-password-rules__item${passed ? ' auth-password-rules__item--passed' : ''}`}
                  >
                    <span className="auth-password-rules__check" aria-hidden="true">
                      {passed ? <Check size={14} strokeWidth={2.5} /> : null}
                    </span>
                    {rule.label}
                  </li>
                )
              })}
            </ul>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={!canSubmit}
          >
            {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </form>

        <div className="auth-divider auth-divider--compact">
          <span>ou</span>
        </div>

        <Link to="/login" className="auth-forgot-back auth-forgot-back--center text-sm">
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
