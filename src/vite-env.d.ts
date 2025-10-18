/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Service URLs - Chaque service Docker tourne sur son propre port
  readonly VITE_USER_SERVICE_URL: string
  readonly VITE_SEARCH_SERVICE_URL: string
  readonly VITE_METRIC_SERVICE_URL: string
  readonly VITE_CONVERSATION_SERVICE_URL: string
  readonly VITE_SYNC_SERVICE_URL: string
  readonly VITE_ENRICHMENT_SERVICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
