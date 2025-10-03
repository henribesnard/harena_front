import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatPage = () => {
  const token = useAuthStore((state) => state.token)
  const userId = useAuthStore((state) => state.user?.id)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        conversationId,
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
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
                <span className="text-4xl">💬</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Bienvenue sur Harena
            </h2>
            <p className="text-gray-600 max-w-lg mb-8 leading-relaxed">
              Posez-moi des questions sur vos finances, recherchez des transactions,
              ou demandez des analyses de vos dépenses.
            </p>

            {/* Suggestions cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl w-full">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-sm text-gray-700 font-medium">Mes dépenses du mois</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm text-gray-700 font-medium">Analyse de budget</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm text-gray-700 font-medium">Rechercher transactions</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-secondary-600 text-white'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
                  } shadow-sm`}>
                    <span className="text-sm font-semibold">
                      {message.role === 'user' ? 'U' : 'H'}
                    </span>
                  </div>

                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <span className={`text-xs mt-1.5 block ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-700 shadow-sm">
                    <span className="text-sm font-semibold">H</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur vos finances..."
                rows={1}
                className="w-full px-4 py-3 rounded-xl focus:outline-none resize-none text-[15px] placeholder:text-gray-400"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Harena peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
