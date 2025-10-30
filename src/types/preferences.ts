/**
 * Types pour les préférences utilisateur
 * Aligné avec le backend (db_service/config/default_preferences.py)
 */

/**
 * Configuration de sélection des comptes
 */
export interface AccountSelection {
  mode: 'all' | 'exclude_types' | 'include_specific'
  excluded_types: Array<'checking' | 'card'>
  included_accounts: number[]  // Liste de bridge_account_ids
}

/**
 * Paramètres budgétaires
 */
export interface BudgetSettings {
  months_analysis: number
  fixed_charge_min_occurrences: number
  fixed_charge_max_variance: number
  fixed_charge_min_amount: number
  account_selection: AccountSelection
}

/**
 * Paramètres d'affichage
 */
export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  currency?: string
}

/**
 * Paramètres de notifications
 */
export interface NotificationSettings {
  email_notifications?: boolean
  push_notifications?: boolean
  alert_threshold?: number
}

/**
 * Préférences utilisateur complètes
 */
export interface UserPreferences {
  budget_settings: BudgetSettings
  display_settings?: DisplaySettings
  notifications_settings?: NotificationSettings
}
