import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import ConversationSidebar from '../../components/chat/ConversationSidebar'
import SuggestedQuestions from '../../components/chat/SuggestedQuestions'
import TypingIndicator from '../../components/chat/TypingIndicator'
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
        },
        // onConversationId - récupérer l'ID de la conversation créée/utilisée
        (convId: number) => {
          console.log('Received conversation_id:', convId)
          setConversationId(convId)
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

  const handleQuestionClick = (question: string) => {
    setInput(question)
    // Auto-send the question
    setTimeout(() => {
      if (!isLoading && token && userId) {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: question,
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
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

        let accumulatedContent = ''

        api.conversation.sendMessageStream(
          token,
          userId,
          question,
          conversationId?.toString(),
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
          (status: string) => {
            console.log('Status:', status)
          },
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
          () => {
            console.log('Stream complete')
            setIsLoading(false)
            queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
          },
          (convId: number) => {
            console.log('Received conversation_id:', convId)
            setConversationId(convId)
          }
        ).catch(error => {
          console.error('Error sending message:', error)
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: 'Une erreur est survenue. Veuillez réessayer.' }
                : msg
            )
          )
          queryClient.invalidateQueries({ queryKey: ['conversationHistory', userId] })
          setIsLoading(false)
        })
      }
    }, 100)
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
        <div className="flex-1 overflow-y-auto px-4 py-6">
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
                    delay: index * 0.03
                  }}
                  className="group"
                >
                  <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
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
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        </div>

        {/* Input Area */}
        <div className="bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                rows={1}
                className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:border-gray-400 resize-none transition-all duration-200 bg-white shadow-sm"
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
    </div>
  )
}

export default ChatPage
