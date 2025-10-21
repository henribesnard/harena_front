import { MessageSquare, Plus, Loader2, Clock } from 'lucide-react'
import { useConversationHistory, ConversationHistoryItem } from '../../hooks/useConversationHistory'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ConversationSidebarProps {
  currentConversationId?: number
  onSelectConversation: (conversationId: number) => void
  onNewConversation: () => void
}

const ConversationSidebar = ({
  currentConversationId,
  onSelectConversation,
  onNewConversation
}: ConversationSidebarProps) => {
  const { data: conversations, isLoading, error } = useConversationHistory()

  console.log('ConversationSidebar - conversations:', conversations)
  console.log('ConversationSidebar - isLoading:', isLoading)
  console.log('ConversationSidebar - error:', error)

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nouvelle conversation</span>
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-600">
            Erreur de chargement de l'historique
          </div>
        )}

        {conversations && conversations.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-500 text-sm">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune conversation</p>
            <p className="mt-1 text-xs">Commencez une nouvelle conversation</p>
          </div>
        )}

        {conversations && conversations.length > 0 && (
          <div className="py-2">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === currentConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ConversationItemProps {
  conversation: ConversationHistoryItem
  isActive: boolean
  onClick: () => void
}

const ConversationItem = ({ conversation, isActive, onClick }: ConversationItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(conversation.last_activity_at), {
    addSuffix: true,
    locale: fr,
  })

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-l-4 ${
        isActive
          ? 'bg-primary-50 border-primary-600'
          : 'border-transparent'
      }`}
    >
      <div className="flex items-start gap-2">
        <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
          isActive ? 'text-primary-600' : 'text-gray-400'
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            isActive ? 'text-primary-900' : 'text-gray-900'
          }`}>
            {conversation.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{timeAgo}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {conversation.total_turns} message{conversation.total_turns > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default ConversationSidebar
