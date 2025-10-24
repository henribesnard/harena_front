import axios from 'axios'
import type {
  BudgetProfile,
  FixedCharge,
  MonthlyAggregate,
  CategoryBreakdown,
  AnalyzeProfileResponse
} from '../../types/budgetProfiling'
import { useAuthStore } from '../../stores/authStore'

const BUDGET_PROFILING_API = import.meta.env.VITE_BUDGET_PROFILING_API_URL || 'http://localhost:3006/api/v1/budget'

const api = axios.create({
  baseURL: BUDGET_PROFILING_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  // Récupérer le token depuis le store Zustand persisté
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
      console.warn('Token expiré dans budgetProfilingApi - Déconnexion et redirection vers login')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Récupère le profil budgétaire sauvegardé de l'utilisateur
 */
export const getBudgetProfile = async (): Promise<BudgetProfile> => {
  const { data } = await api.get<BudgetProfile>('/profile')
  return data
}

/**
 * Analyse et calcule le profil budgétaire (peut prendre du temps)
 * @param months_analysis - Nombre de mois à analyser (optionnel)
 */
export const analyzeBudgetProfile = async (
  months_analysis?: number
): Promise<AnalyzeProfileResponse> => {
  const { data } = await api.post<AnalyzeProfileResponse>('/profile/analyze', {
    months_analysis,
  })
  return data
}

/**
 * Récupère les charges fixes détectées automatiquement
 */
export const getFixedCharges = async (): Promise<FixedCharge[]> => {
  const { data } = await api.get<FixedCharge[]>('/fixed-charges')
  return data
}

/**
 * Récupère les agrégats mensuels (revenus, dépenses, épargne)
 * @param months - Nombre de mois à récupérer (optionnel)
 */
export const getMonthlyAggregates = async (
  months?: number
): Promise<MonthlyAggregate[]> => {
  const { data } = await api.get<MonthlyAggregate[]>('/monthly-aggregates', {
    params: { months },
  })
  return data
}

/**
 * Récupère la répartition des dépenses par catégorie
 * @param months - Nombre de mois à analyser (optionnel)
 */
export const getCategoryBreakdown = async (
  months?: number
): Promise<CategoryBreakdown> => {
  const { data } = await api.get<CategoryBreakdown>('/category-breakdown', {
    params: { months },
  })
  return data
}

/**
 * Health check du service
 */
export const checkHealth = async (): Promise<{ status: string }> => {
  const { data } = await api.get('/health')
  return data
}
