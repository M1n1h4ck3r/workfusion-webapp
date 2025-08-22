'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PersonaService, type Persona } from '@/services/persona-service'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Play, Send, MessageSquare, RotateCcw,
  Settings, TestTube, Brain, Zap
} from 'lucide-react'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TestSession {
  id: string
  personaId: string
  messages: ChatMessage[]
  startedAt: Date
  tokensUsed: number
}

export default function PersonaTestPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [currentSession, setCurrentSession] = useState<TestSession | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [testScenarios] = useState([
    "Hello! Can you introduce yourself?",
    "What's your area of expertise?",
    "How can you help me today?",
    "What makes you different from other AI assistants?",
    "Can you give me some advice about productivity?"
  ])

  useEffect(() => {
    loadPersonas()
  }, [])

  const loadPersonas = async () => {
    try {
      setIsLoading(true)
      
      // Get auth token for admin access
      const token = localStorage.getItem('supabase.auth.token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Get all personas including inactive for testing
      const response = await fetch('/api/personas?include_inactive=true', { headers })
      
      if (response.ok) {
        const data = await response.json()
        setPersonas(data)
      } else {
        toast.error('Failed to load personas')
      }
    } catch (error) {
      console.error('Error loading personas:', error)
      toast.error('Failed to load personas')
    } finally {
      setIsLoading(false)
    }
  }

  const startTestSession = (persona: Persona) => {
    const session: TestSession = {
      id: `test-${Date.now()}`,
      personaId: persona.id,
      messages: [],
      startedAt: new Date(),
      tokensUsed: 0
    }
    
    setSelectedPersona(persona)
    setCurrentSession(session)
    
    // Add initial greeting
    const greetingMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: persona.greeting,
      timestamp: new Date()
    }
    
    session.messages.push(greetingMessage)
    setCurrentSession({ ...session })
  }

  const sendMessage = async (messageText?: string) => {
    if (!selectedPersona || !currentSession) return
    
    const textToSend = messageText || message
    if (!textToSend.trim()) return

    setIsSending(true)
    
    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: textToSend,
        timestamp: new Date()
      }
      
      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage]
      }
      setCurrentSession(updatedSession)
      setMessage('')

      // Send to AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedSession.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          personaId: selectedPersona.id,
          systemPrompt: selectedPersona.system_prompt,
          isTest: true // Flag for testing mode
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add AI response
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        
        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, assistantMessage],
          tokensUsed: updatedSession.tokensUsed + (data.tokensUsed || 0)
        }
        
        setCurrentSession(finalSession)
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const resetSession = () => {
    if (selectedPersona) {
      startTestSession(selectedPersona)
    }
  }

  const endSession = () => {
    setSelectedPersona(null)
    setCurrentSession(null)
    setMessage('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/80">Loading personas...</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Persona Testing</h1>
          <p className="text-white/80">Test and validate persona responses before activation</p>
        </div>
        
        {selectedPersona && (
          <div className="flex items-center space-x-3">
            <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
              <TestTube className="h-3 w-3 mr-1" />
              Testing Mode
            </Badge>
            <Button
              onClick={endSession}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              End Session
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Persona Selection Panel */}
        <div className="lg:col-span-1">
          <div className="glass-strong rounded-2xl p-6 h-full">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary-green" />
              Select Persona
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {personas.map((persona) => (
                <motion.div
                  key={persona.id}
                  className={`glass p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPersona?.id === persona.id 
                      ? 'ring-2 ring-primary-green bg-primary-green/10' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => startTestSession(persona)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {persona.avatar_type === 'image' && persona.avatar_url ? (
                        <img 
                          src={persona.avatar_url} 
                          alt={persona.name} 
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-2xl">{persona.avatar_emoji || '🤖'}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-medium truncate">{persona.name}</h3>
                        {!persona.is_active && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/60 text-sm truncate">{persona.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Test Scenarios */}
            {selectedPersona && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  Quick Tests
                </h3>
                <div className="space-y-2">
                  {testScenarios.map((scenario, index) => (
                    <Button
                      key={index}
                      onClick={() => sendMessage(scenario)}
                      disabled={isSending}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start glass text-white border-white/20 hover:bg-white/10 text-xs"
                    >
                      {scenario}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedPersona && currentSession ? (
            <div className="glass-strong rounded-2xl h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {selectedPersona.avatar_type === 'image' && selectedPersona.avatar_url ? (
                        <img 
                          src={selectedPersona.avatar_url} 
                          alt={selectedPersona.name} 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-3xl">{selectedPersona.avatar_emoji || '🤖'}</div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{selectedPersona.name}</h2>
                      <p className="text-white/60 text-sm">{selectedPersona.category} • Testing Session</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {currentSession.tokensUsed} tokens
                    </Badge>
                    <Button
                      onClick={resetSession}
                      variant="outline"
                      size="sm"
                      className="glass text-white border-white/20 hover:bg-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto min-h-0">
                <div className="space-y-4">
                  {currentSession.messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                        msg.role === 'user' 
                          ? 'bg-primary-green/20 text-white rounded-l-2xl rounded-tr-2xl' 
                          : 'glass text-white rounded-r-2xl rounded-tl-2xl'
                      } p-4`}>
                        <p className="text-sm">{msg.content}</p>
                        <div className="text-xs text-white/50 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="glass p-4 rounded-r-2xl rounded-tl-2xl">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2 text-white/60 text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder={`Message ${selectedPersona.name}...`}
                    className="input-glass flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!message.trim() || isSending}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-strong rounded-2xl h-full flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-white/30" />
                <h2 className="text-xl font-semibold text-white mb-2">Select a Persona to Test</h2>
                <p className="text-white/60 mb-6 max-w-md">
                  Choose a persona from the left panel to start a testing session. 
                  You can test responses, validate prompts, and ensure quality before activation.
                </p>
                <div className="space-y-2 text-sm text-white/50">
                  <p>• Test system prompts and responses</p>
                  <p>• Validate personality consistency</p>
                  <p>• Use quick test scenarios</p>
                  <p>• Monitor token usage</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}