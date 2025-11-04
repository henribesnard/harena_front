/**
 * Common API types to replace 'any' types throughout the application
 */

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  detail?: string | ValidationError[]
  message?: string
  error?: string
  status?: number
}

/**
 * Validation error from FastAPI/Pydantic
 */
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

/**
 * Axios error with typed response
 */
export interface ApiError {
  response?: {
    data?: ApiErrorResponse
    status?: number
    statusText?: string
  }
  message?: string
  request?: unknown
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

/**
 * Notification type
 */
export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
  updated_at?: string
}

/**
 * User preferences response
 */
export interface UserPreferences {
  user_id: number
  account_selection_mode: 'all' | 'specific'
  selected_account_ids: number[]
  created_at: string
  updated_at: string
}

/**
 * Bank item from Bridge API
 */
export interface BankItem {
  id: number
  status: number
  status_code_info: string | null
  status_code_description: string | null
}

/**
 * Account used in budget
 */
export interface AccountUsed {
  account_id: number
  account_name: string
  item_id: number
  bank_name?: string
}
