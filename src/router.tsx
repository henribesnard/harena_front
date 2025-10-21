import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ChatLayout from './components/layout/ChatLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './features/auth/LoginPage'
import ChatPage from './features/chat/ChatPage'
import DashboardPage from './features/dashboard/DashboardPage'
import BudgetProfilingPage from './pages/BudgetProfilingPage'

const AppRouter = () => {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        {/* Chat avec sa propre layout (pas de sidebar navigation) */}
        <Route path="/chat" element={<ChatLayout />}>
          <Route index element={<ChatPage />} />
        </Route>

        {/* Autres pages avec MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="budget" element={<BudgetProfilingPage />} />
          {/* TODO: Add other routes */}
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter