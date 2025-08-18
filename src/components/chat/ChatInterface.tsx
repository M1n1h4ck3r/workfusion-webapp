'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Send, Copy, RefreshCw, User, Bot, Zap, 
  AlertCircle, History, Mic, MicOff, Download,
  Heart, ThumbsUp, ThumbsDown, Star
} from 'lucide-react'
import { toast } from 'sonner'
import { useTokenStore } from '@/store/token-store'
import { useChatStore } from '@/store/chat-store'
import { getAIService, Message, CHATBOT_PERSONALITIES } from '@/services/ai-service'
import { ChatHistory } from './ChatHistory'

interface ChatInterfaceProps {
  personality: keyof typeof CHATBOT_PERSONALITIES
  onTokenUse?: (amount: number) => void
}

export function ChatInterface({ personality, onTokenUse }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { balance, useTokens, calculateTokenCost } = useTokenStore()
  const { 
    currentChatId, 
    createNewChat, 
    saveMessage, 
    loadChat, 
    setCurrentChat 
  } = useChatStore()
  const aiService = getAIService()

  const personalityData = CHATBOT_PERSONALITIES[personality]

  // Initialize with greeting or load existing chat
  useEffect(() => {
    if (currentChatId) {
      const chat = loadChat(currentChatId)
      if (chat && chat.personality === personality) {
        setMessages(chat.messages)
        return
      }
    }
    
    // Create new chat or reset to greeting
    const greeting: Message = {
      role: 'assistant',
      content: personalityData.greeting
    }
    setMessages([greeting])
  }, [personality, currentChatId])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    let chatId = currentChatId

    // Create new chat if none exists
    if (!chatId || !loadChat(chatId) || loadChat(chatId)?.personality !== personality) {
      chatId = createNewChat(personality, input)
    }

    // Save user message
    saveMessage(chatId, userMessage)
    
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setIsTyping(true)

    // Calculate token cost
    const tokenCost = calculateTokenCost('chatbot', input)
    
    // Check token balance
    if (balance < tokenCost) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '⚠️ Insufficient tokens. Please recharge your account to continue.'
      }
      setMessages([...newMessages, errorMessage])
      saveMessage(chatId, errorMessage)
      setIsLoading(false)
      setIsTyping(false)
      toast.error('Insufficient tokens. Please recharge your account.')
      return
    }

    try {
      // Deduct tokens
      const tokenStore = useTokenStore.getState()
      const success = tokenStore.useTokens(tokenCost, 'chatbot', `Chat with ${personalityData.name}`)
      
      if (!success) {
        throw new Error('Failed to deduct tokens')
      }

      // Use the secure API route for chat processing
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.slice(-10), // Keep last 10 messages for context
          personality: personality
        })
      })

      if (!chatResponse.ok) {
        const error = await chatResponse.json()
        throw new Error(error.error || 'Failed to get AI response')
      }

      const { response, tokensUsed, remaining } = await chatResponse.json()

      // Simulate typing effect
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      }
      
      setMessages([...newMessages, assistantMessage])
      saveMessage(chatId, assistantMessage)

      // Call token use callback
      onTokenUse?.(tokenCost)

      // Show success toast with actual token usage
      toast.success(`-${tokensUsed || tokenCost} tokens used | ${remaining} API calls remaining`, {
        icon: <Zap className="h-4 w-4 text-primary-yellow" />
      })

    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.'
      }
      setMessages([...newMessages, errorMessage])
      saveMessage(chatId, errorMessage)
      toast.error('Failed to get response')
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const handleRegenerate = async () => {
    if (messages.length < 2) return
    
    // Remove last assistant message and resend
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (lastUserMessage) {
      const newMessages = messages.slice(0, -1)
      setMessages(newMessages)
      setInput(lastUserMessage.content)
      await handleSend()
    }
  }

  const handleSelectChat = (chatId: string) => {
    const chat = loadChat(chatId)
    if (chat) {
      setMessages(chat.messages)
      setShowHistory(false)
    }
  }

  const handleNewChat = () => {
    setCurrentChat(null)
    const greeting: Message = {
      role: 'assistant',
      content: personalityData.greeting
    }
    setMessages([greeting])
    setShowHistory(false)
  }

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop()
        setIsRecording(false)
      }
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        
        // In a real implementation, you would send this to a speech-to-text service
        // For demo, we'll just add a placeholder
        const demoText = "Voice input detected! (In production, this would be transcribed speech)"
        setInput(demoText)
        toast.success('Voice input recorded')
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
      toast.info('Recording... Click again to stop')
    } catch (error) {
      console.error('Voice input error:', error)
      toast.error('Failed to access microphone')
    }
  }

  const handleMessageReaction = async (messageIndex: number, reaction: string) => {
    // In a real implementation, save reactions to the chat store
    toast.success(`Reacted with ${reaction}`)
  }

  const handleExportChat = () => {
    const chatData = {
      personality: personalityData.name,
      messages: messages,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(chatData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `chat-${personalityData.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Chat exported successfully')
  }

  return (
    <div className="flex h-full">
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 glass-strong border-r border-white/10"
          >
            <ChatHistory
              personality={personality}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              currentChatId={currentChatId || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass-strong p-4 rounded-t-xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleExportChat}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
                title="Export chat"
              >
                <Download className="h-4 w-4" />
              </Button>
              <div className="text-3xl">{personalityData.avatar}</div>
              <div>
                <h3 className="text-lg font-semibold text-white">{personalityData.name}</h3>
                <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
                  <Zap className="mr-1 h-3 w-3" />
                  2 tokens per message
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                <Zap className="mr-1 h-3 w-3" />
                {balance} tokens
              </Badge>
            </div>
          </div>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px]">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`rounded-xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-primary-green text-white' 
                      : 'glass text-white/90'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ className, children, ...props }: { 
                              className?: string; 
                              children: React.ReactNode; 
                              inline?: boolean;
                              [key: string]: unknown;
                            }) {
                              const inline = props.inline as boolean
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <div className="relative">
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                  <button
                                    onClick={() => handleCopy(String(children))}
                                    className="absolute top-2 right-2 p-1 glass rounded hover:bg-white/20 transition-colors"
                                  >
                                    <Copy className="h-4 w-4 text-white/60" />
                                  </button>
                                </div>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mt-2 ml-10">
                    <button
                      onClick={() => handleCopy(message.content)}
                      className="p-1 glass rounded hover:bg-white/20 transition-colors"
                      title="Copy message"
                    >
                      <Copy className="h-4 w-4 text-white/60" />
                    </button>
                    {index === messages.length - 1 && !isTyping && (
                      <button
                        onClick={handleRegenerate}
                        className="p-1 glass rounded hover:bg-white/20 transition-colors"
                        title="Regenerate response"
                      >
                        <RefreshCw className="h-4 w-4 text-white/60" />
                      </button>
                    )}
                    {/* Message Reactions */}
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleMessageReaction(index, '👍')}
                        className="p-1 glass rounded hover:bg-white/20 transition-colors"
                        title="Like"
                      >
                        <ThumbsUp className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={() => handleMessageReaction(index, '❤️')}
                        className="p-1 glass rounded hover:bg-white/20 transition-colors"
                        title="Love"
                      >
                        <Heart className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={() => handleMessageReaction(index, '⭐')}
                        className="p-1 glass rounded hover:bg-white/20 transition-colors"
                        title="Star"
                      >
                        <Star className="h-3 w-3 text-white/60" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="glass px-4 py-3 rounded-xl">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="glass-strong p-4 rounded-b-xl border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Ask ${personalityData.name} anything...`}
              className="input-glass flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleVoiceInput}
              variant="outline"
              size="sm"
              className={`glass border-white/20 hover:bg-white/10 ${isRecording ? 'bg-red-500/20 border-red-500/50' : ''}`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4 text-red-400" />
              ) : (
                <Mic className="h-4 w-4 text-white/60" />
              )}
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || balance < 2}
              className="btn-primary"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {balance < 10 && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Low token balance. <a href="/dashboard/billing" className="underline ml-1">Recharge now</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}