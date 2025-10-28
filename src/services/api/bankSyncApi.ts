/**
 * Service API pour la synchronisation bancaire via Bridge API
 *
 * Ce service interagit avec:
 * - user_service (port 3000) pour la connexion Bridge
 * - sync_service (port 3004) pour la synchronisation des données
 */

import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { SERVICES } from '@/config/services'
import {
  BridgeConnection,
  BankItem,
  BankAccount,
  Transaction,
  SyncStatus,
  ConnectSessionResponse,
  SyncRefreshResponse,
  TransactionsQueryParams
} from '@/types/banking'

// ============================================
// INSTANCES AXIOS
// ============================================

/**
 * Instance axios pour le service utilisateur (connexion Bridge)
 */
const userApi: AxiosInstance = axios.create({
  baseURL: `${SERVICES.USER.baseURL}${SERVICES.USER.apiV1}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Instance axios pour le service de synchronisation
 */
const syncApi: AxiosInstance = axios.create({
  baseURL: `${SERVICES.SYNC.baseURL}${SERVICES.SYNC.apiV1}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Instance axios pour le service d'enrichissement
 */
const enrichmentApi: AxiosInstance = axios.create({
  baseURL: `${SERVICES.ENRICHMENT.baseURL}${SERVICES.ENRICHMENT.apiV1}`,
  timeout: 60000, // 60s timeout pour l'enrichissement
  headers: {
    'Content-Type': 'application/json'
  }
})

// ============================================
// INTERCEPTEURS - USER API
// ============================================

/**
 * Intercepteur pour ajouter le token JWT aux requêtes user_service
 */
userApi.interceptors.request.use(
  (config) => {
    const persistedAuth = localStorage.getItem('harena-auth')
    const token = persistedAuth ? JSON.parse(persistedAuth).state.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Intercepteur pour gérer les erreurs 401 (token expiré)
 */
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expiré dans bankSyncApi (user) - Déconnexion')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTEURS - SYNC API
// ============================================

/**
 * Intercepteur pour ajouter le token JWT aux requêtes sync_service
 */
syncApi.interceptors.request.use(
  (config) => {
    const persistedAuth = localStorage.getItem('harena-auth')
    const token = persistedAuth ? JSON.parse(persistedAuth).state.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Intercepteur pour gérer les erreurs 401 (token expiré)
 */
syncApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expiré dans bankSyncApi (sync) - Déconnexion')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// INTERCEPTEURS - ENRICHMENT API
// ============================================

/**
 * Intercepteur pour ajouter le token JWT aux requêtes enrichment_service
 */
enrichmentApi.interceptors.request.use(
  (config) => {
    const persistedAuth = localStorage.getItem('harena-auth')
    const token = persistedAuth ? JSON.parse(persistedAuth).state.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Intercepteur pour gérer les erreurs 401 (token expiré)
 */
enrichmentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expiré dans bankSyncApi (enrichment) - Déconnexion')
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// API SERVICE
// ============================================

export const bankSyncApiService = {
  // ============================================
  // CONNEXION BRIDGE
  // ============================================

  /**
   * Créer une connexion Bridge pour l'utilisateur
   * Endpoint: POST /api/v1/users/bridge/connect
   */
  connectBridge: async (): Promise<BridgeConnection> => {
    const { data } = await userApi.post<BridgeConnection>('/users/bridge/connect')
    return data
  },

  /**
   * Créer une session Connect pour connecter une banque
   * Endpoint: POST /api/v1/users/bridge/connect-session
   */
  createConnectSession: async (
    callbackUrl?: string,
    countryCode: string = 'FR'
  ): Promise<ConnectSessionResponse> => {
    const params = new URLSearchParams()
    if (callbackUrl) params.append('callback_url', callbackUrl)
    params.append('country_code', countryCode)

    const { data } = await userApi.post<ConnectSessionResponse>(
      `/users/bridge/connect-session?${params.toString()}`
    )
    return data
  },

  // ============================================
  // SYNCHRONISATION
  // ============================================

  /**
   * Lancer la synchronisation des données bancaires
   * Endpoint: POST /api/v1/sync/refresh
   */
  refreshSync: async (): Promise<SyncRefreshResponse> => {
    const { data } = await syncApi.post<SyncRefreshResponse>('/sync/refresh')
    return data
  },

  /**
   * Obtenir le statut de synchronisation
   * Endpoint: GET /api/v1/sync/status
   */
  getSyncStatus: async (): Promise<SyncStatus> => {
    const { data } = await syncApi.get<SyncStatus>('/sync/status')
    return data
  },

  // ============================================
  // ITEMS (Connexions bancaires)
  // ============================================

  /**
   * Récupérer tous les items de l'utilisateur
   * Endpoint: GET /api/v1/items/
   */
  getItems: async (): Promise<BankItem[]> => {
    const { data } = await syncApi.get<BankItem[]>('/items/')
    return data
  },

  /**
   * Récupérer un item spécifique
   * Endpoint: GET /api/v1/items/{itemId}
   */
  getItem: async (itemId: number): Promise<BankItem> => {
    const { data } = await syncApi.get<BankItem>(`/items/${itemId}`)
    return data
  },

  /**
   * Supprimer un item (déconnecter une banque)
   * Endpoint: DELETE /api/v1/items/{itemId}
   */
  deleteItem: async (itemId: number): Promise<void> => {
    await syncApi.delete(`/items/${itemId}`)
  },

  // ============================================
  // COMPTES BANCAIRES
  // ============================================

  /**
   * Récupérer tous les comptes de l'utilisateur
   * Endpoint: GET /api/v1/accounts/
   */
  getAccounts: async (): Promise<BankAccount[]> => {
    const { data } = await syncApi.get<BankAccount[]>('/accounts/')
    return data
  },

  /**
   * Récupérer les comptes d'un item spécifique
   * Endpoint: GET /api/v1/accounts/?item_id={itemId}
   */
  getAccountsByItem: async (itemId: number): Promise<BankAccount[]> => {
    const { data } = await syncApi.get<BankAccount[]>(`/accounts/?item_id=${itemId}`)
    return data
  },

  // ============================================
  // TRANSACTIONS
  // ============================================

  /**
   * Récupérer les transactions
   * Endpoint: GET /api/v1/transactions/
   */
  getTransactions: async (params?: TransactionsQueryParams): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.account_id) queryParams.append('account_id', params.account_id.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/transactions/?${queryString}` : '/transactions/'

    const { data } = await syncApi.get<Transaction[]>(endpoint)
    return data
  },

  // ============================================
  // ENRICHMENT (ELASTICSEARCH)
  // ============================================

  /**
   * Synchroniser les transactions d'un utilisateur vers Elasticsearch
   * Endpoint: POST /api/v1/enrichment/elasticsearch/sync-user/{userId}
   */
  syncUserToElasticsearch: async (userId: number): Promise<any> => {
    const { data } = await enrichmentApi.post(`/enrichment/elasticsearch/sync-user/${userId}`)
    return data
  }
}
