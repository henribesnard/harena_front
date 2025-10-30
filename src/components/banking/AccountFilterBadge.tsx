/**
 * AccountFilterBadge - Badge affichant le nombre de comptes utilisés dans les calculs
 *
 * Variants:
 * - compact: Badge simple avec icône et nombre
 * - detailed: Card complète avec statistiques détaillées
 */

import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import type { AccountsUsed } from '@/types/budgetProfiling'
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

  const modeLabels: Record<typeof selection_mode, string> = {
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
