# Filtrage des Comptes - Guide d'Implémentation Frontend

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture des changements](#architecture-des-changements)
3. [Modifications des types TypeScript](#modifications-des-types-typescript)
4. [Nouveaux composants UI](#nouveaux-composants-ui)
5. [Modifications des APIs](#modifications-des-apis)
6. [Modifications des composants existants](#modifications-des-composants-existants)
7. [Stores et état global](#stores-et-état-global)
8. [Plan d'implémentation](#plan-dimplémentation)
9. [Tests et validation](#tests-et-validation)
10. [Wireframes et maquettes](#wireframes-et-maquettes)

---

## Vue d'ensemble

### Contexte

Le backend a été mis à jour pour permettre aux utilisateurs de sélectionner quels comptes bancaires inclure dans les calculs budgétaires et les métriques financières. Le frontend doit maintenant :

1. **Afficher** les informations sur les comptes utilisés dans les calculs
2. **Permettre** à l'utilisateur de configurer ses préférences de filtrage
3. **Visualiser** la différence entre tous les comptes et les comptes utilisés
4. **Expliquer** le système de whitelist (checking + card uniquement)

### Principe du filtrage (rappel backend)

**Whitelist automatique** : Seuls les comptes `checking` et `card` sont éligibles.
- ❌ Exclus : `savings`, `loan`, `investment`, `other`
- ✅ Inclus : `checking` (compte courant), `card` (carte bancaire)

**3 modes de sélection** :
1. **`all`** : Tous les comptes éligibles (par défaut)
2. **`exclude_types`** : Exclure certains types (`checking` ou `card`)
3. **`include_specific`** : Liste spécifique d'IDs de comptes

### Impact sur le frontend

**Toutes les pages concernées** :
- 🏠 **Dashboard** : Afficher les comptes utilisés
- 💰 **Budget** : Indicateur des comptes inclus dans les calculs
- 📊 **Métriques** : Badge "Basé sur X comptes"
- 💬 **Chat** : L'IA reçoit déjà les infos (Phase 4 backend complétée)
- ⚙️ **Paramètres** : Nouvelle section pour configurer le filtrage

---

## Architecture des changements

### Structure des fichiers à créer/modifier

```
harena_front/
├── src/
│   ├── types/
│   │   ├── budgetProfiling.ts              # ✏️ MODIFIER - Ajouter AccountsUsed
│   │   └── preferences.ts                   # ✏️ MODIFIER - Ajouter AccountSelection
│   │
│   ├── services/api/
│   │   ├── budgetProfilingApi.ts           # ✏️ MODIFIER - Typage AccountsUsed
│   │   ├── coreMetricsApi.ts               # ✏️ MODIFIER - Typage AccountsUsed
│   │   └── userPreferencesApi.ts           # ✏️ MODIFIER - Ajouter account_selection
│   │
│   ├── components/
│   │   ├── banking/
│   │   │   ├── BankAccountsList.tsx        # ✏️ MODIFIER - Badge filtrage
│   │   │   ├── AccountFilterBadge.tsx      # ✨ NOUVEAU - Badge "X comptes utilisés"
│   │   │   └── AccountSelectionPanel.tsx   # ✨ NOUVEAU - Panel de configuration
│   │   │
│   │   ├── budget/
│   │   │   ├── ProfilCard.tsx              # ✏️ MODIFIER - Afficher accounts_used
│   │   │   └── AccountsUsedCard.tsx        # ✨ NOUVEAU - Card détaillée des comptes
│   │   │
│   │   ├── settings/
│   │   │   ├── AccountFilterSettings.tsx   # ✨ NOUVEAU - Page paramètres
│   │   │   └── AccountSelectionMode.tsx    # ✨ NOUVEAU - Sélecteur de mode
│   │   │
│   │   └── common/
│   │       └── InfoTooltip.tsx             # ✨ NOUVEAU - Tooltip explicatif
│   │
│   ├── hooks/
│   │   ├── useBankAccounts.ts              # ✏️ MODIFIER - Filtrer eligible vs used
│   │   ├── useAccountsUsed.ts              # ✨ NOUVEAU - Hook pour accounts_used
│   │   └── useAccountPreferences.ts        # ✨ NOUVEAU - Hook préférences filtrage
│   │
│   ├── stores/
│   │   └── preferencesStore.ts             # ✏️ MODIFIER - Ajouter account_selection
│   │
│   └── features/
│       ├── dashboard/
│       │   └── DashboardPage.tsx           # ✏️ MODIFIER - Card accounts_used
│       │
│       ├── budget/
│       │   └── BudgetPage.tsx              # ✏️ MODIFIER - Indicateur filtrage
│       │
│       ├── metrics/
│       │   └── MetricsDashboard.tsx        # ✏️ MODIFIER - Badge "Basé sur X comptes"
│       │
│       └── settings/
│           └── SettingsPage.tsx            # ✏️ MODIFIER - Onglet "Comptes"
```

---

## Modifications des types TypeScript

### 1. `src/types/budgetProfiling.ts` - Ajouter `AccountsUsed`

**Ajouter ces interfaces** :

```typescript
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
 * (Retourné par GET /api/v1/budget/profile et POST /api/v1/budget/profile/analyze)
 */
export interface AccountsUsed {
  total_accounts: number          // Nombre total de comptes (tous types)
  eligible_accounts: number       // Nombre de comptes éligibles (checking + card)
  used_accounts: number           // Nombre de comptes utilisés dans les calculs
  selection_mode: 'all' | 'exclude_types' | 'include_specific'
  accounts: AccountUsedDetails[]  // Liste détaillée des comptes utilisés
}
```

**Modifier l'interface `BudgetProfile`** :

```typescript
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
  accounts_used?: AccountsUsed    // ← AJOUTER ce champ optionnel
}

export interface AnalyzeProfileResponse extends BudgetProfile {
  accounts_used?: AccountsUsed    // ← Hérite de BudgetProfile
}
```

### 2. `src/types/preferences.ts` - Ajouter `AccountSelection`

**Créer/modifier** :

```typescript
/**
 * Configuration de sélection des comptes
 */
export interface AccountSelection {
  mode: 'all' | 'exclude_types' | 'include_specific'
  excluded_types: Array<'checking' | 'card'>
  included_accounts: number[]  // Liste de bridge_account_ids
}

/**
 * Paramètres budgétaires (étendu)
 */
export interface BudgetSettings {
  months_analysis: number
  fixed_charge_min_occurrences: number
  fixed_charge_max_variance: number
  fixed_charge_min_amount: number
  account_selection: AccountSelection  // ← AJOUTER
}

export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  currency?: string
}

export interface NotificationSettings {
  email_notifications?: boolean
  push_notifications?: boolean
  alert_threshold?: number
}

export interface UserPreferences {
  budget_settings: BudgetSettings
  display_settings?: DisplaySettings
  notifications_settings?: NotificationSettings
}
```

### 3. `src/types/coreMetrics.ts` - Ajouter `AccountsUsed`

**Ajouter** :

```typescript
import { AccountsUsed } from './budgetProfiling'

/**
 * Réponse d'une métrique (étendue)
 */
export interface MetricResponse {
  status: string
  data: {
    value: number
    previous_value?: number
    change_percentage?: number
    accounts_used?: AccountsUsed  // ← AJOUTER
    // ... autres champs existants
  }
}
```

---

## Nouveaux composants UI

### 1. `components/common/InfoTooltip.tsx`

**Composant réutilisable pour les explications**

```typescript
import React from 'react'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  content: string | React.ReactNode
  className?: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = '' }) => {
  return (
    <div className={`group relative inline-block ${className}`}>
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded-lg py-2 px-3 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 shadow-lg">
        <div className="whitespace-normal">{content}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  )
}
```

**Usage** : Partout où on doit expliquer le filtrage.

---

### 2. `components/banking/AccountFilterBadge.tsx`

**Badge compact pour afficher le nombre de comptes utilisés**

```typescript
import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { AccountsUsed } from '@/types/budgetProfiling'
import { InfoTooltip } from '../common/InfoTooltip'

interface AccountFilterBadgeProps {
  accountsUsed?: AccountsUsed
  variant?: 'compact' | 'detailed'
}

export const AccountFilterBadge: React.FC<AccountFilterBadgeProps> = ({
  accountsUsed,
  variant = 'compact'
}) => {
  if (!accountsUsed) {
    return null
  }

  const { used_accounts, eligible_accounts, selection_mode } = accountsUsed

  const isFiltered = selection_mode !== 'all' || used_accounts < eligible_accounts

  const modeLabels = {
    all: 'Tous les comptes éligibles',
    exclude_types: 'Filtrage par type',
    include_specific: 'Comptes spécifiques'
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
        {isFiltered ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        <span className="font-medium">{used_accounts} compte{used_accounts > 1 ? 's' : ''}</span>
        <InfoTooltip
          content={
            <div>
              <p className="font-semibold mb-1">Comptes utilisés dans les calculs</p>
              <p className="text-xs mb-2">{modeLabels[selection_mode]}</p>
              <p className="text-xs text-gray-300">
                Seuls les comptes courants et cartes bancaires sont éligibles.
                Les comptes épargne, prêts et investissements sont automatiquement exclus.
              </p>
            </div>
          }
        />
      </div>
    )
  }

  // variant === 'detailed'
  return (
    <div className="bg-white border border-purple-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isFiltered ? (
            <AlertCircle className="w-5 h-5 text-purple-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
          <h4 className="font-semibold text-gray-900">Comptes utilisés</h4>
        </div>
        <InfoTooltip
          content={
            <div className="text-xs">
              <p className="font-semibold mb-1">Filtrage automatique</p>
              <p className="text-gray-300">
                Seuls vos comptes courants et cartes bancaires sont inclus dans les calculs.
                Cela permet d'avoir une vision précise de vos dépenses courantes sans mélanger
                avec l'épargne ou les investissements.
              </p>
            </div>
          }
        />
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Mode de sélection :</span>
          <span className="font-medium text-gray-900">{modeLabels[selection_mode]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Comptes utilisés :</span>
          <span className="font-medium text-purple-700">
            {used_accounts} / {eligible_accounts} éligibles
          </span>
        </div>
        {accountsUsed.total_accounts > accountsUsed.eligible_accounts && (
          <p className="text-xs text-gray-500 mt-2">
            {accountsUsed.total_accounts - accountsUsed.eligible_accounts} compte(s) exclu(s) automatiquement
            (épargne, prêts, investissements)
          </p>
        )}
      </div>
    </div>
  )
}
```

**Usage** :
- En badge compact dans les headers de sections
- En version détaillée dans les cards de statistiques

---

### 3. `components/budget/AccountsUsedCard.tsx`

**Card détaillée affichant tous les comptes utilisés**

```typescript
import React from 'react'
import { Wallet, CreditCard, TrendingUp } from 'lucide-react'
import { AccountsUsed } from '@/types/budgetProfiling'

interface AccountsUsedCardProps {
  accountsUsed?: AccountsUsed
  onConfigureClick?: () => void
}

export const AccountsUsedCard: React.FC<AccountsUsedCardProps> = ({
  accountsUsed,
  onConfigureClick
}) => {
  if (!accountsUsed || accountsUsed.accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucun compte utilisé dans les calculs</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getAccountIcon = (type: string) => {
    return type === 'card' ? CreditCard : Wallet
  }

  const getAccountTypeLabel = (type: string) => {
    return type === 'card' ? 'Carte bancaire' : 'Compte courant'
  }

  const totalBalance = accountsUsed.accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Comptes utilisés</h3>
            <p className="text-purple-100 text-sm mt-1">
              {accountsUsed.used_accounts} compte{accountsUsed.used_accounts > 1 ? 's' : ''} inclus dans les calculs
            </p>
          </div>
          {onConfigureClick && (
            <button
              onClick={onConfigureClick}
              className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Configurer
            </button>
          )}
        </div>
      </div>

      {/* Accounts List */}
      <div className="p-6">
        <div className="space-y-3 mb-4">
          {accountsUsed.accounts.map((account) => {
            const Icon = getAccountIcon(account.account_type)
            return (
              <div
                key={account.bridge_account_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {account.account_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getAccountTypeLabel(account.account_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-gray-900 font-mono">
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total Balance */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Solde total</span>
            </div>
            <span className="text-2xl font-bold text-purple-700 font-mono">
              {formatCurrency(totalBalance, accountsUsed.accounts[0]?.currency || 'EUR')}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">
            Seuls les comptes courants et cartes sont inclus
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Usage** :
- Page Dashboard (section principale)
- Page Budget (en haut de page)

---

### 4. `components/settings/AccountSelectionMode.tsx`

**Sélecteur de mode de filtrage**

```typescript
import React from 'react'
import { Check } from 'lucide-react'

type SelectionMode = 'all' | 'exclude_types' | 'include_specific'

interface AccountSelectionModeProps {
  value: SelectionMode
  onChange: (mode: SelectionMode) => void
  disabled?: boolean
}

interface ModeOption {
  value: SelectionMode
  label: string
  description: string
}

const modes: ModeOption[] = [
  {
    value: 'all',
    label: 'Tous les comptes éligibles',
    description: 'Inclure automatiquement tous les comptes courants et cartes bancaires'
  },
  {
    value: 'exclude_types',
    label: 'Exclure certains types',
    description: 'Exclure soit les comptes courants, soit les cartes bancaires'
  },
  {
    value: 'include_specific',
    label: 'Comptes spécifiques',
    description: 'Choisir manuellement les comptes à inclure dans les calculs'
  }
]

export const AccountSelectionMode: React.FC<AccountSelectionModeProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const isSelected = value === mode.value
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            disabled={disabled}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                ${isSelected
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 bg-white'
                }
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                  {mode.label}
                </h4>
                <p className="text-sm text-gray-600">
                  {mode.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

---

### 5. `components/settings/AccountFilterSettings.tsx`

**Panel complet de configuration du filtrage**

```typescript
import React, { useState, useEffect } from 'react'
import { Save, RotateCcw, AlertCircle } from 'lucide-react'
import { AccountSelectionMode } from './AccountSelectionMode'
import { BankAccount } from '@/types/banking'
import { AccountSelection } from '@/types/preferences'
import { InfoTooltip } from '../common/InfoTooltip'

interface AccountFilterSettingsProps {
  accounts: BankAccount[]  // Tous les comptes (pour afficher les éligibles)
  currentSelection: AccountSelection
  onSave: (selection: AccountSelection) => Promise<void>
  onReset: () => Promise<void>
}

export const AccountFilterSettings: React.FC<AccountFilterSettingsProps> = ({
  accounts,
  currentSelection,
  onSave,
  onReset
}) => {
  const [mode, setMode] = useState(currentSelection.mode)
  const [excludedTypes, setExcludedTypes] = useState<Array<'checking' | 'card'>>(
    currentSelection.excluded_types
  )
  const [includedAccounts, setIncludedAccounts] = useState<number[]>(
    currentSelection.included_accounts
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Filtrer les comptes éligibles (checking + card uniquement)
  const eligibleAccounts = accounts.filter(
    (acc) => acc.type === 'checking' || acc.type === 'card'
  )

  // Détecter les changements
  useEffect(() => {
    const changed =
      mode !== currentSelection.mode ||
      JSON.stringify(excludedTypes) !== JSON.stringify(currentSelection.excluded_types) ||
      JSON.stringify(includedAccounts) !== JSON.stringify(currentSelection.included_accounts)
    setHasChanges(changed)
  }, [mode, excludedTypes, includedAccounts, currentSelection])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        mode,
        excluded_types: excludedTypes,
        included_accounts: includedAccounts
      })
      setHasChanges(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await onReset()
      // Réinitialiser l'état local
      setMode('all')
      setExcludedTypes([])
      setIncludedAccounts([])
      setHasChanges(false)
    } finally {
      setIsResetting(false)
    }
  }

  const toggleExcludedType = (type: 'checking' | 'card') => {
    if (excludedTypes.includes(type)) {
      setExcludedTypes(excludedTypes.filter((t) => t !== type))
    } else {
      setExcludedTypes([...excludedTypes, type])
    }
  }

  const toggleIncludedAccount = (accountId: number) => {
    if (includedAccounts.includes(accountId)) {
      setIncludedAccounts(includedAccounts.filter((id) => id !== accountId))
    } else {
      setIncludedAccounts([...includedAccounts, accountId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Explication */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Filtrage automatique des comptes</p>
            <p className="text-blue-700">
              Seuls vos comptes courants et cartes bancaires peuvent être inclus dans les calculs
              budgétaires. Les comptes épargne, prêts et investissements sont automatiquement exclus
              pour garantir une analyse précise de vos dépenses courantes.
            </p>
          </div>
        </div>
      </div>

      {/* Mode de sélection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Mode de sélection</h3>
          <InfoTooltip
            content="Choisissez comment vous souhaitez sélectionner les comptes à inclure dans vos calculs budgétaires"
          />
        </div>
        <AccountSelectionMode
          value={mode}
          onChange={setMode}
          disabled={isSaving || isResetting}
        />
      </div>

      {/* Configuration selon le mode */}
      {mode === 'exclude_types' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Types à exclure</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludedTypes.includes('checking')}
                onChange={() => toggleExcludedType('checking')}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                disabled={isSaving || isResetting}
              />
              <span className="text-sm font-medium text-gray-700">
                Exclure les comptes courants
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludedTypes.includes('card')}
                onChange={() => toggleExcludedType('card')}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                disabled={isSaving || isResetting}
              />
              <span className="text-sm font-medium text-gray-700">
                Exclure les cartes bancaires
              </span>
            </label>
          </div>
        </div>
      )}

      {mode === 'include_specific' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Comptes à inclure ({includedAccounts.length} sélectionné{includedAccounts.length > 1 ? 's' : ''})
          </h4>
          <div className="space-y-2">
            {eligibleAccounts.map((account) => (
              <label
                key={account.bridge_account_id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={includedAccounts.includes(account.bridge_account_id)}
                  onChange={() => toggleIncludedAccount(account.bridge_account_id)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  disabled={isSaving || isResetting}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{account.name}</div>
                  <div className="text-sm text-gray-500">
                    {account.type === 'checking' ? 'Compte courant' : 'Carte bancaire'} •{' '}
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: account.currency_code
                    }).format(account.balance)}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {eligibleAccounts.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun compte éligible trouvé
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          disabled={isSaving || isResetting}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isResetting ? 'Réinitialisation...' : 'Réinitialiser'}</span>
        </button>

        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isResetting}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      {hasChanges && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ Vous avez des modifications non enregistrées. N'oubliez pas d'enregistrer vos changements.
        </p>
      )}
    </div>
  )
}
```

---

## Modifications des APIs

### 1. `src/services/api/budgetProfilingApi.ts`

**Aucune modification nécessaire** - Les types `BudgetProfile` et `AnalyzeProfileResponse` incluent déjà `accounts_used?` après modification des types TypeScript.

Le backend retourne déjà ce champ, il sera donc automatiquement typé.

---

### 2. `src/services/api/coreMetricsApi.ts`

**Modifier** pour typer `accounts_used` dans les réponses :

```typescript
import axios from 'axios'
import { useAuthStore } from '../../stores/authStore'
import { AccountsUsed } from '../../types/budgetProfiling'

// ... code existant ...

// Ajouter l'interface pour les réponses de métriques
export interface MetricResponse {
  status: string
  data: {
    value: number
    previous_value?: number
    change_percentage?: number
    period_label?: string
    accounts_used?: AccountsUsed  // ← AJOUTER
    [key: string]: any
  }
}

// Modifier les fonctions pour retourner MetricResponse
export const getExpensesYoY = async (): Promise<MetricResponse> => {
  const { data } = await api.get<MetricResponse>('/metrics/expenses/yoy')
  return data
}

export const getExpensesMoM = async (): Promise<MetricResponse> => {
  const { data } = await api.get<MetricResponse>('/metrics/expenses/mom')
  return data
}

export const getIncomeYoY = async (): Promise<MetricResponse> => {
  const { data } = await api.get<MetricResponse>('/metrics/income/yoy')
  return data
}

export const getIncomeMoM = async (): Promise<MetricResponse> => {
  const { data } = await api.get<MetricResponse>('/metrics/income/mom')
  return data
}

// ... autres métriques avec le même pattern
```

---

### 3. `src/services/api/userPreferencesApi.ts`

**Modifier** pour inclure `account_selection` dans `BudgetSettings` :

```typescript
// ... imports existants ...

export interface AccountSelection {
  mode: 'all' | 'exclude_types' | 'include_specific'
  excluded_types: Array<'checking' | 'card'>
  included_accounts: number[]
}

export interface BudgetSettings {
  months_analysis: number
  fixed_charge_min_occurrences: number
  fixed_charge_max_variance: number
  fixed_charge_min_amount: number
  account_selection: AccountSelection  // ← AJOUTER
}

// ... reste du code inchangé ...
```

---

## Modifications des composants existants

### 1. `components/banking/BankAccountsList.tsx`

**Modifier** pour distinguer comptes éligibles vs non-éligibles :

```typescript
// ... imports existants ...

interface BankAccountsListProps {
  accounts: BankAccount[]
  highlightEligible?: boolean  // ← AJOUTER
}

export const BankAccountsList: React.FC<BankAccountsListProps> = ({
  accounts,
  highlightEligible = false
}) => {
  // ... code existant ...

  const isEligible = (account: BankAccount) => {
    return account.type === 'checking' || account.type === 'card'
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const eligible = isEligible(account)

        return (
          <div
            key={account.id}
            className={`
              bg-white rounded-lg border p-4 flex items-center justify-between hover:shadow-sm transition-shadow
              ${highlightEligible && eligible ? 'border-purple-300 bg-purple-50' : 'border-gray-200'}
              ${highlightEligible && !eligible ? 'opacity-60' : ''}
            `}
          >
            {/* ... contenu existant ... */}

            {highlightEligible && (
              <div className="ml-4">
                {eligible ? (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    Éligible
                  </span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Exclus auto
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

---

### 2. `components/budget/ProfilCard.tsx`

**Ajouter** un indicateur des comptes utilisés :

```typescript
// ... imports existants ...
import { AccountFilterBadge } from '../banking/AccountFilterBadge'

interface ProfilCardProps {
  profile: BudgetProfile
  // ... autres props
}

export const ProfilCard: React.FC<ProfilCardProps> = ({ profile, ...props }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header avec badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profil budgétaire</h3>
        <AccountFilterBadge accountsUsed={profile.accounts_used} variant="compact" />
      </div>

      {/* ... reste du contenu existant ... */}
    </div>
  )
}
```

---

### 3. `features/dashboard/DashboardPage.tsx`

**Ajouter** la card `AccountsUsedCard` :

```typescript
// ... imports existants ...
import { AccountsUsedCard } from '@/components/budget/AccountsUsedCard'
import { useNavigate } from 'react-router-dom'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: budgetProfile } = useBudgetProfile()

  const handleConfigureAccounts = () => {
    navigate('/settings?tab=accounts')
  }

  return (
    <div className="space-y-6">
      {/* Section des comptes utilisés */}
      {budgetProfile?.accounts_used && (
        <AccountsUsedCard
          accountsUsed={budgetProfile.accounts_used}
          onConfigureClick={handleConfigureAccounts}
        />
      )}

      {/* ... reste du contenu existant ... */}
    </div>
  )
}
```

---

### 4. `features/metrics/MetricsDashboard.tsx`

**Ajouter** le badge dans les cards de métriques :

```typescript
// ... imports existants ...
import { AccountFilterBadge } from '@/components/banking/AccountFilterBadge'

export const MetricsDashboard: React.FC = () => {
  const { data: expensesYoY } = useQuery(['expensesYoY'], getExpensesYoY)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Métriques financières</h2>
        {expensesYoY?.data?.accounts_used && (
          <AccountFilterBadge
            accountsUsed={expensesYoY.data.accounts_used}
            variant="compact"
          />
        )}
      </div>

      {/* ... reste du contenu ... */}
    </div>
  )
}
```

---

### 5. `features/settings/SettingsPage.tsx`

**Ajouter** un nouvel onglet "Comptes" :

```typescript
// ... imports existants ...
import { AccountFilterSettings } from '@/components/settings/AccountFilterSettings'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import { useAccountPreferences } from '@/hooks/useAccountPreferences'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const { accounts } = useBankAccounts()
  const { preferences, updatePreferences, resetPreferences } = useAccountPreferences()

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'accounts', label: 'Comptes', icon: Wallet },  // ← NOUVEAU
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const handleSaveAccountSelection = async (selection: AccountSelection) => {
    await updatePreferences({
      budget_settings: {
        ...preferences.budget_settings,
        account_selection: selection
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 font-medium transition-colors
              ${activeTab === tab.id
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'accounts' && (
          <AccountFilterSettings
            accounts={accounts}
            currentSelection={preferences.budget_settings.account_selection}
            onSave={handleSaveAccountSelection}
            onReset={resetPreferences}
          />
        )}

        {/* ... autres onglets ... */}
      </div>
    </div>
  )
}
```

---

## Stores et état global

### Modifier `stores/preferencesStore.ts`

**Ajouter** `account_selection` dans le store :

```typescript
// ... imports existants ...
import { AccountSelection } from '@/types/preferences'

interface PreferencesState {
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchPreferences: () => Promise<void>
  updateAccountSelection: (selection: AccountSelection) => Promise<void>  // ← NOUVEAU
  updateBudgetSettings: (settings: Partial<BudgetSettings>) => Promise<void>
  resetPreferences: () => Promise<void>
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: null,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    set({ isLoading: true, error: null })
    try {
      const prefs = await getUserPreferences()
      set({ preferences: prefs, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors du chargement des préférences', isLoading: false })
    }
  },

  updateAccountSelection: async (selection: AccountSelection) => {
    set({ isLoading: true, error: null })
    try {
      const currentPrefs = get().preferences
      if (!currentPrefs) throw new Error('No preferences loaded')

      const updated = await updateUserPreferences({
        budget_settings: {
          ...currentPrefs.budget_settings,
          account_selection: selection
        }
      })
      set({ preferences: updated, isLoading: false })
    } catch (error) {
      set({ error: 'Erreur lors de la mise à jour', isLoading: false })
      throw error
    }
  },

  // ... autres actions ...
}))
```

---

## Hooks personnalisés

### 1. `hooks/useAccountsUsed.ts` (NOUVEAU)

```typescript
import { useQuery } from '@tanstack/react-query'
import { AccountsUsed } from '@/types/budgetProfiling'
import { getBudgetProfile } from '@/services/api/budgetProfilingApi'

/**
 * Hook pour récupérer les informations sur les comptes utilisés
 */
export const useAccountsUsed = () => {
  const { data: profile, isLoading, error } = useQuery(
    ['budgetProfile'],
    getBudgetProfile,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  return {
    accountsUsed: profile?.accounts_used,
    isLoading,
    error
  }
}
```

---

### 2. `hooks/useAccountPreferences.ts` (NOUVEAU)

```typescript
import { useState, useEffect } from 'react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { AccountSelection } from '@/types/preferences'

/**
 * Hook pour gérer les préférences de filtrage des comptes
 */
export const useAccountPreferences = () => {
  const { preferences, fetchPreferences, updateAccountSelection, resetPreferences } = usePreferencesStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPreferences = async () => {
      await fetchPreferences()
      setIsLoading(false)
    }
    loadPreferences()
  }, [fetchPreferences])

  const updateSelection = async (selection: AccountSelection) => {
    await updateAccountSelection(selection)
  }

  const reset = async () => {
    await resetPreferences()
  }

  return {
    preferences: preferences || {
      budget_settings: {
        months_analysis: 12,
        fixed_charge_min_occurrences: 5,
        fixed_charge_max_variance: 0.2,
        fixed_charge_min_amount: 10,
        account_selection: {
          mode: 'all',
          excluded_types: [],
          included_accounts: []
        }
      }
    },
    accountSelection: preferences?.budget_settings?.account_selection,
    isLoading,
    updatePreferences: updateSelection,
    resetPreferences: reset
  }
}
```

---

## Plan d'implémentation

### Phase 1 : Types et API (2-3 heures)

**Objectif** : Mettre à jour les types et les APIs pour supporter `accounts_used`

#### Tâches :
1. ✅ Modifier `src/types/budgetProfiling.ts`
   - Ajouter interfaces `AccountUsedDetails` et `AccountsUsed`
   - Ajouter champ `accounts_used?` à `BudgetProfile`

2. ✅ Modifier `src/types/preferences.ts`
   - Ajouter interface `AccountSelection`
   - Ajouter champ `account_selection` à `BudgetSettings`

3. ✅ Modifier `src/services/api/coreMetricsApi.ts`
   - Ajouter typage `MetricResponse` avec `accounts_used?`
   - Mettre à jour les fonctions de métriques

4. ✅ Modifier `src/services/api/userPreferencesApi.ts`
   - Ajouter `account_selection` à `BudgetSettings`

**Test** : Vérifier que TypeScript compile sans erreurs

---

### Phase 2 : Composants de base (3-4 heures)

**Objectif** : Créer les composants réutilisables de base

#### Tâches :
1. ✅ Créer `components/common/InfoTooltip.tsx`
2. ✅ Créer `components/banking/AccountFilterBadge.tsx`
3. ✅ Créer `components/budget/AccountsUsedCard.tsx`
4. ✅ Créer `components/settings/AccountSelectionMode.tsx`

**Test** : Créer une page de test (Storybook ou route temporaire) pour visualiser ces composants

---

### Phase 3 : Panel de configuration (4-5 heures)

**Objectif** : Créer le panel complet de configuration

#### Tâches :
1. ✅ Créer `components/settings/AccountFilterSettings.tsx`
2. ✅ Créer `hooks/useAccountPreferences.ts`
3. ✅ Modifier `stores/preferencesStore.ts` pour ajouter `updateAccountSelection`
4. ✅ Ajouter onglet "Comptes" dans `features/settings/SettingsPage.tsx`

**Test** :
- Naviguer vers Settings → Comptes
- Changer le mode de sélection
- Sauvegarder et vérifier que l'appel API est fait
- Vérifier en base de données que `account_selection` a été mis à jour

---

### Phase 4 : Intégration Dashboard/Budget (2-3 heures)

**Objectif** : Afficher les comptes utilisés dans les pages principales

#### Tâches :
1. ✅ Créer `hooks/useAccountsUsed.ts`
2. ✅ Modifier `features/dashboard/DashboardPage.tsx`
   - Ajouter `<AccountsUsedCard />` en haut
   - Lier le bouton "Configurer" aux settings
3. ✅ Modifier `components/budget/ProfilCard.tsx`
   - Ajouter `<AccountFilterBadge />` dans le header
4. ✅ Modifier `components/banking/BankAccountsList.tsx`
   - Ajouter option `highlightEligible`

**Test** :
- Naviguer vers Dashboard
- Vérifier que la card des comptes utilisés s'affiche
- Cliquer sur "Configurer" → doit rediriger vers Settings
- Vérifier que le badge s'affiche dans ProfilCard

---

### Phase 5 : Intégration Métriques (1-2 heures)

**Objectif** : Afficher le badge dans les métriques

#### Tâches :
1. ✅ Modifier `features/metrics/MetricsDashboard.tsx`
   - Ajouter `<AccountFilterBadge />` dans le header
2. ✅ Modifier `components/MetricCard.tsx` (si nécessaire)
   - Afficher petit indicateur sur chaque carte

**Test** :
- Naviguer vers Métriques
- Vérifier que le badge "X comptes" s'affiche
- Hover sur le badge → tooltip doit expliquer le filtrage

---

### Phase 6 : Tests et validation (2-3 heures)

**Objectif** : Tester tous les scénarios utilisateur

#### Scénarios à tester :

**1. Utilisateur avec 1 seul compte éligible**
- Dashboard doit afficher "1 compte"
- Settings → mode "all" par défaut
- Impossible d'exclure le seul compte (validation)

**2. Utilisateur avec plusieurs comptes (checking + card)**
- Dashboard affiche la liste complète
- Mode "exclude_types" → Exclure les cartes
- Vérifier que les métriques changent

**3. Mode "include_specific"**
- Sélectionner 2 comptes sur 5
- Sauvegarder
- Vérifier Dashboard → "2 comptes utilisés"
- Vérifier les métriques se mettent à jour

**4. Réinitialisation**
- Faire des modifications
- Cliquer "Réinitialiser"
- Vérifier retour au mode "all"

**5. Comptes non-éligibles**
- Avoir un compte "savings"
- Vérifier qu'il n'apparaît JAMAIS dans les options
- BankAccountsList avec `highlightEligible=true` doit le griser

---

### Phase 7 : Polish et UX (1-2 heures)

**Objectif** : Peaufiner l'expérience utilisateur

#### Tâches :
1. ✅ Animations et transitions
2. ✅ Messages de confirmation après sauvegarde
3. ✅ Loading states pendant les appels API
4. ✅ Error handling et messages d'erreur clairs
5. ✅ Responsive design (mobile)
6. ✅ Accessibilité (aria-labels, keyboard navigation)

**Test** :
- Tester sur mobile
- Tester avec screen reader
- Tester avec clavier uniquement

---

## Tests et validation

### Tests unitaires à créer

```typescript
// components/banking/AccountFilterBadge.test.tsx
describe('AccountFilterBadge', () => {
  it('should display compact badge with correct count', () => {
    // ...
  })

  it('should show tooltip on hover', () => {
    // ...
  })

  it('should display detailed variant correctly', () => {
    // ...
  })
})

// components/settings/AccountFilterSettings.test.tsx
describe('AccountFilterSettings', () => {
  it('should allow mode selection', () => {
    // ...
  })

  it('should save preferences on button click', () => {
    // ...
  })

  it('should detect changes and enable save button', () => {
    // ...
  })

  it('should reset to defaults', () => {
    // ...
  })
})

// hooks/useAccountPreferences.test.ts
describe('useAccountPreferences', () => {
  it('should fetch preferences on mount', () => {
    // ...
  })

  it('should update account selection', () => {
    // ...
  })
})
```

---

### Tests d'intégration

**Flux complet** :
1. Connexion utilisateur
2. Navigation vers Dashboard → voir comptes utilisés
3. Clic "Configurer" → redirection Settings
4. Changement de mode → "exclude_types"
5. Exclusion des cartes
6. Sauvegarde
7. Retour Dashboard → vérifier mise à jour
8. Navigation Métriques → vérifier badge mis à jour

---

## Wireframes et maquettes

### Dashboard - Card "Comptes utilisés"

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Comptes utilisés              [Configurer]           │
│ 6 comptes inclus dans les calculs                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  💳 Compte Courant 1               1 082,27 €           │
│     Compte courant                                       │
│                                                          │
│  💳 Compte Courant 2               1 406,61 €           │
│     Compte courant                                       │
│                                                          │
│  💳 Carte Visa                      -1 102,07 €         │
│     Carte bancaire                                       │
│                                                          │
│  ... (3 autres comptes)                                 │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  📈 Solde total                    2 107,70 €           │
│  ℹ️  Seuls les comptes courants et cartes sont inclus   │
└─────────────────────────────────────────────────────────┘
```

---

### Settings - Onglet "Comptes"

```
┌─────────────────────────────────────────────────────────┐
│  ⚙️  Général  💳 Comptes  💰 Budget  🔔 Notifications   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ℹ️  Filtrage automatique des comptes                   │
│  Seuls vos comptes courants et cartes bancaires         │
│  peuvent être inclus dans les calculs budgétaires.      │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  Mode de sélection                                  ⓘ   │
│                                                          │
│  ⦿ Tous les comptes éligibles                           │
│    Inclure automatiquement tous les comptes courants    │
│    et cartes bancaires                                   │
│                                                          │
│  ○ Exclure certains types                               │
│    Exclure soit les comptes courants, soit les cartes   │
│                                                          │
│  ○ Comptes spécifiques                                  │
│    Choisir manuellement les comptes à inclure           │
│                                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                          │
│  [Réinitialiser]                    [Enregistrer]       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

### Badge compact (dans headers)

```
┌──────────────────────┐
│ 💰 Profil budgétaire │
│                      │
│ [...stats...]        │  ✅ 6 comptes ⓘ
└──────────────────────┘
```

---

## Checklist finale

### Backend
- [x] Phase 2 : Budget Profiling Service complété
- [x] Phase 3 : Metric Service complété
- [x] Phase 4 : Conversation Service V3 complété
- [x] Migration des utilisateurs existants
- [x] Tag v6.1.5 créé
- [x] Tag v6.2.1 créé (fixes)

### Frontend - À faire
- [ ] Phase 1 : Types et API (2-3h)
- [ ] Phase 2 : Composants de base (3-4h)
- [ ] Phase 3 : Panel de configuration (4-5h)
- [ ] Phase 4 : Intégration Dashboard/Budget (2-3h)
- [ ] Phase 5 : Intégration Métriques (1-2h)
- [ ] Phase 6 : Tests et validation (2-3h)
- [ ] Phase 7 : Polish et UX (1-2h)

**Temps total estimé** : 17-24 heures (2-3 jours)

---

## Notes importantes

### Compatibilité backend

✅ **Tous les endpoints backend sont prêts** :
- `GET /api/v1/budget/profile` retourne `accounts_used`
- `POST /api/v1/budget/profile/analyze` retourne `accounts_used`
- `GET /api/v1/metrics/expenses/yoy` retourne `accounts_used`
- `GET /api/v1/metrics/income/mom` retourne `accounts_used`
- `GET /api/v1/budget/settings` retourne `account_selection`
- `PUT /api/v1/budget/settings` accepte `account_selection`

### Rétrocompatibilité

✅ **Tous les champs sont optionnels** :
- Si `accounts_used` est absent → composants ne crashent pas
- Si `account_selection` est absent → valeur par défaut "all"
- Frontend fonctionne même avec ancien backend

### Performance

✅ **Optimisations** :
- `accounts_used` calculé côté backend (pas de surcharge frontend)
- Utilisation de React Query pour caching
- Composants optimisés avec `React.memo` si nécessaire

---

## Support et ressources

### Documentation de référence
- **Backend** : `ACCOUNT_FILTERING_IMPLEMENTATION.md`
- **API Budget** : `http://localhost:3006/docs`
- **API Métriques** : `http://localhost:3002/docs`

### Commandes utiles

```bash
# Démarrer le frontend en dev
npm run dev

# Build de production
npm run build

# Tests unitaires
npm run test

# Linter
npm run lint

# Type checking
npm run type-check
```

### Aide au débogage

**Vérifier que le backend retourne `accounts_used`** :
```bash
curl http://localhost:3006/api/v1/budget/profile \
  -H "Authorization: Bearer <token>"
```

**Vérifier les préférences** :
```bash
curl http://localhost:3006/api/v1/budget/settings \
  -H "Authorization: Bearer <token>"
```

---

## Auteur

**Document créé par** : Claude Code
**Date** : 28 octobre 2025
**Version** : 1.0
**Statut** : Prêt pour implémentation
