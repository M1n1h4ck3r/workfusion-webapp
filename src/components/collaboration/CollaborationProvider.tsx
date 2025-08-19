'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import WebSocketManager, { CollaborationEvent, WebSocketClient } from '@/lib/websocket-client'
import { toast } from 'sonner'

interface CollaborationUser {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy'
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number; text: string }
  color: string
}

interface CollaborationContextType {
  users: CollaborationUser[]
  isConnected: boolean
  sendCursorPosition: (x: number, y: number) => void
  sendSelection: (start: number, end: number, text: string) => void
  sendEdit: (position: number, text: string, action: 'insert' | 'delete') => void
  updatePresence: (status: 'online' | 'away' | 'busy', activity?: string) => void
}

const CollaborationContext = createContext<CollaborationContextType | null>(null)

const userColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#48DBFB', '#00D2D3', '#A29BFE'
]

export function CollaborationProvider({
  children,
  userId,
  userName,
  sessionId
}: {
  children: React.ReactNode
  userId: string
  userName: string
  sessionId: string
}) {
  const [users, setUsers] = useState<CollaborationUser[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null)

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    const client = WebSocketManager.getInstance(wsUrl, userId, sessionId)
    
    if (client) {
      setWsClient(client)
      
      // Set up event listeners
      client.on('connected', () => {
        setIsConnected(true)
        toast.success('Real-time collaboration connected')
      })
      
      client.on('disconnected', () => {
        setIsConnected(false)
        toast.error('Real-time collaboration disconnected')
      })
      
      client.on('collaboration', (event: CollaborationEvent) => {
        handleCollaborationEvent(event)
      })
      
      client.on('presence', (data: { type: string; userId: string; userName?: string; avatar?: string; status?: string }) => {
        handlePresenceUpdate(data)
      })
      
      // Connect to WebSocket
      client.connect()
    }
    
    return () => {
      WebSocketManager.disconnect()
    }
  }, [userId, sessionId])

  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    switch (event.type) {
      case 'cursor':
        updateUserCursor(event.userId, event.data)
        break
      
      case 'selection':
        updateUserSelection(event.userId, event.data)
        break
      
      case 'edit':
        // Handle collaborative editing
        // This would integrate with your text editor
        break
      
      case 'presence':
        updateUserPresence(event.userId, event.data)
        break
    }
  }, [])

  const handlePresenceUpdate = useCallback((data: { type: string; userId: string; userName?: string; avatar?: string; status?: string }) => {
    if (data.type === 'join') {
      const newUser: CollaborationUser = {
        id: data.userId,
        name: data.userName || 'Unknown User',
        avatar: data.avatar,
        status: 'online',
        color: userColors[Math.floor(Math.random() * userColors.length)]
      }
      
      setUsers(prev => [...prev, newUser])
      toast.info(`${data.userName || 'A user'} joined the session`)
    } else if (data.type === 'leave') {
      setUsers(prev => prev.filter(u => u.id !== data.userId))
      toast.info(`${data.userName || 'A user'} left the session`)
    } else if (data.type === 'update') {
      setUsers(prev => prev.map(u => 
        u.id === data.userId 
          ? { ...u, status: (data.status as 'online' | 'away' | 'busy') || 'online' }
          : u
      ))
    }
  }, [])

  const updateUserCursor = (userId: string, cursor: { x: number; y: number }) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, cursor } : u
    ))
  }

  const updateUserSelection = (userId: string, selection: { start: number; end: number; text: string }) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, selection } : u
    ))
  }

  const updateUserPresence = (userId: string, data: Partial<CollaborationUser>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...data } : u
    ))
  }

  const sendCursorPosition = useCallback((x: number, y: number) => {
    wsClient?.sendCursorPosition(x, y)
  }, [wsClient])

  const sendSelection = useCallback((start: number, end: number, text: string) => {
    wsClient?.sendSelection(start, end, text)
  }, [wsClient])

  const sendEdit = useCallback((position: number, text: string, action: 'insert' | 'delete') => {
    wsClient?.sendEdit(position, text, action)
  }, [wsClient])

  const updatePresence = useCallback((status: 'online' | 'away' | 'busy', activity?: string) => {
    wsClient?.updatePresence(status, activity)
  }, [wsClient])

  return (
    <CollaborationContext.Provider
      value={{
        users,
        isConnected,
        sendCursorPosition,
        sendSelection,
        sendEdit,
        updatePresence
      }}
    >
      {children}
    </CollaborationContext.Provider>
  )
}

export function useCollaboration() {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider')
  }
  return context
}