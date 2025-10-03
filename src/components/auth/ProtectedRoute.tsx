import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, token, fetchUser } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // Si on a un token mais pas d'info utilisateur, on les récupère
    if (token && !useAuthStore.getState().user) {
      fetchUser()
    }
  }, [token, fetchUser])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de login en sauvegardant la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
