'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Edit2, Plus, Trash2, Copy, 
  Brain, Sparkles, Check, X,
  Upload, Image as ImageIcon, Filter,
  Search, BarChart3, Users, Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { PersonaService, type Persona } from '@/services/persona-service'

// Convert database Persona to UI format
interface UIPersona {
  id: string
  slug: string
  name: string
  avatar: string
  avatarType: 'emoji' | 'image'
  avatarUrl?: string
  systemPrompt: string
  greeting: string
  description: string
  category: string
  isActive: boolean
  isDefault: boolean
  voiceId?: string
  createdAt: string
  updatedAt: string
}

// Convert database format to UI format
const convertToUIPersona = (persona: Persona): UIPersona => ({
  id: persona.id,
  slug: persona.slug,
  name: persona.name,
  avatar: persona.avatar_emoji || '🤖',
  avatarType: persona.avatar_type,
  avatarUrl: persona.avatar_url || undefined,
  systemPrompt: persona.system_prompt,
  greeting: persona.greeting,
  description: persona.description || '',
  category: persona.category,
  isActive: persona.is_active,
  isDefault: persona.is_default,
  voiceId: persona.voice_id || undefined,
  createdAt: persona.created_at,
  updatedAt: persona.updated_at
})

// Convert UI format to database format
const convertToDBPersona = (persona: Partial<UIPersona>): Partial<Persona> => {
  const result: Partial<Persona> = {
    id: persona.id,
    slug: persona.slug,
    name: persona.name,
    avatar_emoji: persona.avatar,
    avatar_type: persona.avatarType,
    system_prompt: persona.systemPrompt,
    greeting: persona.greeting,
    description: persona.description,
    category: persona.category,
    is_active: persona.isActive,
    is_default: persona.isDefault
  }
  
  if (persona.avatarUrl) {
    result.avatar_url = persona.avatarUrl
  }
  
  if (persona.voiceId) {
    result.voice_id = persona.voiceId
  }
  
  return result
}

