/**
 * Onglet de configuration pour les comptes bancaires
 * Affiché dans la page Configuration
 */

import React from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { BankConnectionButton } from './BankConnectionButton'
import { BankItemCard } from './BankItemCard'
import { useBankItems } from '@/hooks/useBankItems'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import { useAccountPreferences } from '@/hooks/useAccountPreferences'
import { AccountFilterSettings } from '../settings/AccountFilterSettings'

export const BankingSettingsTab: React.FC = () => {
  const { items, isLoading, deleteItem } = useBankItems()
  const { accounts, isLoading: accountsLoading } = useBankAccounts()
  const {
    accountSelection,
    updatePreferences,
    resetPreferences,
    isLoading: preferencesLoading,
    isUpdating
  } = useAccountPreferences()

  if (isLoading || accountsLoading || preferencesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comptes bancaires</h2>
          <p className="text-gray-600 mt-1">
            Gérez vos connexions bancaires et synchronisez vos transactions
          </p>
        </div>

        {/* Liste des banques connectées */}
        {items.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Banques connectées ({items.length})
            </h3>
            {items.map((item) => (
              <BankItemCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun compte bancaire connecté
            </h3>
            <p className="text-gray-600 mb-6">
              Connectez votre compte bancaire pour synchroniser automatiquement vos transactions et bénéficier d'analyses détaillées de vos finances.
            </p>
          </div>
        )}

        {/* Bouton de connexion */}
        <div className="flex justify-center pt-4 border-t border-gray-200">
          <BankConnectionButton
            label={
              items.length > 0
                ? 'Ajouter ou reconnecter un compte bancaire'
                : 'Connecter mon compte bancaire'
            }
            callbackUrl={
              window.location.origin.startsWith('https://')
                ? `${window.location.origin}/configuration?tab=banking`
                : undefined
            }
          />
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            ℹ️ À propos de la synchronisation
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Vos données sont sécurisées et chiffrées</li>
            <li>• La synchronisation se fait automatiquement via Bridge API (certifié PSD2)</li>
            <li>• Vos transactions sont enrichies et analysées automatiquement</li>
            <li>• Vous pouvez déconnecter un compte bancaire à tout moment</li>
          </ul>
        </div>

        {/* Section de filtrage des comptes */}
        {accounts.length > 0 && (
          <>
            <div className="pt-6 border-t-2 border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Filtrage des comptes</h2>
              <p className="text-gray-600 mb-6">
                Choisissez quels comptes inclure dans vos calculs budgétaires et métriques
              </p>
              <AccountFilterSettings
                accounts={accounts}
                currentSelection={accountSelection}
                onSave={updatePreferences}
                onReset={resetPreferences}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
