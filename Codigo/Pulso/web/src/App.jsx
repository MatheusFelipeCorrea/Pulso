import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './design-system/components/feedback/index.js'
import { AuthBootstrap } from './components/routing/AuthBootstrap'
import { ProtectedRoute, GuestRoute } from './components/routing/ProtectedRoute'
import { MainLayout } from './components/layouts/MainLayout'
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
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
// TEMP: demais páginas ainda não estão neste repo.

function App() {
  return (
    <ToastProvider>
      <AuthBootstrap>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/register/email-sent"
            element={
              <GuestRoute>
                <RegisterEmailSent />
              </GuestRoute>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/email-sent" element={<ForgotPasswordEmailSent />} />
          <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/termos" element={<TermsOfUse />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthBootstrap>
    </ToastProvider>
  )
}

export default App
