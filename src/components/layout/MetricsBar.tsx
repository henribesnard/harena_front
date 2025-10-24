import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useCoreMetrics } from '../../hooks/useCoreMetrics'

const MetricsBar = () => {
  const { yoyExpenses, momExpenses, yoyIncome, momIncome, coverage } = useCoreMetrics()

  // Show loading if any metric is loading
  const isLoading = yoyExpenses.isLoading || momExpenses.isLoading || yoyIncome.isLoading || momIncome.isLoading || coverage.isLoading

  if (isLoading) {
    return (
      <div className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 overflow-x-auto">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
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
    return `${amount}€`
  }

  const MetricBadge = ({ label, value, percent, isPositive }: { label: string; value: string; percent?: number; isPositive?: boolean }) => {
    const Icon = percent !== undefined ? (isPositive ? ArrowUpRight : ArrowDownRight) : null
    const percentColor = isPositive ? 'text-green-600' : 'text-red-600'

    return (
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
        {percent !== undefined && Icon && (
          <span className={`flex items-center gap-0.5 font-medium ${percentColor}`}>
            <Icon className="w-3 h-3" />
            {Math.abs(percent).toFixed(1)}%
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-12 flex-wrap text-xs">
          {/* Dépenses MoM - Plus pertinent que YoY */}
          {momExpenses.data && (
            <MetricBadge
              label="MoM Dépenses"
              value={formatCompact(momExpenses.data.periode_cible.total)}
              percent={momExpenses.data.variation.pourcentage}
              isPositive={momExpenses.data.affichage.couleur === 'green'}
            />
          )}

          {/* Revenus MoM */}
          {momIncome.data && (
            <MetricBadge
              label="MoM Revenus"
              value={formatCompact(momIncome.data.periode_cible.total)}
              percent={momIncome.data.variation.pourcentage}
              isPositive={momIncome.data.affichage.couleur === 'green'}
            />
          )}

          {/* Taux de Couverture */}
          {coverage.data && (
            <MetricBadge
              label="Couverture"
              value={`${coverage.data.taux_couverture.toFixed(1)}%`}
            />
          )}

          {/* Divider - Plus visible */}
          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          {/* YoY Expenses */}
          {yoyExpenses.data && (
            <div className="hidden lg:flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-medium">YoY Dépenses</span>
              <span className={`flex items-center gap-0.5 ${yoyExpenses.data.affichage.couleur === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                {yoyExpenses.data.variation.direction === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {Math.abs(yoyExpenses.data.variation.pourcentage).toFixed(1)}%
              </span>
            </div>
          )}

          {/* YoY Income */}
          {yoyIncome.data && (
            <div className="hidden lg:flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-medium">YoY Revenus</span>
              <span className={`flex items-center gap-0.5 ${yoyIncome.data.affichage.couleur === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                {yoyIncome.data.variation.direction === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {Math.abs(yoyIncome.data.variation.pourcentage).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricsBar
