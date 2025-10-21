import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import ProfilCard from '../components/budget/ProfilCard'
import ChargesBreakdown from '../components/budget/ChargesBreakdown'
import FixedChargesList from '../components/budget/FixedChargesList'
import MonthlyTrendsChart from '../components/budget/MonthlyTrendsChart'
import {
  useBudgetProfile,
  useAnalyzeBudgetProfile,
  useFixedCharges,
  useMonthlyAggregates,
} from '../hooks/useBudgetProfile'

const BudgetProfilingPage = () => {
  const [analysisMonths, setAnalysisMonths] = useState<number | undefined>(undefined)

  // Récupérer les données
  const { data: profile, isLoading: profileLoading, error: profileError } = useBudgetProfile()
  const { data: fixedCharges, isLoading: chargesLoading } = useFixedCharges()
  const { data: monthlyAggregates, isLoading: aggregatesLoading } = useMonthlyAggregates(12)

  // Mutation pour analyser le profil
  const {
    mutate: analyzeProfile,
    isPending: isAnalyzing,
    isSuccess: analyzeSuccess,
  } = useAnalyzeBudgetProfile()

  // Auto-analyse au chargement si pas de profil
  useEffect(() => {
    if (!profile && !profileLoading && !profileError) {
      analyzeProfile(undefined)
    }
  }, [profile, profileLoading, profileError, analyzeProfile])

  const handleAnalyze = () => {
    analyzeProfile(analysisMonths)
  }

  // Calcul du temps écoulé depuis dernière analyse
  const getTimeSinceLastAnalysis = () => {
    if (!profile?.last_analyzed_at) return null

    const lastAnalysis = new Date(profile.last_analyzed_at)
    const now = new Date()
    const diffMs = now.getTime() - lastAnalysis.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    return 'récemment'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-10 h-10 text-indigo-600" />
                <h1 className="text-4xl font-bold text-gray-900">Budget Profiling</h1>
              </div>
              <p className="mt-2 text-lg text-gray-600">
                Analyse intelligente de votre situation financière
              </p>
              {profile && (
                <p className="mt-1 text-sm text-gray-500">
                  Dernière analyse: {getTimeSinceLastAnalysis()}
                </p>
              )}
            </div>

            {/* Bouton d'analyse */}
            <div className="flex items-center space-x-4">
              <select
                value={analysisMonths || ''}
                onChange={(e) => setAnalysisMonths(e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isAnalyzing}
              >
                <option value="">Toutes les transactions</option>
                <option value="3">3 derniers mois</option>
                <option value="6">6 derniers mois</option>
                <option value="12">12 derniers mois</option>
                <option value="24">24 derniers mois</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-700 hover:to-purple-700
                  disabled:from-gray-400 disabled:to-gray-500
                  flex items-center space-x-2 shadow-lg
                  transition-all duration-200
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Analyser</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Message de succès */}
          {analyzeSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 font-medium">
                ✓ Profil budgétaire mis à jour avec succès
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Erreur de chargement */}
        {profileError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Erreur de chargement</h3>
                <p className="text-sm text-red-700 mt-1">
                  Impossible de charger votre profil budgétaire. Veuillez réessayer.
                </p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 underline"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Profil Card */}
          <ProfilCard profile={profile} isLoading={profileLoading || isAnalyzing} />

          {/* Grid 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Répartition des charges */}
            <ChargesBreakdown profile={profile} isLoading={profileLoading || isAnalyzing} />

            {/* Charges fixes détectées */}
            <FixedChargesList charges={fixedCharges} isLoading={chargesLoading} />
          </div>

          {/* Évolution mensuelle */}
          <MonthlyTrendsChart aggregates={monthlyAggregates} isLoading={aggregatesLoading} />

          {/* Insights & Recommandations */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Insights & Recommandations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommandations basées sur le segment */}
                {profile.user_segment === 'budget_serré' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3">💡 Optimisation des dépenses</h4>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li>• Identifiez les abonnements non utilisés</li>
                      <li>• Comparez vos assurances pour économiser</li>
                      <li>• Planifiez vos achats pour éviter les impulsions</li>
                      <li>• Utilisez des applications de cashback</li>
                    </ul>
                  </div>
                )}

                {profile.user_segment === 'équilibré' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3">📈 Augmentez votre épargne</h4>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li>• Automatisez votre épargne mensuelle</li>
                      <li>• Investissez dans un PEA ou assurance-vie</li>
                      <li>• Créez un fonds d'urgence de 3-6 mois</li>
                      <li>• Profitez de l'épargne salariale si disponible</li>
                    </ul>
                  </div>
                )}

                {profile.user_segment === 'confortable' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3">💰 Optimisation fiscale</h4>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li>• Diversifiez vos investissements</li>
                      <li>• Explorez les placements défiscalisés</li>
                      <li>• Consultez un conseiller en gestion de patrimoine</li>
                      <li>• Planifiez votre retraite dès maintenant</li>
                    </ul>
                  </div>
                )}

                {/* Recommandations basées sur le pattern */}
                {profile.behavioral_pattern === 'acheteur_impulsif' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3">🎯 Contrôlez vos achats impulsifs</h4>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li>• Attendez 24h avant un achat non planifié</li>
                      <li>• Définissez un budget mensuel strict</li>
                      <li>• Désactivez les notifications marketing</li>
                      <li>• Créez une liste d'achats et respectez-la</li>
                    </ul>
                  </div>
                )}

                {profile.behavioral_pattern === 'planificateur' && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3">✅ Excellent travail !</h4>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li>• Continuez votre planification rigoureuse</li>
                      <li>• Revoyez vos objectifs tous les 6 mois</li>
                      <li>• Explorez de nouvelles opportunités d'épargne</li>
                      <li>• Partagez vos bonnes pratiques</li>
                    </ul>
                  </div>
                )}

                {/* Statistiques clés */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-semibold mb-3">📊 Vos chiffres clés</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Taux d'épargne:</span>
                      <span className="font-bold">{profile.savings_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Charges fixes:</span>
                      <span className="font-bold">
                        {((profile.fixed_charges_total / profile.avg_monthly_income) * 100).toFixed(1)}% du revenu
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Reste à vivre:</span>
                      <span className="font-bold font-mono">
                        {profile.remaining_to_live.toFixed(2)}€
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Données analysées:</span>
                      <span className="font-bold">
                        {Math.round(profile.profile_completeness * 100)}% complètes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Objectifs suggérés */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h4 className="font-semibold mb-3">🎯 Objectifs suggérés</h4>
                  <div className="space-y-3 text-sm">
                    {profile.savings_rate < 10 && (
                      <div className="flex items-start space-x-2">
                        <span>📌</span>
                        <span className="text-white/90">
                          Atteindre 10% de taux d'épargne
                        </span>
                      </div>
                    )}
                    {profile.savings_rate >= 10 && profile.savings_rate < 20 && (
                      <div className="flex items-start space-x-2">
                        <span>📌</span>
                        <span className="text-white/90">
                          Viser 20% de taux d'épargne
                        </span>
                      </div>
                    )}
                    <div className="flex items-start space-x-2">
                      <span>📌</span>
                      <span className="text-white/90">
                        Constituer un fonds d'urgence de {(profile.avg_monthly_expenses * 3).toFixed(0)}€
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span>📌</span>
                      <span className="text-white/90">
                        Réduire les charges variables de 10%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetProfilingPage
