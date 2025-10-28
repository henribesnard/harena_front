/**
 * Carte affichant un item bancaire (connexion à une banque)
 */

import React, { useState } from 'react'
import { Building2, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { BankItem } from '@/types/banking'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DisconnectBankModal } from './DisconnectBankModal'

interface BankItemCardProps {
  item: BankItem
  onDelete: (itemId: number) => void
}

export const BankItemCard: React.FC<BankItemCardProps> = ({ item, onDelete }) => {
  const { accounts } = useBankAccounts(item.id)
  const [showDisconnectModal, setShowDisconnectModal] = useState(false)

  const getStatusBadge = () => {
    if (item.status === 0) {
      return (
        <span className="flex items-center gap-1 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Connecté
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        {item.status_code_info || 'Erreur'}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais'
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr })
    } catch (error) {
      return 'Date invalide'
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{item.bank_name}</h3>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Comptes</p>
            <p className="font-medium text-gray-900">{accounts.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Connecté depuis</p>
            <p className="font-medium text-gray-900 text-xs">
              {formatDate(item.created_at)}
            </p>
          </div>
        </div>

        {/* Description du statut (si erreur) */}
        {item.status !== 0 && item.status_code_description && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">{item.status_code_description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowDisconnectModal(true)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Déconnecter
          </button>
        </div>
      </div>

      <DisconnectBankModal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        onConfirm={() => onDelete(item.id)}
        bankName={item.bank_name}
      />
    </>
  )
}
