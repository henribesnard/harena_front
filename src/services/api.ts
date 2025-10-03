// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_V1 = '/api/v1'

export const api = {
  // Metrics endpoints
  metrics: {
    getDashboard: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}${API_V1}/metrics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch dashboard metrics')
      return response.json()
    },
  },

  // Conversation endpoints
  conversation: {
    sendMessage: async (token: string, userId: number, message: string, conversationId?: string) => {
      const response = await fetch(`${API_BASE_URL}${API_V1}/conversation/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_id: conversationId,
        }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },

    getHistory: async (token: string, userId: number, limit = 20) => {
      const response = await fetch(
        `${API_BASE_URL}${API_V1}/conversation/conversations/${userId}?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch conversation history')
      return response.json()
    },

    getConversation: async (token: string, conversationId: string) => {
      const response = await fetch(
        `${API_BASE_URL}${API_V1}/conversation/${conversationId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch conversation')
      return response.json()
    },
  },

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(`${API_BASE_URL}${API_V1}/users/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Login failed')
      return response.json()
    },

    getMe: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}${API_V1}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch user info')
      return response.json()
    },
  },
}
