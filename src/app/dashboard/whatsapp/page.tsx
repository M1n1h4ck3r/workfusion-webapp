'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  MessageSquare, Send, Users, Clock, CheckCircle2, 
  Phone, Image, FileText, Settings, Zap, Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { useTokenStore } from '@/store/token-store'

export default function WhatsAppPage() {
  const [message, setMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('welcome')
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

  const handleSendMessage = () => {
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">WhatsApp Automation</h1>
        <p className="text-white/80">Send automated messages to your contacts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Compose Message</h2>
            
            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="text-white/80 text-sm mb-2 block">Message Template</label>
                <div className="grid md:grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template.id)}
                      className={`glass p-3 rounded-lg text-left transition-all hover:bg-white/10 ${
                        selectedTemplate === template.id ? 'border-primary-green border-2' : 'border-white/10 border'
                      }`}
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
                  placeholder="Type your WhatsApp message here..."
                  className="input-glass w-full h-32 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-white/60 mt-1">
                  Cost: 3 tokens per recipient. Selected: {selectedContacts.length} contacts
                </p>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim() || selectedContacts.length === 0}
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

          {/* Message History */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recent Messages</h2>
            
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

        {/* Contacts Sidebar */}
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Contacts</h2>
              <Button
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                {selectedContacts.length === contacts.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="space-y-2">
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
                      <div className="w-10 h-10 bg-primary-blue/20 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-blue" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getContactStatusColor(contact.status)} rounded-full border-2 border-gray-800`} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{contact.name}</p>
                      <p className="text-white/60 text-xs">{contact.phone}</p>
                      <p className="text-white/50 text-xs">Last seen: {contact.lastSeen}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Contact */}
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
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Total Messages</span>
                <span className="text-white font-bold">156</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Delivered</span>
                <span className="text-green-400 font-bold">142</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Read</span>
                <span className="text-blue-400 font-bold">128</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Failed</span>
                <span className="text-red-400 font-bold">14</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Delivery Rate</span>
                <span className="text-white font-bold">91%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}