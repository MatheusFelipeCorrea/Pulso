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
import TransactionsPage from './pages/TransactionsPage'
import GoalsPage from './pages/GoalsPage'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import CalendarPage from './pages/CalendarPage'
import BudgetPage from './pages/BudgetPage'
import PurchasePlanningPage from './pages/PurchasePlanningPage'
import { PremiumRoute } from './components/routing/PremiumRoute.jsx'
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
              <Route path="dashboard" element={<Navigate to="/transactions" replace />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="purchase-planning" element={<PurchasePlanningPage />} />
              <Route
                path="profile"
                element={
                  <AccountPage
                    title="Perfil"
                    subtitle="Dados da conta autenticada. Edição cadastral entra em um recorte futuro."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <AccountPage
                    title="Configurações"
                    subtitle="Preferências de tema ficam no menu do avatar. Demais ajustes entram depois."
                  />
                }
              />
              <Route element={<PremiumRoute />}>
                <Route path="trips" element={<TripsPage />} />
                <Route path="trips/:id" element={<TripDetailPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthBootstrap>
    </ToastProvider>
  )
}

export default App
