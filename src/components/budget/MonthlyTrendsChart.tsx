import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import type { MonthlyAggregate } from '../../types/budgetProfiling'

interface MonthlyTrendsChartProps {
  aggregates: MonthlyAggregate[] | undefined
  isLoading?: boolean
}

const MONTH_NAMES = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <span className="text-sm" style={{ color: entry.color }}>
              {entry.name}:
            </span>
            <span className="font-bold font-mono" style={{ color: entry.color }}>
              {entry.value?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const MonthlyTrendsChart = ({ aggregates, isLoading }: MonthlyTrendsChartProps) => {
  if (isLoading || !aggregates) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  // Préparer les données pour le graphique
  const chartData = aggregates
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
    .map((agg) => ({
      name: `${MONTH_NAMES[agg.month - 1]} ${agg.year}`,
      Revenus: agg.total_income,
      Dépenses: Math.abs(agg.total_expenses),
      Épargne: agg.net_savings,
      year: agg.year,
      month: agg.month,
    }))

  // Calculer les statistiques
  const latestMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]

  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / Math.abs(previous)) * 100
  }

  const revenueTrend = previousMonth
    ? calculateTrend(latestMonth.Revenus, previousMonth.Revenus)
    : 0
  const expenseTrend = previousMonth
    ? calculateTrend(latestMonth.Dépenses, previousMonth.Dépenses)
    : 0
  const savingsTrend = previousMonth
    ? calculateTrend(latestMonth.Épargne, previousMonth.Épargne)
    : 0

  const avgIncome = chartData.reduce((sum, d) => sum + d.Revenus, 0) / chartData.length
  const avgExpenses = chartData.reduce((sum, d) => sum + d.Dépenses, 0) / chartData.length
  const avgSavings = chartData.reduce((sum, d) => sum + d.Épargne, 0) / chartData.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl p-8 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Évolution Mensuelle</h3>
          <p className="text-sm text-gray-500 mt-1">
            Analyse de vos finances sur {chartData.length} mois
          </p>
        </div>
        <Activity className="w-8 h-8 text-blue-600" />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Revenus */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Revenus</span>
            {revenueTrend !== 0 && (
              <div className={`flex items-center text-xs ${revenueTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {revenueTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="ml-1">{Math.abs(revenueTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-mono">
            {latestMonth.Revenus.toFixed(2)}€
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Moy: {avgIncome.toFixed(2)}€
          </div>
        </div>

        {/* Dépenses */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700">Dépenses</span>
            {expenseTrend !== 0 && (
              <div className={`flex items-center text-xs ${expenseTrend < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {expenseTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="ml-1">{Math.abs(expenseTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-red-900 font-mono">
            {latestMonth.Dépenses.toFixed(2)}€
          </div>
          <div className="text-xs text-red-600 mt-1">
            Moy: {avgExpenses.toFixed(2)}€
          </div>
        </div>

        {/* Épargne */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Épargne</span>
            {savingsTrend !== 0 && (
              <div className={`flex items-center text-xs ${savingsTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {savingsTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="ml-1">{Math.abs(savingsTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-blue-900 font-mono">
            {latestMonth.Épargne.toFixed(2)}€
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Moy: {avgSavings.toFixed(2)}€
          </div>
        </div>
      </div>

      {/* Graphique en lignes */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendances</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${value.toFixed(0)}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="Revenus"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Dépenses"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: '#EF4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Épargne"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique en barres */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparaison mensuelle</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData.slice(-6)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `${value.toFixed(0)}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="Revenus" fill="#10B981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Dépenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Épargne" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <h5 className="font-semibold text-indigo-900 mb-2">📊 Analyse</h5>
        <div className="text-sm text-gray-700 space-y-1">
          {savingsTrend > 0 && (
            <p className="text-emerald-700">
              ✓ Votre épargne est en hausse de {savingsTrend.toFixed(1)}% par rapport au mois dernier
            </p>
          )}
          {savingsTrend < 0 && (
            <p className="text-amber-700">
              ⚠ Votre épargne a diminué de {Math.abs(savingsTrend).toFixed(1)}% ce mois-ci
            </p>
          )}
          {avgSavings > 0 && (
            <p className="text-blue-700">
              ℹ Vous épargnez en moyenne {avgSavings.toFixed(2)}€ par mois
            </p>
          )}
          {expenseTrend > 10 && (
            <p className="text-red-700">
              ⚠ Vos dépenses ont fortement augmenté (+{expenseTrend.toFixed(1)}%)
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MonthlyTrendsChart
