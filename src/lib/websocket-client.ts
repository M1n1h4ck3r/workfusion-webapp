import { EventEmitter } from 'events'

export interface WebSocketMessage {
  type: string
  payload: unknown
  timestamp: number
  userId?: string
  sessionId?: string
}

export interface CollaborationEvent {
  type: 'cursor' | 'selection' | 'edit' | 'presence'
  userId: string
  userName: string
  data: unknown
}

export class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private url: string
  private userId: string
  private sessionId: string

  constructor(url: string, userId: string, sessionId: string) {
    super()
    this.url = url
    this.userId = userId
    this.sessionId = sessionId
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.emit('connected')
        this.startHeartbeat()
        
        // Send authentication
        this.send({
          type: 'auth',
          payload: {
            userId: this.userId,
            sessionId: this.sessionId
          }
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.emit('disconnected')
        this.stopHeartbeat()
        this.attemptReconnect()
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.attemptReconnect()
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'pong':
        // Heartbeat response
        break
      
      case 'collaboration':
        this.emit('collaboration', message.payload as CollaborationEvent)
        break
      
      case 'notification':
        this.emit('notification', message.payload)
        break
      
      case 'presence':
        this.emit('presence', message.payload)
        break
      
      case 'workflow':
        this.emit('workflow', message.payload)
        break
      
      case 'analytics':
        this.emit('analytics', message.payload)
        break
      
      default:
        this.emit('message', message)
    }
  }

  send(message: Partial<WebSocketMessage>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        type: message.type || 'message',
        payload: message.payload || {},
        timestamp: Date.now(),
        userId: this.userId,
        sessionId: this.sessionId
      }
      
      this.ws.send(JSON.stringify(fullMessage))
    } else {
      console.warn('WebSocket not connected, queuing message')
      // Could implement message queue here
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping', payload: {} })
    }, 30000) // Every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.emit('reconnectFailed')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Collaboration methods
  sendCursorPosition(x: number, y: number): void {
    this.send({
      type: 'collaboration',
      payload: {
        type: 'cursor',
        userId: this.userId,
        data: { x, y }
      }
    })
  }

  sendSelection(start: number, end: number, text: string): void {
    this.send({
      type: 'collaboration',
      payload: {
        type: 'selection',
        userId: this.userId,
        data: { start, end, text }
      }
    })
  }

  sendEdit(position: number, text: string, action: 'insert' | 'delete'): void {
    this.send({
      type: 'collaboration',
      payload: {
        type: 'edit',
        userId: this.userId,
        data: { position, text, action }
      }
    })
  }

  updatePresence(status: 'online' | 'away' | 'busy', activity?: string): void {
    this.send({
      type: 'presence',
      payload: {
        userId: this.userId,
        status,
        activity,
        timestamp: Date.now()
      }
    })
  }
}

// Singleton instance manager
class WebSocketManager {
  private static instance: WebSocketClient | null = null

  static getInstance(url?: string, userId?: string, sessionId?: string): WebSocketClient | null {
    if (!WebSocketManager.instance && url && userId && sessionId) {
      WebSocketManager.instance = new WebSocketClient(url, userId, sessionId)
    }
    return WebSocketManager.instance
  }

  static disconnect(): void {
    if (WebSocketManager.instance) {
      WebSocketManager.instance.disconnect()
      WebSocketManager.instance = null
    }
  }
}

export default WebSocketManager