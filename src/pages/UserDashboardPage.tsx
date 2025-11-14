import type { ComponentType } from 'react'
import { TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react'
import { useCoreMetrics } from '../hooks/useCoreMetrics'
import { useBudgetProfile } from '../hooks/useBudgetProfile'

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null || Number.isNaN(amount)) return '--'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('fr-FR', {
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
  loading = false,
}: {
  title: string
  value: string
  icon: ComponentType<{ className?: string }>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
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

const segmentLabels: Record<string, string> = {
  budget_serré: 'Budget serré',
  équilibré: 'Équilibré',
  confortable: 'Confortable',
}

const behaviorLabels: Record<string, string> = {
  acheteur_impulsif: 'Acheteur impulsif',
  planificateur: 'Planificateur',
  dépensier_hebdomadaire: 'Dépensier hebdomadaire',
  indéterminé: 'Profil à préciser',
}

const UserDashboardPage = () => {
  const { yoyExpenses, momExpenses, yoyIncome, momIncome, coverage } = useCoreMetrics()
  const { data: profile, isLoading: profileLoading } = useBudgetProfile()

  const metricsSubtitle = 'Calculées via metric_service'

  const profileHighlights = [
    {
      label: 'Segment utilisateur',
      value: profile ? segmentLabels[profile.user_segment] ?? 'Analyse en attente' : 'Analyse en attente',
    },
    {
      label: 'Comportement détecté',
      value: profile ? behaviorLabels[profile.behavioral_pattern] ?? 'Analyse en attente' : 'Analyse en attente',
    },
    { label: 'Reste à vivre estimé', value: formatCurrency(profile?.remaining_to_live) },
    {
      label: 'Complétude du profil',
      value: profile ? `${Math.round((profile.profile_completeness ?? 0) * 100)}%` : '--',
    },
  ]

  const quickStats = [
    { label: 'Revenus moyens', value: formatCurrency(profile?.avg_monthly_income) },
    { label: 'Dépenses moyennes', value: formatCurrency(profile?.avg_monthly_expenses) },
    { label: 'Épargne moyenne', value: formatCurrency(profile?.avg_monthly_savings) },
    { label: 'Charges fixes', value: formatCurrency(profile?.fixed_charges_total) },
    { label: 'Charges variables', value: formatCurrency(profile?.variable_charges_total) },
    {
      label: 'Taux de couverture',
      value: coverage.data ? `${coverage.data.taux_couverture.toFixed(1)}%` : '--',
    },
    { label: 'Dernière analyse', value: formatDate(profile?.last_analyzed_at) },
  ]

  const budgetSummary = [
    { label: 'Revenus moyens', value: formatCurrency(profile?.avg_monthly_income) },
    { label: 'Dépenses moyennes', value: formatCurrency(profile?.avg_monthly_expenses) },
    { label: 'Épargne moyenne', value: formatCurrency(profile?.avg_monthly_savings) },
    { label: 'Charges fixes', value: formatCurrency(profile?.fixed_charges_total) },
    { label: 'Charges semi-fixes', value: formatCurrency(profile?.semi_fixed_charges_total) },
    { label: 'Charges variables', value: formatCurrency(profile?.variable_charges_total) },
    { label: 'Taux de couverture', value: coverage.data ? `${coverage.data.taux_couverture.toFixed(1)}%` : '--' },
    { label: 'Taux d’épargne', value: profile ? `${(profile.savings_rate * 100).toFixed(1)}%` : '--' },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Profil budgétaire</h3>
          <p className="text-sm text-gray-500 mb-4">Analyse fournie par budget_profiling_service</p>
          {profileLoading && !profile ? (
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileHighlights.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{item.label}</dt>
                  <dd className="text-lg font-semibold text-gray-900 mt-1">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Synthèse financière</h3>
          <p className="text-sm text-gray-500 mb-4">Indicateurs clés calculés localement</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickStats.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Métriques financières</h2>
            <p className="text-sm text-gray-500">{metricsSubtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Dépenses (MoM)"
            value={momExpenses.data ? formatCurrency(momExpenses.data.periode_cible.total) : '--'}
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
            value={momIncome.data ? formatCurrency(momIncome.data.periode_cible.total) : '--'}
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
            value={yoyExpenses.data ? formatCurrency(yoyExpenses.data.periode_cible.total) : '--'}
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
            value={yoyIncome.data ? formatCurrency(yoyIncome.data.periode_cible.total) : '--'}
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

          <StatCard
            title="Couverture"
            value={coverage.data ? `${coverage.data.taux_couverture.toFixed(1)}%` : '--'}
            icon={ShieldCheck}
            trend="neutral"
            loading={coverage.isLoading}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Résumé budgétaire</h3>
            <p className="text-sm text-gray-500">Basé sur la dernière analyse complète</p>
          </div>
        </div>
        {profileLoading && !profile ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {budgetSummary.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-xl font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        )}
        {profile?.last_analyzed_at && (
          <p className="mt-4 text-xs text-gray-500">Dernière mise à jour : {formatDate(profile.last_analyzed_at)}</p>
        )}
      </section>
    </div>
  )
}

export default UserDashboardPage
