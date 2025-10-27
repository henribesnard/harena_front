import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBudgetProfile,
  analyzeBudgetProfile,
  getFixedCharges,
  getMonthlyAggregates,
  getCategoryBreakdown,
} from '../services/api/budgetProfilingApi'
import type { BudgetProfile } from '../types/budgetProfiling'

/**
 * Hook pour récupérer le profil budgétaire
 */
export const useBudgetProfile = () => {
  return useQuery({
    queryKey: ['budgetProfile'],
    queryFn: getBudgetProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Ne pas réessayer si c'est une 404 (profil non trouvé)
      if (error?.response?.status === 404) {
        return false
      }
      // Réessayer pour les autres erreurs (max 3 fois)
      return failureCount < 3
    },
    // Ne pas considérer une 404 comme une erreur fatale
    // Le composant gèrera l'affichage "pas de profil"
  })
}

/**
 * Hook pour analyser le profil budgétaire
 */
export const useAnalyzeBudgetProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (months_analysis?: number) => analyzeBudgetProfile(months_analysis),
    onSuccess: (data: BudgetProfile) => {
      // Mettre à jour le cache du profil
      queryClient.setQueryData(['budgetProfile'], data)
    },
  })
}

/**
 * Hook pour récupérer les charges fixes
 */
export const useFixedCharges = () => {
  return useQuery({
    queryKey: ['fixedCharges'],
    queryFn: getFixedCharges,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Hook pour récupérer les agrégats mensuels
 */
export const useMonthlyAggregates = (months?: number) => {
  return useQuery({
    queryKey: ['monthlyAggregates', months],
    queryFn: () => getMonthlyAggregates(months),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour récupérer la répartition par catégorie
 */
export const useCategoryBreakdown = (months?: number) => {
  return useQuery({
    queryKey: ['categoryBreakdown', months],
    queryFn: () => getCategoryBreakdown(months),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
