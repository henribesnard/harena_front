import { Mail, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useCoreMetrics } from '../hooks/useCoreMetrics'
import { useBudgetProfile } from '../hooks/useBudgetProfile'

const UserDashboardPage = () => {
  const { user } = useAuthStore()
  const { yoyExpenses, momExpenses, yoyIncome, momIncome, coverage } = useCoreMetrics()
  const { data: profile, isLoading: profileLoading } = useBudgetProfile()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    loading = false
  }: {
    title: string
    value: string
    icon: any
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    loading?: boolean
  }) => {
    const trendColors = {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-600',
    }

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

    return (
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{title}</span>
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && trendValue && TrendIcon && (
              <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                <span>{trendValue}</span>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {user?.first_name?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.full_name || user?.first_name || user?.email?.split('@')[0] || 'Utilisateur'}
            </h1>
            <p className="text-sm text-gray-600 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Métriques Financières</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Dépenses (MoM)"
            value={momExpenses.data ? formatCurrency(momExpenses.data.periode_cible.total) : '-'}
            icon={TrendingDown}
            trend={
              momExpenses.data?.affichage.couleur === 'green'
                ? 'up'
                : momExpenses.data?.affichage.couleur === 'red'
                ? 'down'
                : 'neutral'
            }
            trendValue={momExpenses.data ? `${Math.abs(momExpenses.data.variation.pourcentage).toFixed(1)}%` : undefined}
            loading={momExpenses.isLoading}
          />

          <StatCard
            title="Revenus (MoM)"
            value={momIncome.data ? formatCurrency(momIncome.data.periode_cible.total) : '-'}
            icon={TrendingUp}
            trend={
              momIncome.data?.affichage.couleur === 'green'
                ? 'up'
                : momIncome.data?.affichage.couleur === 'red'
                ? 'down'
                : 'neutral'
            }
            trendValue={momIncome.data ? `${Math.abs(momIncome.data.variation.pourcentage).toFixed(1)}%` : undefined}
            loading={momIncome.isLoading}
          />

          <StatCard
            title="Dépenses (YoY)"
            value={yoyExpenses.data ? formatCurrency(yoyExpenses.data.periode_cible.total) : '-'}
            icon={TrendingDown}
            trend={
              yoyExpenses.data?.affichage.couleur === 'green'
                ? 'up'
                : yoyExpenses.data?.affichage.couleur === 'red'
                ? 'down'
                : 'neutral'
            }
            trendValue={yoyExpenses.data ? `${Math.abs(yoyExpenses.data.variation.pourcentage).toFixed(1)}%` : undefined}
            loading={yoyExpenses.isLoading}
          />

          <StatCard
            title="Revenus (YoY)"
            value={yoyIncome.data ? formatCurrency(yoyIncome.data.periode_cible.total) : '-'}
            icon={TrendingUp}
            trend={
              yoyIncome.data?.affichage.couleur === 'green'
                ? 'up'
                : yoyIncome.data?.affichage.couleur === 'red'
                ? 'down'
                : 'neutral'
            }
            trendValue={yoyIncome.data ? `${Math.abs(yoyIncome.data.variation.pourcentage).toFixed(1)}%` : undefined}
            loading={yoyIncome.isLoading}
          />
        </div>
      </div>

      {/* Key Statistics */}
      {profile && (
        <div className="mb-8">
          <div className="bg-gradient-primary text-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Statistiques clés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-90">Taux d'épargne</p>
                <p className="text-2xl font-bold">
                  {profile.avg_monthly_income > 0
                    ? ((profile.avg_monthly_savings / profile.avg_monthly_income) * 100).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Charges fixes / Revenus</p>
                <p className="text-2xl font-bold">
                  {profile.avg_monthly_income > 0
                    ? ((profile.fixed_charges_total / profile.avg_monthly_income) * 100).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Dépenses / Revenus</p>
                <p className="text-2xl font-bold">
                  {profile.avg_monthly_income > 0
                    ? ((profile.avg_monthly_expenses / profile.avg_monthly_income) * 100).toFixed(1)
                    : '0'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Wallet className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Résumé budgétaire</h2>
        </div>
        {profileLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Revenus moyens</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(profile.avg_monthly_income)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dépenses moyennes</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(profile.avg_monthly_expenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Charges fixes</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(profile.fixed_charges_total)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dépenses variables</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(profile.variable_charges_total)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Épargne moyenne</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(profile.avg_monthly_savings)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Taux de couverture</p>
              <p className="text-lg font-semibold text-gray-900">{coverage.data?.taux_couverture.toFixed(1) || '0'}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dernière analyse</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(profile.last_analyzed_at)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Aucune donnée de profil disponible</p>
            <p className="text-xs mt-2">
              Visitez la page <a href="/budget" className="text-primary-600 hover:underline">Budget Profiling</a> pour analyser votre profil
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboardPage
