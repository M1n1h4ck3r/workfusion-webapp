import { EventEmitter } from 'events'

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  text?: string
  media?: {
    type: 'image' | 'video' | 'audio' | 'document'
    url: string
    caption?: string
  }
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'failed'
  isIncoming: boolean
}

export interface WhatsAppContact {
  id: string
  phone: string
  name?: string
  profilePicture?: string
  lastSeen?: Date
  isOnline?: boolean
  isBusinessAccount?: boolean
  labels?: string[]
}

export interface WhatsAppChat {
  id: string
  contact: WhatsAppContact
  messages: WhatsAppMessage[]
  unreadCount: number
  lastMessage?: WhatsAppMessage
  isPinned?: boolean
  isMuted?: boolean
  isArchived?: boolean
}

export interface WhatsAppTemplate {
  id: string
  name: string
  category: 'marketing' | 'utility' | 'authentication'
  language: string
  components: Array<{
    type: 'header' | 'body' | 'footer' | 'buttons'
    text?: string
    format?: 'text' | 'image' | 'video' | 'document'
    buttons?: Array<{
      type: 'quick_reply' | 'phone_number' | 'url'
      text: string
      payload?: string
    }>
  }>
  status: 'approved' | 'pending' | 'rejected'
  variables?: string[]
}

export interface WhatsAppBusinessProfile {
  about: string
  address: string
  description: string
  email: string
  profilePictureUrl: string
  websites: string[]
  verticalCategory: string
}

class WhatsAppService extends EventEmitter {
  private apiToken: string | null = null
  private webhookUrl: string | null = null
  private phoneNumber: string | null = null
  private businessAccountId: string | null = null
  private isConnected: boolean = false
  private messageQueue: Map<string, WhatsAppMessage[]> = new Map()
  private rateLimitRemaining: number = 1000
  private rateLimitReset: Date = new Date()

  constructor() {
    super()
    this.initialize()
  }

  private async initialize() {
    // Initialize with environment variables
    this.apiToken = process.env.WHATSAPP_API_TOKEN || null
    this.webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || null
    this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || null
    this.businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || null

    if (this.apiToken && this.apiToken !== 'your_whatsapp_api_token_here') {
      await this.connect()
    }
  }

  async connect(): Promise<boolean> {
    try {
      // In production, this would verify the API token with WhatsApp Business API
      // For now, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.isConnected = true
      this.emit('connected')
      
      // Start webhook listener
      this.startWebhookListener()
      
      return true
    } catch (error) {
      console.error('Failed to connect to WhatsApp:', error)
      this.isConnected = false
      this.emit('error', error)
      return false
    }
  }

  private startWebhookListener() {
    // In production, this would set up a webhook endpoint
    // For demo, simulate incoming messages
    if (process.env.NODE_ENV === 'development') {
      this.simulateIncomingMessages()
    }
  }

