import { MessageSquare, Plus, Loader2, Clock, LogOut, ChevronDown } from 'lucide-react'
import { useConversationHistory, ConversationHistoryItem } from '../../hooks/useConversationHistory'
import { useAuthStore } from '../../stores/authStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useState, useRef, useEffect } from 'react'

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
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const getFullName = () => {
    if (!user) return 'Utilisateur'
    if (user.full_name) return user.full_name
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    if (firstName && lastName) return `${firstName} ${lastName}`
    if (firstName) return firstName
    if (lastName) return lastName
    return user.email?.split('@')[0] || 'Utilisateur'
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  const fullName = getFullName()

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-white">H</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Harena
          </span>
        </div>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium text-sm">Nouvelle conversation</span>
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

      {/* User Profile Footer */}
      <div className="border-t border-gray-200 p-3" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {getInitials(fullName)}
            </span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* User Dropdown */}
        {dropdownOpen && (
          <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
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
