'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Bot, 
  MessageSquare, 
  Phone, 
  Mic, 
  Send, 
  Play, 
  Volume2,
  Download,
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const demoTabs = [
  {
    id: 'chatbot',
    label: 'AI Chatbot',
    icon: Bot,
    description: 'Chat with Alex Hormozi AI',
    color: 'green'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    description: 'Send automated messages',
    color: 'yellow'
  },
  {
    id: 'calls',
    label: 'Voice Calls',
    icon: Phone,
    description: 'AI phone conversations',
    color: 'orange'
  },
  {
    id: 'tts',
    label: 'Text-to-Speech',
    icon: Mic,
    description: 'Natural voice synthesis',
    color: 'green'
  }
]

const sampleConversations = {
  chatbot: [
    { role: 'user', message: 'How can I scale my business faster?' },
    { 
      role: 'assistant', 
      message: 'Great question! Based on my experience helping entrepreneurs scale to 8-figures, here are the 3 key principles: 1) Focus on solving bigger problems for fewer people rather than smaller problems for more people. 2) Systemize your delivery so you can scale without trading time for money. 3) Master the art of making irresistible offers that solve painful problems. Which of these areas would you like me to dive deeper into?',
      typing: false
    }
  ]
}

export function DemoSection() {
  const [activeTab, setActiveTab] = useState('chatbot')
  const [isTyping, setIsTyping] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [ttsText, setTtsText] = useState('Hello! This is a demonstration of our text-to-speech technology.')
  const [isPlaying, setIsPlaying] = useState(false)

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return
    setIsTyping(true)
    // Simulate API call
    setTimeout(() => {
      setIsTyping(false)
      setChatInput('')
    }, 2000)
  }

  const handleWhatsAppSend = () => {
    if (!phoneNumber || !whatsappMessage) return
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setPhoneNumber('')
      setWhatsappMessage('')
    }, 1500)
  }

  const handleTTSPlay = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 3000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-green/10 via-transparent to-primary-orange/10" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary-green/20 text-primary-green border-primary-green/30">
            🎮 Interactive Demo
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Try Our <span className="gradient-text">AI Tools</span> Live
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the power of our AI platform with these interactive demonstrations. 
            No signup required - start exploring immediately.
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 glass-strong p-2 mb-8">
              {demoTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center p-4 data-[state=active]:glass-strong data-[state=active]:text-white"
                >
                  <motion.div 
                    className={`w-8 h-8 mb-2 flex items-center justify-center rounded-lg bg-gradient-to-r ${
                      tab.color === 'green' ? 'from-green-400 to-emerald-500' :
                      tab.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                      'from-orange-400 to-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <tab.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className="text-xs text-white/60">{tab.description}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Chatbot Demo */}
            <TabsContent value="chatbot" className="space-y-6">
              <div className="glass-strong p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Alex Hormozi AI</h3>
                    <p className="text-white/60 text-sm">Business scaling expert</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Online
                    </Badge>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto custom-scrollbar">
                  {sampleConversations.chatbot.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`max-w-sm p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary-green text-white ml-12' 
                          : 'glass mr-12 text-white'
                      }`}>
                        {msg.message}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="glass p-4 rounded-2xl mr-12">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Alex is typing...
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Alex about business scaling..."
                    className="input-glass flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  />
                  <Button 
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isTyping}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* WhatsApp Demo */}
            <TabsContent value="whatsapp" className="space-y-6">
              <div className="glass-strong p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">WhatsApp Automation</h3>
                    <p className="text-white/60 text-sm">Send messages instantly</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="input-glass"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      placeholder="Hello! This is a demo message from Workfusion AI..."
                      className="w-full h-32 input-glass resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleWhatsAppSend}
                    disabled={!phoneNumber || !whatsappMessage || isTyping}
                    className="w-full btn-primary"
                  >
                    {isTyping ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send WhatsApp Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Voice Calls Demo */}
            <TabsContent value="calls" className="space-y-6">
              <div className="glass-strong p-6 rounded-2xl text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">
                  AI Phone Call Demo
                </h3>
                <p className="text-white/70 mb-6">
                  Experience our AI voice technology in a live phone conversation.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="glass p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-2">Demo Features</h4>
                    <ul className="text-white/60 text-sm space-y-1">
                      <li>• Natural conversation flow</li>
                      <li>• Real-time responses</li>
                      <li>• Multiple voice options</li>
                      <li>• Call recording available</li>
                    </ul>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <h4 className="text-white font-medium mb-2">Use Cases</h4>
                    <ul className="text-white/60 text-sm space-y-1">
                      <li>• Customer support</li>
                      <li>• Lead qualification</li>
                      <li>• Appointment booking</li>
                      <li>• Survey collection</li>
                    </ul>
                  </div>
                </div>

                <Button className="btn-primary">
                  <Play className="mr-2 h-4 w-4" />
                  Start Demo Call
                </Button>
              </div>
            </TabsContent>

            {/* TTS Demo */}
            <TabsContent value="tts" className="space-y-6">
              <div className="glass-strong p-6 rounded-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Mic className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Text-to-Speech</h3>
                    <p className="text-white/60 text-sm">Convert text to natural speech</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Text to Convert
                    </label>
                    <textarea
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      placeholder="Enter text to convert to speech..."
                      className="w-full h-32 input-glass resize-none"
                    />
                    <div className="text-white/60 text-xs mt-1">
                      {ttsText.length} characters
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Voice
                      </label>
                      <select className="w-full input-glass">
                        <option>Sarah (Female, US)</option>
                        <option>David (Male, US)</option>
                        <option>Emma (Female, UK)</option>
                        <option>James (Male, UK)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Speed
                      </label>
                      <select className="w-full input-glass">
                        <option>Normal</option>
                        <option>Slow</option>
                        <option>Fast</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleTTSPlay}
                      disabled={!ttsText.trim() || isPlaying}
                      className="btn-primary flex-1"
                    >
                      {isPlaying ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" />
                          Generate & Play
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="glass text-white border-white/20">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="glass text-white border-white/20">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="glass-strong p-8 rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary-yellow mr-2" />
              <h3 className="text-xl font-bold text-white">
                Ready to explore more?
              </h3>
            </div>
            <p className="text-white/70 mb-6">
              Access the full AI playground with 500 free tokens and unlock all features.
            </p>
            <Link href="/playground">
              <Button className="btn-primary">
                Open Full Playground
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}