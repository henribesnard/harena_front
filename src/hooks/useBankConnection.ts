/**
 * Hook pour gérer la connexion Bridge et la création de session Connect
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
      // Ne pas afficher de toast ici, car c'est une étape intermédiaire
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
   * Fonction pour lancer le processus complet de connexion
   * 1. Créer la connexion Bridge (si nécessaire)
   * 2. Créer la session Connect
   * 3. Ouvrir l'URL Bridge dans une popup
   */
  const initiateBankConnection = async (callbackUrl?: string) => {
    try {
      console.log('🚀 Initialisation de la connexion bancaire...')

      // Étape 1 : Créer la connexion Bridge
      // Note: Cette étape peut échouer si l'utilisateur a déjà une connexion Bridge
      // Dans ce cas, on ignore l'erreur et on continue avec la session
      try {
        await connectBridge.mutateAsync()
        console.log('✅ Connexion Bridge créée')
      } catch (error: any) {
        // Si l'erreur indique que l'utilisateur a déjà une connexion, on continue
        if (error.response?.status === 400 || error.response?.status === 409) {
          console.log('ℹ️ Connexion Bridge déjà existante, on continue...')
        } else {
          throw error
        }
      }

      // Étape 2 : Créer la session Connect
      console.log('🔗 Création de la session Connect...')
      const session = await createConnectSession.mutateAsync({ callbackUrl })
      console.log('✅ Session Connect créée:', session.session_id)

      // Étape 3 : Ouvrir l'URL dans une popup
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
        toast.error('Impossible d\'ouvrir la popup. Vérifiez les paramètres de votre navigateur.')
        return null
      }

      toast.success('Popup Bridge ouverte. Suivez les instructions pour connecter votre banque.')

      // Écouter la fermeture de la popup pour rafraîchir les données et enrichir
      const popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheckInterval)
          console.log('🔄 Popup fermée, rafraîchissement des données...')

          // Invalider les queries pour rafraîchir les données
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['bank-items'] })
            queryClient.invalidateQueries({ queryKey: ['sync-status'] })
          }, 1000)

          // Lancer l'enrichissement automatique vers Elasticsearch
          if (user?.id) {
            setTimeout(async () => {
              try {
                console.log('🔍 Démarrage de l\'enrichissement automatique vers Elasticsearch...')
                await bankSyncApiService.syncUserToElasticsearch(user.id)
                console.log('✅ Enrichissement vers Elasticsearch terminé')
                toast.success('Vos transactions ont été enrichies et synchronisées')
              } catch (error: any) {
                console.error('❌ Erreur lors de l\'enrichissement:', error)
                // Ne pas afficher d'erreur à l'utilisateur car c'est un processus en arrière-plan
                // L'enrichissement pourra être relancé plus tard si nécessaire
              }
            }, 3000) // Attendre 3 secondes que les transactions soient bien enregistrées
          }
        }
      }, 1000)

      return session
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la connexion:', error)
      throw error
    }
  }

  return {
    initiateBankConnection,
    isConnecting: connectBridge.isPending || createConnectSession.isPending
  }
}
