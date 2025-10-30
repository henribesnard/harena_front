import { useNavigate } from 'react-router-dom'
import { useAccountsUsed } from '@/hooks/useAccountsUsed'
import { AccountsUsedCard } from '@/components/budget/AccountsUsedCard'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { accountsUsed, isLoading: accountsLoading } = useAccountsUsed()

  const handleConfigureAccounts = () => {
    navigate('/configuration?tab=banking')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue sur votre tableau de bord Harena
        </p>
      </div>

      {/* Section des comptes utilisés */}
      {!accountsLoading && accountsUsed && (
        <AccountsUsedCard
          accountsUsed={accountsUsed}
          onConfigureClick={handleConfigureAccounts}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Solde Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                €12,458.50
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-success-main text-sm font-medium">+12.5%</span>
            <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                €3,245.80
              </p>
            </div>
            <div className="w-12 h-12 bg-danger-light/20 rounded-full flex items-center justify-center">
              <span className="text-danger-main text-xl">💸</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-danger-main text-sm font-medium">-8.2%</span>
            <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                €5,120.00
              </p>
            </div>
            <div className="w-12 h-12 bg-success-light/20 rounded-full flex items-center justify-center">
              <span className="text-success-main text-xl">📈</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-success-main text-sm font-medium">+3.1%</span>
            <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Épargne</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                €1,874.20
              </p>
            </div>
            <div className="w-12 h-12 bg-info-light/20 rounded-full flex items-center justify-center">
              <span className="text-info-main text-xl">🎯</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-success-main text-sm font-medium">+15.8%</span>
            <span className="text-gray-500 text-sm ml-2">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Évolution du Solde
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            [Graphique à implémenter]
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Dépenses par Catégorie
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            [Graphique à implémenter]
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Transactions Récentes
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span>🛒</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Supermarché</p>
                  <p className="text-sm text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <span className="font-mono font-bold text-danger-main">-€45.32</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage