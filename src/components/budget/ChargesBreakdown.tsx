import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { BudgetProfile } from '../../types/budgetProfiling'

interface ChargesBreakdownProps {
  profile: BudgetProfile | undefined
  isLoading?: boolean
}

const COLORS = {
  fixed: '#EF4444',      // Rouge pour charges fixes
  semiFixed: '#F97316',   // Orange pour semi-fixes
  variable: '#10B981',   // Vert pour variables
}

const ChargesBreakdown = ({ profile, isLoading }: ChargesBreakdownProps) => {
  if (isLoading || !profile) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
        <div className="h-80 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  const chartData = [
    {
      name: 'Charges Fixes',
      value: profile.fixed_charges_total,
      color: COLORS.fixed,
      description: 'Loyer, prêts, abonnements'
    },
    {
      name: 'Charges Semi-fixes',
      value: profile.semi_fixed_charges_total,
      color: COLORS.semiFixed,
      description: 'Alimentation, transport, énergie'
    },
    {
      name: 'Charges Variables',
      value: profile.variable_charges_total,
      color: COLORS.variable,
      description: 'Loisirs, shopping, extras'
    },
  ]

  const total = profile.fixed_charges_total + profile.semi_fixed_charges_total + profile.variable_charges_total

  const getPercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl p-8 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Répartition des Charges</h3>
        <div className="text-sm text-gray-500">
          Total: {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€/mois
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Graphique en anneau */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}€`}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Détails des charges */}
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
              className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
              style={{ borderColor: item.color }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                </div>
                <span className="text-lg font-bold text-gray-900 font-mono">
                  {item.value.toFixed(2)}€
                </span>
              </div>
              <p className="text-sm text-gray-500 ml-7">{item.description}</p>
              <div className="mt-3 ml-7">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Part du budget</span>
                  <span className="font-semibold" style={{ color: item.color }}>
                    {getPercentage(item.value)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${getPercentage(item.value)}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Résumé */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Dépenses mensuelles totales</span>
              <span className="text-xl font-bold text-gray-900 font-mono">
                {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Revenus moyens</span>
              <span className="font-semibold text-gray-900 font-mono">
                {profile.avg_monthly_income.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-indigo-200 flex items-center justify-between">
              <span className="font-medium text-gray-700">Épargne moyenne</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">
                {profile.avg_monthly_savings.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChargesBreakdown
