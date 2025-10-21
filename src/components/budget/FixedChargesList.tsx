import { motion } from 'framer-motion'
import { Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import type { FixedCharge } from '../../types/budgetProfiling'

interface FixedChargesListProps {
  charges: FixedCharge[] | undefined
  isLoading?: boolean
}

const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 0.9) return { label: 'Très élevée', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (confidence >= 0.8) return { label: 'Élevée', color: 'text-blue-600', bg: 'bg-blue-50' }
  if (confidence >= 0.7) return { label: 'Moyenne', color: 'text-amber-600', bg: 'bg-amber-50' }
  return { label: 'Faible', color: 'text-gray-600', bg: 'bg-gray-50' }
}

const getCategoryColor = (category: string) => {
  const categoryColors: Record<string, string> = {
    'prêt': 'bg-red-100 text-red-700',
    'Assurances': 'bg-blue-100 text-blue-700',
    'Téléphones/internet': 'bg-purple-100 text-purple-700',
    'Abonnements': 'bg-indigo-100 text-indigo-700',
    'Eélectricité/eau': 'bg-yellow-100 text-yellow-700',
    'Impôts': 'bg-orange-100 text-orange-700',
    'Garde d\'enfants': 'bg-pink-100 text-pink-700',
    'Pension alimentaire': 'bg-rose-100 text-rose-700',
    'Frais scolarité': 'bg-cyan-100 text-cyan-700',
  }
  return categoryColors[category] || 'bg-gray-100 text-gray-700'
}

const FixedChargesList = ({ charges, isLoading }: FixedChargesListProps) => {
  if (isLoading || !charges) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  const activeCharges = charges.filter(charge => charge.is_active)
  const totalFixedCharges = activeCharges.reduce((sum, charge) => sum + charge.avg_amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl p-8 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Charges Fixes Détectées</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeCharges.length} charge{activeCharges.length > 1 ? 's' : ''} récurrente{activeCharges.length > 1 ? 's' : ''} identifiée{activeCharges.length > 1 ? 's' : ''} automatiquement
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total mensuel</div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {totalFixedCharges.toFixed(2)}€
          </div>
        </div>
      </div>

      {activeCharges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune charge fixe détectée pour le moment</p>
          <p className="text-sm mt-2">Les charges fixes seront détectées après analyse de vos transactions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCharges.map((charge, index) => {
            const confidenceLevel = getConfidenceLevel(charge.recurrence_confidence)
            const categoryColor = getCategoryColor(charge.category)

            return (
              <motion.div
                key={charge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all hover:border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-semibold text-gray-900">{charge.merchant_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                        {charge.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 ml-8">
                      {/* Montant */}
                      <div>
                        <div className="text-xs text-gray-500">Montant moyen</div>
                        <div className="text-lg font-bold text-gray-900 font-mono">
                          {charge.avg_amount.toFixed(2)}€
                        </div>
                      </div>

                      {/* Jour de prélèvement */}
                      <div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Jour du mois
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {charge.recurrence_day}
                        </div>
                      </div>

                      {/* Confiance */}
                      <div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Confiance
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceLevel.bg} ${confidenceLevel.color}`}>
                            {confidenceLevel.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(charge.recurrence_confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression de confiance */}
                    <div className="mt-3 ml-8">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${charge.recurrence_confidence * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Basé sur {charge.transaction_count} transaction{charge.transaction_count > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Légende */}
      {activeCharges.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium text-blue-900">Détection automatique</p>
              <p className="mt-1">
                Ces charges sont détectées automatiquement en analysant la récurrence de vos transactions
                (montant similaire ±10%, régularité temporelle ±5 jours).
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FixedChargesList
