import { Calendar, CalendarDays, ArrowUpRight, ArrowDownRight, Shield, CreditCard, Banknote } from 'lucide-react'
import { useCoreMetrics } from '../../hooks/useCoreMetrics'

const MetricsBar = () => {
  const { yoyExpenses, momExpenses, yoyIncome, momIncome, coverage } = useCoreMetrics()

  // Debug coverage
  console.log('Coverage data:', coverage.data, 'Error:', coverage.error, 'Loading:', coverage.isLoading)

  // Show loading if any metric is loading
  const isLoading = yoyExpenses.isLoading || momExpenses.isLoading || yoyIncome.isLoading || momIncome.isLoading || coverage.isLoading

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center space-x-6 overflow-x-auto">
          <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
          <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
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

  const EvolutionBadgeExpenses = ({ couleur, direction, percent }: { couleur: string; direction: 'up' | 'down' | 'stable'; percent: number }) => {
    // Pour les dépenses (après fix backend):
    // - Si percent < 0 (diminution) => vert (positif) + flèche down
    // - Si percent > 0 (augmentation) => rouge (négatif) + flèche up
    const Icon = direction === 'down' ? ArrowDownRight : direction === 'up' ? ArrowUpRight : null
    const colorClass = couleur === 'green' ? 'text-green-600 bg-white/90' : couleur === 'red' ? 'text-red-600 bg-white/90' : 'text-gray-600 bg-white/90'

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
        {Icon && <Icon className="w-3 h-3 mr-0.5" />}
        {percent >= 0 ? '+' : ''}{percent.toFixed(1)}%
      </span>
    )
  }

  const EvolutionBadgeIncome = ({ couleur, direction, percent }: { couleur: string; direction: 'up' | 'down' | 'stable'; percent: number }) => {
    // Pour les revenus (après fix backend):
    // - Si percent > 0 (augmentation) => vert (positif) + flèche up
    // - Si percent < 0 (diminution) => rouge (négatif) + flèche down
    const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : null
    const colorClass = couleur === 'green' ? 'text-green-600 bg-white/90' : couleur === 'red' ? 'text-red-600 bg-white/90' : 'text-gray-600 bg-white/90'

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
        {Icon && <Icon className="w-3 h-3 mr-0.5" />}
        {percent >= 0 ? '+' : ''}{percent.toFixed(1)}%
      </span>
    )
  }

  const getCoverageColor = (taux: number) => {
    if (taux >= 20) return 'text-green-400'
    if (taux >= 10) return 'text-green-300'
    if (taux >= 5) return 'text-yellow-300'
    if (taux >= 0) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 overflow-x-auto">

          {/* YoY Expenses */}
          {yoyExpenses.data && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Calendar className="w-5 h-5 text-white/80" />
              <div>
                <p className="text-xs text-white/70 font-medium">📅 Dépenses (YoY)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatCurrency(yoyExpenses.data.periode_cible.total)}
                  </span>
                  <EvolutionBadgeExpenses
                    couleur={yoyExpenses.data.affichage.couleur}
                    percent={yoyExpenses.data.variation.pourcentage}
                    direction={yoyExpenses.data.variation.direction}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MoM Expenses */}
          {momExpenses.data && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-white/80" />
              <div>
                <p className="text-xs text-white/70 font-medium">📆 Dépenses (MoM)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatCurrency(momExpenses.data.periode_cible.total)}
                  </span>
                  <EvolutionBadgeExpenses
                    couleur={momExpenses.data.affichage.couleur}
                    percent={momExpenses.data.variation.pourcentage}
                    direction={momExpenses.data.variation.direction}
                  />
                </div>
              </div>
            </div>
          )}

          {/* YoY Income */}
          {yoyIncome.data && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Banknote className="w-5 h-5 text-white/80" />
              <div>
                <p className="text-xs text-white/70 font-medium">💰 Revenus (YoY)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatCurrency(yoyIncome.data.periode_cible.total)}
                  </span>
                  <EvolutionBadgeIncome
                    couleur={yoyIncome.data.affichage.couleur}
                    percent={yoyIncome.data.variation.pourcentage}
                    direction={yoyIncome.data.variation.direction}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MoM Income */}
          {momIncome.data && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <CreditCard className="w-5 h-5 text-white/80" />
              <div>
                <p className="text-xs text-white/70 font-medium">💳 Revenus (MoM)</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatCurrency(momIncome.data.periode_cible.total)}
                  </span>
                  <EvolutionBadgeIncome
                    couleur={momIncome.data.affichage.couleur}
                    percent={momIncome.data.variation.pourcentage}
                    direction={momIncome.data.variation.direction}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Coverage Rate */}
          {!coverage.isLoading && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Shield className={`w-5 h-5 ${coverage.data ? getCoverageColor(coverage.data.taux_couverture) : 'text-white/80'}`} />
              <div>
                <p className="text-xs text-white/70 font-medium">🛡️ Taux de Couverture</p>
                {coverage.data ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {coverage.data.taux_couverture.toFixed(1)}%
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${getCoverageColor(coverage.data.taux_couverture)}`}>
                      {coverage.data.affichage.niveau || 'N/A'}
                    </span>
                  </div>
                ) : coverage.error ? (
                  <span className="text-xs text-red-300">Erreur</span>
                ) : (
                  <span className="text-xs text-white/60">Aucune donnée</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MetricsBar
