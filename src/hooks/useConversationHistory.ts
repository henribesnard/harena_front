import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export interface ConversationHistoryItem {
  id: number
  title: string
  created_at: string
  updated_at: string
  turn_count: number
}

export const useConversationHistory = () => {
  const token = useAuthStore((state) => state.token)
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['conversationHistory', userId],
    queryFn: async () => {
      if (!token || !userId) {
        throw new Error('No authentication token or user ID')
      }
      console.log('Fetching conversation history for user:', userId)
      const response = await api.conversation.getHistory(token, userId, 50)
      console.log('Conversation history response:', response)
      console.log('Conversations array:', response.conversations)
      return response.conversations as ConversationHistoryItem[]
    },
    enabled: !!token && !!userId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  })
}
