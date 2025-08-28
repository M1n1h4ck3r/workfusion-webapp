'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  MessageSquare, Send, Users, Clock, CheckCircle2, 
  Phone, Image, FileText, Settings, Zap, Plus,
  QrCode, Calendar, UserPlus, Mic, Video, Volume2,
  Wifi, WifiOff, Link, Smartphone
} from 'lucide-react'
import { toast } from 'sonner'
import { useTokenStore } from '@/store/token-store'

export default function WhatsAppPage() {
  const [message, setMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('welcome')
  const [isConnected, setIsConnected] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeTab, setActiveTab] = useState('send')
  const [scheduledDateTime, setScheduledDateTime] = useState('')
  const { balance } = useTokenStore()

  const templates = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      content: 'Welcome to our service! We\'re excited to help you achieve your goals. Reply HELP for assistance.',
      category: 'Onboarding'
    },
    {
      id: 'followup',
      name: 'Follow-up',
      content: 'Hi! Just following up on our conversation. Do you have any questions about our proposal?',
      category: 'Sales'
    },
    {
      id: 'appointment',
      name: 'Appointment Reminder',
      content: 'This is a reminder about your appointment tomorrow at 2 PM. Please confirm your attendance.',
      category: 'Support'
    },
    {
      id: 'promotion',
      name: 'Special Offer',
      content: '🎉 Special offer just for you! Get 20% off your next order. Use code SAVE20. Valid until Friday.',
      category: 'Marketing'
    },
    {
      id: 'support',
      name: 'Support Response',
      content: 'Thank you for contacting support. We\'ve received your request and will respond within 24 hours.',
      category: 'Support'
    }
  ]

  const contacts = [
    { id: '1', name: 'John Smith', phone: '+1 (555) 123-4567', status: 'active', lastSeen: '2 hours ago' },
    { id: '2', name: 'Sarah Johnson', phone: '+1 (555) 987-6543', status: 'active', lastSeen: '5 minutes ago' },
    { id: '3', name: 'Mike Wilson', phone: '+1 (555) 456-7890', status: 'away', lastSeen: '1 day ago' },
    { id: '4', name: 'Emily Davis', phone: '+1 (555) 321-0987', status: 'active', lastSeen: '1 hour ago' },
    { id: '5', name: 'Alex Brown', phone: '+1 (555) 567-8901', status: 'active', lastSeen: '30 minutes ago' }
  ]

  const messageHistory = [
    {
      id: 1,
      recipient: 'John Smith',
      message: 'Welcome to our service! We\'re excited...',
      status: 'delivered',
      timestamp: '2024-01-15 14:30',
      tokens: 3
    },
    {
      id: 2,
      recipient: 'Sarah Johnson',
      message: 'Thank you for contacting support...',
      status: 'read',
      timestamp: '2024-01-15 13:15',
      tokens: 2
    },
    {
      id: 3,
      recipient: 'Mike Wilson',
      message: 'This is a reminder about your appointment...',
      status: 'failed',
      timestamp: '2024-01-15 12:00',
      tokens: 3
    }
  ]

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length 
        ? [] 
        : contacts.map(c => c.id)
    )
  }

  const handleConnectWhatsApp = () => {
    setShowQRCode(true)
    toast.info('Scan the QR code with your phone to connect WhatsApp Web')
  }

  const handleQRScanned = () => {
    setShowQRCode(false)
    setIsConnected(true)
    toast.success('WhatsApp Web connected successfully!')
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    toast.success('WhatsApp disconnected')
  }

  const handleSendMessage = () => {
    if (!isConnected) {
      toast.error('Please connect to WhatsApp Web first')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact')
      return
    }

    const tokenCost = selectedContacts.length * 3 // 3 tokens per message
    if (balance < tokenCost) {
      toast.error('Insufficient tokens. Please recharge.')
      return
    }

    setIsSending(true)
    toast.info(`Sending to ${selectedContacts.length} contacts...`)

    // Simulate sending
    setTimeout(() => {
      setIsSending(false)
      toast.success(`Messages sent successfully! -${tokenCost} tokens used`)
      setMessage('')
      setSelectedContacts([])
    }, 2000)
  }

  const handleScheduleMessage = () => {
    if (!scheduledDateTime) {
      toast.error('Please select date and time')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    toast.success(`Message scheduled for ${new Date(scheduledDateTime).toLocaleString()}`)
    setMessage('')
    setScheduledDateTime('')
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setMessage(template.content)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400'
      case 'read': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      case 'sending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Business</h1>
          <p className="text-white/80">Advanced WhatsApp automation and messaging</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-400" /> : <WifiOff className="h-5 w-5 text-red-400" />}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {!isConnected ? (
            <Button onClick={handleConnectWhatsApp} className="btn-primary">
              <QrCode className="mr-2 h-4 w-4" />
              Connect WhatsApp
            </Button>
          ) : (
            <Button onClick={handleDisconnect} variant="outline" className="glass text-white border-white/20">
              Disconnect
            </Button>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="glass-strong p-8 rounded-2xl max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <QrCode className="h-12 w-12 text-primary-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Scan QR Code</h3>
              <p className="text-white/60 mb-6">
                Open WhatsApp on your phone and scan this QR code to connect
              </p>
              
              {/* Mock QR Code */}
              <div className="bg-white p-6 rounded-xl mb-6 inline-block">
                <div className="w-48 h-48 bg-black">
                  <div className="grid grid-cols-8 gap-1 h-full p-2">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div key={i} className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} rounded-sm`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={() => setShowQRCode(false)} variant="outline" className="glass text-white border-white/20 flex-1">
                  Cancel
                </Button>
                <Button onClick={handleQRScanned} className="btn-primary flex-1">
                  <Smartphone className="mr-2 h-4 w-4" />
                  I've Scanned It
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'send', label: 'Send Messages', icon: Send },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'groups', label: 'Groups', icon: Users },
          { id: 'media', label: 'Media', icon: Image }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary-green text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'send' && (
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Send Messages</h2>
              
              <div className="space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Message Template</label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => loadTemplate(template.id)}
                        className="glass p-3 rounded-lg text-left transition-all hover:bg-white/10 border border-white/10 hover:border-primary-green/50"
                      >
                        <p className="text-white font-medium text-sm">{template.name}</p>
                        <p className="text-white/60 text-xs">{template.category}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Message ({message.length} characters)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isConnected ? "Type your WhatsApp message here..." : "Please connect WhatsApp first"}
                    className="input-glass w-full h-32 resize-none"
                    maxLength={1000}
                    disabled={!isConnected}
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Cost: 3 tokens per recipient. Selected: {selectedContacts.length} contacts
                  </p>
                </div>

                {/* Media Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm" className="glass text-white border-white/20" disabled={!isConnected}>
                    <Image className="mr-2 h-4 w-4" />
                    Image
                  </Button>
                  <Button variant="outline" size="sm" className="glass text-white border-white/20" disabled={!isConnected}>
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm" className="glass text-white border-white/20" disabled={!isConnected}>
                    <Mic className="mr-2 h-4 w-4" />
                    Audio
                  </Button>
                  <Button variant="outline" size="sm" className="glass text-white border-white/20" disabled={!isConnected}>
                    <FileText className="mr-2 h-4 w-4" />
                    Document
                  </Button>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim() || selectedContacts.length === 0 || !isConnected}
                  className="w-full btn-primary"
                >
                  {isSending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Sending Messages...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to {selectedContacts.length} contacts ({selectedContacts.length * 3} tokens)
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Schedule Messages</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="input-glass w-full"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your scheduled message..."
                    className="input-glass w-full h-24 resize-none"
                    maxLength={1000}
                  />
                </div>

                <Button
                  onClick={handleScheduleMessage}
                  disabled={!scheduledDateTime || !message.trim()}
                  className="w-full btn-primary"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Message
                </Button>

                {/* Scheduled Messages List */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Scheduled Messages</h3>
                  <div className="glass p-4 rounded-lg text-center">
                    <Calendar className="h-8 w-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60">No scheduled messages</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'groups' && (
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Group Management</h2>
              
              <div className="space-y-4">
                <Button className="btn-primary w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Group
                </Button>

                <div className="glass p-4 rounded-lg text-center">
                  <Users className="h-8 w-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">No groups created yet</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Media Library</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg text-center">
                    <Image className="h-8 w-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Images</p>
                    <p className="text-white font-bold">0</p>
                  </div>
                  <div className="glass p-4 rounded-lg text-center">
                    <Video className="h-8 w-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">Videos</p>
                    <p className="text-white font-bold">0</p>
                  </div>
                </div>

                <Button className="btn-primary w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </div>
            </motion.div>
          )}

          {/* Message History */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            
            <div className="space-y-3">
              {messageHistory.map((msg) => (
                <div key={msg.id} className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary-green" />
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">{msg.recipient}</p>
                        <p className="text-white/60 text-sm">{msg.message.substring(0, 50)}...</p>
                        <p className="text-white/50 text-xs">{msg.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-sm ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                          <Zap className="mr-1 h-2 w-2" />
                          {msg.tokens}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connection Status */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Connection</h3>
            <div className={`p-4 rounded-lg ${isConnected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? 'WhatsApp Connected' : 'Not Connected'}
                </span>
              </div>
              {isConnected && (
                <p className="text-white/60 text-sm mt-2">Ready to send messages</p>
              )}
            </div>
          </motion.div>

          {/* Contacts */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Contacts</h2>
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                {selectedContacts.length === contacts.length ? 'Clear' : 'All'}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`glass p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContacts.includes(contact.id) 
                      ? 'border-primary-green border-2' 
                      : 'border-white/10 border hover:border-white/20'
                  }`}
                  onClick={() => handleContactToggle(contact.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary-blue/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-blue" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 ${getContactStatusColor(contact.status)} rounded-full border border-gray-800`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{contact.name}</p>
                      <p className="text-white/50 text-xs truncate">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 glass text-white border-white/20 hover:bg-white/10"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Messages Sent</span>
                <span className="text-white font-bold">156</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Delivered</span>
                <span className="text-green-400 font-bold">142</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Read Rate</span>
                <span className="text-blue-400 font-bold">91%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Active Contacts</span>
                <span className="text-primary-green font-bold">{contacts.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}