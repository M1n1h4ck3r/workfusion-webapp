import { EventEmitter } from 'events'

export interface CallRecord {
  id: string
  from: string
  to: string
  direction: 'inbound' | 'outbound'
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer'
  duration?: number // in seconds
  startTime: Date
  endTime?: Date
  recordingUrl?: string
  transcription?: string
  cost?: number
  aiAssistantUsed?: boolean
}

export interface VoiceScript {
  id: string
  name: string
  category: string
  script: string
  variables?: string[]
  language: string
  voice: 'male' | 'female' | 'neutral'
  speed: number // 0.5 to 2.0
}

export interface CallAnalytics {
  totalCalls: number
  successfulCalls: number
  failedCalls: number
  averageDuration: number
  totalDuration: number
  peakHours: { hour: number; calls: number }[]
  conversionRate: number
  satisfaction: number // 1-5 rating
}

class VoiceCallService extends EventEmitter {
  private twilioAccountSid: string | null = null
  private twilioAuthToken: string | null = null
  private twilioPhoneNumber: string | null = null
  private isConnected: boolean = false
  private activeCall: CallRecord | null = null
  private callHistory: CallRecord[] = []
  private scripts: Map<string, VoiceScript> = new Map()

  constructor() {
    super()
    this.initialize()
    this.loadDefaultScripts()
  }

  private async initialize() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || null
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || null
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || null

