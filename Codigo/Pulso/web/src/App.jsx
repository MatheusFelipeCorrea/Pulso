import { Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './design-system/components/feedback/index.js'
import DesignSystemDemo from './pages/DesignSystemDemo'
import Register from './pages/Register'
import RegisterEmailSent from './pages/RegisterEmailSent'
import AuthCallback from './pages/AuthCallback'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ForgotPasswordEmailSent from './pages/ForgotPasswordEmailSent'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordSuccess from './pages/ResetPasswordSuccess'
import TermsOfUse from './pages/TermsOfUse'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-[var(--ds-color-background)] text-[var(--ds-color-text)]">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center px-4">
                <h1 className="text-4xl font-bold text-[var(--ds-color-primary)] mb-2">
                  💜 Pulso
                </h1>
                <p className="text-[var(--ds-color-text-secondary)]">
                  O pulso da sua vida financeira
                </p>
                <p className="text-sm text-[var(--ds-color-text-secondary)] mt-4 opacity-70">
                  Front rodando com sucesso!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Link
                    to="/register"
                    className="inline-block px-6 py-3 bg-[var(--ds-color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Criar conta
                  </Link>
                  <Link
                    to="/design-system"
                    className="inline-block px-6 py-3 border border-[var(--ds-color-border)] rounded-lg hover:bg-[var(--ds-color-hover)] transition-colors"
                  >
                    Design System
                  </Link>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/register/email-sent" element={<RegisterEmailSent />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/email-sent" element={<ForgotPasswordEmailSent />} />
        <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/termos" element={<TermsOfUse />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/design-system" element={<DesignSystemDemo />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
