import axios from 'axios'
import { useAuthStore } from '../../stores/authStore'
import type {
  AccountSelection,
  BudgetSettings,
  DisplaySettings,
  NotificationSettings,
  UserPreferences
} from '../../types/preferences'

// Utiliser le USER_SERVICE pour les préférences utilisateur
const USER_API_BASE = import.meta.env.VITE_USER_API_URL || 'http://localhost:3000/api/v1'
const USER_API = USER_API_BASE.endsWith('/api/v1')
  ? USER_API_BASE
  : `${USER_API_BASE}/api/v1`

// Export AccountSelection for convenience
export type { AccountSelection }

const api = axios.create({
  baseURL: USER_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const persistedAuth = localStorage.getItem('harena-auth')
  const token = persistedAuth ? JSON.parse(persistedAuth).state.token : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expiré dans userPreferencesApi - Déconnexion et redirection vers login')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Récupère les préférences de l'utilisateur depuis /users/me
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  const { data } = await api.get('/users/me')
  // L'endpoint retourne l'utilisateur complet, on extrait juste les preferences
  return data.preferences
}

/**
 * Met à jour les préférences de l'utilisateur (mise à jour partielle)
 */
export const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  const { data } = await api.put('/users/me', { preferences })
  // L'endpoint retourne l'utilisateur complet, on extrait juste les preferences
  return data.preferences
}

/**
 * Réinitialise les préférences aux valeurs par défaut
 * TODO: Implémenter côté backend si nécessaire
 */
export const resetUserPreferences = async (): Promise<UserPreferences> => {
  // Pour l'instant, on envoie les valeurs par défaut
  const defaultPreferences: UserPreferences = {
    budget_settings: {
      months_analysis: 12,
      fixed_charge_min_occurrences: 5,
      fixed_charge_max_variance: 0.2,
      fixed_charge_min_amount: 10,
      account_selection: {
        mode: 'all',
        excluded_types: [],
        included_accounts: []
      }
    }
  }
  return updateUserPreferences(defaultPreferences)
}
