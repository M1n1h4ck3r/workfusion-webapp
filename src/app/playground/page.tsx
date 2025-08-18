'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Bot, MessageSquare, Mic, Phone, Sparkles, 
  Download, Settings, Zap,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useTokenStore, TOKEN_COSTS } from '@/store/token-store'
import { CHATBOT_PERSONALITIES } from '@/services/ai-service'

export default function PlaygroundPage() {
  const [selectedTool, setSelectedTool] = useState('chatbot')
  const [selectedPersona, setSelectedPersona] = useState<keyof typeof CHATBOT_PERSONALITIES>('alex-hormozi')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { balance, useTokens, transactions } = useTokenStore()

  const aiTools = [
    {
      id: 'chatbot',
      name: 'AI Chatbots',
      icon: Bot,
      description: 'Chat with AI personalities',
      color: 'green',
      cost: TOKEN_COSTS.chatbot
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Bot',
      icon: MessageSquare,
      description: 'Test WhatsApp automation',
      color: 'yellow',
      cost: TOKEN_COSTS.whatsapp
    },
    {
      id: 'tts',
      name: 'Text to Speech',
      icon: Mic,
      description: 'Convert text to natural speech',
      color: 'orange',
      cost: TOKEN_COSTS.tts
    },
    {
      id: 'voice',
      name: 'Voice Call',
      icon: Phone,
      description: 'Test AI voice calls',
      color: 'red',
      cost: TOKEN_COSTS['voice-call']
    }
  ]

  const personas = [
    { 
      id: 'alex-hormozi' as const, 
      name: 'Alex Hormozi', 
      specialty: 'Business & Sales',
      icon: '💼',
      gradient: 'from-blue-400 to-cyan-500'
    },
    { 
      id: 'jordan-peterson' as const, 
      name: 'Jordan Peterson', 
      specialty: 'Psychology & Philosophy',
      icon: '📚',
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      id: 'daedalus' as const, 
      name: 'Daedalus', 
      specialty: 'Engineering & Architecture',
      icon: '🏗️',
      gradient: 'from-orange-400 to-red-500'
    },
    { 
      id: 'sensei-suki' as const, 
      name: 'Sensei Suki', 
      specialty: 'Productivity & Time',
      icon: '⏰',
      gradient: 'from-green-400 to-emerald-500'
    }
  ]

  const handleTextToSpeech = () => {
    if (!input.trim()) {
      toast.error('Please enter some text to convert')
      return
    }
    
    const cost = Math.ceil(input.length / 100)
    
    if (balance < cost) {
      toast.error('Insufficient tokens. Please recharge.')
      return
    }
    
    setIsProcessing(true)
    
    const tokenStore = useTokenStore.getState()
    const success = tokenStore.useTokens(cost, 'tts', 'Text to Speech conversion')
    
    if (success) {
      setTimeout(() => {
        setOutput('🎵 Audio generated successfully! In the full version, you can download the audio file.')
        toast.success(`Speech generated! -${cost} tokens`)
        setIsProcessing(false)
      }, 2000)
    } else {
      toast.error('Failed to process. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleWhatsAppTest = () => {
    if (!input.trim()) {
      toast.error('Please enter a message')
      return
    }
    
    const cost = TOKEN_COSTS.whatsapp
    
    if (balance < cost) {
      toast.error('Insufficient tokens. Please recharge.')
      return
    }
    
    setIsProcessing(true)
    
    const tokenStore = useTokenStore.getState()
    const success = tokenStore.useTokens(cost, 'whatsapp', 'WhatsApp message test')
    
    if (success) {
      setTimeout(() => {
        setOutput(`✅ WhatsApp message prepared: "${input}"\n📱 Ready to send to contacts.`)
        toast.success(`Message prepared! -${cost} tokens`)
        setIsProcessing(false)
      }, 1500)
    } else {
      toast.error('Failed to process. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleVoiceCall = () => {
    const cost = TOKEN_COSTS['voice-call']
    
    if (balance < cost) {
      toast.error('Insufficient tokens. Please recharge.')
      return
    }
    
    setIsProcessing(true)
    
    const tokenStore = useTokenStore.getState()
    const success = tokenStore.useTokens(cost, 'voice-call', 'AI voice call test')
    
    if (success) {
      setTimeout(() => {
        setOutput('📞 Voice call simulation completed. AI agent ready for deployment.')
        toast.success(`Voice call tested! -${cost} tokens`)
        setIsProcessing(false)
      }, 2000)
    } else {
      toast.error('Failed to process. Please try again.')
      setIsProcessing(false)
    }
  }

  // Recent activity from transactions
  const recentActivity = transactions.slice(0, 5)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          <div className="container mx-auto relative z-10">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary-green/20 text-primary-green border-primary-green/30">
                <Sparkles className="mr-1 h-3 w-3" />
                {balance} Tokens Available
              </Badge>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                AI <span className="gradient-text">Playground</span>
              </h1>
              
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Experience the power of AI with our advanced tools and chatbots
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Tool Selection */}
              <div className="lg:col-span-1 space-y-4">
                {/* Tool Selection */}
                <motion.div
                  className="glass-strong p-4 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Select Tool</h3>
                  <div className="space-y-2">
                    {aiTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`w-full glass p-3 rounded-lg transition-all text-left ${
                          selectedTool === tool.id 
                            ? 'border-2 border-primary-green shadow-lg shadow-primary-green/20' 
                            : 'border border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${
                              tool.color === 'green' ? 'from-green-400 to-emerald-500' :
                              tool.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                              tool.color === 'orange' ? 'from-orange-400 to-red-500' :
                              'from-red-400 to-pink-500'
                            } rounded-lg flex items-center justify-center`}>
                              <tool.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{tool.name}</p>
                              <p className="text-white/60 text-xs">{tool.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                            <Zap className="mr-1 h-2 w-2" />
                            {tool.cost}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Token Balance Card */}
                <motion.div
                  className="glass-strong p-4 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-3">Token Balance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Available</span>
                      <span className="text-2xl font-bold gradient-text">{balance}</span>
                    </div>
                    
                    {balance < 50 && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-400 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                          Low balance! Recharge to continue using AI tools.
                        </p>
                      </div>
                    )}
                    
                    <a href="/dashboard/billing">
                      <Button className="w-full btn-primary">
                        <Zap className="mr-2 h-4 w-4" />
                        Buy More Tokens
                      </Button>
                    </a>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                {recentActivity.length > 0 && (
                  <motion.div
                    className="glass-strong p-4 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between text-sm">
                          <span className="text-white/60 truncate">{activity.description}</span>
                          <span className={activity.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                            {activity.amount > 0 ? '+' : ''}{Math.abs(activity.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                <motion.div
                  className="glass-strong rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {/* Chatbot Interface */}
                    {selectedTool === 'chatbot' && (
                      <motion.div
                        key="chatbot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Persona Selection */}
                        <div className="p-4 border-b border-white/10">
                          <h3 className="text-sm text-white/60 mb-3">Select AI Personality</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {personas.map((persona) => (
                              <button
                                key={persona.id}
                                onClick={() => setSelectedPersona(persona.id)}
                                className={`glass p-3 rounded-lg text-left transition-all ${
                                  selectedPersona === persona.id 
                                    ? 'border-primary-green border-2' 
                                    : 'border-white/10 border hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 bg-gradient-to-r ${persona.gradient} rounded-lg flex items-center justify-center text-2xl`}>
                                    {persona.icon}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium text-sm">{persona.name}</p>
                                    <p className="text-white/60 text-xs">{persona.specialty}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Chat Interface */}
                        <ChatInterface 
                          personality={selectedPersona}
                          onTokenUse={(amount) => {
                            console.log(`Used ${amount} tokens`)
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Text to Speech Interface */}
                    {selectedTool === 'tts' && (
                      <motion.div
                        key="tts"
                        className="p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="text-2xl font-bold text-white mb-4">Text to Speech</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-white/80 text-sm mb-2 block">Select Voice</label>
                            <select className="input-glass w-full">
                              <option>Natural - Female</option>
                              <option>Natural - Male</option>
                              <option>Professional - Female</option>
                              <option>Professional - Male</option>
                              <option>Friendly - Female</option>
                              <option>Friendly - Male</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-white/80 text-sm mb-2 block">
                              Enter Text ({input.length} characters = {Math.ceil(input.length / 100)} tokens)
                            </label>
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Type or paste your text here..."
                              className="input-glass w-full h-32 resize-none"
                              maxLength={5000}
                            />
                            <p className="text-xs text-white/60 mt-1">
                              Maximum 5000 characters. Cost: 1 token per 100 characters.
                            </p>
                          </div>
                          
                          {output && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="glass p-4 rounded-lg"
                            >
                              <p className="text-white/80">{output}</p>
                              <div className="flex items-center space-x-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="glass text-white border-white/20 hover:bg-white/10"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Audio
                                </Button>
                              </div>
                            </motion.div>
                          )}
                          
                          <Button
                            onClick={handleTextToSpeech}
                            disabled={isProcessing || !input.trim() || balance < Math.ceil(input.length / 100)}
                            className="w-full btn-primary"
                          >
                            {isProcessing ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Generating Speech...
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-4 w-4" />
                                Generate Speech ({Math.ceil(input.length / 100)} tokens)
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* WhatsApp Interface */}
                    {selectedTool === 'whatsapp' && (
                      <motion.div
                        key="whatsapp"
                        className="p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="text-2xl font-bold text-white mb-4">WhatsApp Automation</h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-white/80 text-sm mb-2 block">Message Template</label>
                            <select className="input-glass w-full">
                              <option>Welcome Message</option>
                              <option>Follow-up Message</option>
                              <option>Promotional Message</option>
                              <option>Support Response</option>
                              <option>Custom Message</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-white/80 text-sm mb-2 block">Phone Number</label>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="input-glass"
                            />
                          </div>
                          
                          <div>
                            <label className="text-white/80 text-sm mb-2 block">Message Content</label>
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Compose your WhatsApp message..."
                              className="input-glass w-full h-32 resize-none"
                              maxLength={1000}
                            />
                          </div>
                          
                          {output && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="glass p-4 rounded-lg"
                            >
                              <p className="text-white/80 whitespace-pre-line">{output}</p>
                            </motion.div>
                          )}
                          
                          <Button
                            onClick={handleWhatsAppTest}
                            disabled={isProcessing || !input.trim() || balance < TOKEN_COSTS.whatsapp}
                            className="w-full btn-primary"
                          >
                            {isProcessing ? (
                              <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message ({TOKEN_COSTS.whatsapp} tokens)
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Voice Call Interface */}
                    {selectedTool === 'voice' && (
                      <motion.div
                        key="voice"
                        className="p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h2 className="text-2xl font-bold text-white mb-4">AI Voice Calls</h2>
                        
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="h-12 w-12 text-white animate-pulse" />
                          </div>
                          
                          <h3 className="text-xl font-semibold text-white mb-2">Voice Call Testing</h3>
                          <p className="text-white/70 mb-6 max-w-md mx-auto">
                            Test AI-powered voice calls with natural conversation flow and real-time responses
                          </p>
                          
                          <div className="space-y-4 max-w-sm mx-auto">
                            <Input
                              type="tel"
                              placeholder="Enter phone number (demo)"
                              className="input-glass"
                            />
                            
                            <select className="input-glass w-full">
                              <option>Sales Call Script</option>
                              <option>Support Call Script</option>
                              <option>Appointment Booking</option>
                              <option>Survey Call</option>
                              <option>Custom Script</option>
                            </select>
                            
                            {output && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-4 rounded-lg"
                              >
                                <p className="text-white/80">{output}</p>
                              </motion.div>
                            )}
                            
                            <Button
                              onClick={handleVoiceCall}
                              disabled={isProcessing || balance < TOKEN_COSTS['voice-call']}
                              className="w-full btn-primary"
                            >
                              {isProcessing ? (
                                <>
                                  <LoadingSpinner size="sm" className="mr-2" />
                                  Initiating Call...
                                </>
                              ) : (
                                <>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Start Test Call ({TOKEN_COSTS['voice-call']} tokens)
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* API Configuration Notice */}
                <motion.div
                  className="glass p-4 rounded-xl mt-4 flex items-start space-x-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Settings className="h-5 w-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">
                      Currently running in demo mode. To enable real AI responses, configure your API keys in{' '}
                      <a href="/dashboard/settings" className="text-primary-green hover:underline">
                        Settings
                      </a>.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}