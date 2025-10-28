/**
 * Hook pour gérer les items bancaires (connexions aux banques)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bankSyncApiService } from '@/services/api/bankSyncApi'
import toast from 'react-hot-toast'

export const useBankItems = () => {
  const queryClient = useQueryClient()

  // Query pour récupérer tous les items
  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ['bank-items'],
    queryFn: bankSyncApiService.getItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  })

  // Mutation pour supprimer un item
  const deleteItem = useMutation({
    mutationFn: bankSyncApiService.deleteItem,
    onMutate: async (itemId) => {
      console.log('🗑️ Suppression de l\'item:', itemId)

      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['bank-items'] })

      // Sauvegarder les données actuelles pour un rollback éventuel
      const previousItems = queryClient.getQueryData(['bank-items'])

      // Optimistic update: retirer l'item immédiatement de l'UI
      queryClient.setQueryData(['bank-items'], (old: any) =>
        old?.filter((item: any) => item.id !== itemId)
      )

      return { previousItems }
    },
    onSuccess: () => {
      console.log('✅ Item supprimé avec succès')
      toast.success('Banque déconnectée avec succès')

      // Invalider les queries liées
      queryClient.invalidateQueries({ queryKey: ['bank-items'] })
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['sync-status'] })
      queryClient.invalidateQueries({ queryKey: ['bank-transactions'] })
    },
    onError: (error: any, itemId, context: any) => {
      console.error('❌ Erreur lors de la suppression:', error)

      // Rollback en cas d'erreur
      if (context?.previousItems) {
        queryClient.setQueryData(['bank-items'], context.previousItems)
      }

      const errorMessage = error.response?.data?.detail || 'Erreur lors de la déconnexion de la banque'
      toast.error(errorMessage)
    }
  })

  return {
    items: items || [],
    isLoading,
    error,
    refetch,
    deleteItem: deleteItem.mutate,
    isDeleting: deleteItem.isPending
  }
}
