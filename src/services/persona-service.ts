import { createClient } from '@supabase/supabase-js'

// Persona interface
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
  personaId: string
  totalUsages: number
  avgRating: number
  totalTokens: number
  lastUsedAt: string
}

export interface PersonaWithUsage extends Persona {
  usage?: PersonaUsageStats
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data for development
const mockPersonas: Persona[] = [
  {
    id: '1',
    slug: 'friendly-assistant',
    name: 'Friendly Assistant',
    avatar_type: 'emoji',
    avatar_emoji: '😊',
    category: 'General',
    description: 'A helpful and friendly AI assistant',
    system_prompt: 'You are a helpful, friendly, and professional AI assistant.',
    greeting: 'Hello! How can I help you today?',
    is_active: true,
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    slug: 'tech-expert',
    name: 'Tech Expert',
    avatar_type: 'emoji',
    avatar_emoji: '💻',
    category: 'Technical',
    description: 'Expert in technology and programming',
    system_prompt: 'You are a knowledgeable technology expert.',
    greeting: 'Hi there! Ready to tackle any technical questions.',
    is_active: true,
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    slug: 'creative-writer',
    name: 'Creative Writer',
    avatar_type: 'emoji',
    avatar_emoji: '✍️',
    category: 'Creative',
    description: 'Creative writing and storytelling assistant',
    system_prompt: 'You are a creative writing assistant.',
    greeting: 'Let\'s create something amazing together!',
    is_active: true,
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// In-memory storage for development
let devPersonas: Persona[] = [...mockPersonas]
let nextId = 4

// Helper to check if we should use mock data
const useMockData = () => {
  // Always use mock data in development for now
  return process.env.NODE_ENV === 'development'
}

// Persona Service Class
export class PersonaService {
  // Get all active personas
  static async getActivePersonas(): Promise<Persona[]> {
    // Use mock data in development if Supabase is not available
    if (useMockData()) {
      return devPersonas.filter(p => p.is_active)
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching personas:', error)
      // Return mock data as fallback
      return devPersonas.filter(p => p.is_active)
    }

    return data || []
  }

  // Get all personas including inactive (admin only)
  static async getAllPersonas(): Promise<Persona[]> {
    if (useMockData()) {
      return devPersonas
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching all personas:', error)
      return devPersonas
    }

    return data || []
  }

  // Get persona by slug
  static async getPersonaBySlug(slug: string): Promise<Persona | null> {
    if (useMockData()) {
      return devPersonas.find(p => p.slug === slug && p.is_active) || null
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching persona by slug:', error)
      return devPersonas.find(p => p.slug === slug && p.is_active) || null
    }

    return data
  }

  // Get persona by ID
  static async getPersonaById(id: string): Promise<Persona | null> {
    if (useMockData()) {
      return devPersonas.find(p => p.id === id) || null
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching persona:', error)
      return devPersonas.find(p => p.id === id) || null
    }

    return data
  }

  // Create new persona (admin only)
  static async createPersona(persona: Partial<Persona>): Promise<Persona | null> {
    if (useMockData()) {
      const newPersona: Persona = {
        id: String(nextId++),
        slug: persona.slug || persona.name?.toLowerCase().replace(/\s+/g, '-') || 'persona',
        name: persona.name || 'New Persona',
        avatar_type: persona.avatar_type || 'emoji',
        avatar_emoji: persona.avatar_emoji || '🤖',
        avatar_url: persona.avatar_url,
        category: persona.category || 'General',
        description: persona.description || '',
        system_prompt: persona.system_prompt || 'You are a helpful AI assistant.',
        greeting: persona.greeting || 'Hello!',
        voice_id: persona.voice_id,
        response_style: persona.response_style,
        is_active: persona.is_active !== undefined ? persona.is_active : true,
        is_default: persona.is_default || false,
        metadata: persona.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      devPersonas.push(newPersona)
      return newPersona
    }

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
    if (useMockData()) {
      const index = devPersonas.findIndex(p => p.id === id)
      if (index === -1) return null
      
      devPersonas[index] = {
        ...devPersonas[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return devPersonas[index]
    }

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
    if (useMockData()) {
      const index = devPersonas.findIndex(p => p.id === id)
      if (index === -1) return false
      
      devPersonas.splice(index, 1)
      return true
    }

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

  // Get default persona
  static async getDefaultPersona(): Promise<Persona | null> {
    if (useMockData()) {
      return devPersonas.find(p => p.is_default && p.is_active) || devPersonas[0] || null
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching default persona:', error)
      // Fallback to first active persona
      const personas = await this.getActivePersonas()
      return personas[0] || null
    }

    return data
  }

  // Get personas by category
  static async getPersonasByCategory(category: string): Promise<Persona[]> {
    if (useMockData()) {
      return devPersonas.filter(p => p.category === category && p.is_active)
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching personas by category:', error)
      return devPersonas.filter(p => p.category === category && p.is_active)
    }

    return data || []
  }

  // Search personas
  static async searchPersonas(query: string): Promise<Persona[]> {
    if (useMockData()) {
      const lowerQuery = query.toLowerCase()
      return devPersonas.filter(p => 
        p.is_active && (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        )
      )
    }

    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error searching personas:', error)
      return []
    }

    return data || []
  }

  // Get avatar display info
  static getAvatarDisplay(persona: Persona): { type: 'emoji' | 'image', content: string } {
    if (persona.avatar_type === 'image' && persona.avatar_url) {
      return { type: 'image', content: persona.avatar_url }
    }
    return { type: 'emoji', content: persona.avatar_emoji || '🤖' }
  }

  // Get usage stats (mock implementation)
  static async getUsageStats(personaId: string): Promise<PersonaUsageStats | null> {
    // Mock implementation - returns fake usage data
    return {
      personaId,
      totalUsages: Math.floor(Math.random() * 1000),
      avgRating: 3 + Math.random() * 2,
      totalTokens: Math.floor(Math.random() * 100000),
      lastUsedAt: new Date().toISOString()
    }
  }

  // Get cached persona (same as getPersonaById for now)
  static async getCachedPersona(id: string): Promise<Persona | null> {
    return this.getPersonaById(id)
  }

  // Get categories
  static async getCategories(): Promise<string[]> {
    if (useMockData()) {
      const categories = new Set(devPersonas.filter(p => p.is_active).map(p => p.category))
      return Array.from(categories).sort()
    }

    const { data, error } = await supabase
      .from('personas')
      .select('category')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching categories:', error)
      return ['General', 'Technical', 'Creative', 'Business', 'Health']
    }

    const categories = new Set(data?.map(item => item.category) || [])
    return Array.from(categories).sort()
  }
}