/**
 * API Client pour le Metric Service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface MetricResponse<T = any> {
  user_id: number
  metric_type: string
  computed_at: string
  data: T
  cached: boolean
}

// ===== TRENDS =====

export interface MoMData {
  current_month: string
  previous_month: string
  current_amount: number
  previous_amount: number
  change_amount: number
  change_percent: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface YoYData {
  current_year: number
  previous_year: number
  current_amount: number
  previous_amount: number
  change_amount: number
  change_percent: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

// ===== HEALTH =====

export interface SavingsRateData {
  period_start: string
  period_end: string
  total_income: number
  total_expenses: number
  net_savings: number
  savings_rate: number
  health_status: 'excellent' | 'good' | 'fair' | 'poor'
  recommendation?: string
}

export interface ExpenseRatioData {
  period_start: string
  period_end: string
  total_expenses: number
  essentials: number
  essentials_percent: number
  lifestyle: number
  lifestyle_percent: number
  savings: number
  savings_percent: number
  is_balanced: boolean
  recommendations: string[]
}

export interface BurnRateData {
  period_start: string
  period_end: string
  current_balance: number
  monthly_burn_rate: number
  runway_days: number | null
  runway_months: number | null
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  alert: string | null
}

export interface BalanceForecastData {
  forecast_type: 'prophet' | 'linear'
  periods: number
  current_balance: number
  predictions: Array<{
    date: string
    balance: number
    balance_lower: number
    balance_upper: number
  }>
  trend: 'increasing' | 'decreasing' | 'stable'
  confidence: 'high' | 'medium' | 'low'
}

// ===== PATTERNS =====

export interface RecurringExpense {
  merchant: string
  category: string | null
  frequency: 'weekly' | 'monthly' | 'yearly'
  average_amount: number
  last_occurrence: string
  next_expected: string
  confidence: number
  occurrences: number
}

export interface RecurringExpensesData {
  period_start: string
  period_end: string
  recurring_expenses: RecurringExpense[]
  total_monthly_recurring: number
  recurring_percent_of_expenses: number
}

class MetricsAPI {
  private async fetchMetric<T>(endpoint: string): Promise<MetricResponse<T>> {
    // Get token from Zustand persisted store
    const persistedAuth = localStorage.getItem('harena-auth')
    const token = persistedAuth ? JSON.parse(persistedAuth).state.token : null

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // ===== TRENDS =====

  async getMoM(userId: number, month?: string, category?: string): Promise<MetricResponse<MoMData>> {
    const params = new URLSearchParams()
    if (month) params.append('month', month)
    if (category) params.append('category', category)

    return this.fetchMetric<MoMData>(
      `/api/v1/metrics/trends/mom/${userId}${params.toString() ? `?${params}` : ''}`
    )
  }

  async getYoY(userId: number, year?: number, category?: string): Promise<MetricResponse<YoYData>> {
    const params = new URLSearchParams()
    if (year) params.append('year', year.toString())
    if (category) params.append('category', category)

    return this.fetchMetric<YoYData>(
      `/api/v1/metrics/trends/yoy/${userId}${params.toString() ? `?${params}` : ''}`
    )
  }

  // ===== HEALTH =====

  async getSavingsRate(userId: number, periodDays = 30): Promise<MetricResponse<SavingsRateData>> {
    return this.fetchMetric<SavingsRateData>(
      `/api/v1/metrics/health/savings-rate/${userId}?period_days=${periodDays}`
    )
  }

  async getExpenseRatio(userId: number, periodDays = 30): Promise<MetricResponse<ExpenseRatioData>> {
    return this.fetchMetric<ExpenseRatioData>(
      `/api/v1/metrics/health/expense-ratio/${userId}?period_days=${periodDays}`
    )
  }

  async getBurnRate(userId: number, periodDays = 30): Promise<MetricResponse<BurnRateData>> {
    return this.fetchMetric<BurnRateData>(
      `/api/v1/metrics/health/burn-rate/${userId}?period_days=${periodDays}`
    )
  }

  async getBalanceForecast(userId: number, periods = 90): Promise<MetricResponse<BalanceForecastData>> {
    return this.fetchMetric<BalanceForecastData>(
      `/api/v1/metrics/health/balance-forecast/${userId}?periods=${periods}`
    )
  }

  // ===== PATTERNS =====

  async getRecurringExpenses(
    userId: number,
    minOccurrences = 3,
    lookbackDays = 90
  ): Promise<MetricResponse<RecurringExpensesData>> {
    return this.fetchMetric<RecurringExpensesData>(
      `/api/v1/metrics/patterns/recurring/${userId}?min_occurrences=${minOccurrences}&lookback_days=${lookbackDays}`
    )
  }
}

export const metricsApi = new MetricsAPI()
