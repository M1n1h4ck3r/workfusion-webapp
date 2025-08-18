'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, Trash2, Download, Search, Plus, 
  Edit2, Check, X, Calendar
} from 'lucide-react'
import { useChatStore } from '@/store/chat-store'
import { CHATBOT_PERSONALITIES } from '@/services/ai-service'
import { toast } from 'sonner'

interface ChatHistoryProps {
  personality: string
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  currentChatId?: string
}

export function ChatHistory({ personality, onSelectChat, onNewChat, currentChatId }: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  
  const {
    getChatsByPersonality,
    deleteChat,
    updateChatTitle,
    exportChat
  } = useChatStore()

  const chats = getChatsByPersonality(personality).filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const personalityData = CHATBOT_PERSONALITIES[personality as keyof typeof CHATBOT_PERSONALITIES]

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId)
      toast.success('Chat deleted')
    }
  }

  const handleExportChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const content = exportChat(chatId)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${chatId}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat exported')
  }

  const handleEditTitle = (chat: { id: string; title: string }, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveTitle = (chatId: string) => {
    if (editTitle.trim()) {
      updateChatTitle(chatId, editTitle.trim())
      toast.success('Title updated')
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const chatDate = new Date(date)
    const diff = now.getTime() - chatDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return chatDate.toLocaleDateString()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white flex items-center">
            <span className="text-xl mr-2">{personalityData?.avatar}</span>
            {personalityData?.name} Chats
          </h3>
          <Button
            onClick={onNewChat}
            size="sm"
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats..."
            className="input-glass pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center">
            {searchTerm ? (
              <p className="text-white/60">No chats found matching &quot;{searchTerm}&quot;</p>
            ) : (
              <div className="py-8">
                <MessageSquare className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 mb-3">No chats yet</p>
                <Button
                  onClick={onNewChat}
                  variant="outline"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  Start your first chat
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`glass p-3 rounded-lg cursor-pointer transition-all ${
                    currentChatId === chat.id 
                      ? 'border-primary-green border-2' 
                      : 'border-white/10 border hover:border-white/20'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <div className="flex items-center space-x-2 mb-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input-glass text-sm h-8"
                            onClick={(e) => e.stopPropagation()}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveTitle(chat.id)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveTitle(chat.id)
                            }}
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelEdit()
                            }}
                            className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <h4 className="font-medium text-white text-sm truncate mb-2">
                          {chat.title}
                        </h4>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-white/10 text-white/70 border-white/20">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {chat.messages.length}
                          </Badge>
                          <span className="text-xs text-white/60 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(chat.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditTitle(chat, e)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Edit title"
                      >
                        <Edit2 className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={(e) => handleExportChat(chat.id, e)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Export chat"
                      >
                        <Download className="h-3 w-3 text-white/60" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Preview of last message */}
                  {chat.messages.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-white/60 truncate">
                        {chat.messages[chat.messages.length - 1]?.content.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {chats.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{chats.length} chat{chats.length !== 1 ? 's' : ''}</span>
            <span>
              {chats.reduce((total, chat) => total + chat.messages.length, 0)} messages
            </span>
          </div>
        </div>
      )}
    </div>
  )
}