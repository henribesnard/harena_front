import type {
  MetricResponse,
  YoYExpensesData,
  MoMExpensesData,
  YoYIncomeData,
  MoMIncomeData,
  CoverageData,
} from '../../types/coreMetrics'

import { SERVICES } from '../../config/services'

class CoreMetricsAPI {
  private baseURL: string

  constructor() {
    this.baseURL = `${SERVICES.METRIC.baseURL}${SERVICES.METRIC.apiV1}/metrics`
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const storedAuth = localStorage.getItem('harena-auth')
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        const token = authData.state?.token
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      } catch (e) {
        console.error('Error parsing auth token:', e)
      }
    }

    return headers
  }

  private async fetchMetric<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    console.log(`Fetching metric from: ${url}`)

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Failed to fetch metric: ${response.statusText}`)
    }

    const data: MetricResponse<T> = await response.json()
    console.log(`Response from ${endpoint}:`, data)
    return data.data
  }

  // YoY Expenses (defaults: current year vs last year)
  async getYoYExpenses(): Promise<YoYExpensesData> {
    return this.fetchMetric<YoYExpensesData>('/expenses/yoy')
  }

  // MoM Expenses (defaults: current month vs last month)
  async getMoMExpenses(): Promise<MoMExpensesData> {
    return this.fetchMetric<MoMExpensesData>('/expenses/mom')
  }

  // YoY Income (defaults: current year vs last year)
  async getYoYIncome(): Promise<YoYIncomeData> {
    return this.fetchMetric<YoYIncomeData>('/income/yoy')
  }

  // MoM Income (defaults: current month vs last month)
  async getMoMIncome(): Promise<MoMIncomeData> {
    return this.fetchMetric<MoMIncomeData>('/income/mom')
  }

  // Coverage Rate (defaults: current month)
  async getCoverage(): Promise<CoverageData> {
    return this.fetchMetric<CoverageData>('/coverage')
  }
}

export const coreMetricsApi = new CoreMetricsAPI()
