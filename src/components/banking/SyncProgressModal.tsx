/**
 * Modal affichant la progression de la synchronisation
 */

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react'

interface SyncProgressModalProps {
  isOpen: boolean
  status: 'idle' | 'syncing' | 'success' | 'error'
  message: string
  onClose: () => void
}

export const SyncProgressModal: React.FC<SyncProgressModalProps> = ({
  isOpen,
  status,
  message,
  onClose
}) => {
  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-600" />
      case 'error':
        return <XCircle className="w-16 h-16 text-red-600" />
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'syncing':
        return 'Synchronisation en cours'
      case 'success':
        return 'Synchronisation réussie'
      case 'error':
        return 'Erreur de synchronisation'
      default:
        return ''
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={status !== 'syncing' ? onClose : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-full max-w-md z-50 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Bouton de fermeture (seulement si pas en cours de sync) */}
          {status !== 'syncing' && (
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          )}

          <div className="flex flex-col items-center text-center gap-4">
            {/* Icône */}
            {getIcon()}

            {/* Titre */}
            <Dialog.Title className="text-2xl font-bold text-gray-900">
              {getTitle()}
            </Dialog.Title>

            {/* Message */}
            <Dialog.Description className="text-gray-600 text-base">
              {message}
            </Dialog.Description>

            {/* Bouton de fermeture (seulement si pas en cours de sync) */}
            {status !== 'syncing' && (
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Fermer
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
