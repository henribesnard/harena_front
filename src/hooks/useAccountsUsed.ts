/**
 * useAccountsUsed - Hook pour récupérer les informations sur les comptes utilisés
 *
 * Récupère les données accounts_used depuis le profil budgétaire
 * Permet d'afficher quels comptes sont inclus dans les calculs
 */

import { useQuery } from '@tanstack/react-query'
import type { AccountsUsed } from '@/types/budgetProfiling'
import { getBudgetProfile } from '@/services/api/budgetProfilingApi'

export const useAccountsUsed = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['budgetProfile'],
    queryFn: getBudgetProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  console.log('🔍 useAccountsUsed - Profile:', profile)
  console.log('🔍 useAccountsUsed - accounts_used:', profile?.accounts_used)

  return {
    accountsUsed: profile?.accounts_used,
    isLoading,
    error
  }
}