export default function PersonaManagementPage() {
  const [personas, setPersonas] = useState<UIPersona[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UIPersona>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showInactive, setShowInactive] = useState(false)
  const [usageStats, setUsageStats] = useState<Record<string, {
    totalUsages: number
    avgRating: number
    totalTokens: number
  }>>({})

  // Load personas from API
  useEffect(() => {
    loadPersonas()
  }, [showInactive])

  const loadPersonas = async () => {
    try {
      setIsLoading(true)
      
      // Get the current session from Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const url = showInactive ? '/api/personas?include_inactive=true' : '/api/personas'
      const response = await fetch(url, { headers })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded personas:', data)
        const uiPersonas = Array.isArray(data) ? data.map(convertToUIPersona) : []
        setPersonas(uiPersonas)
        
        // Load usage stats for each persona
        loadUsageStats(uiPersonas)
      } else {
        console.error('Failed to load personas, response not ok:', response.status)
        toast.error('Failed to load personas')
        // Load mock data as fallback
        setPersonas([
          {
            id: '1',
            slug: 'friendly-assistant',
            name: 'Friendly Assistant',
            avatar: '😊',
            avatarType: 'emoji',
            category: 'General',
            description: 'A helpful AI assistant',
            systemPrompt: 'You are helpful',
            greeting: 'Hello!',
            isActive: true,
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error loading personas:', error)
      toast.error('Failed to load personas - using mock data')
      // Load mock data as fallback
      setPersonas([
        {
          id: '1',
          slug: 'friendly-assistant',
          name: 'Friendly Assistant',
          avatar: '😊',
          avatarType: 'emoji',
          category: 'General',
          description: 'A helpful AI assistant',
          systemPrompt: 'You are helpful',
          greeting: 'Hello!',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsageStats = async (personaList: UIPersona[]) => {
    const stats: Record<string, {
      totalUsages: number
      avgRating: number
      totalTokens: number
    }> = {}
    
    for (const persona of personaList) {
      try {
        const statsData = await PersonaService.getUsageStats(persona.id)
        stats[persona.id] = {
          totalUsages: statsData.length,
          avgRating: statsData.length > 0 
            ? statsData.reduce((sum, stat) => sum + (stat.rating || 0), 0) / statsData.filter(s => s.rating).length 
            : 0,
          totalTokens: statsData.reduce((sum, stat) => sum + stat.tokens_used, 0)
        }
      } catch (error) {
        console.warn(`Failed to load stats for persona ${persona.id}:`, error)
      }
    }
    
    setUsageStats(stats)
  }

  const getPersonaDescription = (id: string) => {
    const descriptions: Record<string, string> = {
      'alex-hormozi': 'Business scaling and sales expert',
      'jordan-peterson': 'Psychology and philosophy professor',
      'daedalus': 'Engineering and architecture specialist',
      'sensei-suki': 'Productivity and time management coach'
    }
    return descriptions[id] || 'AI Assistant'
  }

  const getPersonaCategory = (id: string) => {
    const categories: Record<string, string> = {
      'alex-hormozi': 'Business',
      'jordan-peterson': 'Psychology',
      'daedalus': 'Engineering',
      'sensei-suki': 'Productivity'
    }
    return categories[id] || 'General'
  }

  const handleEdit = (persona: UIPersona) => {
    setEditingId(persona.id)
    setEditForm(persona)
  }

  const handleSave = async () => {
    if (!editingId || !editForm.name) return
    
    setIsSaving(true)
    
    try {
      // Get the current session from Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      let response
      
      if (editingId.startsWith('new-')) {
        // Create new persona
        const personaData = convertToDBPersona(editForm)
        response = await fetch('/api/personas', {
          method: 'POST',
          headers,
          body: JSON.stringify(personaData)
        })
      } else {
        // Update existing persona
        const personaData = convertToDBPersona(editForm)
        response = await fetch(`/api/personas/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(personaData)
        })
      }

      if (response.ok) {
        const savedPersona = await response.json()
        const uiPersona = convertToUIPersona(savedPersona)
        
        if (editingId.startsWith('new-')) {
          // Replace temporary persona with saved one
          setPersonas(prev => prev.map(p => 
            p.id === editingId ? uiPersona : p
          ))
        } else {
          // Update existing persona
          setPersonas(prev => prev.map(p => 
            p.id === editingId ? { ...p, ...editForm } : p
          ))
        }
        
        toast.success(`${editForm.name} ${editingId.startsWith('new-') ? 'created' : 'updated'} successfully!`)
        setEditingId(null)
        setEditForm({})
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save persona')
      }
    } catch (error) {
      console.error('Error saving persona:', error)
      toast.error('Failed to save persona. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleCreate = () => {
    console.log('handleCreate function called!')
    console.log('Current state - isLoading:', isLoading, 'editingId:', editingId)
    
    const newPersona: UIPersona = {
      id: `new-${Date.now()}`,
      slug: '',
      name: 'New Persona',
      avatar: '🤖',
      avatarType: 'emoji' as const,
      avatarUrl: undefined,
      systemPrompt: 'You are a helpful AI assistant.',
      greeting: 'Hello! I\'m your new AI assistant. How can I help you today?',
      description: 'Custom AI personality',
      category: 'Custom',
      isActive: false,
      isDefault: false,
      voiceId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add to the beginning of the list so it's visible
    setPersonas(prev => [newPersona, ...prev])
    setEditingId(newPersona.id)
    setEditForm(newPersona)
    
    // Clear filters to ensure the new persona is visible
    setSearchTerm('')
    setCategoryFilter('all')
    
    // Scroll to top after a short delay
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    
    toast.info('New persona created - edit and save to persist')
  }

  const handleDelete = async (id: string, persona: UIPersona) => {
    if (persona.isDefault) {
      toast.error('Cannot delete default persona')
      return
    }

    if (!confirm(`Are you sure you want to delete "${persona.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const token = localStorage.getItem('supabase.auth.token')
      const headers: Record<string, string> = {}
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/personas/${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        setPersonas(prev => prev.filter(p => p.id !== id))
        toast.success('Persona deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete persona')
      }
    } catch (error) {
      console.error('Error deleting persona:', error)
      toast.error('Failed to delete persona')
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      // Get the current session from Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      )
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ is_active: !currentState })
      })

      if (response.ok) {
        setPersonas(prev => prev.map(p => 
          p.id === id ? { ...p, isActive: !p.isActive } : p
        ))
        toast.success(`Persona ${!currentState ? 'activated' : 'deactivated'}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update persona')
      }
    } catch (error) {
      console.error('Error toggling persona status:', error)
      toast.error('Failed to update persona')
    }
  }

  const handleDuplicate = (persona: UIPersona) => {
    const newPersona: UIPersona = {
      ...persona,
      id: `new-${Date.now()}`,
      slug: `${persona.slug}-copy`,
      name: `${persona.name} (Copy)`,
      isActive: false,
      isDefault: false,
      avatarUrl: undefined, // Don't copy avatar URL
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEditingId(newPersona.id)
    setEditForm(newPersona)
    setPersonas(prev => [...prev, newPersona])
    toast.success('Persona duplicated - edit and save to create')
  }

  // Filter and search logic
  const filteredPersonas = personas.filter(persona => {
    // Always include the persona being edited
    if (editingId && persona.id === editingId) {
      return true
    }
    
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || persona.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(personas.map(p => p.category)))
  
  const categoryColors: Record<string, string> = {
    'Business': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Psychology': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Engineering': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Productivity': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Custom': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'Marketing': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Education': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/80">Loading personas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Persona Management</h1>
          <p className="text-white/80">Configure AI chatbot personalities and prompts</p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
              {personas.length} Total
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {personas.filter(p => p.isActive).length} Active
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {personas.filter(p => p.isDefault).length} Default
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setShowInactive(!showInactive)}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showInactive ? 'Hide Inactive' : 'Show All'}
          </Button>
          <Button 
            onClick={() => {
              console.log('Button clicked, isLoading:', isLoading)
              if (!isLoading) {
                handleCreate()
              }
            }} 
            disabled={isLoading}
            className="btn-primary"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : 'Create New Persona'}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-strong p-4 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search personas..."
                className="input-glass pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-white/80 text-sm mb-2 block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-glass w-full"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/80 text-sm mb-2 block">Results</label>
            <div className="text-white/60 text-sm pt-2">
              {filteredPersonas.length} of {personas.length} personas
            </div>
          </div>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid gap-6">
        {filteredPersonas.map((persona) => {
          const isEditing = editingId === persona.id
          
          return (
            <motion.div
              key={persona.id}
              className="glass-strong rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Persona Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {persona.avatarType === 'image' && persona.avatarUrl ? (
                        <img 
                          src={persona.avatarUrl} 
                          alt={persona.name} 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-4xl">{persona.avatar}</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-white">
                          {isEditing ? (
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="input-glass w-48"
                            />
                          ) : (
                            persona.name
                          )}
                        </h2>
                        <Badge className={categoryColors[persona.category]}>
                          {persona.category}
                        </Badge>
                        {persona.isActive ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/60 mt-1">
                        {isEditing ? (
                          <Input
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Persona description"
                            className="input-glass w-96 mt-1"
                          />
                        ) : (
                          persona.description
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="btn-primary"
                        >
                          {isSaving ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(persona)}
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDuplicate(persona)}
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleToggleActive(persona.id, persona.isActive)}
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20 hover:bg-white/10"
                          title={persona.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {persona.isActive ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        {!persona.isDefault && (
                          <Button
                            onClick={() => handleDelete(persona.id, persona)}
                            variant="outline"
                            size="sm"
                            className="glass text-red-400 border-red-400/20 hover:bg-red-400/10"
                            title="Delete persona"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {persona.isDefault && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            Protected
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Prompt Configuration */}
              <div className="p-6 space-y-4">
                {/* Avatar Configuration */}
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Avatar</label>
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Avatar Type Selector */}
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={editForm.avatarType === 'emoji' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEditForm({ ...editForm, avatarType: 'emoji' })}
                          className={editForm.avatarType === 'emoji' ? 'btn-primary' : 'glass text-white border-white/20'}
                        >
                          Emoji
                        </Button>
                        <Button
                          type="button"
                          variant={editForm.avatarType === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEditForm({ ...editForm, avatarType: 'image' })}
                          className={editForm.avatarType === 'image' ? 'btn-primary' : 'glass text-white border-white/20'}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Image
                        </Button>
                      </div>
                      
                      {/* Avatar Input */}
                      {editForm.avatarType === 'emoji' ? (
                        <Input
                          value={editForm.avatar}
                          onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                          placeholder="Enter an emoji"
                          className="input-glass w-24"
                          maxLength={2}
                        />
                      ) : (
                        <div className="space-y-2">
                          {editForm.avatarUrl && (
                            <div className="relative w-24 h-24">
                              <img 
                                src={editForm.avatarUrl} 
                                alt="Avatar" 
                                className="w-full h-full rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              id={`avatar-upload-${persona.id}`}
                              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  // Upload to MinIO via API
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  
                                  try {
                                    const response = await fetch(`/api/personas/${persona.id}/avatar`, {
                                      method: 'POST',
                                      body: formData
                                    })
                                    
                                    if (response.ok) {
                                      const { avatarUrl } = await response.json()
                                      setEditForm({ ...editForm, avatarUrl, avatarType: 'image' })
                                      toast.success('Avatar uploaded successfully')
                                    } else {
                                      const error = await response.json()
                                      toast.error(error.error || 'Failed to upload avatar')
                                    }
                                  } catch (error) {
                                    toast.error('Failed to upload avatar')
                                  }
                                }
                              }}
                            />
                            <label
                              htmlFor={`avatar-upload-${persona.id}`}
                              className="btn-primary cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </label>
                            {editForm.avatarUrl && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(`/api/personas/${persona.id}/avatar`, {
                                      method: 'DELETE'
                                    })
                                    
                                    if (response.ok) {
                                      setEditForm({ ...editForm, avatarUrl: undefined, avatarType: 'emoji' })
                                      toast.success('Avatar removed')
                                    }
                                  } catch (error) {
                                    toast.error('Failed to remove avatar')
                                  }
                                }}
                                className="glass text-red-400 border-red-400/20 hover:bg-red-400/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {persona.avatarType === 'image' && persona.avatarUrl ? (
                        <img 
                          src={persona.avatarUrl} 
                          alt={persona.name} 
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-2xl">{persona.avatar}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* System Prompt */}
                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    System Prompt (Personality Definition)
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.systemPrompt}
                      onChange={(e) => setEditForm({ ...editForm, systemPrompt: e.target.value })}
                      placeholder="Define the AI's personality, expertise, and communication style..."
                      className="input-glass w-full h-48 resize-none"
                    />
                  ) : (
                    <div className="glass p-4 rounded-lg">
                      <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                        {persona.systemPrompt}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Greeting Message */}
                <div>
                  <label className="text-white/80 text-sm mb-2 block">
                    Greeting Message
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.greeting}
                      onChange={(e) => setEditForm({ ...editForm, greeting: e.target.value })}
                      placeholder="The first message users see when starting a chat..."
                      className="input-glass w-full h-24 resize-none"
                    />
                  ) : (
                    <div className="glass p-4 rounded-lg">
                      <p className="text-white/80">{persona.greeting}</p>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Category</label>
                    {isEditing ? (
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="input-glass w-full"
                      >
                        <option value="Business">Business</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Education">Education</option>
                        <option value="Custom">Custom</option>
                      </select>
                    ) : (
                      <Badge className={`${categoryColors[persona.category]} px-3 py-1`}>
                        {persona.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Status & Voice</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isEditing ? editForm.isActive : persona.isActive}
                          onChange={(e) => isEditing && setEditForm({ ...editForm, isActive: e.target.checked })}
                          disabled={!isEditing}
                          className="rounded border-white/20"
                        />
                        <span className="text-white/80">Active</span>
                      </div>
                      {isEditing && (
                        <div>
                          <label className="text-white/80 text-xs mb-1 block">Voice ID (Optional)</label>
                          <select
                            value={editForm.voiceId || ''}
                            onChange={(e) => setEditForm({ ...editForm, voiceId: e.target.value || undefined })}
                            className="input-glass w-full text-sm"
                          >
                            <option value="">No Voice</option>
                            <option value="echo">Echo</option>
                            <option value="alloy">Alloy</option>
                            <option value="fable">Fable</option>
                            <option value="onyx">Onyx</option>
                            <option value="nova">Nova</option>
                            <option value="shimmer">Shimmer</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview and Stats Section */}
              {!isEditing && (
                <div className="p-6 bg-white/5 border-t border-white/10 space-y-6">
                  {/* Usage Statistics */}
                  {usageStats[persona.id] && (
                    <div>
                      <h3 className="text-white font-medium mb-3 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-primary-green" />
                        Usage Statistics
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="glass p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-green">
                            {usageStats[persona.id].totalUsages || 0}
                          </div>
                          <div className="text-white/60 text-xs">Total Chats</div>
                        </div>
                        <div className="glass p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {usageStats[persona.id].avgRating ? usageStats[persona.id].avgRating.toFixed(1) : 'N/A'}
                          </div>
                          <div className="text-white/60 text-xs">Avg Rating</div>
                        </div>
                        <div className="glass p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {(usageStats[persona.id].totalTokens || 0).toLocaleString()}
                          </div>
                          <div className="text-white/60 text-xs">Tokens Used</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chat Preview */}
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary-green" />
                      Chat Preview
                    </h3>
                    <div className="glass p-4 rounded-lg space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {persona.avatarType === 'image' && persona.avatarUrl ? (
                            <img 
                              src={persona.avatarUrl} 
                              alt={persona.name} 
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="text-2xl">{persona.avatar}</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-white/60 text-sm">{persona.name}</p>
                            {persona.voiceId && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                🔊 {persona.voiceId}
                              </Badge>
                            )}
                            <div className="text-white/40 text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(persona.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-white/90 mt-1">{persona.greeting}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-white/50">Slug:</span>
                      <span className="text-white/80 ml-2 font-mono">{persona.slug}</span>
                    </div>
                    <div>
                      <span className="text-white/50">ID:</span>
                      <span className="text-white/80 ml-2 font-mono">{persona.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* No results message */}
      {filteredPersonas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No personas found</h3>
          <p className="text-white/60 mb-4">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first persona to get started'}
          </p>
          {(searchTerm || categoryFilter !== 'all') && (
            <Button 
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
              }}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Instructions */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary-green" />
          Prompt Engineering Guidelines
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">System Prompt Best Practices</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <Sparkles className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                Define clear expertise and knowledge areas
              </li>
              <li className="flex items-start">
                <Sparkles className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                Specify communication style and tone
              </li>
              <li className="flex items-start">
                <Sparkles className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                Include specific behaviors and responses
              </li>
              <li className="flex items-start">
                <Sparkles className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                Set boundaries and limitations
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Example Structure</h4>
            <div className="glass p-3 rounded-lg">
              <pre className="text-xs text-white/60 font-mono">
{`You are [NAME], an expert in [FIELD].

Your expertise includes:
- [AREA 1]
- [AREA 2]
- [AREA 3]

Communication style:
- [TRAIT 1]
- [TRAIT 2]
- [TRAIT 3]

Always provide [TYPE] advice.`}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-white font-medium mb-2">Quick Tips</h4>
          <ul className="space-y-1 text-sm text-white/70">
            <li>• Use specific, actionable language in system prompts</li>
            <li>• Test personas in the playground before activating</li>
            <li>• Monitor usage statistics to optimize performance</li>
            <li>• Keep greetings conversational and welcoming</li>
            <li>• Assign appropriate voice IDs for text-to-speech</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}