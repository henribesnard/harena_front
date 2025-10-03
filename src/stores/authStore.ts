import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../services/api'

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
          // Token invalide, déconnexion
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
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
