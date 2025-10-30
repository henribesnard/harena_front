/**
 * useAccountPreferences - Hook pour gérer les préférences de filtrage des comptes
 *
 * Permet de:
 * - Récupérer les préférences utilisateur
 * - Mettre à jour la sélection de comptes
 * - Réinitialiser aux valeurs par défaut
 */

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getUserPreferences, updateUserPreferences, resetUserPreferences } from '../services/api/userPreferencesApi'
import { analyzeBudgetProfile } from '../services/api/budgetProfilingApi'
import type { AccountSelection, UserPreferences } from '../types/preferences'
import toast from 'react-hot-toast'

const DEFAULT_ACCOUNT_SELECTION: AccountSelection = {
  mode: 'all',
  excluded_types: [],
  included_accounts: []
}

const DEFAULT_PREFERENCES: UserPreferences = {
  budget_settings: {
    months_analysis: 12,
    fixed_charge_min_occurrences: 5,
    fixed_charge_max_variance: 0.2,
    fixed_charge_min_amount: 10,
    account_selection: DEFAULT_ACCOUNT_SELECTION
  }
}

export const useAccountPreferences = () => {
  const queryClient = useQueryClient()
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Charger les préférences au montage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true)
        const prefs = await getUserPreferences()
        console.log('📥 Loaded preferences from API:', prefs)

        // Merge avec les valeurs par défaut pour s'assurer d'avoir la structure complète
        const mergedPrefs: UserPreferences = {
          ...DEFAULT_PREFERENCES,
          ...prefs,
          budget_settings: {
            ...DEFAULT_PREFERENCES.budget_settings,
            ...prefs.budget_settings,
            account_selection: {
              ...DEFAULT_ACCOUNT_SELECTION,
              ...(prefs.budget_settings?.account_selection || {})
            }
          }
        }

        console.log('🔄 Merged preferences:', mergedPrefs)
        setPreferences(mergedPrefs)
      } catch (error: any) {
        console.error('❌ Erreur lors du chargement des préférences:', error)
        toast.error('Erreur lors du chargement des préférences')
        // Garder les valeurs par défaut en cas d'erreur
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  // Mettre à jour la sélection de comptes
  const updateSelection = async (selection: AccountSelection) => {
    try {
      setIsUpdating(true)
      const payload = {
        budget_settings: {
          ...(preferences?.budget_settings || DEFAULT_PREFERENCES.budget_settings),
          account_selection: selection
        }
      }
      console.log('📤 Sending to API:', payload)

      const updated = await updateUserPreferences(payload)
      console.log('📥 Received from API after save:', updated)

      setPreferences(updated)

      // Déclencher automatiquement une nouvelle analyse du profil budgétaire
      console.log('🔄 Triggering budget profile reanalysis...')
      try {
        await analyzeBudgetProfile()
        console.log('✅ Budget profile analysis completed')
      } catch (err) {
        console.error('⚠️ Budget analysis failed but preferences saved:', err)
        // Ne pas bloquer l'UX si l'analyse échoue
      }

      // Invalider toutes les queries dépendantes pour forcer le recalcul
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      // Budget profiling service
      queryClient.invalidateQueries({ queryKey: ['budgetProfile'] })
      queryClient.invalidateQueries({ queryKey: ['fixedCharges'] })
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] })
      queryClient.invalidateQueries({ queryKey: ['categoryBreakdown'] })
      // Metric service
      queryClient.invalidateQueries({ queryKey: ['coreMetrics'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['mom-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-income'] })
      queryClient.invalidateQueries({ queryKey: ['mom-income'] })
      queryClient.invalidateQueries({ queryKey: ['coverage'] })

      toast.success('Préférences de comptes mises à jour')
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour:', error)
      console.error('❌ Error details:', error.response?.data)
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour')
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  // Réinitialiser aux valeurs par défaut
  const reset = async () => {
    try {
      setIsUpdating(true)
      const updated = await resetUserPreferences()
      setPreferences(updated)

      // Déclencher automatiquement une nouvelle analyse du profil budgétaire
      console.log('🔄 Triggering budget profile reanalysis after reset...')
      try {
        await analyzeBudgetProfile()
        console.log('✅ Budget profile analysis completed after reset')
      } catch (err) {
        console.error('⚠️ Budget analysis failed but preferences reset:', err)
      }

      // Invalider toutes les queries dépendantes pour forcer le recalcul
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
      // Budget profiling service
      queryClient.invalidateQueries({ queryKey: ['budgetProfile'] })
      queryClient.invalidateQueries({ queryKey: ['fixedCharges'] })
      queryClient.invalidateQueries({ queryKey: ['monthlyAggregates'] })
      queryClient.invalidateQueries({ queryKey: ['categoryBreakdown'] })
      // Metric service
      queryClient.invalidateQueries({ queryKey: ['coreMetrics'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['mom-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['yoy-income'] })
      queryClient.invalidateQueries({ queryKey: ['mom-income'] })
      queryClient.invalidateQueries({ queryKey: ['coverage'] })

      toast.success('Préférences réinitialisées')
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error)
      toast.error(error.response?.data?.detail || 'Erreur lors de la réinitialisation')
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    preferences,
    accountSelection: preferences?.budget_settings?.account_selection || DEFAULT_ACCOUNT_SELECTION,
    isLoading,
    isUpdating,
    updatePreferences: updateSelection,
    resetPreferences: reset
  }
}
