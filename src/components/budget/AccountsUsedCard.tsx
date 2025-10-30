/**
 * AccountsUsedCard - Card détaillée affichant tous les comptes utilisés dans les calculs
 *
 * Affiche:
 * - Liste complète des comptes avec noms, types, et soldes
 * - Solde total
 * - Bouton "Configurer" pour modifier la sélection
 */

import React from 'react'
import { Wallet, CreditCard, TrendingUp } from 'lucide-react'
import type { AccountsUsed } from '@/types/budgetProfiling'

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
