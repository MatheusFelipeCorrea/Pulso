import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './design-system/components/feedback/index.js'
import { AuthBootstrap } from './components/routing/AuthBootstrap'
import { ProtectedRoute, GuestRoute } from './components/routing/ProtectedRoute'
import { MainLayout } from './components/layouts/MainLayout'
import { APP_ROUTE_PATHS } from './config/appRoutes'
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
import InDevelopmentPage from './pages/InDevelopmentPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetPage from './pages/BudgetPage'
import CalendarPage from './pages/CalendarPage'
import DebtsPage from './pages/DebtsPage'
import GoalsPage from './pages/GoalsPage'
import TripsPage from './pages/TripsPage'
import TripDetailPage from './pages/TripDetailPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'
import GroupJoinRedirect from './pages/GroupJoinRedirect.jsx'
import PurchasePlanningPage from './pages/PurchasePlanningPage.jsx'
import ExpenseSplitPage from './pages/ExpenseSplitPage.jsx'

function App() {
  return (
    <ToastProvider>
      <AuthBootstrap>
        <Routes>
          {/* Público — landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth — só visitantes */}
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/register/email-sent" element={<RegisterEmailSent />} />
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
          <Route path="/design-system" element={<DesignSystemDemo />} />

          {/* App autenticado — sidebar + placeholders */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="debts" element={<DebtsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="trips/:id" element={<TripDetailPage />} />
              <Route path="groups/join/:codigo" element={<GroupJoinRedirect />} />
              <Route path="groups" element={<GroupsPage />} />
              <Route path="groups/:id" element={<GroupDetailPage />} />
              <Route path="purchase-planning" element={<PurchasePlanningPage />} />
              <Route path="expense-split" element={<ExpenseSplitPage />} />
              {APP_ROUTE_PATHS.filter(
                (path) =>
                  path !== '/dashboard' &&
                  path !== '/transactions' &&
                  path !== '/budget' &&
                  path !== '/calendar' &&
                  path !== '/debts' &&
                  path !== '/goals' &&
                  path !== '/trips' &&
                  path !== '/groups' &&
                  path !== '/purchase-planning' &&
                  path !== '/expense-split'
              ).map((path) => (
                <Route
                  key={path}
                  path={path.replace(/^\//, '')}
                  element={<InDevelopmentPage />}
                />
              ))}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthBootstrap>
    </ToastProvider>
  )
}

export default App
