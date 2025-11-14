/**
 * Hook pour gérer l'expérience complète de connexion bancaire via Bridge.
 *
 * Étapes gérées automatiquement :
 * 1. Création/validation de la connexion Bridge côté user_service
 * 2. Création de la session Bridge Connect puis ouverture d'une popup
 * 3. Détection de la fermeture de la popup pour lancer la synchronisation initiale
 * 4. Rafraîchissement du cache React Query et lancement facultatif de l'enrichissement
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bankSyncApiService } from '@/services/api/bankSyncApi'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

export const useBankConnection = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  // Mutation pour créer la connexion Bridge
  const connectBridge = useMutation({
    mutationFn: bankSyncApiService.connectBridge,
    onSuccess: () => {
      console.log('✅ Connexion Bridge créée avec succès')
    },
    onError: (error: any) => {
      console.error('❌ Erreur lors de la connexion Bridge:', error)
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la connexion Bridge'
      toast.error(errorMessage)
    }
  })

  // Mutation pour créer une session Connect
  const createConnectSession = useMutation({
    mutationFn: ({ callbackUrl, countryCode }: { callbackUrl?: string; countryCode?: string }) =>
      bankSyncApiService.createConnectSession(callbackUrl, countryCode),
    onError: (error: any) => {
      console.error('❌ Erreur lors de la création de la session:', error)
      const errorMessage = error.response?.data?.detail || 'Erreur lors de la création de la session'
      toast.error(errorMessage)
    }
  })

  /**
   * Lance automatiquement la synchronisation complète après la connexion Bridge.
   * Retourne true si la synchronisation a bien démarré (items créés), false sinon.
   */
  const triggerAutomaticSync = async (): Promise<boolean> => {
    const loadingToastId = toast.loading('Lancement de la synchronisation bancaire...')
    try {
      const syncResponse = await bankSyncApiService.refreshSync()
      toast.dismiss(loadingToastId)

      if (syncResponse.status === 'warning') {
        const message = syncResponse.message || 'Bridge ne renvoie aucun compte pour le moment.'
        toast.error(message)
        return false
      }

      const itemsCount = syncResponse.items_count ?? 0
      const successLabel =
        itemsCount > 0
          ? `Synchronisation démarrée pour ${itemsCount} connexion${itemsCount > 1 ? 's' : ''}`
          : 'Synchronisation bancaire démarrée'

      toast.success(successLabel)
      return true
    } catch (error: any) {
      toast.dismiss(loadingToastId)
      const fallbackMessage = 'Impossible de synchroniser vos comptes pour le moment.'
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        fallbackMessage

      if (error.response?.status === 428) {
        toast.error('Connectez d’abord une banque via Bridge avant de lancer la synchronisation.')
      } else {
        toast.error(errorMessage)
      }

      console.error('Erreur lors de la synchronisation automatique:', error)
      return false
    }
  }

  /**
   * Démarre le processus complet de connexion bancaire.
   */
  const initiateBankConnection = async (callbackUrl?: string) => {
    try {
      console.log('🚀 Initialisation de la connexion bancaire...')

      // Étape 1 : créer la connexion Bridge si nécessaire
      try {
        await connectBridge.mutateAsync()
        console.log('✅ Connexion Bridge créée')
      } catch (error: any) {
        if (error.response?.status === 400 || error.response?.status === 409) {
          console.log('ℹ️ Connexion Bridge déjà existante, on continue...')
        } else {
          throw error
        }
      }

      // Étape 2 : créer la session Connect
      console.log('🔗 Création de la session Connect...')
      const session = await createConnectSession.mutateAsync({ callbackUrl })
      console.log('✅ Session Connect créée:', session.session_id)

      // Étape 3 : ouvrir l’URL Bridge dans une popup
      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      console.log('🪟 Ouverture de la popup Bridge...')
      const popup = window.open(
        session.connect_url,
        'Bridge Connect',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      )

      if (!popup) {
        toast.error("Impossible d'ouvrir la popup. Vérifiez les paramètres de votre navigateur.")
        return null
      }

      toast.success('Popup Bridge ouverte. Suivez les instructions pour connecter votre banque.')

      const handlePopupClosed = async () => {
        console.log('🧹 Popup fermée, démarrage de la synchronisation automatique...')
        const syncStarted = await triggerAutomaticSync()

        // Rafraîchir les données locales après la création des items et comptes
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['sync-status'] })
          queryClient.invalidateQueries({ queryKey: ['bank-items'] })
          queryClient.invalidateQueries({ queryKey: ['bank-accounts'] })
          queryClient.invalidateQueries({ queryKey: ['bank-transactions'] })
        }, syncStarted ? 2000 : 500)

        // Lancer l'enrichissement uniquement si la synchronisation s'est bien lancée
        if (syncStarted && user?.id) {
          setTimeout(async () => {
            try {
              console.log("🔁 Démarrage de l'enrichissement automatique vers Elasticsearch...")
              await bankSyncApiService.syncUserToElasticsearch(user.id)
              console.log('✅ Enrichissement vers Elasticsearch terminé')
              toast.success('Vos transactions ont été enrichies et synchronisées')
            } catch (error: any) {
              console.error("❌ Erreur lors de l'enrichissement:", error)
              // Pas d'alerte utilisateur : processus arrière-plan
            }
          }, 3000)
        }
      }

      const popupCheckInterval = window.setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheckInterval)
          void handlePopupClosed()
        }
      }, 1000)

      return session
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de la connexion:", error)
      throw error
    }
  }

  return {
    initiateBankConnection,
    isConnecting: connectBridge.isPending || createConnectSession.isPending
  }
}
