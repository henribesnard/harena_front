/**
 * Liste des comptes bancaires
 */

import React from 'react'
import { Wallet } from 'lucide-react'
import { BankAccount } from '@/types/banking'

interface BankAccountsListProps {
  accounts: BankAccount[]
}

export const BankAccountsList: React.FC<BankAccountsListProps> = ({ accounts }) => {
  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode
    }).format(amount)
  }

  const getAccountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: 'Compte courant',
      savings: 'Compte épargne',
      loan: 'Prêt',
      credit: 'Carte de crédit',
      investment: 'Investissement'
    }
    return types[type] || type
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun compte bancaire trouvé
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{account.name}</h4>
              <p className="text-sm text-gray-500 truncate">
                {account.iban || getAccountTypeLabel(account.type)}
              </p>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="text-lg font-semibold text-gray-900 font-mono">
              {formatCurrency(account.balance, account.currency_code)}
            </p>
            <p className="text-xs text-gray-500 uppercase">
              {getAccountTypeLabel(account.type)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
