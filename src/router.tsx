import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Eager load authentication pages (small and needed immediately)
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'

// Lazy load other pages to improve initial load time
const ChatPage = lazy(() => import('./features/chat/ChatPage'))
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'))
const BudgetProfilingPage = lazy(() => import('./pages/BudgetProfilingPage'))
const ConfigurationPage = lazy(() => import('./pages/ConfigurationPage'))
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage'))

/**
 * Loading fallback component for lazy-loaded routes
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
)

const AppRouter = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes protégées - Toutes utilisent MainLayout maintenant */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route
            path="chat"
            element={
              <Suspense fallback={<PageLoader />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="budget"
            element={
              <Suspense fallback={<PageLoader />}>
                <BudgetProfilingPage />
              </Suspense>
            }
          />
          <Route
            path="configuration"
            element={
              <Suspense fallback={<PageLoader />}>
                <ConfigurationPage />
              </Suspense>
            }
          />
          <Route
            path="user-dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <UserDashboardPage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
