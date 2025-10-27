import axios from 'axios'
import { useAuthStore } from '../../stores/authStore'

// TODO: À ajuster selon l'URL du service de notifications quand il sera créé
const NOTIFICATIONS_API = import.meta.env.VITE_NOTIFICATIONS_API_URL || 'http://localhost:3007/api/v1/notifications'

export interface Notification {
  id: number
  user_id: number
  type: 'info' | 'warning' | 'alert' | 'success'
  title: string
  message: string
  read: boolean
  created_at: string
  data?: Record<string, any>
}

const api = axios.create({
  baseURL: NOTIFICATIONS_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
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
      console.warn('Token expiré dans notificationsApi - Déconnexion et redirection vers login')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Récupère les notifications de l'utilisateur
 */
export const getNotifications = async (limit = 20, unread_only = false): Promise<Notification[]> => {
  const { data } = await api.get<Notification[]>('/notifications', {
    params: { limit, unread_only },
  })
  return data
}

/**
 * Marque une notification comme lue
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  await api.put(`/notifications/${notificationId}/read`)
}

/**
 * Marque toutes les notifications comme lues
 */
export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all')
}

/**
 * Supprime une notification
 */
export const deleteNotification = async (notificationId: number): Promise<void> => {
  await api.delete(`/notifications/${notificationId}`)
}

/**
 * Récupère le nombre de notifications non lues
 */
export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get<{ count: number }>('/notifications/unread-count')
  return data.count
}
