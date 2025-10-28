/**
 * Types pour la synchronisation bancaire via Bridge API
 *
 * Ces types correspondent aux modèles de données retournés par:
 * - user_service (POST /bridge/connect, POST /bridge/connect-session)
 * - sync_service (GET /items, GET /accounts, GET /transactions, GET /sync/status)
 */

/**
 * Connexion Bridge d'un utilisateur
 */
export interface BridgeConnection {
  id: number;
  user_id: number;
  bridge_user_uuid: string;
  external_user_id: string;
  last_token: string | null;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Item bancaire (connexion à une banque)
 */
export interface BankItem {
  id: number;
  user_id: number;
  bank_id: number;
  bank_name: string;
  status: number;
  status_code_info: string | null;
  status_code_description: string | null;
  created_at: string;
  updated_at: string;
  last_refresh_at: string | null;
}

/**
 * Compte bancaire
 */
export interface BankAccount {
  id: number;
  bridge_account_id: number;
  item_id: number;
  name: string;
  balance: number;
  type: string;
  currency_code: string;
  iban: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

/**
 * Transaction bancaire
 */
export interface Transaction {
  id: number;
  bridge_transaction_id: number;
  account_id: number;
  description: string;
  raw_description: string;
  amount: number;
  date: string;
  updated_at: string;
  currency_code: string;
  category_id: number | null;
  is_deleted: boolean;
  coming: boolean;
}

/**
 * Statut de synchronisation global
 */
export interface SyncStatus {
  user_id: number;
  total_items: number;
  active_items: number;
  total_accounts: number;
  total_transactions: number;
  last_sync: string | null;
  items: Array<{
    id: number;
    bank_name: string;
    status: number;
    accounts_count: number;
    transactions_count: number;
  }>;
}

/**
 * Réponse de création de session Connect
 */
export interface ConnectSessionResponse {
  connect_url: string;
  session_id: string;
}

/**
 * Réponse de rafraîchissement de synchronisation
 */
export interface SyncRefreshResponse {
  status: string;
  message: string;
  items_count?: number;
  item_ids?: number[];
  info?: string;
}

/**
 * Paramètres de requête pour récupérer les transactions
 */
export interface TransactionsQueryParams {
  limit?: number;
  offset?: number;
  account_id?: number;
}

/**
 * État de progression de synchronisation (UI)
 */
export interface SyncProgress {
  isOpen: boolean;
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
}
