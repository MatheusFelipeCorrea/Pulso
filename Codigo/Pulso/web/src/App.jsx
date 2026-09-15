import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './design-system/components/feedback/index.js'
import { AuthBootstrap } from './components/routing/AuthBootstrap'
import { ProtectedRoute, GuestRoute } from './components/routing/ProtectedRoute'
// TEMP Sprint-2: app autenticado (MainLayout + pages) ainda não transferido
// import { MainLayout } from './components/layouts/MainLayout'
// import { APP_ROUTE_PATHS } from './config/appRoutes'
// import DesignSystemDemo from './pages/DesignSystemDemo'
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
// import InDevelopmentPage from './pages/InDevelopmentPage'
// import DashboardPage from './pages/DashboardPage'
// import TransactionsPage from './pages/TransactionsPage'
// import BudgetPage from './pages/BudgetPage'
// import CalendarPage from './pages/CalendarPage'
// import DebtsPage from './pages/DebtsPage'
// import GoalsPage from './pages/GoalsPage'
// import TripsPage from './pages/TripsPage'
// import TripDetailPage from './pages/TripDetailPage.jsx'
// import GroupsPage from './pages/GroupsPage.jsx'
// import GroupDetailPage from './pages/GroupDetailPage.jsx'
// import GroupJoinRedirect from './pages/GroupJoinRedirect.jsx'
// import PurchasePlanningPage from './pages/PurchasePlanningPage.jsx'
// import ExpenseSplitPage from './pages/ExpenseSplitPage.jsx'

/** Placeholder pós-login até MainLayout/Dashboard entrarem no Sprint-2. */
function AuthenticatedStub() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Sessão autenticada</h1>
      <p>Auth OK. Módulos do app (dashboard, etc.) ainda não estão neste branch.</p>
    </main>
  )
}

function App() {
  return (
    <ToastProvider>
      <AuthBootstrap>
        <Routes>
          {/* Público — landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth — PULSO-FEAT-001 (cadastro + verificação de email) */}
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
          {/* Link do email: acessível sem sessão (não usar GuestRoute) */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Auth — login / recuperação */}
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
          {/* <Route path="/design-system" element={<DesignSystemDemo />} /> */}

          {/* App autenticado — TEMP stub (MainLayout/pages ausentes) */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<AuthenticatedStub />} />
            {/*
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              ...
            </Route>
            */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthBootstrap>
    </ToastProvider>
  )
}

export default App
