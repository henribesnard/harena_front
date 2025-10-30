/**
 * Types pour le Budget Profiling Service
 */

/**
 * Détails d'un compte utilisé dans les calculs
 */
export interface AccountUsedDetails {
  bridge_account_id: number
  account_name: string
  account_type: 'checking' | 'card'
  balance: number
  currency: string
}

/**
 * Informations sur les comptes utilisés dans les calculs budgétaires
 * Retourné par GET /api/v1/budget/profile et POST /api/v1/budget/profile/analyze
 */
export interface AccountsUsed {
  total_accounts: number          // Nombre total de comptes (tous types)
  eligible_accounts: number       // Nombre de comptes éligibles (checking + card)
  used_accounts: number           // Nombre de comptes utilisés dans les calculs
  selection_mode: 'all' | 'exclude_types' | 'include_specific'
  accounts: AccountUsedDetails[]  // Liste détaillée des comptes utilisés
}

export interface BudgetProfile {
  user_id?: number
  user_segment: 'budget_serré' | 'équilibré' | 'confortable'
  behavioral_pattern: 'acheteur_impulsif' | 'planificateur' | 'dépensier_hebdomadaire' | 'indéterminé'
  avg_monthly_income: number
  avg_monthly_expenses: number
  avg_monthly_savings: number
  savings_rate: number
  fixed_charges_total: number
  semi_fixed_charges_total: number
  variable_charges_total: number
  remaining_to_live: number
  profile_completeness: number
  last_analyzed_at: string
  created_at?: string
  updated_at?: string
  accounts_used?: AccountsUsed    // Informations sur les comptes utilisés dans les calculs
}

export interface FixedCharge {
  id: number
  user_id: number
  merchant_name: string
  category: string
  avg_amount: number
  recurrence_day: number
  recurrence_confidence: number
  transaction_count: number
  is_active: boolean
  detected_at: string
}

export interface MonthlyAggregate {
  year: number
  month: number
  total_income: number
  total_expenses: number
  net_savings: number
}

export interface CategoryBreakdown {
  [category: string]: number
}

export interface AnalyzeProfileResponse extends BudgetProfile {
  accounts_used?: AccountsUsed    // Hérite de BudgetProfile
}

export interface HealthScore {
  score: number
  level: 'excellent' | 'good' | 'warning' | 'poor'
  insights: string[]
}
