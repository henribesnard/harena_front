import { useQuery } from '@tanstack/react-query'
import { coreMetricsApi } from '../services/api/coreMetricsApi'

export const useCoreMetrics = () => {
  // YoY Expenses
  const yoyExpenses = useQuery({
    queryKey: ['coreMetrics', 'yoy-expenses'],
    queryFn: () => coreMetricsApi.getYoYExpenses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // MoM Expenses
  const momExpenses = useQuery({
    queryKey: ['coreMetrics', 'mom-expenses'],
    queryFn: () => coreMetricsApi.getMoMExpenses(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // YoY Income
  const yoyIncome = useQuery({
    queryKey: ['coreMetrics', 'yoy-income'],
    queryFn: () => coreMetricsApi.getYoYIncome(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // MoM Income
  const momIncome = useQuery({
    queryKey: ['coreMetrics', 'mom-income'],
    queryFn: () => coreMetricsApi.getMoMIncome(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Coverage Rate
  const coverage = useQuery({
    queryKey: ['coreMetrics', 'coverage'],
    queryFn: () => coreMetricsApi.getCoverage(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  return {
    yoyExpenses,
    momExpenses,
    yoyIncome,
    momIncome,
    coverage,
  }
}
