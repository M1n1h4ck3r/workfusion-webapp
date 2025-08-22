'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Palette, Globe, Settings, Users, Crown, Shield,
  Upload, Download, Copy, Eye, Monitor, Smartphone,
  Tablet, Code, Layers, Zap, Star, Edit3, Save,
  RefreshCw, Link2, Paintbrush, Type, Image as ImageIcon,
  Layout, Database, Cloud, Lock, Unlock, Plus,
  Trash2, MoreVertical, CheckCircle2, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface WhiteLabelConfig {
  id: string
  name: string
  domain: string
  status: 'active' | 'pending' | 'inactive'
  branding: {
    logo: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    customCSS: string
  }
  features: {
    chat: boolean
    tts: boolean
    whatsapp: boolean
    analytics: boolean
    api: boolean
    customDomain: boolean
  }
  usage: {
    users: number
    apiCalls: number
    storage: number
    bandwidth: number
  }
  limits: {
    users: number
    apiCalls: number
    storage: number
    bandwidth: number
  }
  createdAt: string
  plan: 'starter' | 'professional' | 'enterprise'
}

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  owner: string
  email: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'trial'
  users: number
  usage: {
    apiCalls: number
    storage: number
    bandwidth: number
  }
  createdAt: string
  trialEndsAt?: string
}

interface CustomTheme {
  id: string
  name: string
  description: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  typography: {
    fontFamily: string
    headingSize: string
    bodySize: string
    lineHeight: string
  }
  isActive: boolean
  isPublic: boolean
}

