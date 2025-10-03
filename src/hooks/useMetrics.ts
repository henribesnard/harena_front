import { useQuery } from '@tanstack/react-query'
import { metricsApi, type MoMData, type SavingsRateData, type BurnRateData } from '../services/api/metricsApi'
import { useAuthStore } from '../stores/authStore'

export const useFinancialMetrics = (userId: number) => {
  // MoM - Month over Month
  const mom = useQuery({
    queryKey: ['metrics', 'mom', userId],
    queryFn: () => metricsApi.getMoM(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  // Savings Rate
  const savingsRate = useQuery({
    queryKey: ['metrics', 'savings-rate', userId],
    queryFn: () => metricsApi.getSavingsRate(userId, 30),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  // Burn Rate
  const burnRate = useQuery({
    queryKey: ['metrics', 'burn-rate', userId],
    queryFn: () => metricsApi.getBurnRate(userId, 30),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    mom,
    savingsRate,
    burnRate,
  }
}
