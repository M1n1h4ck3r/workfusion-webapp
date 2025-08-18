import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message } from '@/services/ai-service'

interface ChatHistory {
  id: string
  personality: string
  title: string
  messages: Message[]
  created: Date
  lastUpdated: Date
}

interface ChatStore {
  histories: ChatHistory[]
  currentChatId: string | null
  
  // Actions
  createNewChat: (personality: string, firstMessage?: string) => string
  saveMessage: (chatId: string, message: Message) => void
  loadChat: (chatId: string) => ChatHistory | null
  deleteChat: (chatId: string) => void
  getChatsByPersonality: (personality: string) => ChatHistory[]
  clearAllChats: () => void
  setCurrentChat: (chatId: string | null) => void
  updateChatTitle: (chatId: string, title: string) => void
  exportChat: (chatId: string) => string
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      histories: [],
      currentChatId: null,

      createNewChat: (personality, firstMessage) => {
        const chatId = `chat_${Date.now()}`
        const now = new Date()
        
        const newChat: ChatHistory = {
          id: chatId,
          personality,
          title: firstMessage 
            ? firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '')
            : `New Chat with ${personality}`,
          messages: [],
          created: now,
          lastUpdated: now
        }

        set((state) => ({
          histories: [newChat, ...state.histories],
          currentChatId: chatId
        }))

        return chatId
      },

      saveMessage: (chatId, message) => {
        set((state) => ({
          histories: state.histories.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  lastUpdated: new Date(),
                  // Auto-generate title from first user message
                  title: chat.messages.length === 0 && message.role === 'user'
                    ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
                    : chat.title
                }
              : chat
          )
        }))
      },

      loadChat: (chatId) => {
        const chat = get().histories.find(h => h.id === chatId)
        if (chat) {
          set({ currentChatId: chatId })
          return chat
        }
        return null
      },

      deleteChat: (chatId) => {
        set((state) => ({
          histories: state.histories.filter(h => h.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId
        }))
      },

      getChatsByPersonality: (personality) => {
        return get().histories
          .filter(h => h.personality === personality)
          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      },

      clearAllChats: () => {
        set({ histories: [], currentChatId: null })
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId })
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          histories: state.histories.map((chat) =>
            chat.id === chatId
              ? { ...chat, title, lastUpdated: new Date() }
              : chat
          )
        }))
      },

      exportChat: (chatId) => {
        const chat = get().histories.find(h => h.id === chatId)
        if (!chat) return ''

        const content = [
          `# Chat with ${chat.personality}`,
          `Created: ${chat.created.toLocaleDateString()}`,
          `Last Updated: ${chat.lastUpdated.toLocaleDateString()}`,
          '',
          ...chat.messages.map(msg => 
            `**${msg.role === 'user' ? 'You' : chat.personality}:**\n${msg.content}\n`
          )
        ].join('\n')

        return content
      }
    }),
    {
      name: 'chat-history-storage',
    }
  )
)