export default function WhiteLabelPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'tenants' | 'themes' | 'settings'>('overview')
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>({
    id: 'wl-1',
    name: 'My AI Platform',
    domain: 'my-ai-platform.com',
    status: 'active',
    branding: {
      logo: '/api/placeholder/200/60',
      primaryColor: '#10B981',
      secondaryColor: '#3B82F6', 
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      customCSS: ''
    },
    features: {
      chat: true,
      tts: true,
      whatsapp: false,
      analytics: true,
      api: true,
      customDomain: true
    },
    usage: {
      users: 1247,
      apiCalls: 89532,
      storage: 2.4,
      bandwidth: 15.8
    },
    limits: {
      users: 5000,
      apiCalls: 1000000,
      storage: 50,
      bandwidth: 500
    },
    createdAt: '2024-01-01',
    plan: 'enterprise'
  })

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'tenant-1',
      name: 'Acme Corporation',
      slug: 'acme-corp',
      domain: 'ai.acme.com',
      owner: 'John Smith',
      email: 'john@acme.com',
      plan: 'enterprise',
      status: 'active',
      users: 245,
      usage: {
        apiCalls: 45230,
        storage: 12.5,
        bandwidth: 87.3
      },
      createdAt: '2024-01-05'
    },
    {
      id: 'tenant-2',
      name: 'TechStart Inc',
      slug: 'techstart',
      owner: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      plan: 'professional',
      status: 'active',
      users: 89,
      usage: {
        apiCalls: 23450,
        storage: 5.2,
        bandwidth: 34.1
      },
      createdAt: '2024-01-10'
    },
    {
      id: 'tenant-3',
      name: 'StartupXYZ',
      slug: 'startupxyz',
      owner: 'Mike Wilson',
      email: 'mike@startupxyz.com',
      plan: 'starter',
      status: 'trial',
      users: 12,
      usage: {
        apiCalls: 1250,
        storage: 0.8,
        bandwidth: 3.2
      },
      createdAt: '2024-01-15',
      trialEndsAt: '2024-02-15'
    }
  ])

  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([
    {
      id: 'theme-1',
      name: 'Modern Dark',
      description: 'Sleek dark theme with green accents',
      preview: '/api/placeholder/300/200',
      colors: {
        primary: '#10B981',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB'
      },
      typography: {
        fontFamily: 'Inter',
        headingSize: '2rem',
        bodySize: '1rem',
        lineHeight: '1.6'
      },
      isActive: true,
      isPublic: false
    },
    {
      id: 'theme-2',
      name: 'Corporate Blue',
      description: 'Professional blue theme for enterprise',
      preview: '/api/placeholder/300/200',
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#10B981',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#1E293B'
      },
      typography: {
        fontFamily: 'Roboto',
        headingSize: '1.8rem',
        bodySize: '0.95rem',
        lineHeight: '1.5'
      },
      isActive: false,
      isPublic: true
    }
  ])

  const [isCustomizing, setIsCustomizing] = useState(false)
  const [newTenantName, setNewTenantName] = useState('')
  const [newTenantSlug, setNewTenantSlug] = useState('')
  const [newTenantEmail, setNewTenantEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('starter')

  const handleCreateTenant = async () => {
    if (!newTenantName || !newTenantSlug || !newTenantEmail) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCustomizing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: newTenantName,
        slug: newTenantSlug,
        owner: newTenantName,
        email: newTenantEmail,
        plan: selectedPlan,
        status: 'trial',
        users: 0,
        usage: {
          apiCalls: 0,
          storage: 0,
          bandwidth: 0
        },
        createdAt: new Date().toISOString().split('T')[0],
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      setTenants(prev => [newTenant, ...prev])
      setNewTenantName('')
      setNewTenantSlug('')
      setNewTenantEmail('')
      toast.success('Tenant created successfully')
    } catch (error) {
      toast.error('Failed to create tenant')
    } finally {
      setIsCustomizing(false)
    }
  }

  const handleColorChange = (colorType: keyof typeof whiteLabelConfig.branding, color: string) => {
    setWhiteLabelConfig(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [colorType]: color
      }
    }))
  }

  const handleToggleFeature = (feature: keyof typeof whiteLabelConfig.features) => {
    setWhiteLabelConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }))
  }

  const handleActivateTheme = (themeId: string) => {
    setCustomThemes(prev => prev.map(theme => ({
      ...theme,
      isActive: theme.id === themeId
    })))
    toast.success('Theme activated')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'pending': case 'trial': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'inactive': case 'suspended': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'professional': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'starter': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const formatStorage = (gb: number) => {
    return `${gb.toFixed(1)} GB`
  }

  const formatBandwidth = (gb: number) => {
    return `${gb.toFixed(1)} GB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">White-Label & Multi-Tenant</h1>
          <p className="text-white/80">Customize branding and manage multiple tenant instances</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className={getStatusColor(whiteLabelConfig.status)}>
            <Crown className="mr-1 h-3 w-3" />
            {whiteLabelConfig.status}
          </Badge>
          <Badge className={getPlanColor(whiteLabelConfig.plan)}>
            <Shield className="mr-1 h-3 w-3" />
            {whiteLabelConfig.plan}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-primary-green" />
            <span className="text-2xl font-bold text-white">{whiteLabelConfig.usage.users.toLocaleString()}</span>
          </div>
          <p className="text-white/60 text-sm">Total Users</p>
          <Progress value={(whiteLabelConfig.usage.users / whiteLabelConfig.limits.users) * 100} className="h-1 mt-2" />
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-8 w-8 text-primary-yellow" />
            <span className="text-2xl font-bold text-white">{whiteLabelConfig.usage.apiCalls.toLocaleString()}</span>
          </div>
          <p className="text-white/60 text-sm">API Calls</p>
          <Progress value={(whiteLabelConfig.usage.apiCalls / whiteLabelConfig.limits.apiCalls) * 100} className="h-1 mt-2" />
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Database className="h-8 w-8 text-primary-blue" />
            <span className="text-2xl font-bold text-white">{formatStorage(whiteLabelConfig.usage.storage)}</span>
          </div>
          <p className="text-white/60 text-sm">Storage Used</p>
          <Progress value={(whiteLabelConfig.usage.storage / whiteLabelConfig.limits.storage) * 100} className="h-1 mt-2" />
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Cloud className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">{formatBandwidth(whiteLabelConfig.usage.bandwidth)}</span>
          </div>
          <p className="text-white/60 text-sm">Bandwidth Used</p>
          <Progress value={(whiteLabelConfig.usage.bandwidth / whiteLabelConfig.limits.bandwidth) * 100} className="h-1 mt-2" />
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Globe },
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'tenants', label: 'Tenants', icon: Users },
          { id: 'themes', label: 'Themes', icon: Paintbrush },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'branding' | 'tenants' | 'themes' | 'settings')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary-green text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Platform Preview */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Platform Preview</h3>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: whiteLabelConfig.branding.primaryColor }}
                  >
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{whiteLabelConfig.name}</h4>
                    <p className="text-white/60 text-sm">{whiteLabelConfig.domain}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div 
                    className="h-8 rounded"
                    style={{ backgroundColor: whiteLabelConfig.branding.primaryColor }}
                  />
                  <div 
                    className="h-8 rounded"
                    style={{ backgroundColor: whiteLabelConfig.branding.secondaryColor }}
                  />
                  <div 
                    className="h-8 rounded"
                    style={{ backgroundColor: whiteLabelConfig.branding.accentColor }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-white/60" />
                  <Tablet className="h-4 w-4 text-white/60" />
                  <Smartphone className="h-4 w-4 text-white/60" />
                  <span className="text-white/60 text-xs">Responsive Design</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 glass text-white border-white/20">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" className="glass text-white border-white/20">
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Feature Status */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Feature Status</h3>
              
              <div className="space-y-3">
                {Object.entries(whiteLabelConfig.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center space-x-3">
                      {enabled ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-white capitalize">{feature.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                    <Badge className={enabled ? getStatusColor('active') : getStatusColor('inactive')}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Tenants */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Tenants</h3>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants.slice(0, 3).map((tenant) => (
                <div key={tenant.id} className="glass p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{tenant.name}</h4>
                      <p className="text-white/60 text-xs">{tenant.slug}</p>
                    </div>
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-white/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Users:</span>
                      <span className="text-white">{tenant.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span className="text-white">{tenant.usage.apiCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <Badge className={getPlanColor(tenant.plan)}>
                        {tenant.plan}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Brand Colors */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Brand Colors</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={whiteLabelConfig.branding.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20"
                    />
                    <Input
                      value={whiteLabelConfig.branding.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="input-glass flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={whiteLabelConfig.branding.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20"
                    />
                    <Input
                      value={whiteLabelConfig.branding.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="input-glass flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Accent Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={whiteLabelConfig.branding.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20"
                    />
                    <Input
                      value={whiteLabelConfig.branding.accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="input-glass flex-1"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Font Family</label>
                  <select
                    value={whiteLabelConfig.branding.fontFamily}
                    onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Logo Upload</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                    <p className="text-white/60 text-sm mb-2">Upload your logo</p>
                    <Button variant="outline" className="glass text-white border-white/20">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Configuration */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Feature Configuration</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(whiteLabelConfig.features).map(([feature, enabled]) => (
                <div key={feature} className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-white/60 text-xs">
                        {feature === 'chat' && 'AI Chat Completions'}
                        {feature === 'tts' && 'Text-to-Speech'}
                        {feature === 'whatsapp' && 'WhatsApp Integration'}
                        {feature === 'analytics' && 'Usage Analytics'}
                        {feature === 'api' && 'API Access'}
                        {feature === 'customDomain' && 'Custom Domain Support'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleToggleFeature(feature as keyof typeof whiteLabelConfig.features)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button className="btn-primary">
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tenants Tab */}
      {activeTab === 'tenants' && (
        <div className="space-y-6">
          {/* Create Tenant */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New Tenant</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                placeholder="Tenant Name"
                className="input-glass"
              />
              <Input
                value={newTenantSlug}
                onChange={(e) => setNewTenantSlug(e.target.value)}
                placeholder="tenant-slug"
                className="input-glass"
              />
              <Input
                value={newTenantEmail}
                onChange={(e) => setNewTenantEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-glass"
              />
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as 'starter' | 'professional' | 'enterprise')}
                className="input-glass"
              >
                <option value="starter">Starter Plan</option>
                <option value="professional">Professional Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>
            
            <div className="mt-4">
              <Button
                onClick={handleCreateTenant}
                disabled={isCustomizing}
                className="btn-primary"
              >
                {isCustomizing ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isCustomizing ? 'Creating...' : 'Create Tenant'}
              </Button>
            </div>
          </motion.div>

          {/* Tenants List */}
          <motion.div
            className="glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Tenant Instances</h3>
            </div>

            <div className="divide-y divide-white/10">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{tenant.name}</h4>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status}
                        </Badge>
                        <Badge className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                        {tenant.domain && (
                          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
                            <Globe className="mr-1 h-2 w-2" />
                            Custom Domain
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60 mb-3">
                        <div>
                          <span className="block">Owner</span>
                          <span className="text-white">{tenant.owner}</span>
                        </div>
                        <div>
                          <span className="block">Users</span>
                          <span className="text-white">{tenant.users}</span>
                        </div>
                        <div>
                          <span className="block">API Calls</span>
                          <span className="text-white">{tenant.usage.apiCalls.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block">Created</span>
                          <span className="text-white">{tenant.createdAt}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <span>Slug: {tenant.slug}</span>
                        <span>Storage: {formatStorage(tenant.usage.storage)}</span>
                        <span>Bandwidth: {formatBandwidth(tenant.usage.bandwidth)}</span>
                        {tenant.trialEndsAt && (
                          <span className="text-yellow-400">Trial ends: {tenant.trialEndsAt}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Custom Themes</h3>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Theme
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {customThemes.map((theme) => (
                <div key={theme.id} className="glass p-6 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">{theme.name}</h4>
                      <p className="text-white/60 text-sm">{theme.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {theme.isActive && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      )}
                      {theme.isPublic && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {Object.entries(theme.colors).map(([name, color]) => (
                      <div
                        key={name}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: color }}
                        title={name}
                      />
                    ))}
                  </div>
                  
                  <div className="text-sm text-white/60 mb-4">
                    <p>Font: {theme.typography.fontFamily}</p>
                    <p>Heading: {theme.typography.headingSize}</p>
                    <p>Body: {theme.typography.bodySize}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!theme.isActive && (
                      <Button
                        onClick={() => handleActivateTheme(theme.id)}
                        className="btn-primary flex-1"
                      >
                        Activate
                      </Button>
                    )}
                    <Button variant="outline" className="glass text-white border-white/20">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="glass text-white border-white/20">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Platform Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Platform Name</label>
                <Input
                  value={whiteLabelConfig.name}
                  onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, name: e.target.value }))}
                  className="input-glass"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Custom Domain</label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={whiteLabelConfig.domain}
                    onChange={(e) => setWhiteLabelConfig(prev => ({ ...prev, domain: e.target.value }))}
                    className="input-glass flex-1"
                  />
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Custom CSS</label>
                <textarea
                  value={whiteLabelConfig.branding.customCSS}
                  onChange={(e) => handleColorChange('customCSS', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm resize-none focus:outline-none focus:border-primary-green"
                  rows={8}
                  placeholder="/* Add your custom CSS here */"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" className="glass text-white border-white/20">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button className="btn-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}