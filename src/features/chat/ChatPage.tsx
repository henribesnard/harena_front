import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import ConversationSidebar from '../../components/chat/ConversationSidebar'
import { useQueryClient } from '@tanstack/react-query'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatPage = () => {
  const token = useAuthStore((state) => state.token)
  const userId = useAuthStore((state) => state.user?.id)
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewConversation = () => {
    setMessages([])
    setConversationId(undefined)
  }

  const handleSelectConversation = async (convId: number) => {
    if (!token) return

    setConversationId(convId)
    setIsLoading(true)

    try {
      console.log('Loading conversation:', convId)
      const data = await api.conversation.getConversation(token, convId)
      console.log('Conversation data:', data)

      // Convertir les tours en messages
      const loadedMessages: Message[] = []
      for (const turn of data.turns) {
        loadedMessages.push({
          id: `${turn.id}-user`,
          role: 'user',
          content: turn.user_message,
          timestamp: new Date(turn.created_at)
        })
        loadedMessages.push({
          id: `${turn.id}-assistant`,
          role: 'assistant',
          content: turn.assistant_response,
          timestamp: new Date(turn.created_at)
        })
      }

      console.log('Loaded messages:', loadedMessages)
      setMessages(loadedMessages)
    } catch (error) {
      console.error('Error loading conversation:', error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  // Pas besoin d'useEffect ici, on invalidera directement après l'envoi du message

  const handleSend = async () => {
    if (!input.trim() || isLoading || !token || !userId) return

    console.log('ChatPage - Sending message with token:', token?.substring(0, 20) + '...')
    console.log('ChatPage - userId:', userId)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      let accumulatedContent = ''

      await api.conversation.sendMessageStream(
        token,
        userId,
        currentInput,
        conversationId?.toString(),
        // onChunk - append text as it arrives
        (chunk: string) => {
          accumulatedContent += chunk
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          )
        },
        // onStatus - could show status updates
        (status: string) => {
          console.log('Status:', status)
        },
        // onError
        (error: string) => {
          console.error('Stream error:', error)
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: error || 'Une erreur est survenue.' }
                : msg
            )
          )
        },
        // onComplete
        () => {
          console.log('Stream complete')
          setIsLoading(false)
          // Invalider le cache des conversations pour mettre à jour la sidebar
          console.log('Invalidating conversation history cache...')
          queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
        }
      )

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Une erreur est survenue. Veuillez réessayer.' }
            : msg
        )
      )
      // Invalider le cache même en cas d'erreur
      queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue sur Harena
            </h2>
            <p className="text-gray-600 max-w-md">
              Posez-moi des questions sur vos finances, recherchez des transactions,
              ou demandez des analyses de vos dépenses.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              rows={1}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center w-12 h-12 bg-gradient-primary text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
