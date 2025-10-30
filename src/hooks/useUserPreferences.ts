import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
} from '../services/api/userPreferencesApi'
import { analyzeBudgetProfile } from '../services/api/budgetProfilingApi'
import type { UserPreferences } from '../types/preferences'
import toast from 'react-hot-toast'

export const useUserPreferences = () => {
  const queryClient = useQueryClient()

  const preferences = useQuery({
    queryKey: ['user-preferences'],
    queryFn: getUserPreferences,
  })

  const updateMutation = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      // Déclencher automatiquement une nouvelle analyse du profil budgétaire
      console.log('🔄 Triggering budget profile reanalysis...')
      analyzeBudgetProfile().catch(err => {
        console.error('⚠️ Budget analysis failed but preferences saved:', err)
        // Ne pas bloquer l'UX si l'analyse échoue
      })

      // Invalider les préférences ET toutes les données calculées
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      // Budget profiling service
      queryClient.invalidateQueries({ queryKey: ['budgetProfile'] })
      queryClient.invalidateQueries({ queryKey: ['fixedCharges'] })
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] })
      queryClient.invalidateQueries({ queryKey: ['categoryBreakdown'] })
      // Metric service
      queryClient.invalidateQueries({ queryKey: ['coreMetrics'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['mom-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-income'] })
      queryClient.invalidateQueries({ queryKey: ['mom-income'] })
      queryClient.invalidateQueries({ queryKey: ['coverage'] })
      toast.success('Préférences mises à jour avec succès')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour des préférences')
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetUserPreferences,
    onSuccess: () => {
      // Déclencher automatiquement une nouvelle analyse du profil budgétaire
      console.log('🔄 Triggering budget profile reanalysis after reset...')
      analyzeBudgetProfile().catch(err => {
        console.error('⚠️ Budget analysis failed but preferences reset:', err)
      })

      // Invalider les préférences ET toutes les données calculées
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      // Budget profiling service
      queryClient.invalidateQueries({ queryKey: ['budgetProfile'] })
      queryClient.invalidateQueries({ queryKey: ['fixedCharges'] })
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] })
      queryClient.invalidateQueries({ queryKey: ['categoryBreakdown'] })
      // Metric service
      queryClient.invalidateQueries({ queryKey: ['coreMetrics'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['mom-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-income'] })
      queryClient.invalidateQueries({ queryKey: ['mom-income'] })
      queryClient.invalidateQueries({ queryKey: ['coverage'] })
      toast.success('Préférences réinitialisées aux valeurs par défaut')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la réinitialisation des préférences')
    },
  })

  return {
    preferences: preferences.data,
    isLoading: preferences.isLoading,
    error: preferences.error,
    updatePreferences: updateMutation.mutate,
    resetPreferences: resetMutation.mutate,
    isUpdating: updateMutation.isPending,
    isResetting: resetMutation.isPending,
  }
}
