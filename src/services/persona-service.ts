import { createClient } from '@supabase/supabase-js'

// Types
export interface Persona {
  id: string
  slug: string
  name: string
  avatar_type: 'emoji' | 'image'
  avatar_emoji?: string
  avatar_url?: string
  category: string
  description: string
  system_prompt: string
  greeting: string
  voice_id?: string
  response_style?: Record<string, unknown>
  is_active: boolean
  is_default: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface PersonaUsageStats {
  id: string
  persona_id: string
  user_id: string
  messages_count: number
  tokens_used: number
  rating?: number
  feedback?: string
  started_at: string
  ended_at?: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Persona Service Class
export class PersonaService {
  // Get all active personas
  static async getActivePersonas(): Promise<Persona[]> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching personas:', error)
      return []
    }

    return data || []
  }

  // Get persona by slug
  static async getPersonaBySlug(slug: string): Promise<Persona | null> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching persona:', error)
      return null
    }

    return data
  }

  // Get persona by ID
  static async getPersonaById(id: string): Promise<Persona | null> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching persona:', error)
      return null
    }

    return data
  }

  // Create new persona (admin only)
  static async createPersona(persona: Partial<Persona>): Promise<Persona | null> {
    const { data, error } = await supabase
      .from('personas')
      .insert([persona])
      .select()
      .single()

    if (error) {
      console.error('Error creating persona:', error)
      throw error
    }

    return data
  }

  // Update persona (admin only)
  static async updatePersona(id: string, updates: Partial<Persona>): Promise<Persona | null> {
    const { data, error } = await supabase
      .from('personas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating persona:', error)
      throw error
    }

    return data
  }

  // Delete persona (admin only)
  static async deletePersona(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting persona:', error)
      return false
    }

    return true
  }

  // Upload persona avatar image - client-side version
  // Note: Actual upload happens via API route to use server-side MinIO service
  static async uploadAvatar(personaId: string, file: File): Promise<string | null> {
    try {
      // Upload via API route (which uses server-side MinIO)
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`/api/personas/${personaId}/avatar`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }
      
      const { avatarUrl } = await response.json()
      return avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return null
    }
  }

  // Delete avatar image - client-side version
  static async deleteAvatar(personaId: string, avatarUrl: string): Promise<boolean> {
    try {
      // Delete via API route
      const response = await fetch(`/api/personas/${personaId}/avatar`, {
        method: 'DELETE'
      })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return false
    }
  }

  // Track usage statistics
  static async trackUsage(
    personaId: string,
    userId: string,
    sessionId: string,
    messagesCount: number = 1,
    tokensUsed: number = 0
  ): Promise<void> {
    await supabase
      .from('persona_usage_stats')
      .upsert({
        persona_id: personaId,
        user_id: userId,
        session_id: sessionId,
        messages_count: messagesCount,
        tokens_used: tokensUsed
      }, {
        onConflict: 'session_id',
        count: 'exact'
      })
  }

  // Add user feedback/rating
  static async addFeedback(
    sessionId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    await supabase
      .from('persona_usage_stats')
      .update({
        rating,
        feedback,
        ended_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
  }

  // Get usage statistics for a persona
  static async getUsageStats(personaId: string): Promise<PersonaUsageStats[]> {
    const { data, error } = await supabase
      .from('persona_usage_stats')
      .select('*')
      .eq('persona_id', personaId)
      .order('started_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error fetching usage stats:', error)
      return []
    }

    return data || []
  }

  // Get popular personas
  static async getPopularPersonas(limit: number = 5): Promise<Persona[]> {
    const { data, error } = await supabase
      .rpc('get_popular_personas', { limit_count: limit })

    if (error) {
      console.error('Error fetching popular personas:', error)
      return []
    }

    return data || []
  }

  // Helper function to get avatar display
  static getAvatarDisplay(persona: Persona): { type: 'emoji' | 'image', value: string, thumbnail?: string } {
    if (persona.avatar_type === 'image' && persona.avatar_url) {
      // Avatar URL is already the full MinIO URL
      return { 
        type: 'image', 
        value: persona.avatar_url,
        thumbnail: persona.metadata?.thumbnailUrl
      }
    }
    return { type: 'emoji', value: persona.avatar_emoji || '🤖' }
  }

  // Migrate avatars from Supabase to MinIO
  // Note: This should be called from a server-side context or API route
  static async migrateAvatarsToMinIO(): Promise<void> {
    console.log('Avatar migration should be performed via API route or server-side script')
  }

  // Cache personas locally for performance
  private static personaCache: Map<string, Persona> = new Map()
  private static cacheExpiry: number = 5 * 60 * 1000 // 5 minutes

  static async getCachedPersona(slug: string): Promise<Persona | null> {
    const cached = this.personaCache.get(slug)
    
    if (cached) {
      return cached
    }

    const persona = await this.getPersonaBySlug(slug)
    
    if (persona) {
      this.personaCache.set(slug, persona)
      
      // Clear cache after expiry
      setTimeout(() => {
        this.personaCache.delete(slug)
      }, this.cacheExpiry)
    }

    return persona
  }

  // Clear persona cache
  static clearCache(): void {
    this.personaCache.clear()
  }
}

// Export for backward compatibility
export const getPersonas = PersonaService.getActivePersonas
export const getPersonaBySlug = PersonaService.getPersonaBySlug
export const uploadPersonaAvatar = PersonaService.uploadAvatar