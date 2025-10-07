import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Clock, X } from 'lucide-react'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

interface Conversation {
  conversation_id: string
  title: string
  created_at: string
  last_message_at: string
}

interface ConversationSidebarProps {
  open: boolean
  onClose: () => void
  onSelectConversation?: (conversationId: string) => void
}

const ConversationSidebar = ({ open, onClose, onSelectConversation }: ConversationSidebarProps) => {
  const token = useAuthStore((state) => state.token)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && token) {
      loadConversations()
    }
  }, [open, token])

  const loadConversations = async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const data = await api.conversation.getHistory(token, 20)
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Hier'
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[7.5rem] left-0 z-40 h-[calc(100vh-7.5rem)] w-80
          bg-white border-r border-gray-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={() => {
                // Handle new conversation
                if (onSelectConversation) {
                  onSelectConversation('')
                }
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nouvelle conversation</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  Aucune conversation
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Commencez une nouvelle conversation
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.conversation_id}
                    onClick={() => {
                      if (onSelectConversation) {
                        onSelectConversation(conv.conversation_id)
                      }
                    }}
                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600">
                          {conv.title || 'Nouvelle conversation'}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatDate(conv.last_message_at || conv.created_at)}</span>
                        </div>
                      </div>
                      <MessageSquare className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default ConversationSidebar
