import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { isTokenExpired } from '../utils/apiHelpers'

/**
 * Hook qui valide le token au démarrage et redirige si expiré
 * À utiliser dans App.tsx pour vérifier le token dès le chargement
 */
export const useTokenValidation = () => {
  const { token, logout, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Ne vérifier que si on pense être authentifié
    if (!isAuthenticated || !token) {
      return
    }

    // Vérifier si le token est expiré
    if (isTokenExpired(token)) {
      console.warn('Token expired on app startup - logging out and redirecting to login')
      logout()
      window.location.href = '/login'
    }
  }, [token, isAuthenticated, logout])

  // Vérification périodique toutes les 5 minutes
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return
    }

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        console.warn('Token expired during session - logging out and redirecting to login')
        logout()
        window.location.href = '/login'
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [token, isAuthenticated, logout])
}
