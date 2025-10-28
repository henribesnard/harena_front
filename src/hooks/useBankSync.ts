/**
 * Hook pour gérer la synchronisation des données bancaires
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bankSyncApiService } from '@/services/api/bankSyncApi'
import { SyncProgress } from '@/types/banking'
import toast from 'react-hot-toast'
import { useState } from 'react'

export const useBankSync = () => {
  const queryClient = useQueryClient()

  // État local pour la progression de la synchronisation
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({
    isOpen: false,
    status: 'idle',
    message: ''
  })

  // Query pour le statut de synchronisation
  const {
    data: syncStatus,
    isLoading: isLoadingStatus,
    refetch: refetchSyncStatus
  } = useQuery({
    queryKey: ['sync-status'],
    queryFn: bankSyncApiService.getSyncStatus,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
    // Refetch automatiquement pendant la synchronisation
    refetchInterval: (data) => {
      return syncProgress.status === 'syncing' ? 5000 : false
    }
  })

  // Mutation pour lancer une synchronisation
  const refreshSync = useMutation({
    mutationFn: bankSyncApiService.refreshSync,
    onMutate: () => {
      console.log('🔄 Démarrage de la synchronisation...')
      setSyncProgress({
        isOpen: true,
        status: 'syncing',
        message: 'Synchronisation en cours...'
      })
    },
    onSuccess: (data) => {
      console.log('✅ Synchronisation terminée:', data)

      // Vérifier si c'est un warning (aucun item trouvé)
      if (data.status === 'warning') {
        setSyncProgress({
          isOpen: true,
          status: 'error',
          message: data.message
        })
        toast.error(data.message)
        return
      }

      // Succès
      const itemsCount = data.items_count || 0
      const successMessage =
        itemsCount > 0
          ? `Synchronisation terminée ! ${itemsCount} ${itemsCount > 1 ? 'banques synchronisées' : 'banque synchronisée'}`
          : 'Synchronisation terminée avec succès'

      setSyncProgress({
        isOpen: true,
        status: 'success',
        message: successMessage
      })

      // Invalider les queries pour rafraîchir les données
      // Utiliser un timeout pour laisser le temps au backend de terminer
      setTimeout(() => {
        console.log('🔄 Rafraîchissement des données...')
        queryClient.invalidateQueries({ queryKey: ['sync-status'] })
        queryClient.invalidateQueries({ queryKey: ['bank-items'] })
        queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
        queryClient.invalidateQueries({ queryKey: ['bank-transactions'] })
      }, 2000)

      toast.success(successMessage)

      // Fermer le modal après 3 secondes en cas de succès
      setTimeout(() => {
        setSyncProgress((prev) => ({ ...prev, isOpen: false }))
      }, 3000)
    },
    onError: (error: any) => {
      console.error('❌ Erreur lors de la synchronisation:', error)

      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Erreur lors de la synchronisation'

      setSyncProgress({
        isOpen: true,
        status: 'error',
        message: errorMessage
      })

      toast.error('Échec de la synchronisation')
    }
  })

  /**
   * Fermer le modal de progression
   */
  const closeSyncModal = () => {
    setSyncProgress((prev) => ({ ...prev, isOpen: false }))
  }

  /**
   * Réinitialiser l'état de synchronisation
   */
  const resetSyncProgress = () => {
    setSyncProgress({
      isOpen: false,
      status: 'idle',
      message: ''
    })
  }

  return {
    // Statut de synchronisation
    syncStatus,
    isLoadingStatus,
    refetchSyncStatus,

    // Action de synchronisation
    refreshSync: refreshSync.mutate,
    isSyncing: refreshSync.isPending,

    // Progression de la synchronisation
    syncProgress,
    closeSyncModal,
    resetSyncProgress
  }
}
