import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PiggyBank, AlertTriangle } from 'lucide-react'
import { useFinancialMetrics } from '../../hooks/useMetrics'
import { useAuthStore } from '../../stores/authStore'

const MetricsBar = () => {
  const userId = useAuthStore((state) => state.user?.id)
  const { mom, savingsRate, burnRate } = useFinancialMetrics(userId || 0)

  // Show loading if any metric is loading
  const isLoading = mom.isLoading || savingsRate.isLoading || burnRate.isLoading

  // Check for errors
  console.log('MetricsBar - userId:', userId)
  console.log('MetricsBar - mom:', { isLoading: mom.isLoading, error: mom.error, data: mom.data })
  console.log('MetricsBar - savingsRate:', { isLoading: savingsRate.isLoading, error: savingsRate.error, data: savingsRate.data })
  console.log('MetricsBar - burnRate:', { isLoading: burnRate.isLoading, error: burnRate.error, data: burnRate.data })

  if (!userId || isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
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

  const EvolutionBadge = ({ percent }: { percent: number }) => {
    const isPositive = percent >= 0
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight
    const colorClass = isPositive ? 'text-green-600 bg-white/90' : 'text-red-600 bg-white/90'

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
        <Icon className="w-3 h-3 mr-0.5" />
        {Math.abs(percent).toFixed(1)}%
      </span>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">

          {/* MoM Evolution */}
          {mom.data && (
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-white/80" />
              <div>
                <p className="text-xs text-white/70 font-medium">Dépenses (MoM)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatCurrency(mom.data.data.current_amount)}
                  </span>
                  <EvolutionBadge percent={mom.data.data.change_percent} />
                </div>
              </div>
            </div>
          )}

          {/* Savings Rate */}
          {savingsRate.data && (
            <div className="flex items-center space-x-2">
              <PiggyBank className={`w-5 h-5 ${getHealthColor(savingsRate.data.data.health_status)}`} />
              <div>
                <p className="text-xs text-white/70 font-medium">Taux d'Épargne</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {savingsRate.data.data.savings_rate.toFixed(1)}%
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${getHealthColor(savingsRate.data.data.health_status)}`}>
                    {savingsRate.data.data.health_status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Burn Rate & Runway */}
          {burnRate.data && (
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${getRiskColor(burnRate.data.data.risk_level)}`} />
              <div>
                <p className="text-xs text-white/70 font-medium">Autonomie</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {burnRate.data.data.runway_months !== null
                      ? `${burnRate.data.data.runway_months} mois`
                      : 'Illimitée'
                    }
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${getRiskColor(burnRate.data.data.risk_level)}`}>
                    {burnRate.data.data.risk_level}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricsBar
