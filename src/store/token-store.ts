import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TokenTransaction {
  id: string
  type: 'purchase' | 'usage' | 'bonus' | 'refund'
  amount: number
  description: string
  tool?: string
  timestamp: Date
}

interface TokenStore {
  balance: number
  freeTokens: number
  transactions: TokenTransaction[]
  
  // Actions
  setBalance: (balance: number) => void
  addTokens: (amount: number, type: 'purchase' | 'bonus', description: string) => void
  useTokens: (amount: number, tool: string, description: string) => boolean
  getTransactionHistory: () => TokenTransaction[]
  calculateTokenCost: (tool: string, input?: string) => number
}

// Token costs per tool/action
export const TOKEN_COSTS = {
  'chatbot': 2, // per message
  'chatbot-long': 5, // for responses over 500 chars
  'tts': 1, // per 100 characters
  'whatsapp': 3, // per message
  'voice-call': 10, // per call
  'image-generation': 15, // per image
  'document-analysis': 8, // per document
} as const

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      balance: 500, // Start with 500 free tokens
      freeTokens: 500,
      transactions: [],

      setBalance: (balance) => set({ balance }),

      addTokens: (amount, type, description) => {
        const transaction: TokenTransaction = {
          id: `txn_${Date.now()}`,
          type,
          amount,
          description,
          timestamp: new Date(),
        }

        set((state) => ({
          balance: state.balance + amount,
          transactions: [transaction, ...state.transactions],
        }))
      },

      useTokens: (amount, tool, description) => {
        const currentBalance = get().balance
        
        if (currentBalance < amount) {
          return false // Insufficient balance
        }

        const transaction: TokenTransaction = {
          id: `txn_${Date.now()}`,
          type: 'usage',
          amount: -amount,
          description,
          tool,
          timestamp: new Date(),
        }

        set((state) => ({
          balance: state.balance - amount,
          transactions: [transaction, ...state.transactions],
        }))

        return true
      },

      getTransactionHistory: () => get().transactions,

      calculateTokenCost: (tool, input) => {
        let baseCost: number = TOKEN_COSTS[tool as keyof typeof TOKEN_COSTS] || 1
        
        // Adjust cost based on input length for certain tools
        if (tool === 'chatbot' && input && input.length > 500) {
          baseCost = TOKEN_COSTS['chatbot-long']
        }
        
        if (tool === 'tts' && input) {
          // 1 token per 100 characters
          baseCost = Math.ceil(input.length / 100)
        }
        
        return baseCost
      },
    }),
    {
      name: 'token-storage',
    }
  )
)