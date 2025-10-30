// Types pour les métriques Harena

import { AccountsUsed } from './budgetProfiling'

export interface Variation {
  montant: number;
  pourcentage: number;
  direction: 'up' | 'down' | 'stable';
}

export interface Affichage {
  couleur: 'green' | 'green-light' | 'green-dark' | 'red' | 'orange' | 'gray';
  icone?: string;
  niveau?: string;
  message: string;
}

export interface Filtres {
  categorie: string | null;
  marchand: string | null;
}

// YoY Expenses
export interface YoYExpensesData {
  metric_type: 'yoy_expenses';
  periode_talon: {
    annee: number;
    total: number;
  };
  periode_cible: {
    annee: number;
    total: number;
  };
  variation: Variation;
  affichage: Affichage;
  filtres: Filtres;
  mise_a_jour: string;
  accounts_used?: AccountsUsed;
}

// MoM Expenses
export interface MoMExpensesData {
  metric_type: 'mom_expenses';
  periode_talon: {
    mois: number;
    annee: number;
    label: string;
    total: number;
  };
  periode_cible: {
    mois: number;
    annee: number;
    label: string;
    total: number;
  };
  variation: Variation;
  affichage: Affichage;
  filtres: Filtres;
  mise_a_jour: string;
  accounts_used?: AccountsUsed;
}

// YoY Income
export interface YoYIncomeData {
  metric_type: 'yoy_income';
  periode_talon: {
    annee: number;
    total: number;
  };
  periode_cible: {
    annee: number;
    total: number;
  };
  variation: Variation;
  affichage: Affichage;
  filtres: Filtres;
  mise_a_jour: string;
  accounts_used?: AccountsUsed;
}

// MoM Income
export interface MoMIncomeData {
  metric_type: 'mom_income';
  periode_talon: {
    mois: number;
    annee: number;
    label: string;
    total: number;
  };
  periode_cible: {
    mois: number;
    annee: number;
    label: string;
    total: number;
  };
  variation: Variation;
  affichage: Affichage;
  filtres: Filtres;
  mise_a_jour: string;
  accounts_used?: AccountsUsed;
}

// Coverage Rate
export interface CoverageData {
  metric_type: 'coverage_rate';
  periode: {
    mois: number;
    annee: number;
    label: string;
    is_current_month: boolean;
  };
  revenus: number;
  depenses: number;
  solde: number;
  taux_couverture: number;
  affichage: Affichage;
  mise_a_jour: string;
  accounts_used?: AccountsUsed;
}

// Generic API Response
export interface MetricResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Query Parameters Types
export interface YoYQueryParams {
  annee_talon?: number;
  annee_cible?: number;
  categorie?: string;
  marchand?: string;
}

export interface MoMQueryParams {
  mois_talon?: number;
  annee_talon?: number;
  mois_cible?: number;
  annee_cible?: number;
  categorie?: string;
  marchand?: string;
}

export interface CoverageQueryParams {
  mois?: number;
  annee?: number;
}
