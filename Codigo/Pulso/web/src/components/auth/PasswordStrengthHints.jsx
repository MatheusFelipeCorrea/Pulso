import { Check } from 'lucide-react'
import { PASSWORD_RULES, getPasswordStrength } from '@/utils/passwordStrength.js'

export function PasswordStrengthBar({ password }) {
  if (!password) return null

  const strength = getPasswordStrength(password)

  return (
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
  )
}

export function PasswordRulesChecklist({ password }) {
  return (
    <div className="auth-password-rules">
      <p className="auth-password-rules__title">Sua senha deve conter:</p>
      <ul className="auth-password-rules__grid">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password)
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
  )
}
