export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          tokens: number
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          tokens?: number
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          tokens?: number
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          slug: string
          name: string
          avatar_type: 'emoji' | 'image'
          avatar_emoji: string | null
          avatar_url: string | null
          category: string
          description: string
          system_prompt: string
          greeting: string
          voice_id: string | null
          response_style: Json
          is_active: boolean
          is_default: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          avatar_type?: 'emoji' | 'image'
          avatar_emoji?: string | null
          avatar_url?: string | null
          category?: string
          description: string
          system_prompt: string
          greeting: string
          voice_id?: string | null
          response_style?: Json
          is_active?: boolean
          is_default?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          avatar_type?: 'emoji' | 'image'
          avatar_emoji?: string | null
          avatar_url?: string | null
          category?: string
          description?: string
          system_prompt?: string
          greeting?: string
          voice_id?: string | null
          response_style?: Json
          is_active?: boolean
          is_default?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          persona_id: string
          title: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          persona_id: string
          title: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          persona_id?: string
          title?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      token_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          transaction_type: 'purchase' | 'bonus' | 'usage' | 'refund'
          service_type: string | null
          description: string
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          transaction_type: 'purchase' | 'bonus' | 'usage' | 'refund'
          service_type?: string | null
          description: string
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          transaction_type?: 'purchase' | 'bonus' | 'usage' | 'refund'
          service_type?: string | null
          description?: string
          reference_id?: string | null
          created_at?: string
        }
      }
      persona_usage_stats: {
        Row: {
          id: string
          persona_id: string
          user_id: string
          usage_count: number
          total_tokens_used: number
          rating: number | null
          last_used_at: string
          created_at: string
        }
        Insert: {
          id?: string
          persona_id: string
          user_id: string
          usage_count?: number
          total_tokens_used?: number
          rating?: number | null
          last_used_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          persona_id?: string
          user_id?: string
          usage_count?: number
          total_tokens_used?: number
          rating?: number | null
          last_used_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_tokens: {
        Args: {
          user_id: string
          amount: number
          transaction_type: string
          service_type?: string
          description?: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Profile = Tables<'profiles'>
export type Persona = Tables<'personas'>
export type ChatSession = Tables<'chat_sessions'>
export type ChatMessage = Tables<'chat_messages'>
export type TokenTransaction = Tables<'token_transactions'>
export type PersonaUsageStats = Tables<'persona_usage_stats'>