'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Folder, FileText, Image, Video, Music, File,
  Upload, Download, Share2, Star, Search, Filter,
  Grid3X3, List, MoreVertical, Edit3, Trash2, Copy,
  Lock, Unlock, Users, Clock, Eye, Tag, Archive,
  RefreshCw, Settings, Plus, FolderPlus, Move,
  Calendar, Target, Zap, AlertCircle, Shield,
  Database, Code, Layers, Globe, Link2, Heart
} from 'lucide-react'
import { toast } from 'sonner'

interface Resource {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'dataset' | 'template' | 'model' | 'code'
  size: string
  owner: string
  sharedWith: string[]
  permissions: {
    canView: boolean
    canEdit: boolean
    canShare: boolean
    canDelete: boolean
  }
  metadata: {
    createdAt: string
    modifiedAt: string
    version: string
    tags: string[]
    description?: string
  }
  status: 'active' | 'archived' | 'draft' | 'processing'
  isStarred: boolean
  isPublic: boolean
  folder?: string
  thumbnail?: string
  analytics: {
    views: number
    downloads: number
    shares: number
    lastAccessed: string
  }
}

interface Folder {
  id: string
  name: string
  description?: string
  color: string
  itemCount: number
  isShared: boolean
  permissions: 'public' | 'team' | 'private'
  createdAt: string
  owner: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'res-1',
      name: 'Brand Voice Guidelines',
      type: 'document',
      size: '2.4 MB',
      owner: 'Sarah Johnson',
      sharedWith: ['team-marketing', 'team-content'],
      permissions: {
        canView: true,
        canEdit: true,
        canShare: true,
        canDelete: false
      },
      metadata: {
        createdAt: '2024-01-10',
        modifiedAt: '2024-01-15',
        version: '2.1',
        tags: ['branding', 'guidelines', 'voice'],
        description: 'Comprehensive brand voice and tone guidelines for all communications'
      },
      status: 'active',
      isStarred: true,
      isPublic: false,
      folder: 'brand-assets',
      analytics: {
        views: 127,
        downloads: 23,
        shares: 8,
        lastAccessed: '2 hours ago'
      }
    },
    {
      id: 'res-2',
      name: 'Customer Support Templates',
      type: 'template',
      size: '856 KB',
      owner: 'Mike Wilson',
      sharedWith: ['team-support'],
      permissions: {
        canView: true,
        canEdit: false,
        canShare: true,
        canDelete: false
      },
      metadata: {
        createdAt: '2024-01-08',
        modifiedAt: '2024-01-15',
        version: '1.5',
        tags: ['support', 'templates', 'customer-service'],
        description: 'Ready-to-use templates for customer support responses'
      },
      status: 'active',
      isStarred: false,
      isPublic: true,
      folder: 'templates',
      analytics: {
        views: 89,
        downloads: 45,
        shares: 12,
        lastAccessed: '1 hour ago'
      }
    },
    {
      id: 'res-3',
      name: 'Product Training Dataset',
      type: 'dataset',
      size: '12.8 MB',
      owner: 'John Smith',
      sharedWith: ['team-ai', 'team-dev'],
      permissions: {
        canView: true,
        canEdit: true,
        canShare: false,
        canDelete: true
      },
      metadata: {
        createdAt: '2024-01-05',
        modifiedAt: '2024-01-14',
        version: '3.0',
        tags: ['dataset', 'training', 'ai', 'machine-learning'],
        description: 'Curated dataset for product recommendation AI training'
      },
      status: 'processing',
      isStarred: true,
      isPublic: false,
      folder: 'ai-resources',
      analytics: {
        views: 34,
        downloads: 8,
        shares: 3,
        lastAccessed: '3 hours ago'
      }
    },
    {
      id: 'res-4',
      name: 'Marketing Campaign Assets',
      type: 'image',
      size: '45.2 MB',
      owner: 'Emily Davis',
      sharedWith: ['team-marketing', 'team-design'],
      permissions: {
        canView: true,
        canEdit: true,
        canShare: true,
        canDelete: false
      },
      metadata: {
        createdAt: '2024-01-12',
        modifiedAt: '2024-01-15',
        version: '1.2',
        tags: ['marketing', 'design', 'campaign', 'assets'],
        description: 'Visual assets for Q1 2024 marketing campaigns'
      },
      status: 'active',
      isStarred: false,
      isPublic: false,
      folder: 'marketing',
      analytics: {
        views: 156,
        downloads: 67,
        shares: 23,
        lastAccessed: '30 minutes ago'
      }
    },
    {
      id: 'res-5',
      name: 'AI Model Configurations',
      type: 'code',
      size: '3.1 MB',
      owner: 'Alex Chen',
      sharedWith: ['team-ai'],
      permissions: {
        canView: true,
        canEdit: true,
        canShare: false,
        canDelete: true
      },
      metadata: {
        createdAt: '2024-01-03',
        modifiedAt: '2024-01-13',
        version: '4.2',
        tags: ['ai', 'configuration', 'models', 'code'],
        description: 'Configuration files and scripts for AI model deployment'
      },
      status: 'active',
      isStarred: true,
      isPublic: false,
      folder: 'ai-resources',
      analytics: {
        views: 78,
        downloads: 19,
        shares: 5,
        lastAccessed: '1 day ago'
      }
    }
  ])

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 'brand-assets',
      name: 'Brand Assets',
      description: 'All brand-related materials and guidelines',
      color: 'purple',
      itemCount: 12,
      isShared: true,
      permissions: 'team',
      createdAt: '2023-12-01',
      owner: 'Sarah Johnson'
    },
    {
      id: 'templates',
      name: 'Templates',
      description: 'Reusable templates for various purposes',
      color: 'blue',
      itemCount: 28,
      isShared: true,
      permissions: 'public',
      createdAt: '2023-12-05',
      owner: 'Mike Wilson'
    },
    {
      id: 'ai-resources',
      name: 'AI Resources',
      description: 'AI models, datasets, and configurations',
      color: 'green',
      itemCount: 15,
      isShared: false,
      permissions: 'private',
      createdAt: '2023-12-10',
      owner: 'John Smith'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing materials and campaign assets',
      color: 'orange',
      itemCount: 34,
      isShared: true,
      permissions: 'team',
      createdAt: '2023-12-15',
      owner: 'Emily Davis'
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'popularity'>('date')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const availableTags = Array.from(new Set(resources.flatMap(r => r.metadata.tags)))

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.metadata.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = !selectedFolder || resource.folder === selectedFolder
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => resource.metadata.tags.includes(tag))
    
    return matchesSearch && matchesFolder && matchesTags
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.metadata.modifiedAt).getTime() - new Date(a.metadata.modifiedAt).getTime()
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size)
      case 'popularity':
        return b.analytics.views - a.analytics.views
      default:
        return 0
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newResource: Resource = {
          id: `res-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: getFileType(file.type),
          size: formatFileSize(file.size),
          owner: 'You',
          sharedWith: [],
          permissions: {
            canView: true,
            canEdit: true,
            canShare: true,
            canDelete: true
          },
          metadata: {
            createdAt: new Date().toISOString().split('T')[0],
            modifiedAt: new Date().toISOString().split('T')[0],
            version: '1.0',
            tags: [],
            description: `Uploaded file: ${file.name}`
          },
          status: 'active',
          isStarred: false,
          isPublic: false,
          folder: selectedFolder || undefined,
          analytics: {
            views: 0,
            downloads: 0,
            shares: 0,
            lastAccessed: 'just now'
          }
        }
        
        setResources(prev => [newResource, ...prev])
      }
      
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileType = (mimeType: string): Resource['type'] => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('text/') || mimeType.includes('document')) return 'document'
    return 'document'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'image': return Image
      case 'video': return Video
      case 'audio': return Music
      case 'dataset': return Database
      case 'template': return Copy
      case 'model': return Zap
      case 'code': return Code
      default: return File
    }
  }

  const getFolderColor = (color: string) => {
    switch (color) {
      case 'purple': return 'text-purple-400 bg-purple-500/20'
      case 'blue': return 'text-blue-400 bg-blue-500/20'
      case 'green': return 'text-green-400 bg-green-500/20'
      case 'orange': return 'text-orange-400 bg-orange-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'processing': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'draft': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'archived': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const handleToggleStar = (resourceId: string) => {
    setResources(prev => prev.map(resource =>
      resource.id === resourceId ? { ...resource, isStarred: !resource.isStarred } : resource
    ))
  }

  const handleDeleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(resource => resource.id !== resourceId))
    toast.success('Resource deleted')
  }

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const selectedFolderData = folders.find(f => f.id === selectedFolder)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Shared Resources</h1>
          <p className="text-white/80">Manage and collaborate on team files and assets</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
            <Folder className="mr-1 h-3 w-3" />
            {filteredResources.length} Resources
          </Badge>
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
            <Users className="mr-1 h-3 w-3" />
            {folders.filter(f => f.isShared).length} Shared Folders
          </Badge>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-strong p-4 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and filters */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="input-glass pl-10 w-64"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-glass"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              className="glass text-white border-white/20"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <input
              type="file"
              id="file-upload"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button className="btn-primary cursor-pointer" disabled={isUploading}>
                {isUploading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </label>
            
            <Button variant="outline" className="glass text-white border-white/20">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>
        </div>
        
        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="h-4 w-4 text-white/60" />
              <span className="text-white/80 text-sm">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-green text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="space-y-4">
          <div className="glass-strong p-4 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Folders</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  !selectedFolder ? 'bg-primary-green/20 text-primary-green' : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Folder className="h-5 w-5" />
                  <span>All Resources</span>
                </div>
              </button>
              
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedFolder === folder.id ? 'bg-primary-green/20 text-primary-green' : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Folder className={`h-5 w-5 ${getFolderColor(folder.color)}`} />
                      <div>
                        <p className="font-medium">{folder.name}</p>
                        <p className="text-xs text-white/60">{folder.itemCount} items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {folder.isShared && (
                        <Users className="h-3 w-3 text-white/60" />
                      )}
                      {folder.permissions === 'public' ? (
                        <Unlock className="h-3 w-3 text-white/60" />
                      ) : (
                        <Lock className="h-3 w-3 text-white/60" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Grid/List */}
        <div className="lg:col-span-3">
          {selectedFolderData && (
            <div className="glass-strong p-4 rounded-2xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedFolderData.name}</h2>
                  <p className="text-white/60">{selectedFolderData.description}</p>
                </div>
                <Badge className={getFolderColor(selectedFolderData.color)}>
                  {selectedFolderData.permissions}
                </Badge>
              </div>
            </div>
          )}
          
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedResources.map((resource) => {
                const FileIcon = getFileIcon(resource.type)
                
                return (
                  <motion.div
                    key={resource.id}
                    className="glass-strong p-4 rounded-2xl hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-8 w-8 text-primary-blue" />
                        <div>
                          <h4 className="text-white font-medium text-sm">{resource.name}</h4>
                          <p className="text-white/60 text-xs">{resource.size}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleStar(resource.id)}
                          className="text-white/60 hover:text-yellow-400 transition-colors"
                        >
                          <Star className={`h-4 w-4 ${resource.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                        </button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>By {resource.owner}</span>
                        <Badge className={getStatusColor(resource.status)}>
                          {resource.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{resource.analytics.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{resource.analytics.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-3 w-3" />
                          <span>{resource.analytics.shares}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} className="bg-white/10 text-white/70 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.metadata.tags.length > 3 && (
                        <Badge className="bg-white/10 text-white/70 text-xs">
                          +{resource.metadata.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 glass text-white border-white/20">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="glass text-white border-white/20">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="glass text-white border-white/20">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="glass-strong rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Resources</h3>
              </div>
              
              <div className="divide-y divide-white/10">
                {sortedResources.map((resource) => {
                  const FileIcon = getFileIcon(resource.type)
                  
                  return (
                    <div key={resource.id} className="p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileIcon className="h-6 w-6 text-primary-blue" />
                          
                          <div>
                            <h4 className="text-white font-medium">{resource.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-white/60">
                              <span>{resource.size}</span>
                              <span>By {resource.owner}</span>
                              <span>Modified {resource.metadata.modifiedAt}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3 text-xs text-white/60">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{resource.analytics.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="h-3 w-3" />
                              <span>{resource.analytics.downloads}</span>
                            </div>
                          </div>
                          
                          <Badge className={getStatusColor(resource.status)}>
                            {resource.status}
                          </Badge>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleToggleStar(resource.id)}
                              className="text-white/60 hover:text-yellow-400 transition-colors"
                            >
                              <Star className={`h-4 w-4 ${resource.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                            </button>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {sortedResources.length === 0 && (
            <div className="glass-strong p-12 rounded-2xl text-center">
              <Folder className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No resources found</h3>
              <p className="text-white/60 mb-4">
                {searchQuery || selectedTags.length > 0 
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first file to get started'
                }
              </p>
              {!searchQuery && selectedTags.length === 0 && (
                <label htmlFor="file-upload">
                  <Button className="btn-primary cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}