// Types pour les 5 métriques core de Harena

export interface Variation {
  montant: number
  pourcentage: number
  direction: 'up' | 'down' | 'stable'
}

export interface Affichage {
  couleur: 'green' | 'green-light' | 'green-dark' | 'red' | 'orange' | 'gray'
  icone?: string
  niveau?: string
  message: string
}

// YoY Expenses
export interface YoYExpensesData {
  metric_type: 'yoy_expenses'
  periode_talon: {
    annee: number
    total: number
  }
  periode_cible: {
    annee: number
    total: number
  }
  variation: Variation
  affichage: Affichage
  filtres: {
    categorie: string | null
    marchand: string | null
  }
  mise_a_jour: string
}

// MoM Expenses
export interface MoMExpensesData {
  metric_type: 'mom_expenses'
  periode_talon: {
    mois: number
    annee: number
    label: string
    total: number
  }
  periode_cible: {
    mois: number
    annee: number
    label: string
    total: number
  }
  variation: Variation
  affichage: Affichage
  filtres: {
    categorie: string | null
    marchand: string | null
  }
  mise_a_jour: string
}

// YoY Income
export interface YoYIncomeData {
  metric_type: 'yoy_income'
  periode_talon: {
    annee: number
    total: number
  }
  periode_cible: {
    annee: number
    total: number
  }
  variation: Variation
  affichage: Affichage
  filtres: {
    categorie: string | null
    marchand: string | null
  }
  mise_a_jour: string
}

// MoM Income
export interface MoMIncomeData {
  metric_type: 'mom_income'
  periode_talon: {
    mois: number
    annee: number
    label: string
    total: number
  }
  periode_cible: {
    mois: number
    annee: number
    label: string
    total: number
  }
  variation: Variation
  affichage: Affichage
  filtres: {
    categorie: string | null
    marchand: string | null
  }
  mise_a_jour: string
}

// Coverage Rate
export interface CoverageData {
  metric_type: 'coverage_rate'
  periode: {
    mois: number
    annee: number
    label: string
    is_current_month: boolean
  }
  revenus: number
  depenses: number
  solde: number
  taux_couverture: number
  affichage: Affichage
  mise_a_jour: string
}

// Generic API Response
export interface MetricResponse<T> {
  success: boolean
  data: T
  timestamp: string
}
