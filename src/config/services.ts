/**
 * Configuration centralisée des URLs des services backend
 * Chaque service Docker tourne sur son propre port
 */

interface ServiceConfig {
  baseURL: string
  apiV1: string
}

// Configuration des services avec leurs ports Docker respectifs
console.log('🔍 ENV CHECK:', {
  METRIC: import.meta.env.VITE_METRIC_SERVICE_URL,
  USER: import.meta.env.VITE_USER_SERVICE_URL,
  CONVERSATION: import.meta.env.VITE_CONVERSATION_SERVICE_URL
});

export const SERVICES = {
  USER: {
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3000',
    apiV1: '/api/v1',
  },
  SEARCH: {
    baseURL: import.meta.env.VITE_SEARCH_SERVICE_URL || 'http://localhost:3001',
    apiV1: '/api/v1',
  },
  METRIC: {
    baseURL: import.meta.env.VITE_METRIC_SERVICE_URL || 'http://localhost:3002',
    apiV1: '/api/v1',
  },
  CONVERSATION_V1: {
    baseURL: import.meta.env.VITE_CONVERSATION_V1_SERVICE_URL || 'http://localhost:3003',
    apiV1: '/api/v1',
  },
  CONVERSATION: {
    baseURL: import.meta.env.VITE_CONVERSATION_SERVICE_URL || 'http://localhost:3008',
    apiV1: '/api/v3',
  },
  SYNC: {
    baseURL: import.meta.env.VITE_SYNC_SERVICE_URL || 'http://localhost:3004',
    apiV1: '/api/v1',
  },
  ENRICHMENT: {
    baseURL: import.meta.env.VITE_ENRICHMENT_SERVICE_URL || 'http://localhost:3005',
    apiV1: '/api/v1',
  },
} as const satisfies Record<string, ServiceConfig>

// Helper pour construire une URL complète
export const buildServiceURL = (service: keyof typeof SERVICES, path: string): string => {
  const config = SERVICES[service]
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${config.baseURL}${config.apiV1}${cleanPath}`
}

// Helper pour obtenir l'URL de base d'un service
export const getServiceBaseURL = (service: keyof typeof SERVICES): string => {
  return SERVICES[service].baseURL
}
