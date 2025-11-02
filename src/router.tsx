import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import ChatPage from './features/chat/ChatPage'
import DashboardPage from './features/dashboard/DashboardPage'
import BudgetProfilingPage from './pages/BudgetProfilingPage'
import ConfigurationPage from './pages/ConfigurationPage'
import UserDashboardPage from './pages/UserDashboardPage'

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
          <Route path="chat" element={<ChatPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="budget" element={<BudgetProfilingPage />} />
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="user-dashboard" element={<UserDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
