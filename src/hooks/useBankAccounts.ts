/**
 * Hook pour gérer les comptes bancaires
 */

import { useQuery } from '@tanstack/react-query'
import { bankSyncApiService } from '@/services/api/bankSyncApi'

/**
 * Hook pour récupérer les comptes bancaires
 * @param itemId - ID de l'item (optionnel). Si fourni, récupère uniquement les comptes de cet item
 */
export const useBankAccounts = (itemId?: number) => {
  const {
    data: accounts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: itemId ? ['bank-accounts', itemId] : ['bank-accounts'],
    queryFn: () =>
      itemId
        ? bankSyncApiService.getAccountsByItem(itemId)
        : bankSyncApiService.getAccounts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  })

  return {
    accounts: accounts || [],
    isLoading,
    error,
    refetch
  }
}