  private simulateIncomingMessages() {
    // Simulate occasional incoming messages for demo
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        const demoMessage: WhatsAppMessage = {
          id: 'demo-msg-' + Date.now(),
          from: '+1234567890',
          to: this.phoneNumber || '+0987654321',
          text: this.getRandomDemoMessage(),
          timestamp: new Date(),
          status: 'delivered',
          isIncoming: true
        }
        
        this.emit('message', demoMessage)
        this.addToMessageQueue(demoMessage.from, demoMessage)
      }
    }, 30000) // Check every 30 seconds
  }

  private getRandomDemoMessage(): string {
    const messages = [
      'Hi, I need help with my order',
      'When will my product be delivered?',
      'Can you provide more information about your services?',
      'I would like to schedule a consultation',
      'Thank you for your help!',
      'Is this offer still available?',
      'How can I track my shipment?',
      'I have a question about pricing'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  async sendMessage(to: string, text: string, options?: {
    mediaUrl?: string
    mediaType?: 'image' | 'video' | 'audio' | 'document'
    caption?: string
    replyTo?: string
  }): Promise<WhatsAppMessage> {
    if (!this.isConnected) {
      throw new Error('WhatsApp service is not connected')
    }

    // Check rate limits
    if (!this.checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    const message: WhatsAppMessage = {
      id: 'msg-' + Date.now(),
      from: this.phoneNumber || '+0987654321',
      to,
      text,
      timestamp: new Date(),
      status: 'sent',
      isIncoming: false
    }

    if (options?.mediaUrl) {
      message.media = {
        type: options.mediaType || 'image',
        url: options.mediaUrl,
        caption: options.caption
      }
    }

    // In production, send via WhatsApp Business API
    // For demo, simulate sending
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.status = 'delivered'
    this.addToMessageQueue(to, message)
    this.emit('messageSent', message)
    
    // Simulate delivery and read receipts
    setTimeout(() => {
      message.status = 'read'
      this.emit('messageStatusUpdate', { messageId: message.id, status: 'read' })
    }, 2000)

    return message
  }

  async sendTemplate(to: string, templateId: string, variables: Record<string, string>): Promise<WhatsAppMessage> {
    if (!this.isConnected) {
      throw new Error('WhatsApp service is not connected')
    }

    // In production, this would send a template message via WhatsApp Business API
    const template = await this.getTemplate(templateId)
    
    if (!template) {
      throw new Error('Template not found')
    }

    // Replace variables in template
    let messageText = template.components.find(c => c.type === 'body')?.text || ''
    
    for (const [key, value] of Object.entries(variables)) {
      messageText = messageText.replace(`{{${key}}}`, value)
    }

    return this.sendMessage(to, messageText)
  }

  async getTemplate(templateId: string): Promise<WhatsAppTemplate | null> {
    // Mock template for demo
    return {
      id: templateId,
      name: 'order_confirmation',
      category: 'utility',
      language: 'en',
      components: [
        {
          type: 'header',
          text: 'Order Confirmation',
          format: 'text'
        },
        {
          type: 'body',
          text: 'Hi {{name}}, your order #{{orderNumber}} has been confirmed. Expected delivery: {{deliveryDate}}'
        },
        {
          type: 'footer',
          text: 'Thank you for your business!'
        }
      ],
      status: 'approved',
      variables: ['name', 'orderNumber', 'deliveryDate']
    }
  }

  async sendBroadcast(phoneNumbers: string[], message: string, options?: {
    templateId?: string
    variables?: Record<string, string>
    delay?: number
  }): Promise<{ successful: string[], failed: string[] }> {
    const results = {
      successful: [] as string[],
      failed: [] as string[]
    }

    for (const phone of phoneNumbers) {
      try {
        if (options?.templateId) {
          await this.sendTemplate(phone, options.templateId, options.variables || {})
        } else {
          await this.sendMessage(phone, message)
        }
        results.successful.push(phone)
        
        // Add delay between messages to avoid rate limiting
        if (options?.delay) {
          await new Promise(resolve => setTimeout(resolve, options.delay))
        }
      } catch (error) {
        console.error(`Failed to send to ${phone}:`, error)
        results.failed.push(phone)
      }
    }

    return results
  }

  async getChats(limit: number = 50): Promise<WhatsAppChat[]> {
    const chats: WhatsAppChat[] = []
    
    for (const [phone, messages] of this.messageQueue.entries()) {
      const contact: WhatsAppContact = {
        id: 'contact-' + phone,
        phone,
        name: this.getContactName(phone),
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 86400000)
      }

      const unreadCount = messages.filter(m => m.isIncoming && m.status !== 'read').length

      chats.push({
        id: 'chat-' + phone,
        contact,
        messages: messages.slice(-50), // Last 50 messages
        unreadCount,
        lastMessage: messages[messages.length - 1],
        isPinned: false,
        isMuted: false,
        isArchived: false
      })
    }

    return chats.slice(0, limit)
  }

  async markAsRead(chatId: string): Promise<void> {
    // Mark all messages in chat as read
    const phone = chatId.replace('chat-', '')
    const messages = this.messageQueue.get(phone)
    
    if (messages) {
      messages.forEach(msg => {
        if (msg.isIncoming) {
          msg.status = 'read'
        }
      })
    }

    this.emit('chatRead', chatId)
  }

  async updateBusinessProfile(profile: Partial<WhatsAppBusinessProfile>): Promise<void> {
    // In production, update via WhatsApp Business API
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.emit('profileUpdated', profile)
  }

  async createLabel(name: string, color?: string): Promise<string> {
    const labelId = 'label-' + Date.now()
    // In production, create label via API
    this.emit('labelCreated', { id: labelId, name, color })
    return labelId
  }

  async assignLabel(contactId: string, labelId: string): Promise<void> {
    // In production, assign label via API
    this.emit('labelAssigned', { contactId, labelId })
  }

  private addToMessageQueue(phone: string, message: WhatsAppMessage) {
    if (!this.messageQueue.has(phone)) {
      this.messageQueue.set(phone, [])
    }
    this.messageQueue.get(phone)!.push(message)
    
    // Keep only last 100 messages per chat
    const messages = this.messageQueue.get(phone)!
    if (messages.length > 100) {
      this.messageQueue.set(phone, messages.slice(-100))
    }
  }

  private getContactName(phone: string): string {
    // In production, fetch from contacts database
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown']
    return names[Math.floor(Math.random() * names.length)]
  }

  private checkRateLimit(): boolean {
    const now = new Date()
    
    if (now > this.rateLimitReset) {
      this.rateLimitRemaining = 1000
      this.rateLimitReset = new Date(now.getTime() + 3600000) // Reset in 1 hour
    }

    if (this.rateLimitRemaining <= 0) {
      return false
    }

    this.rateLimitRemaining--
    return true
  }

  getRateLimitInfo() {
    return {
      remaining: this.rateLimitRemaining,
      reset: this.rateLimitReset,
      total: 1000
    }
  }

  isServiceConnected(): boolean {
    return this.isConnected
  }

  getPhoneNumber(): string | null {
    return this.phoneNumber
  }

  disconnect() {
    this.isConnected = false
    this.emit('disconnected')
  }
}

export const whatsappService = new WhatsAppService()