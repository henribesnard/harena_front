import axios, { AxiosInstance } from 'axios';
import type {
  MetricResponse,
  YoYExpensesData,
  MoMExpensesData,
  YoYIncomeData,
  MoMIncomeData,
  CoverageData,
  YoYQueryParams,
  MoMQueryParams,
  CoverageQueryParams
} from '../types/metrics';

class MetricsAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1/metrics',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Intercepteur pour ajouter le token JWT depuis le store zustand
    this.client.interceptors.request.use((config) => {
      // Le token est stocké dans zustand persist avec la clé 'harena-auth'
      const storedAuth = localStorage.getItem('harena-auth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          const token = authData.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error('Error parsing auth token:', e);
        }
      }
      return config;
    });
  }

  // YoY Expenses
  async getYoYExpenses(params?: YoYQueryParams): Promise<YoYExpensesData> {
    const response = await this.client.get<MetricResponse<YoYExpensesData>>(
      '/expenses/yoy',
      { params }
    );
    return response.data.data;
  }

  // MoM Expenses
  async getMoMExpenses(params?: MoMQueryParams): Promise<MoMExpensesData> {
    const response = await this.client.get<MetricResponse<MoMExpensesData>>(
      '/expenses/mom',
      { params }
    );
    return response.data.data;
  }

  // YoY Income
  async getYoYIncome(params?: YoYQueryParams): Promise<YoYIncomeData> {
    const response = await this.client.get<MetricResponse<YoYIncomeData>>(
      '/income/yoy',
      { params }
    );
    return response.data.data;
  }

  // MoM Income
  async getMoMIncome(params?: MoMQueryParams): Promise<MoMIncomeData> {
    const response = await this.client.get<MetricResponse<MoMIncomeData>>(
      '/income/mom',
      { params }
    );
    return response.data.data;
  }

  // Coverage Rate
  async getCoverage(params?: CoverageQueryParams): Promise<CoverageData> {
    const response = await this.client.get<MetricResponse<CoverageData>>(
      '/coverage',
      { params }
    );
    return response.data.data;
  }
}

export const metricsAPI = new MetricsAPI();
