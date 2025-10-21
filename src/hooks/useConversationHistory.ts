import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export interface ConversationHistoryItem {
  id: number
  title: string
  created_at: string
  last_activity_at: string  // v3 uses last_activity_at instead of updated_at
  total_turns: number        // v3 uses total_turns instead of turn_count
  status?: string            // v3 includes status field
  data?: Record<string, any> // v3 includes data field
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
