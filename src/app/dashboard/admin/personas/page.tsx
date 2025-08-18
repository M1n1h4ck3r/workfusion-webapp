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
  Upload, Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { CHATBOT_PERSONALITIES } from '@/services/ai-service'

interface Persona {
  id: string
  name: string
  avatar: string
  avatarType: 'emoji' | 'image'
  avatarUrl?: string
  systemPrompt: string
  greeting: string
  description: string
  category: string
  isActive: boolean
}

export default function PersonaManagementPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Persona>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Load existing personas
  useEffect(() => {
    // Convert existing personas to editable format
    const loadedPersonas: Persona[] = Object.entries(CHATBOT_PERSONALITIES).map(([key, value]) => ({
      id: key,
      name: value.name,
      avatar: value.avatar,
      avatarType: 'emoji' as const,
      avatarUrl: undefined,
      systemPrompt: value.systemPrompt,
      greeting: value.greeting,
      description: getPersonaDescription(key),
      category: getPersonaCategory(key),
      isActive: true
    }))
    setPersonas(loadedPersonas)
  }, [])

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

  const handleEdit = (persona: Persona) => {
    setEditingId(persona.id)
    setEditForm(persona)
  }

  const handleSave = async () => {
    if (!editingId) return
    
    setIsSaving(true)
    
    try {
      // Simulate API call to save persona
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setPersonas(prev => prev.map(p => 
        p.id === editingId ? { ...p, ...editForm } : p
      ))
      
      toast.success(`${editForm.name} updated successfully!`)
      setEditingId(null)
      setEditForm({})
    } catch (error) {
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
    const newPersona: Persona = {
      id: `persona-${Date.now()}`,
      name: 'New Persona',
      avatar: '🤖',
      avatarType: 'emoji' as const,
      avatarUrl: undefined,
      systemPrompt: '',
      greeting: 'Hello! I\'m your new AI assistant. How can I help you today?',
      description: 'Custom AI personality',
      category: 'Custom',
      isActive: false
    }
    setEditingId(newPersona.id)
    setEditForm(newPersona)
    setPersonas(prev => [...prev, newPersona])
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this persona?')) {
      setPersonas(prev => prev.filter(p => p.id !== id))
      toast.success('Persona deleted')
    }
  }

  const handleToggleActive = (id: string) => {
    setPersonas(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const handleDuplicate = (persona: Persona) => {
    const newPersona: Persona = {
      ...persona,
      id: `persona-${Date.now()}`,
      name: `${persona.name} (Copy)`,
      isActive: false
    }
    setPersonas(prev => [...prev, newPersona])
    toast.success('Persona duplicated')
  }

  const categoryColors: Record<string, string> = {
    'Business': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Psychology': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Engineering': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Productivity': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Custom': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Persona Management</h1>
          <p className="text-white/80">Configure AI chatbot personalities and prompts</p>
        </div>
        
        <Button onClick={handleCreate} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Persona
        </Button>
      </div>

      {/* Personas Grid */}
      <div className="grid gap-6">
        {personas.map((persona) => {
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
                          onClick={() => handleToggleActive(persona.id)}
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          {persona.isActive ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDelete(persona.id)}
                          variant="outline"
                          size="sm"
                          className="glass text-red-400 border-red-400/20 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                        <option value="Custom">Custom</option>
                      </select>
                    ) : (
                      <Badge className={`${categoryColors[persona.category]} px-3 py-1`}>
                        {persona.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Status</label>
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
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {!isEditing && (
                <div className="p-6 bg-white/5 border-t border-white/10">
                  <h3 className="text-white font-medium mb-3">Preview Chat</h3>
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
                        <p className="text-white/60 text-sm">{persona.name}</p>
                        <p className="text-white/90 mt-1">{persona.greeting}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

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
      </motion.div>
    </div>
  )
}