/**
 * AccountFilterSettings - Panel complet de configuration du filtrage des comptes
 *
 * Permet de:
 * - Choisir le mode de sélection (all, exclude_types, include_specific)
 * - Configurer les types exclus (si mode exclude_types)
 * - Sélectionner les comptes spécifiques (si mode include_specific)
 * - Sauvegarder les changements
 * - Réinitialiser aux valeurs par défaut
 */

import React, { useState, useEffect } from 'react'
import { Save, RotateCcw, AlertCircle } from 'lucide-react'
import { AccountSelectionMode } from './AccountSelectionMode'
import type { BankAccount } from '@/types/banking'
import type { AccountSelection } from '@/types/preferences'
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
  const [mode, setMode] = useState<'all' | 'exclude_types' | 'include_specific'>(
    currentSelection.mode || 'all'
  )
  const [excludedTypes, setExcludedTypes] = useState<Array<'checking' | 'card'>>(
    currentSelection.excluded_types || []
  )
  const [includedAccounts, setIncludedAccounts] = useState<number[]>(
    currentSelection.included_accounts || []
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Synchroniser l'état local avec currentSelection quand il change
  useEffect(() => {
    setMode(currentSelection.mode)
    setExcludedTypes(currentSelection.excluded_types || [])
    setIncludedAccounts(currentSelection.included_accounts || [])
  }, [currentSelection])

  // Réinitialiser les états appropriés quand on change de mode
  useEffect(() => {
    if (mode === 'all') {
      setExcludedTypes([])
      setIncludedAccounts([])
    } else if (mode === 'exclude_types') {
      setIncludedAccounts([])
    } else if (mode === 'include_specific') {
      setExcludedTypes([])
    }
  }, [mode])

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
    const selectionToSave = {
      mode,
      excluded_types: excludedTypes,
      included_accounts: includedAccounts
    }
    console.log('💾 Saving account selection:', selectionToSave)
    try {
      await onSave(selectionToSave)
      console.log('✅ Save successful')
      setHasChanges(false)
    } catch (error) {
      console.error('❌ Save failed:', error)
      // Error is handled in the hook with toast
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
    } catch (error) {
      // Error is handled in the hook with toast
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

  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode
    }).format(amount)
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
                key={account.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={includedAccounts.includes(account.id)}
                  onChange={() => toggleIncludedAccount(account.id)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  disabled={isSaving || isResetting}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{account.name}</div>
                  <div className="text-sm text-gray-500">
                    {account.type === 'checking' ? 'Compte courant' : 'Carte bancaire'} •{' '}
                    {formatCurrency(account.balance, account.currency_code)}
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
