import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
  UserPreferences,
} from '../services/api/userPreferencesApi'
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
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      toast.success('Préférences mises à jour avec succès')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour des préférences')
    },
  })

  const resetMutation = useMutation({
    mutationFn: resetUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
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
