import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'
import { queryClient } from '../lib/queryClient'

interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  is_active: boolean
  is_superuser: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const data = await api.auth.login(email, password)
          const token = data.access_token

          set({ token, isAuthenticated: true })

          // Récupérer les infos de l'utilisateur
          const userData = await api.auth.getMe(token)
          console.log('User data received:', userData)

          // S'assurer que full_name existe
          if (!userData.full_name) {
            const firstName = userData.first_name || ''
            const lastName = userData.last_name || ''
            if (firstName && lastName) {
              userData.full_name = `${firstName} ${lastName}`
            } else if (firstName) {
              userData.full_name = firstName
            } else if (lastName) {
              userData.full_name = lastName
            } else {
              userData.full_name = userData.email.split('@')[0]
            }
          }

          set({ user: userData, isLoading: false })

          // Invalider tout le cache React Query pour forcer le rechargement avec le nouveau token
          queryClient.clear()
          console.log('React Query cache cleared after login')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
          set({ error: errorMessage, isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })

        // Nettoyer tout le cache React Query pour éviter d'afficher les données de l'ancien utilisateur
        queryClient.clear()
        console.log('React Query cache cleared after logout')
      },

      fetchUser: async () => {
        const { token } = get()
        if (!token) return

        set({ isLoading: true })
        try {
          const userData = await api.auth.getMe(token)
          console.log('User data fetched:', userData)

          // S'assurer que full_name existe
          if (!userData.full_name) {
            const firstName = userData.first_name || ''
            const lastName = userData.last_name || ''
            if (firstName && lastName) {
              userData.full_name = `${firstName} ${lastName}`
            } else if (firstName) {
              userData.full_name = firstName
            } else if (lastName) {
              userData.full_name = lastName
            } else {
              userData.full_name = userData.email.split('@')[0]
            }
          }

          set({ user: userData, isLoading: false, isAuthenticated: true })
        } catch (error) {
          // Token invalide ou expiré, déconnexion
          console.warn('fetchUser failed - token expired or invalid, redirecting to login')
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })

          // Nettoyer le cache React Query car le token est invalide
          queryClient.clear()
          console.log('React Query cache cleared due to invalid token')

          // Redirection vers la page de login
          window.location.href = '/login'
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'harena-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
