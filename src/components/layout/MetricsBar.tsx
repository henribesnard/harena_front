import { ArrowUpRight, ArrowDownRight, Menu, LayoutDashboard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCoreMetrics } from '../../hooks/useCoreMetrics'
import NotificationBell from '../notifications/NotificationBell'

interface MetricsBarProps {
  onMenuClick?: () => void
}

const MetricsBar = ({ onMenuClick }: MetricsBarProps) => {
  const { yoyExpenses, momExpenses, yoyIncome, momIncome, coverage } = useCoreMetrics()
  const navigate = useNavigate()

  // Show loading if any metric is loading
  const isLoading =
    yoyExpenses.isLoading ||
    momExpenses.isLoading ||
    yoyIncome.isLoading ||
    momIncome.isLoading ||
    coverage.isLoading

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 py-2 sm:py-3 px-2 sm:px-4 min-w-max sm:min-w-0">
            <div className="h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded flex-shrink-0" />
            <div className="h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded flex-shrink-0" />
            <div className="h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded flex-shrink-0" />
            <div className="h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded flex-shrink-0" />
            <div className="h-4 w-20 sm:w-24 bg-gray-200 animate-pulse rounded flex-shrink-0" />
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M€`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k€`
    }
    return `${Math.round(amount)}€`
  }

  const MetricBadge = ({
    label,
    value,
    percent,
    isPositive,
  }: {
    label: string
    value: string
    percent?: number
    isPositive?: boolean
  }) => {
    const Icon = percent !== undefined ? (isPositive ? ArrowUpRight : ArrowDownRight) : null
    const percentColor = isPositive ? 'text-green-600' : 'text-red-600'

    return (
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-shrink-0">
        <span className="text-gray-500 font-medium whitespace-nowrap">{label}</span>
        <span className="font-semibold text-gray-900 whitespace-nowrap">{value}</span>
        {percent !== undefined && Icon && (
          <span className={`flex items-center gap-0.5 font-medium ${percentColor} whitespace-nowrap`}>
            <Icon className="w-3 h-3" />
            {Math.abs(percent).toFixed(1)}%
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="w-full">
        <div className="flex items-center py-2 px-4 gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/user-dashboard')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-sm whitespace-nowrap hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de bord</span>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-start gap-3 lg:gap-4 xl:gap-5 text-xs min-w-max pr-4">
                {momExpenses.data && (
                  <MetricBadge
                    label="MoM Dépenses"
                    value={formatCompact(momExpenses.data.periode_cible.total)}
                    percent={momExpenses.data.variation.pourcentage}
                    isPositive={momExpenses.data.affichage.couleur === 'green'}
                  />
                )}

                {momIncome.data && (
                  <MetricBadge
                    label="MoM Revenus"
                    value={formatCompact(momIncome.data.periode_cible.total)}
                    percent={momIncome.data.variation.pourcentage}
                    isPositive={momIncome.data.affichage.couleur === 'green'}
                  />
                )}

                {coverage.data && (
                  <MetricBadge
                    label="Couverture"
                    value={`${coverage.data.taux_couverture.toFixed(1)}%`}
                  />
                )}

                {yoyExpenses.data && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-shrink-0 whitespace-nowrap">
                    <span className="text-gray-500 font-medium">YoY Dépenses</span>
                    <span
                      className={`flex items-center gap-0.5 ${
                        yoyExpenses.data.affichage.couleur === 'green' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {yoyExpenses.data.variation.direction === 'down' ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {Math.abs(yoyExpenses.data.variation.pourcentage).toFixed(1)}%
                    </span>
                  </div>
                )}

                {yoyIncome.data && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-shrink-0 whitespace-nowrap">
                    <span className="text-gray-500 font-medium">YoY Revenus</span>
                    <span
                      className={`flex items-center gap-0.5 ${
                        yoyIncome.data.affichage.couleur === 'green' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {yoyIncome.data.variation.direction === 'down' ? (
                        <ArrowDownRight className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {Math.abs(yoyIncome.data.variation.pourcentage).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <NotificationBell />
        </div>
      </div>
    </div>
  )
}

export default MetricsBar