    if (
      this.twilioAccountSid && 
      this.twilioAccountSid !== 'your_twilio_account_sid_here' &&
      this.twilioAuthToken && 
      this.twilioAuthToken !== 'your_twilio_auth_token_here'
    ) {
      await this.connect()
    }
  }

  private loadDefaultScripts() {
    const defaultScripts: VoiceScript[] = [
      {
        id: 'welcome',
        name: 'Welcome Call',
        category: 'Onboarding',
        script: 'Hello {{name}}, welcome to WorkFusion. We are excited to help you automate your business with AI. How can we assist you today?',
        variables: ['name'],
        language: 'en-US',
        voice: 'female',
        speed: 1.0
      },
      {
        id: 'appointment',
        name: 'Appointment Reminder',
        category: 'Support',
        script: 'Hi {{name}}, this is a reminder about your appointment on {{date}} at {{time}}. Press 1 to confirm, 2 to reschedule, or 3 to cancel.',
        variables: ['name', 'date', 'time'],
        language: 'en-US',
        voice: 'male',
        speed: 0.95
      },
      {
        id: 'survey',
        name: 'Customer Survey',
        category: 'Feedback',
        script: 'Thank you for using our service. On a scale of 1 to 5, how satisfied are you with your experience? Press the corresponding number.',
        variables: [],
        language: 'en-US',
        voice: 'neutral',
        speed: 1.0
      },
      {
        id: 'sales',
        name: 'Sales Follow-up',
        category: 'Sales',
        script: 'Hi {{name}}, I am calling regarding your interest in {{product}}. Do you have a few minutes to discuss how we can help your business?',
        variables: ['name', 'product'],
        language: 'en-US',
        voice: 'female',
        speed: 0.9
      }
    ]

    defaultScripts.forEach(script => {
      this.scripts.set(script.id, script)
    })
  }

  async connect(): Promise<boolean> {
    try {
      // In production, initialize Twilio client here
      // For demo, simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.isConnected = true
      this.emit('connected')
      
      // Start webhook listener for incoming calls
      this.startIncomingCallListener()
      
      return true
    } catch (error) {
      console.error('Failed to connect to Twilio:', error)
      this.isConnected = false
      this.emit('error', error)
      return false
    }
  }

  private startIncomingCallListener() {
    // In production, this would set up webhook endpoints for Twilio
    // For demo, simulate occasional incoming calls
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        if (Math.random() < 0.05) { // 5% chance every interval
          this.simulateIncomingCall()
        }
      }, 60000) // Check every minute
    }
  }

  private simulateIncomingCall() {
    const call: CallRecord = {
      id: 'call-' + Date.now(),
      from: this.generateRandomPhoneNumber(),
      to: this.twilioPhoneNumber || '+1234567890',
      direction: 'inbound',
      status: 'ringing',
      startTime: new Date()
    }

    this.emit('incomingCall', call)
    this.callHistory.push(call)

    // Simulate call progression
    setTimeout(() => {
      call.status = 'in-progress'
      this.emit('callStatusUpdate', call)
      
      // End call after random duration
      const duration = Math.floor(Math.random() * 300) + 30 // 30-330 seconds
      setTimeout(() => {
        call.status = 'completed'
        call.duration = duration
        call.endTime = new Date()
        call.cost = duration * 0.01 // $0.01 per second for demo
        this.emit('callEnded', call)
      }, duration * 1000)
    }, 3000)
  }

  async makeCall(
    to: string,
    options?: {
      scriptId?: string
      variables?: Record<string, string>
      record?: boolean
      aiAssistant?: boolean
      maxDuration?: number // in seconds
    }
  ): Promise<CallRecord> {
    if (!this.isConnected) {
      throw new Error('Voice service is not connected')
    }

    if (this.activeCall) {
      throw new Error('Another call is already in progress')
    }

    const call: CallRecord = {
      id: 'call-' + Date.now(),
      from: this.twilioPhoneNumber || '+0987654321',
      to,
      direction: 'outbound',
      status: 'initiated',
      startTime: new Date(),
      aiAssistantUsed: options?.aiAssistant
    }

    this.activeCall = call
    this.callHistory.push(call)
    this.emit('callInitiated', call)

    // Simulate call progression
    await new Promise(resolve => setTimeout(resolve, 1000))
    call.status = 'ringing'
    this.emit('callStatusUpdate', call)

    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Random chance of answer
    if (Math.random() > 0.2) { // 80% answer rate
      call.status = 'in-progress'
      this.emit('callConnected', call)

      // If script is provided, play it
      if (options?.scriptId) {
        const script = this.scripts.get(options.scriptId)
        if (script) {
          let scriptText = script.script
          if (options.variables) {
            for (const [key, value] of Object.entries(options.variables)) {
              scriptText = scriptText.replace(`{{${key}}}`, value)
            }
          }
          this.emit('scriptPlaying', { call, script: scriptText })
        }
      }

      // Simulate call duration
      const duration = Math.floor(Math.random() * 180) + 30 // 30-210 seconds
      await new Promise(resolve => setTimeout(resolve, duration * 100)) // Speed up for demo

      call.status = 'completed'
      call.duration = duration
      call.endTime = new Date()
      call.cost = duration * 0.015 // $0.015 per second

      if (options?.record) {
        call.recordingUrl = `https://demo.twilio.com/recordings/${call.id}.mp3`
      }

      if (options?.aiAssistant) {
        call.transcription = 'Customer expressed interest in the product and requested more information via email.'
      }
    } else {
      // Call not answered
      call.status = Math.random() > 0.5 ? 'no-answer' : 'busy'
      call.endTime = new Date()
    }

    this.activeCall = null
    this.emit('callEnded', call)
    
    return call
  }

  async endCall(): Promise<void> {
    if (!this.activeCall) {
      throw new Error('No active call to end')
    }

    this.activeCall.status = 'completed'
    this.activeCall.endTime = new Date()
    
    if (this.activeCall.startTime) {
      this.activeCall.duration = Math.floor(
        (this.activeCall.endTime.getTime() - this.activeCall.startTime.getTime()) / 1000
      )
    }

    this.emit('callEnded', this.activeCall)
    this.activeCall = null
  }

  async sendSMS(to: string, message: string): Promise<{ id: string; status: string }> {
    if (!this.isConnected) {
      throw new Error('Voice service is not connected')
    }

    // In production, send via Twilio SMS API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const smsId = 'sms-' + Date.now()
    this.emit('smsSent', { id: smsId, to, message })
    
    return { id: smsId, status: 'sent' }
  }

  async getCallHistory(limit: number = 50): Promise<CallRecord[]> {
    return this.callHistory.slice(-limit).reverse()
  }

  async getCallAnalytics(days: number = 30): Promise<CallAnalytics> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const relevantCalls = this.callHistory.filter(call => 
      call.startTime >= cutoffDate
    )

    const successfulCalls = relevantCalls.filter(call => 
      call.status === 'completed'
    )

    const totalDuration = successfulCalls.reduce((sum, call) => 
      sum + (call.duration || 0), 0
    )

    // Calculate peak hours
    const hourCounts = new Map<number, number>()
    relevantCalls.forEach(call => {
      const hour = new Date(call.startTime).getHours()
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1)
    })

    const peakHours = Array.from(hourCounts.entries())
      .map(([hour, calls]) => ({ hour, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 5)

    return {
      totalCalls: relevantCalls.length,
      successfulCalls: successfulCalls.length,
      failedCalls: relevantCalls.filter(call => 
        call.status === 'failed' || call.status === 'no-answer' || call.status === 'busy'
      ).length,
      averageDuration: successfulCalls.length > 0 
        ? totalDuration / successfulCalls.length 
        : 0,
      totalDuration,
      peakHours,
      conversionRate: successfulCalls.length > 0 
        ? (successfulCalls.length / relevantCalls.length) * 100 
        : 0,
      satisfaction: 4.2 // Mock satisfaction score
    }
  }

  getScripts(): VoiceScript[] {
    return Array.from(this.scripts.values())
  }

  addScript(script: VoiceScript): void {
    this.scripts.set(script.id, script)
    this.emit('scriptAdded', script)
  }

  updateScript(scriptId: string, updates: Partial<VoiceScript>): void {
    const script = this.scripts.get(scriptId)
    if (script) {
      Object.assign(script, updates)
      this.emit('scriptUpdated', script)
    }
  }

  deleteScript(scriptId: string): void {
    if (this.scripts.delete(scriptId)) {
      this.emit('scriptDeleted', scriptId)
    }
  }

  private generateRandomPhoneNumber(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100
    const prefix = Math.floor(Math.random() * 900) + 100
    const lineNumber = Math.floor(Math.random() * 9000) + 1000
    return `+1${areaCode}${prefix}${lineNumber}`
  }

  isServiceConnected(): boolean {
    return this.isConnected
  }

  getPhoneNumber(): string | null {
    return this.twilioPhoneNumber
  }

  getActiveCall(): CallRecord | null {
    return this.activeCall
  }

  disconnect() {
    this.isConnected = false
    if (this.activeCall) {
      this.endCall()
    }
    this.emit('disconnected')
  }
}

export const voiceCallService = new VoiceCallService()