import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './features/auth/LoginPage'
import ChatPage from './features/chat/ChatPage'
import DashboardPage from './features/dashboard/DashboardPage'

const AppRouter = () => {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {/* TODO: Add other routes */}
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter