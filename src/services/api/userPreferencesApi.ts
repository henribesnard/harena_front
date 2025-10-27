import axios from 'axios'
import { useAuthStore } from '../../stores/authStore'

const BUDGET_API_BASE = import.meta.env.VITE_BUDGET_PROFILING_API_URL || 'http://localhost:3006/api/v1/budget'
// S'assurer que l'URL de base se termine bien par /api/v1/budget
const BUDGET_API = BUDGET_API_BASE.endsWith('/api/v1/budget')
  ? BUDGET_API_BASE
  : `${BUDGET_API_BASE}/api/v1/budget`

export interface BudgetSettings {
  months_analysis: number
  fixed_charge_min_occurrences: number
  fixed_charge_max_variance: number
  fixed_charge_min_amount: number
}

export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  currency?: string
}

export interface NotificationSettings {
  email_notifications?: boolean
  push_notifications?: boolean
  alert_threshold?: number
}

export interface UserPreferences {
  budget_settings: BudgetSettings
  display_settings?: DisplaySettings
  notifications_settings?: NotificationSettings
}

const api = axios.create({
  baseURL: BUDGET_API,
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
 * Récupère les préférences de l'utilisateur
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  const { data } = await api.get<UserPreferences>('/settings')
  return data
}

/**
 * Met à jour les préférences de l'utilisateur (mise à jour partielle)
 */
export const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
  const { data } = await api.put<UserPreferences>('/settings', preferences)
  return data
}

/**
 * Réinitialise les préférences aux valeurs par défaut
 */
export const resetUserPreferences = async (): Promise<UserPreferences> => {
  const { data } = await api.post<UserPreferences>('/settings/reset')
  return data
}
