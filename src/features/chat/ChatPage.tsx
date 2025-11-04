import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import ConversationSidebar from '../../components/chat/ConversationSidebar'
import SuggestedQuestions from '../../components/chat/SuggestedQuestions'
import TypingIndicator from '../../components/chat/TypingIndicator'
import StatusMessage from '../../components/chat/StatusMessage'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { logger } from '../../utils/logger'

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
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | undefined>()
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load conversation from URL query parameter
  useEffect(() => {
    const conversationParam = searchParams.get('conversation')
    if (conversationParam) {
      const convId = parseInt(conversationParam, 10)
      if (!isNaN(convId) && convId !== conversationId) {
        handleSelectConversation(convId)
      }
    }
  }, [searchParams])

  const handleNewConversation = () => {
    setMessages([])
    setConversationId(undefined)
  }

  const handleSelectConversation = async (convId: number) => {
    if (!token) return

    setConversationId(convId)
    setIsLoading(true)

    try {
      logger.log('Loading conversation:', convId)
      const data = await api.conversation.getConversation(token, convId)
      logger.log('Conversation data:', data)

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

      logger.log('Loaded messages:', loadedMessages)
      setMessages(loadedMessages)
    } catch (error) {
      logger.error('Error loading conversation:', error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Unified function to send a message (eliminating duplication)
   */
  const sendMessage = useCallback(
    async (messageContent: string) => {
      if (!token || !userId || isLoading || !messageContent.trim()) return

      logger.log('ChatPage - Sending message with userId:', userId)

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setCurrentStatus('')

      // Create placeholder for assistant message
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      let accumulatedContent = ''

      try {
        await api.conversation.sendMessageStream(
          token,
          userId,
          messageContent,
          conversationId?.toString(),
          // onChunk - append text as it arrives
          (chunk: string) => {
            if (accumulatedContent === '') {
              setCurrentStatus('')
            }
            accumulatedContent += chunk
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg
              )
            )
          },
          // onStatus - display progress messages
          (status: string) => {
            logger.log('Status:', status)
            setCurrentStatus(status)
          },
          // onError
          (error: string) => {
            logger.error('Stream error:', error)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: error || 'Une erreur est survenue.' }
                  : msg
              )
            )
          },
          // onComplete
          () => {
            logger.log('Stream complete')
            setIsLoading(false)
            logger.log('Invalidating conversation history cache...')
            queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
          },
          // onConversationId - capture conversation ID
          (convId: number) => {
            logger.log('Received conversation_id:', convId)
            setConversationId(convId)
          }
        )
      } catch (error) {
        logger.error('Error sending message:', error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: 'Une erreur est survenue. Veuillez réessayer.' }
              : msg
          )
        )
        queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
      } finally {
        setIsLoading(false)
      }
    },
    [token, userId, isLoading, conversationId, queryClient]
  )

  const handleSend = useCallback(async () => {
    if (!input.trim()) return
    const currentInput = input
    setInput('')
    await sendMessage(currentInput)
  }, [input, sendMessage])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleQuestionClick = useCallback(
    (question: string) => {
      setInput(question)
      // Auto-send the question after a brief delay
      setTimeout(() => {
        if (!isLoading && token && userId) {
          sendMessage(question)
        }
      }, 100)
    },
    [isLoading, token, userId, sendMessage]
  )

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pt-2">
        {messages.length === 0 ? (
          <SuggestedQuestions onQuestionClick={handleQuestionClick} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.03,
                  }}
                  className="group"
                >
                  <div
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {message.role === 'user' ? 'V' : 'H'}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                        {message.content}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                  H
                </div>
                {currentStatus ? <StatusMessage message={currentStatus} /> : <TypingIndicator />}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 pb-safe">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              rows={1}
              className="flex-1 px-4 py-3.5 pr-14 rounded-2xl border border-gray-300 focus:outline-none focus:border-purple-400 resize-none transition-all duration-200 bg-white shadow-md"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-2 bottom-2 flex items-center justify-center w-9 h-9 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
