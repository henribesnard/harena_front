import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import type { BudgetProfile } from '../../types/budgetProfiling'

interface ProfilCardProps {
  profile: BudgetProfile | undefined
  isLoading?: boolean
}

const getSegmentConfig = (segment: string) => {
  switch (segment) {
    case 'confortable':
      return {
        gradient: 'from-emerald-500 to-teal-600',
        icon: '🎯',
        label: 'Budget Confortable',
        color: 'text-emerald-600'
      }
    case 'équilibré':
      return {
        gradient: 'from-blue-500 to-indigo-600',
        icon: '⚖️',
        label: 'Budget Équilibré',
        color: 'text-blue-600'
      }
    case 'budget_serré':
      return {
        gradient: 'from-amber-500 to-orange-600',
        icon: '⚠️',
        label: 'Budget Serré',
        color: 'text-amber-600'
      }
    default:
      return {
        gradient: 'from-gray-500 to-gray-600',
        icon: '📊',
        label: 'Budget',
        color: 'text-gray-600'
      }
  }
}

const getPatternLabel = (pattern: string) => {
  switch (pattern) {
    case 'planificateur':
      return '🧠 Planificateur'
    case 'acheteur_impulsif':
      return '⚡ Acheteur Impulsif'
    case 'dépensier_hebdomadaire':
      return '📅 Dépensier Hebdomadaire'
    default:
      return pattern
  }
}

const getHealthScore = (profile: BudgetProfile) => {
  // Score basé sur: taux d'épargne, complétude, et ratio charges/revenus
  const savingsScore = Math.min(profile.savings_rate * 2, 40) // Max 40 points
  const completenessScore = profile.profile_completeness * 30 // Max 30 points
  const chargesRatio = (profile.fixed_charges_total + profile.semi_fixed_charges_total) / profile.avg_monthly_income
  const balanceScore = Math.max(0, 30 - (chargesRatio * 30)) // Max 30 points

  return Math.round(savingsScore + completenessScore + balanceScore)
}

const getHealthLevel = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (score >= 60) return { label: 'Bon', color: 'text-blue-600', bg: 'bg-blue-50' }
  if (score >= 40) return { label: 'Moyen', color: 'text-amber-600', bg: 'bg-amber-50' }
  return { label: 'À améliorer', color: 'text-red-600', bg: 'bg-red-50' }
}

const ProfilCard = ({ profile, isLoading }: ProfilCardProps) => {
  if (isLoading || !profile) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    )
  }

  const segmentConfig = getSegmentConfig(profile.user_segment)
  const healthScore = getHealthScore(profile)
  const healthLevel = getHealthLevel(healthScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-white rounded-2xl shadow-xl"
    >
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${segmentConfig.gradient} p-8 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">{segmentConfig.icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{segmentConfig.label}</h2>
              <p className="text-white/90 mt-1">{getPatternLabel(profile.behavioral_pattern)}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
            <div className="text-3xl font-bold">{healthScore}</div>
            <div className="text-sm text-white/90">Score Santé</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Taux d'épargne */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Taux d'épargne</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {profile.savings_rate.toFixed(1)}%
            </div>
            {profile.savings_rate > 10 ? (
              <div className="flex items-center text-sm text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Excellent</span>
              </div>
            ) : profile.savings_rate > 5 ? (
              <div className="flex items-center text-sm text-blue-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Bon</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-amber-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>À améliorer</span>
              </div>
            )}
          </div>

          {/* Reste à vivre */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm font-medium">Reste à vivre</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono">
              {profile.remaining_to_live.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}€
            </div>
            <div className="text-sm text-gray-500">
              Après charges fixes
            </div>
          </div>

          {/* Complétude */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm font-medium">Complétude</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(profile.profile_completeness * 100)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profile.profile_completeness * 100}%` }}
              ></div>
            </div>
          </div>

          {/* État de santé */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Santé financière</span>
            </div>
            <div className={`text-xl font-bold ${healthLevel.color}`}>
              {healthLevel.label}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${healthLevel.bg} ${healthLevel.color}`}>
              Score: {healthScore}/100
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfilCard
