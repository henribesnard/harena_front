import { useAuthStore } from '../../../stores/authStore'
import { useFinancialMetrics } from '../../../hooks/useMetrics'
import { MetricCard } from '../../../components/metrics/MetricCard'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  Calendar,
  Store,
  Target,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react'

export const AllMetrics = () => {
  const userId = useAuthStore((state) => state.user?.id)
  const metrics = useFinancialMetrics(userId || 0)

  if (!userId) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-red-600'
    if (trend === 'decreasing') return 'text-green-600'
    return 'text-gray-600'
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'increasing' ? TrendingUp : TrendingDown
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Toutes les Métriques</h1>
        <p className="mt-2 text-gray-600">
          Vue complète de votre santé financière avec analyse ML
        </p>
      </div>

      {/* TENDANCES */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Tendances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* MoM */}
          <MetricCard
            title="Month-over-Month"
            emoji="📅"
            loading={metrics.mom.isLoading}
            error={!!metrics.mom.error}
          >
            {metrics.mom.data && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-mono">
                    {formatCurrency(metrics.mom.data.data.current_amount)}
                  </span>
                  <span className={`text-lg font-bold ${
                    metrics.mom.data.data.change_percent > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.mom.data.data.change_percent > 0 ? '+' : ''}
                    {metrics.mom.data.data.change_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  vs {formatCurrency(metrics.mom.data.data.previous_amount)} le mois dernier
                </div>
              </div>
            )}
          </MetricCard>

          {/* YoY */}
          <MetricCard
            title="Year-over-Year"
            emoji="📆"
            loading={metrics.yoy.isLoading}
            error={!!metrics.yoy.error}
          >
            {metrics.yoy.data && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-mono">
                    {formatCurrency(metrics.yoy.data.data.current_amount)}
                  </span>
                  <span className={`text-lg font-bold ${
                    metrics.yoy.data.data.change_percent > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metrics.yoy.data.data.change_percent > 0 ? '+' : ''}
                    {metrics.yoy.data.data.change_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  vs {metrics.yoy.data.data.previous_year}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Momentum */}
          <MetricCard
            title="Momentum"
            emoji="⚡"
            loading={metrics.momentum.isLoading}
            error={!!metrics.momentum.error}
          >
            {metrics.momentum.data && (
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-3xl font-bold ${
                    metrics.momentum.data.data.status === 'accelerating' ? 'text-red-600' :
                    metrics.momentum.data.data.status === 'decelerating' ? 'text-green-600' :
                    'text-gray-600'
                  }`}>
                    {metrics.momentum.data.data.momentum > 0 ? '+' : ''}
                    {metrics.momentum.data.data.momentum.toFixed(1)} pts
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    metrics.momentum.data.data.status === 'accelerating' ? 'bg-red-100 text-red-700' :
                    metrics.momentum.data.data.status === 'decelerating' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {metrics.momentum.data.data.status}
                  </span>
                </div>
                {metrics.momentum.data.data.alert && (
                  <div className="mt-2 text-sm text-red-600 font-medium">
                    {metrics.momentum.data.data.alert}
                  </div>
                )}
              </div>
            )}
          </MetricCard>

          {/* Volatility */}
          <MetricCard
            title="Volatilité"
            icon={Activity}
            loading={metrics.volatility.isLoading}
            error={!!metrics.volatility.error}
          >
            {metrics.volatility.data && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-mono">
                    {metrics.volatility.data.data.volatility_percent.toFixed(1)}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    metrics.volatility.data.data.stability_level === 'very_stable' ? 'bg-green-100 text-green-700' :
                    metrics.volatility.data.data.stability_level === 'stable' ? 'bg-blue-100 text-blue-700' :
                    metrics.volatility.data.data.stability_level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {metrics.volatility.data.data.stability_level}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Moyenne: {formatCurrency(metrics.volatility.data.data.mean)}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Moving Averages */}
          <MetricCard
            title="Moyennes Mobiles"
            icon={BarChart3}
            loading={metrics.movingAverages.isLoading}
            error={!!metrics.movingAverages.error}
          >
            {metrics.movingAverages.data && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actuel</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(metrics.movingAverages.data.data.current_value)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MA3</span>
                  <span className="font-mono">{formatCurrency(metrics.movingAverages.data.data.ma3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MA6</span>
                  <span className="font-mono">{formatCurrency(metrics.movingAverages.data.data.ma6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MA12</span>
                  <span className="font-mono">{formatCurrency(metrics.movingAverages.data.data.ma12)}</span>
                </div>
                <div className={`mt-2 px-2 py-1 rounded text-sm font-semibold text-center ${
                  metrics.movingAverages.data.data.signal === 'above_all' ? 'bg-red-100 text-red-700' :
                  metrics.movingAverages.data.data.signal === 'below_all' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {metrics.movingAverages.data.data.signal}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Trend Strength */}
          <MetricCard
            title="Force de Tendance"
            icon={Zap}
            loading={metrics.trendStrength.isLoading}
            error={!!metrics.trendStrength.error}
          >
            {metrics.trendStrength.data && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-mono">
                    {metrics.trendStrength.data.data.strength_score.toFixed(0)}/100
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    metrics.trendStrength.data.data.interpretation === 'very_strong' ? 'bg-purple-100 text-purple-700' :
                    metrics.trendStrength.data.data.interpretation === 'strong' ? 'bg-blue-100 text-blue-700' :
                    metrics.trendStrength.data.data.interpretation === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {metrics.trendStrength.data.data.interpretation}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Direction: {metrics.trendStrength.data.data.direction}
                </div>
              </div>
            )}
          </MetricCard>
        </div>
      </section>

      {/* SANTÉ FINANCIÈRE */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💪 Santé Financière</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Savings Rate */}
          <MetricCard
            title="Taux d'Épargne"
            icon={PiggyBank}
            loading={metrics.savingsRate.isLoading}
            error={!!metrics.savingsRate.error}
          >
            {metrics.savingsRate.data && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold font-mono">
                    {metrics.savingsRate.data.data.savings_rate.toFixed(1)}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    metrics.savingsRate.data.data.health_status === 'excellent' ? 'bg-green-100 text-green-700' :
                    metrics.savingsRate.data.data.health_status === 'good' ? 'bg-blue-100 text-blue-700' :
                    metrics.savingsRate.data.data.health_status === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {metrics.savingsRate.data.data.health_status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Épargne: {formatCurrency(metrics.savingsRate.data.data.net_savings)}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Expense Ratio */}
          <MetricCard
            title="Répartition 50/30/20"
            emoji="🎯"
            loading={metrics.expenseRatio.isLoading}
            error={!!metrics.expenseRatio.error}
          >
            {metrics.expenseRatio.data && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Essentiels</span>
                  <span className="font-bold">
                    {metrics.expenseRatio.data.data.essentials_percent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.expenseRatio.data.data.essentials_percent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plaisirs</span>
                  <span className="font-bold">
                    {metrics.expenseRatio.data.data.lifestyle_percent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.expenseRatio.data.data.lifestyle_percent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Épargne</span>
                  <span className="font-bold">
                    {metrics.expenseRatio.data.data.savings_percent.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(metrics.expenseRatio.data.data.savings_percent, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </MetricCard>

          {/* Burn Rate */}
          <MetricCard
            title="Burn Rate & Runway"
            icon={AlertTriangle}
            loading={metrics.burnRate.isLoading}
            error={!!metrics.burnRate.error}
          >
            {metrics.burnRate.data && (
              <div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Burn Rate</div>
                    <div className="text-2xl font-bold font-mono">
                      {formatCurrency(metrics.burnRate.data.data.monthly_burn_rate)}/mois
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Autonomie</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold font-mono">
                        {metrics.burnRate.data.data.runway_months !== null
                          ? `${metrics.burnRate.data.data.runway_months.toFixed(1)} mois`
                          : 'Illimitée'
                        }
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        metrics.burnRate.data.data.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                        metrics.burnRate.data.data.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        metrics.burnRate.data.data.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {metrics.burnRate.data.data.risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MetricCard>
        </div>
      </section>

      {/* PATTERNS COMPORTEMENTAUX */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Patterns Comportementaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Weekday Pattern */}
          <MetricCard
            title="Dépenses par Jour"
            icon={Calendar}
            loading={metrics.weekdayPattern.isLoading}
            error={!!metrics.weekdayPattern.error}
          >
            {metrics.weekdayPattern.data && (
              <div className="space-y-2">
                {metrics.weekdayPattern.data.data.patterns.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      day.day === metrics.weekdayPattern.data!.data.most_expensive_day
                        ? 'text-red-600'
                        : day.day === metrics.weekdayPattern.data!.data.least_expensive_day
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}>
                      {day.day}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${day.percent_of_week}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-bold w-16 text-right">
                        {formatCurrency(day.average_amount)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                  Weekend premium: <span className="font-bold">
                    {metrics.weekdayPattern.data.data.weekend_premium_percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </MetricCard>

          {/* Month Period Pattern */}
          <MetricCard
            title="Dépenses par Période du Mois"
            emoji="📊"
            loading={metrics.monthPeriodPattern.isLoading}
            error={!!metrics.monthPeriodPattern.error}
          >
            {metrics.monthPeriodPattern.data && (
              <div className="space-y-3">
                {metrics.monthPeriodPattern.data.data.patterns.map((period) => (
                  <div key={period.period}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{period.period}</span>
                      <span className="font-bold">
                        {period.percent_of_month.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${period.percent_of_month}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatCurrency(period.total_amount)}
                    </div>
                  </div>
                ))}
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  metrics.monthPeriodPattern.data.data.detected_behavior === 'flush_post_paie'
                    ? 'bg-yellow-100 text-yellow-800'
                    : metrics.monthPeriodPattern.data.data.detected_behavior === 'end_of_month_syndrome'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <div className="font-semibold mb-1">
                    {metrics.monthPeriodPattern.data.data.detected_behavior.replace(/_/g, ' ')}
                  </div>
                  {metrics.monthPeriodPattern.data.data.recommendations.map((rec, i) => (
                    <div key={i} className="text-xs">{rec}</div>
                  ))}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Recurring Expenses */}
          <MetricCard
            title="Dépenses Récurrentes"
            emoji="🔄"
            loading={metrics.recurringExpenses.isLoading}
            error={!!metrics.recurringExpenses.error}
          >
            {metrics.recurringExpenses.data && (
              <div>
                <div className="mb-4">
                  <div className="text-3xl font-bold font-mono">
                    {formatCurrency(metrics.recurringExpenses.data.data.total_monthly_recurring)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metrics.recurringExpenses.data.data.recurring_percent_of_expenses.toFixed(0)}% de vos dépenses
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {metrics.recurringExpenses.data.data.recurring_expenses.slice(0, 5).map((expense, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium truncate">{expense.merchant}</div>
                        <div className="text-xs text-gray-500">{expense.frequency}</div>
                      </div>
                      <span className="font-mono font-bold">
                        {formatCurrency(expense.average_amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </MetricCard>

          {/* Merchant Loyalty */}
          <MetricCard
            title="Commerçants Favoris"
            icon={Store}
            loading={metrics.merchantLoyalty.isLoading}
            error={!!metrics.merchantLoyalty.error}
          >
            {metrics.merchantLoyalty.data && (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {metrics.merchantLoyalty.data.data.top_merchants.slice(0, 5).map((merchant, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium truncate">{merchant.merchant}</div>
                        <div className="text-xs text-gray-500">
                          {merchant.visits} visites • Score: {merchant.loyalty_score.toFixed(0)}/100
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm">
                        {formatCurrency(merchant.total_spent)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Panier moyen: {formatCurrency(merchant.average_basket)} •
                      Fréquence: tous les {merchant.frequency_days.toFixed(0)} jours
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MetricCard>
        </div>
      </section>

      {/* OPTIMISATION */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Optimisation</h2>
        <div className="grid grid-cols-1 gap-6">

          {/* Savings Potential */}
          <MetricCard
            title="Potentiel d'Économie"
            icon={Target}
            loading={metrics.savingsPotential.isLoading}
            error={!!metrics.savingsPotential.error}
          >
            {metrics.savingsPotential.data && (
              <div>
                <div className="mb-6">
                  <div className="text-4xl font-bold font-mono text-green-600">
                    {formatCurrency(metrics.savingsPotential.data.data.total_potential_monthly)}/mois
                  </div>
                  <div className="text-lg text-gray-600">
                    soit {formatCurrency(metrics.savingsPotential.data.data.total_potential_yearly)} par an
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Impact sur taux d'épargne: <span className="font-bold text-green-600">
                      +{metrics.savingsPotential.data.data.impact_on_savings_rate.toFixed(1)} points
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Opportunités détectées:</h4>
                  {metrics.savingsPotential.data.data.opportunities.map((opp, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border-l-4 ${
                        opp.difficulty === 'easy'
                          ? 'bg-green-50 border-green-500'
                          : opp.difficulty === 'medium'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{opp.description}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Difficulté: <span className="font-semibold">{opp.difficulty}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-green-600">
                          {formatCurrency(opp.potential_monthly_savings)}/mois
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {metrics.savingsPotential.data.data.action_plan.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Plan d'action:</h4>
                    <ul className="space-y-1">
                      {metrics.savingsPotential.data.data.action_plan.map((action, i) => (
                        <li key={i} className="text-sm text-blue-800">{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </MetricCard>
        </div>
      </section>
    </div>
  )
}
