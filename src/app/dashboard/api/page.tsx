'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Settings, Key, Globe, Shield, Webhook,
  Copy, Eye, EyeOff, RefreshCw, Plus, Trash2,
  Activity, AlertCircle, CheckCircle2, Clock,
  BarChart3, Users, Zap, Filter, Download,
  Edit3, MoreVertical, Code, Link2, Database,
  Lock, Unlock, Bell, BellOff, Calendar, Target,
  Send, TestTube, PlayCircle, CheckCircle,
  XCircle, AlertTriangle, Timer, Pause
} from 'lucide-react'
import { toast } from 'sonner'

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  usage: {
    calls: number
    tokens: number
    limit: number
  }
  status: 'active' | 'revoked' | 'expired'
  createdAt: string
  lastUsed: string
  expiresAt?: string
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'paused' | 'failed'
  secret: string
  deliveries: {
    total: number
    successful: number
    failed: number
  }
  createdAt: string
  lastDelivery?: string
}

interface APIEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  description: string
  usage: number
  responseTime: number
  uptime: number
  status: 'healthy' | 'degraded' | 'down'
}

export default function APIManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'webhooks' | 'endpoints' | 'docs'>('overview')
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key-1',
      name: 'Production API',
      key: 'wf_sk_live_abc123...',
      permissions: ['chat', 'tts', 'whatsapp', 'analytics'],
      usage: {
        calls: 15430,
        tokens: 234567,
        limit: 1000000
      },
      status: 'active',
      createdAt: '2024-01-01',
      lastUsed: '2 minutes ago'
    },
    {
      id: 'key-2', 
      name: 'Development API',
      key: 'wf_sk_test_xyz789...',
      permissions: ['chat', 'tts'],
      usage: {
        calls: 2340,
        tokens: 45678,
        limit: 100000
      },
      status: 'active',
      createdAt: '2024-01-10',
      lastUsed: '1 hour ago'
    },
    {
      id: 'key-3',
      name: 'Mobile App Key',
      key: 'wf_sk_live_def456...',
      permissions: ['chat'],
      usage: {
        calls: 8920,
        tokens: 123456,
        limit: 500000
      },
      status: 'active',
      createdAt: '2024-01-05',
      lastUsed: '30 minutes ago'
    }
  ])

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'wh-1',
      name: 'User Events',
      url: 'https://api.example.com/webhooks/users',
      events: ['user.created', 'user.updated', 'subscription.changed'],
      status: 'active',
      secret: 'whsec_abc123...',
      deliveries: {
        total: 1547,
        successful: 1534,
        failed: 13
      },
      createdAt: '2024-01-01',
      lastDelivery: '5 minutes ago'
    },
    {
      id: 'wh-2',
      name: 'Payment Notifications',
      url: 'https://billing.company.com/hooks/payments',
      events: ['payment.succeeded', 'payment.failed', 'invoice.created'],
      status: 'active',
      secret: 'whsec_xyz789...',
      deliveries: {
        total: 892,
        successful: 889,
        failed: 3
      },
      createdAt: '2024-01-05',
      lastDelivery: '1 hour ago'
    },
    {
      id: 'wh-3',
      name: 'Analytics Webhook',
      url: 'https://analytics.company.com/api/events',
      events: ['usage.updated', 'threshold.exceeded'],
      status: 'failed',
      secret: 'whsec_def456...',
      deliveries: {
        total: 245,
        successful: 198,
        failed: 47
      },
      createdAt: '2024-01-12',
      lastDelivery: '3 hours ago'
    }
  ])

  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([
    {
      id: 'ep-1',
      path: '/api/v1/chat/completions',
      method: 'POST',
      description: 'Create chat completion with AI models',
      usage: 45230,
      responseTime: 1.2,
      uptime: 99.97,
      status: 'healthy'
    },
    {
      id: 'ep-2',
      path: '/api/v1/tts/generate',
      method: 'POST', 
      description: 'Generate text-to-speech audio',
      usage: 12540,
      responseTime: 2.8,
      uptime: 99.85,
      status: 'healthy'
    },
    {
      id: 'ep-3',
      path: '/api/v1/whatsapp/send',
      method: 'POST',
      description: 'Send WhatsApp messages',
      usage: 8940,
      responseTime: 0.9,
      uptime: 98.2,
      status: 'degraded'
    },
    {
      id: 'ep-4',
      path: '/api/v1/analytics/usage',
      method: 'GET',
      description: 'Retrieve usage analytics',
      usage: 3450,
      responseTime: 0.4,
      uptime: 99.99,
      status: 'healthy'
    }
  ])

  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newWebhookName, setNewWebhookName] = useState('')
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)
  const [webhookTestResults, setWebhookTestResults] = useState<{ [key: string]: any }>({})

  const availablePermissions = [
    { id: 'chat', name: 'Chat Completions', description: 'Access to AI chat endpoints' },
    { id: 'tts', name: 'Text-to-Speech', description: 'Generate audio from text' },
    { id: 'whatsapp', name: 'WhatsApp API', description: 'Send WhatsApp messages' },
    { id: 'analytics', name: 'Analytics', description: 'Access usage analytics' },
    { id: 'webhooks', name: 'Webhooks', description: 'Manage webhook endpoints' },
    { id: 'billing', name: 'Billing', description: 'Access billing information' }
  ]

  const availableEvents = [
    'user.created', 'user.updated', 'user.deleted',
    'subscription.created', 'subscription.changed', 'subscription.cancelled',
    'payment.succeeded', 'payment.failed', 'invoice.created',
    'usage.updated', 'threshold.exceeded', 'quota.reached'
  ]

  const handleCreateAPIKey = async () => {
    if (!newKeyName || selectedPermissions.length === 0) {
      toast.error('Please provide a name and select permissions')
      return
    }

    setIsCreatingKey(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: newKeyName,
        key: `wf_sk_live_${Math.random().toString(36).substring(2, 15)}...`,
        permissions: selectedPermissions,
        usage: {
          calls: 0,
          tokens: 0,
          limit: 100000
        },
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      }
      
      setApiKeys(prev => [newKey, ...prev])
      setNewKeyName('')
      setSelectedPermissions([])
      toast.success('API key created successfully')
    } catch (error) {
      toast.error('Failed to create API key')
    } finally {
      setIsCreatingKey(false)
    }
  }

  const handleCreateWebhook = async () => {
    if (!newWebhookName || !newWebhookUrl || selectedEvents.length === 0) {
      toast.error('Please fill all fields and select events')
      return
    }

    setIsCreatingWebhook(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newWebhook: Webhook = {
        id: `wh-${Date.now()}`,
        name: newWebhookName,
        url: newWebhookUrl,
        events: selectedEvents,
        status: 'active',
        secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
        deliveries: {
          total: 0,
          successful: 0,
          failed: 0
        },
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setWebhooks(prev => [newWebhook, ...prev])
      setNewWebhookName('')
      setNewWebhookUrl('')
      setSelectedEvents([])
      toast.success('Webhook created successfully')
    } catch (error) {
      toast.error('Failed to create webhook')
    } finally {
      setIsCreatingWebhook(false)
    }
  }

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ))
    toast.success('API key revoked')
  }

  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === webhookId 
        ? { ...webhook, status: webhook.status === 'active' ? 'paused' as const : 'active' as const }
        : webhook
    ))
  }

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate webhook test
      const testResult = {
        status: Math.random() > 0.3 ? 'success' : 'failed',
        responseTime: Math.floor(Math.random() * 500) + 100,
        statusCode: Math.random() > 0.3 ? 200 : Math.random() > 0.5 ? 404 : 500,
        timestamp: new Date().toISOString(),
        testPayload: {
          event: 'test.webhook',
          data: { message: 'This is a test webhook delivery' }
        }
      }
      
      setWebhookTestResults(prev => ({ ...prev, [webhookId]: testResult }))
      
      if (testResult.status === 'success') {
        toast.success(`Webhook test successful (${testResult.responseTime}ms)`)
      } else {
        toast.error(`Webhook test failed (Status: ${testResult.statusCode})`)
      }
    } catch (error) {
      toast.error('Failed to test webhook')
    } finally {
      setTestingWebhook(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'paused': case 'degraded': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'revoked': case 'failed': case 'down': case 'expired': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-blue-400 bg-blue-500/20'
      case 'POST': return 'text-green-400 bg-green-500/20'
      case 'PUT': return 'text-yellow-400 bg-yellow-500/20'
      case 'DELETE': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const totalCalls = apiKeys.reduce((sum, key) => sum + key.usage.calls, 0)
  const totalTokens = apiKeys.reduce((sum, key) => sum + key.usage.tokens, 0)
  const activeKeys = apiKeys.filter(key => key.status === 'active').length
  const activeWebhooks = webhooks.filter(wh => wh.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Management</h1>
          <p className="text-white/80">Manage API keys, webhooks, and monitor endpoint performance</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Key className="mr-1 h-3 w-3" />
            {activeKeys} Active Keys
          </Badge>
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
            <Webhook className="mr-1 h-3 w-3" />
            {activeWebhooks} Webhooks
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
            <BarChart3 className="h-8 w-8 text-primary-green" />
            <span className="text-2xl font-bold text-white">{totalCalls.toLocaleString()}</span>
          </div>
          <p className="text-white/60 text-sm">Total API Calls</p>
          <p className="text-green-400 text-xs">Last 30 days</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-8 w-8 text-primary-yellow" />
            <span className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</span>
          </div>
          <p className="text-white/60 text-sm">Tokens Used</p>
          <p className="text-yellow-400 text-xs">Last 30 days</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Globe className="h-8 w-8 text-primary-blue" />
            <span className="text-2xl font-bold text-white">99.7%</span>
          </div>
          <p className="text-white/60 text-sm">API Uptime</p>
          <p className="text-blue-400 text-xs">Last 30 days</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">1.4s</span>
          </div>
          <p className="text-white/60 text-sm">Avg Response</p>
          <p className="text-red-400 text-xs">Last 24 hours</p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
          { id: 'endpoints', label: 'Endpoints', icon: Globe },
          { id: 'docs', label: 'Documentation', icon: Code }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'keys' | 'webhooks' | 'endpoints' | 'docs')}
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
            {/* API Usage Chart */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">API Usage Trends</h3>
              <div className="space-y-4">
                {[
                  { endpoint: 'Chat Completions', calls: 45230, percentage: 78 },
                  { endpoint: 'Text-to-Speech', calls: 12540, percentage: 22 },
                  { endpoint: 'WhatsApp API', calls: 8940, percentage: 15 },
                  { endpoint: 'Analytics', calls: 3450, percentage: 6 }
                ].map((item) => (
                  <div key={item.endpoint} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">{item.endpoint}</span>
                      <span className="text-white">{item.calls.toLocaleString()} calls</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent API Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'New API key created', key: 'Mobile App Key', time: '2 hours ago' },
                  { action: 'Webhook delivery failed', key: 'Analytics Webhook', time: '3 hours ago' },
                  { action: 'Rate limit exceeded', key: 'Development API', time: '5 hours ago' },
                  { action: 'API key regenerated', key: 'Production API', time: '1 day ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 glass rounded-lg">
                    <Activity className="h-4 w-4 text-primary-green" />
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-white/60 text-xs">{activity.key} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Create API Key */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New API Key</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Key Name</label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter API key name"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission.id} className="flex items-center space-x-2 p-2 glass rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(prev => [...prev, permission.id])
                            } else {
                              setSelectedPermissions(prev => prev.filter(p => p !== permission.id))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-white text-sm">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleCreateAPIKey}
                  disabled={isCreatingKey}
                  className="btn-primary w-full"
                >
                  {isCreatingKey ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  {isCreatingKey ? 'Creating...' : 'Create API Key'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* API Keys List */}
          <motion.div
            className="glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">API Keys</h3>
            </div>

            <div className="divide-y divide-white/10">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{apiKey.name}</h4>
                        <Badge className={getStatusColor(apiKey.status)}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <code className="text-white/60 text-sm font-mono bg-white/5 px-2 py-1 rounded">
                          {showApiKey === apiKey.id ? apiKey.key : apiKey.key.replace(/(?<=.{8}).*(?=.{4})/g, '••••••••••••')}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          className="text-white/60 hover:text-white"
                        >
                          {showApiKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="text-white/60 hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                        <div>
                          <span className="block">Calls</span>
                          <span className="text-white">{apiKey.usage.calls.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block">Tokens</span>
                          <span className="text-white">{apiKey.usage.tokens.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block">Created</span>
                          <span className="text-white">{apiKey.createdAt}</span>
                        </div>
                        <div>
                          <span className="block">Last Used</span>
                          <span className="text-white">{apiKey.lastUsed}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} className="bg-primary-green/20 text-primary-green text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
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
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Usage Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                      <span>Usage</span>
                      <span>{Math.round((apiKey.usage.calls / apiKey.usage.limit) * 100)}% of limit</span>
                    </div>
                    <Progress value={(apiKey.usage.calls / apiKey.usage.limit) * 100} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          {/* Create Webhook */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Create New Webhook</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Webhook Name</label>
                  <Input
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                    placeholder="Enter webhook name"
                    className="input-glass"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Endpoint URL</label>
                  <Input
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://your-site.com/webhook"
                    className="input-glass"
                  />
                </div>
                
                <Button
                  onClick={handleCreateWebhook}
                  disabled={isCreatingWebhook}
                  className="btn-primary w-full"
                >
                  {isCreatingWebhook ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Webhook className="mr-2 h-4 w-4" />
                  )}
                  {isCreatingWebhook ? 'Creating...' : 'Create Webhook'}
                </Button>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Events to Subscribe</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableEvents.map((event) => (
                    <label key={event} className="flex items-center space-x-2 p-2 glass rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents(prev => [...prev, event])
                          } else {
                            setSelectedEvents(prev => prev.filter(e => e !== event))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-white text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Webhooks List */}
          <motion.div
            className="glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Webhooks</h3>
            </div>

            <div className="divide-y divide-white/10">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{webhook.name}</h4>
                        <Badge className={getStatusColor(webhook.status)}>
                          {webhook.status}
                        </Badge>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-3">{webhook.url}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60 mb-3">
                        <div>
                          <span className="block">Total Deliveries</span>
                          <span className="text-white">{webhook.deliveries.total}</span>
                        </div>
                        <div>
                          <span className="block">Successful</span>
                          <span className="text-green-400">{webhook.deliveries.successful}</span>
                        </div>
                        <div>
                          <span className="block">Failed</span>
                          <span className="text-red-400">{webhook.deliveries.failed}</span>
                        </div>
                        <div>
                          <span className="block">Last Delivery</span>
                          <span className="text-white">{webhook.lastDelivery || 'Never'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 3).map((event) => (
                          <Badge key={event} className="bg-primary-blue/20 text-primary-blue text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 3 && (
                          <Badge className="bg-white/10 text-white/70 text-xs">
                            +{webhook.events.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook.id)}
                        disabled={testingWebhook === webhook.id}
                        className="text-white/60 hover:text-white"
                        title="Test webhook"
                      >
                        {testingWebhook === webhook.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <TestTube className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleWebhook(webhook.id)}
                        className="text-white/60 hover:text-white"
                        title={webhook.status === 'active' ? 'Pause webhook' : 'Activate webhook'}
                      >
                        {webhook.status === 'active' ? <Pause className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                        title="Edit webhook"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        title="Delete webhook"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Test Results */}
                  {webhookTestResults[webhook.id] && (
                    <div className="mt-4 p-3 glass rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">Last Test Result</span>
                        <div className="flex items-center space-x-2">
                          {webhookTestResults[webhook.id].status === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`text-xs ${
                            webhookTestResults[webhook.id].status === 'success' 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {webhookTestResults[webhook.id].status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
                        <div>
                          <span className="block">Response Time</span>
                          <span className="text-white">{webhookTestResults[webhook.id].responseTime}ms</span>
                        </div>
                        <div>
                          <span className="block">Status Code</span>
                          <span className="text-white">{webhookTestResults[webhook.id].statusCode}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs text-white/60">Test Payload:</span>
                        <pre className="text-xs text-white/80 mt-1 overflow-x-auto">
                          {JSON.stringify(webhookTestResults[webhook.id].testPayload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Success Rate */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                      <span>Success Rate</span>
                      <span>{Math.round((webhook.deliveries.successful / webhook.deliveries.total) * 100) || 0}%</span>
                    </div>
                    <Progress value={(webhook.deliveries.successful / webhook.deliveries.total) * 100 || 0} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">API Endpoints</h3>
            </div>

            <div className="divide-y divide-white/10">
              {apiEndpoints.map((endpoint) => (
                <div key={endpoint.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-white font-mono">{endpoint.path}</code>
                        <Badge className={getStatusColor(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-3">{endpoint.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                        <div>
                          <span className="block">Usage</span>
                          <span className="text-white">{endpoint.usage.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block">Response Time</span>
                          <span className="text-white">{endpoint.responseTime}s</span>
                        </div>
                        <div>
                          <span className="block">Uptime</span>
                          <span className="text-white">{endpoint.uptime}%</span>
                        </div>
                        <div>
                          <span className="block">Rate Limit</span>
                          <span className="text-white">1000/min</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">API Documentation</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">Quick Start Guide</h4>
                  <p className="text-white/60 text-sm mb-3">Get started with the WorkFusion API in minutes</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Link2 className="mr-2 h-4 w-4" />
                    View Guide
                  </Button>
                </div>
                
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">API Reference</h4>
                  <p className="text-white/60 text-sm mb-3">Complete API reference documentation</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Code className="mr-2 h-4 w-4" />
                    Browse API
                  </Button>
                </div>
                
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">SDKs & Libraries</h4>
                  <p className="text-white/60 text-sm mb-3">Official SDKs for popular programming languages</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Download className="mr-2 h-4 w-4" />
                    Download SDKs
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">Authentication</h4>
                  <p className="text-white/60 text-sm mb-3">Learn how to authenticate your API requests</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Shield className="mr-2 h-4 w-4" />
                    Auth Guide
                  </Button>
                </div>
                
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">Rate Limits</h4>
                  <p className="text-white/60 text-sm mb-3">Understanding API rate limits and best practices</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Clock className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>
                
                <div className="p-4 glass rounded-lg">
                  <h4 className="text-white font-medium mb-2">Webhooks Guide</h4>
                  <p className="text-white/60 text-sm mb-3">Set up and manage webhook endpoints</p>
                  <Button variant="outline" className="glass text-white border-white/20">
                    <Webhook className="mr-2 h-4 w-4" />
                    Setup Webhooks
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}