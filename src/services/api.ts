// API Configuration
import { SERVICES, buildServiceURL } from '../config/services'
import { handleApiError } from '../utils/apiHelpers'
import { useAuthStore } from '../stores/authStore'

export const api = {
  // Metrics endpoints
  metrics: {
    getDashboard: async (token: string) => {
      const response = await fetch(buildServiceURL('METRIC', '/metrics/dashboard'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to fetch dashboard metrics')
      }
      return response.json()
    },
  },

  // Conversation endpoints
  conversation: {
    sendMessage: async (token: string, userId: number, message: string, conversationId?: string) => {
      // Use CONVERSATION (v3) for sending messages
      const response = await fetch(buildServiceURL('CONVERSATION', `/conversation/${userId}`), {
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
      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to send message')
      }
      return response.json()
    },

    sendMessageStream: async (
      token: string,
      userId: number,
      message: string,
      conversationId: string | undefined,
      onChunk: (chunk: string) => void,
      onStatus: (status: string) => void,
      onError: (error: string) => void,
      onComplete: () => void,
      onConversationId?: (convId: number) => void
    ) => {
      // Use CONVERSATION (v3) for sending messages
      const response = await fetch(buildServiceURL('CONVERSATION', `/conversation/${userId}/stream`), {
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

      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              try {
                const parsed = JSON.parse(data)

                if (parsed.type === 'status') {
                  onStatus(parsed.message || '')
                } else if (parsed.type === 'response_chunk') {
                  onChunk(parsed.content || '')
                } else if (parsed.type === 'response_start') {
                  // Ignore, juste le début du streaming
                } else if (parsed.type === 'conversation_id') {
                  // Capturer le conversation_id envoyé par le backend
                  if (onConversationId && parsed.conversation_id) {
                    onConversationId(parsed.conversation_id)
                  }
                } else if (parsed.type === 'response_end') {
                  onComplete()
                  break
                } else if (parsed.type === 'error') {
                  onError(parsed.message || 'Une erreur est survenue')
                  break
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    },

    getHistory: async (token: string, userId: number, limit = 20) => {
      // Use CONVERSATION (v3) for history - NOW WITH PERSISTENCE!
      const response = await fetch(
        buildServiceURL('CONVERSATION', `/conversation/conversations/${userId}?limit=${limit}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to fetch conversation history')
      }
      return response.json()
    },

    getConversation: async (token: string, conversationId: number) => {
      // Use CONVERSATION (v3) for fetching conversations - NOW WITH PERSISTENCE!
      const response = await fetch(
        buildServiceURL('CONVERSATION', `/conversation/conversation/${conversationId}/turns`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to fetch conversation')
      }
      return response.json()
    },
  },

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(buildServiceURL('USER', '/users/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Email ou mot de passe incorrect')
        } else if (response.status === 422) {
          throw new Error('Email ou mot de passe invalide')
        }
        throw new Error('Erreur lors de la connexion. Veuillez réessayer.')
      }

      return response.json()
    },

    register: async (userData: {
      email: string
      password: string
      confirm_password: string
      first_name?: string
      last_name?: string
    }) => {
      const response = await fetch(buildServiceURL('USER', '/users/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        const error = await response.json()

        // Handle Pydantic validation errors (422)
        if (Array.isArray(error.detail)) {
          const validationErrors = error.detail.map((err: any) => err.msg).join(', ')
          throw new Error(validationErrors)
        }

        // Handle standard FastAPI errors
        throw new Error(error.detail || 'Registration failed')
      }
      return response.json()
    },

    getMe: async (token: string) => {
      const response = await fetch(buildServiceURL('USER', '/users/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        if (response.status === 401) {
          const { logout } = useAuthStore.getState()
          handleApiError(response, logout)
        }
        throw new Error('Failed to fetch user info')
      }
      return response.json()
    },
  },
}
