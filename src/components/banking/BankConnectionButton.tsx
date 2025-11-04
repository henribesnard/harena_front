/**
 * Bouton pour initier la connexion d'une banque via Bridge
 */

import React from 'react'
import { Loader2, Link as LinkIcon } from 'lucide-react'
import { useBankConnection } from '@/hooks/useBankConnection'

interface BankConnectionButtonProps {
  callbackUrl?: string
  variant?: 'primary' | 'secondary'
  className?: string
  label?: string
}

export const BankConnectionButton: React.FC<BankConnectionButtonProps> = ({
  callbackUrl,
  variant = 'primary',
  className = '',
  label = 'Connecter mon compte bancaire'
}) => {
  const { initiateBankConnection, isConnecting } = useBankConnection()

  const handleConnect = async () => {
    try {
      await initiateBankConnection(callbackUrl)
    } catch (error) {
      console.error('Erreur lors de la connexion bancaire:', error)
    }
  }

  const buttonClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      aria-busy={isConnecting}
      aria-label={isConnecting ? 'Connexion en cours' : label}
      className={`
        px-6 py-3 rounded-lg font-medium
        flex items-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonClasses}
        ${className}
      `}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connexion en cours...</span>
        </>
      ) : (
        <>
          <LinkIcon className="w-5 h-5" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
