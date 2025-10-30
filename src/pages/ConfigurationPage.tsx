import { useState, useEffect } from 'react'
import { Settings, DollarSign, Bell, Palette, RotateCcw, Building2 } from 'lucide-react'
import { useUserPreferences } from '../hooks/useUserPreferences'
import { BankingSettingsTab } from '../components/banking/BankingSettingsTab'

const ConfigurationPage = () => {
  const { preferences, isLoading, updatePreferences, resetPreferences, isUpdating, isResetting } = useUserPreferences()

  const [activeTab, setActiveTab] = useState<'budget' | 'banking' | 'display' | 'notifications'>('budget')

  // États locaux pour les formulaires
  const [budgetSettings, setBudgetSettings] = useState({
    months_analysis: preferences?.budget_settings?.months_analysis || 12,
    fixed_charge_min_occurrences: preferences?.budget_settings?.fixed_charge_min_occurrences || 5,
    fixed_charge_max_variance: preferences?.budget_settings?.fixed_charge_max_variance || 20,
    fixed_charge_min_amount: preferences?.budget_settings?.fixed_charge_min_amount || 10,
    account_selection: preferences?.budget_settings?.account_selection || {
      mode: 'all' as const,
      excluded_types: [],
      included_accounts: []
    },
  })

  // Mettre à jour les états locaux quand les préférences sont chargées
  useEffect(() => {
    if (preferences?.budget_settings) {
      setBudgetSettings({
        months_analysis: preferences.budget_settings.months_analysis,
        fixed_charge_min_occurrences: preferences.budget_settings.fixed_charge_min_occurrences,
        fixed_charge_max_variance: preferences.budget_settings.fixed_charge_max_variance,
        fixed_charge_min_amount: preferences.budget_settings.fixed_charge_min_amount,
        account_selection: preferences.budget_settings.account_selection,
      })
    }
  }, [preferences])

  const handleSaveBudgetSettings = () => {
    updatePreferences({
      budget_settings: budgetSettings,
    })
  }

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos préférences aux valeurs par défaut ?')) {
      resetPreferences()
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des préférences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <Settings className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        </div>
        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'banking'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Comptes bancaires</span>
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'display'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Affichage</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Bientôt</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Bientôt</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Budget Settings */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de profil budgétaire</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Configurez les paramètres utilisés pour analyser votre profil budgétaire et détecter vos charges fixes.
                </p>

                <div className="space-y-4">
                  {/* Months Analysis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de mois à analyser
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={budgetSettings.months_analysis}
                      onChange={(e) => setBudgetSettings({ ...budgetSettings, months_analysis: parseInt(e.target.value) || 12 })}
                      className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Par défaut : 12 mois. Maximum : 24 mois.
                    </p>
                  </div>

                  {/* Fixed Charge Detection */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Détection des charges fixes</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre minimum d'occurrences
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={budgetSettings.fixed_charge_min_occurrences}
                          onChange={(e) => setBudgetSettings({ ...budgetSettings, fixed_charge_min_occurrences: parseInt(e.target.value) || 5 })}
                          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Nombre minimum de fois qu'une transaction doit apparaître pour être considérée comme charge fixe. Par défaut : 5.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Variance maximale (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={budgetSettings.fixed_charge_max_variance}
                          onChange={(e) => setBudgetSettings({ ...budgetSettings, fixed_charge_max_variance: parseFloat(e.target.value) || 20 })}
                          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Variance maximale autorisée entre les montants pour être considéré comme fixe. Par défaut : 20%.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant minimum (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={budgetSettings.fixed_charge_min_amount}
                          onChange={(e) => setBudgetSettings({ ...budgetSettings, fixed_charge_min_amount: parseFloat(e.target.value) || 10 })}
                          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Montant minimum pour qu'une transaction soit considérée comme charge fixe. Par défaut : 10€.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveBudgetSettings}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                  >
                    {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Banking Settings */}
          {activeTab === 'banking' && <BankingSettingsTab />}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Paramètres d'affichage</h3>
              <p className="text-gray-600">Cette fonctionnalité sera disponible prochainement.</p>
              <p className="text-sm text-gray-500 mt-2">
                Vous pourrez configurer le thème, la langue et les préférences d'affichage.
              </p>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Paramètres de notifications</h3>
              <p className="text-gray-600">Cette fonctionnalité sera disponible prochainement.</p>
              <p className="text-sm text-gray-500 mt-2">
                Vous pourrez configurer vos préférences de notifications par email, push, et définir des seuils d'alerte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfigurationPage
