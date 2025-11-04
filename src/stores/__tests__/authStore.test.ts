import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../authStore'

// Mock the API
vi.mock('../../services/api', () => ({
  api: {
    auth: {
      login: vi.fn(() => Promise.resolve({ access_token: 'mock-token' })),
      register: vi.fn(() => Promise.resolve({ id: 1, email: 'test@example.com' })),
      getMe: vi.fn(() =>
        Promise.resolve({
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          full_name: 'Test User',
          is_active: true,
          is_superuser: false,
        })
      ),
    },
  },
}))

// Mock queryClient
vi.mock('../../lib/queryClient', () => ({
  queryClient: {
    clear: vi.fn(),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have initial state with no authenticated user', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Login', () => {
    it('should set isLoading to true when login starts', async () => {
      const loginPromise = useAuthStore.getState().login('test@example.com', 'password')

      // Check immediately after calling login
      expect(useAuthStore.getState().isLoading).toBe(true)

      await loginPromise
    })

    it('should update auth state on successful login', async () => {
      await useAuthStore.getState().login('test@example.com', 'password')

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe('mock-token')
      expect(state.user).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
        })
      )
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Logout', () => {
    it('should clear state on logout', async () => {
      // First login
      await useAuthStore.getState().login('test@example.com', 'password')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then logout
      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.token).toBeNull()
      expect(state.user).toBeNull()
      expect(state.error).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should clear error when clearError is called', () => {
      useAuthStore.setState({ error: 'Test error' })
      expect(useAuthStore.getState().error).toBe('Test error')

      useAuthStore.getState().clearError()
      expect(useAuthStore.getState().error).toBeNull()
    })
  })
})
