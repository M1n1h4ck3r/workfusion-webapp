'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain, Zap, TrendingUp, TrendingDown, Clock, DollarSign,
  CheckCircle2, XCircle, AlertTriangle, Settings, Plus, Edit3,
  Trash2, RefreshCw, Activity, BarChart3, Target, Cpu, Globe,
  Shield, Play, Pause, Route, Layers, Monitor, Gauge
} from 'lucide-react'
import { toast } from 'sonner'
import { aiModelManager, AIModel, ModelPerformance, ModelUsage } from '@/services/ai-model-manager'

export default function AIModelManagementPage() {
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'routing' | 'config'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [healthStatus, setHealthStatus] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    loadModels()
    loadHealthStatus()
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadModels()
      loadHealthStatus()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadModels = async () => {
    try {
      const modelList = await aiModelManager.getAllModels()
      setModels(modelList)
      if (!selectedModel && modelList.length > 0) {
        setSelectedModel(modelList[0])
      }
    } catch (error) {
      toast.error('Failed to load AI models')
    } finally {
      setIsLoading(false)
    }
  }

  const loadHealthStatus = async () => {
    try {
      const status = await aiModelManager.checkModelHealth()
      setHealthStatus(status)
    } catch (error) {
      console.error('Failed to check model health:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'training': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'deprecated': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getHealthIcon = (modelId: string) => {
    const isHealthy = healthStatus.get(modelId)
    if (isHealthy === undefined) return <Clock className="h-4 w-4 text-yellow-400" />
    return isHealthy ? 
      <CheckCircle2 className="h-4 w-4 text-green-400" /> : 
      <XCircle className="h-4 w-4 text-red-400" />
  }

  const handleToggleModel = async (modelId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await aiModelManager.updateModelStatus(modelId, newStatus)
      await loadModels()
      toast.success(`Model ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
    } catch (error) {
      toast.error('Failed to update model status')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-white/80">Loading AI models...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Model Management</h1>
          <p className="text-white/80">Manage and monitor your AI models with intelligent routing</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadHealthStatus}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Models</p>
              <p className="text-2xl font-bold text-white mt-1">{models.length}</p>
            </div>
            <Brain className="h-8 w-8 text-primary-green" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Models</p>
              <p className="text-2xl font-bold text-white mt-1">
                {models.filter(m => m.status === 'active').length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg Latency</p>
              <p className="text-2xl font-bold text-white mt-1">
                {Math.round(
                  models.reduce((sum, m) => sum + m.performance.averageLatency, 0) / models.length
                )}ms
              </p>
            </div>
            <Gauge className="h-8 w-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(models.reduce((sum, m) => sum + m.performance.successRate, 0) / models.length).toFixed(1)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Models List */}
        <div className="lg:col-span-1">
          <div className="glass-strong p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">AI Models</h2>
            
            <div className="space-y-3">
              {models.map((model) => (
                <motion.div
                  key={model.id}
                  className={`glass p-4 rounded-lg cursor-pointer transition-all ${
                    selectedModel?.id === model.id ? 'ring-2 ring-primary-green' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedModel(model)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">{model.name}</h3>
                        {getHealthIcon(model.id)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(model.status)}>
                          {model.status}
                        </Badge>
                        <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
                          {model.provider}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-white/60 space-y-1">
                        <p>Latency: {model.performance.averageLatency}ms</p>
                        <p>Success: {model.performance.successRate}%</p>
                        <p>Cost: {formatCurrency(model.pricing.inputCostPer1k)}/1k tokens</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleModel(model.id, model.status)
                        }}
                        size="sm"
                        variant="outline"
                        className="glass text-white border-white/20 hover:bg-white/10"
                      >
                        {model.status === 'active' ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass text-white border-white/20 hover:bg-white/10"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Details */}
        <div className="lg:col-span-2">
          {selectedModel ? (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'performance', label: 'Performance', icon: Activity },
                  { id: 'routing', label: 'Routing', icon: Route },
                  { id: 'config', label: 'Configuration', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
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

              {/* Tab Content */}
              <div className="glass-strong p-6 rounded-2xl">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">{selectedModel.name}</h3>
                      <p className="text-white/70 mb-4">{selectedModel.metadata.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-white/60">Provider</span>
                            <span className="text-white">{selectedModel.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Model ID</span>
                            <span className="text-white font-mono text-sm">{selectedModel.modelId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Version</span>
                            <span className="text-white">{selectedModel.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Context Window</span>
                            <span className="text-white">{selectedModel.metadata.contextWindow.toLocaleString()} tokens</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-white/60">Input Cost</span>
                            <span className="text-white">{formatCurrency(selectedModel.pricing.inputCostPer1k)}/1k</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Output Cost</span>
                            <span className="text-white">{formatCurrency(selectedModel.pricing.outputCostPer1k)}/1k</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">RPM Limit</span>
                            <span className="text-white">{selectedModel.limits.requestsPerMinute.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">TPM Limit</span>
                            <span className="text-white">{selectedModel.limits.tokensPerMinute.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <h4 className="text-md font-semibold text-white mb-3">Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.capabilities.map((cap, index) => (
                          <Badge key={index} className="bg-primary-purple/20 text-primary-purple border-primary-purple/30">
                            {cap.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="text-md font-semibold text-white mb-3">Use Cases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.metadata.useCase.map((useCase, index) => (
                          <Badge key={index} className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="glass p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Average Latency</span>
                            <span className="text-white font-semibold">{selectedModel.performance.averageLatency}ms</span>
                          </div>
                          <Progress value={Math.min(100, (selectedModel.performance.averageLatency / 3000) * 100)} className="h-2" />
                        </div>
                        
                        <div className="glass p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Success Rate</span>
                            <span className="text-white font-semibold">{selectedModel.performance.successRate}%</span>
                          </div>
                          <Progress value={selectedModel.performance.successRate} className="h-2" />
                        </div>
                        
                        <div className="glass p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Tokens/Second</span>
                            <span className="text-white font-semibold">{selectedModel.performance.tokensPerSecond}</span>
                          </div>
                          <Progress value={Math.min(100, (selectedModel.performance.tokensPerSecond / 100) * 100)} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="glass p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-3">Performance Status</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Health Status</span>
                              <div className="flex items-center space-x-2">
                                {getHealthIcon(selectedModel.id)}
                                <span className="text-white text-sm">
                                  {healthStatus.get(selectedModel.id) ? 'Healthy' : 'Unhealthy'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Error Rate</span>
                              <span className="text-white text-sm">{selectedModel.performance.errorRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Last Updated</span>
                              <span className="text-white text-sm">
                                {new Date(selectedModel.performance.lastUpdated).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'routing' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Intelligent Routing</h3>
                      <Button
                        size="sm"
                        className="bg-primary-green hover:bg-primary-green/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Route
                      </Button>
                    </div>
                    
                    <div className="glass p-4 rounded-lg">
                      <p className="text-white/70 text-center">
                        Routing rules will be displayed here. Configure intelligent routing based on
                        text complexity, cost optimization, and performance requirements.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'config' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Model Configuration</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Temperature</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="2"
                            defaultValue={selectedModel.config.temperature}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Max Tokens</label>
                          <input
                            type="number"
                            defaultValue={selectedModel.config.maxTokens}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Top P</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            defaultValue={selectedModel.config.topP}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Frequency Penalty</label>
                          <input
                            type="number"
                            step="0.1"
                            min="-2"
                            max="2"
                            defaultValue={selectedModel.config.frequencyPenalty}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Presence Penalty</label>
                          <input
                            type="number"
                            step="0.1"
                            min="-2"
                            max="2"
                            defaultValue={selectedModel.config.presencePenalty}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/60 text-sm mb-2">System Prompt</label>
                          <textarea
                            rows={3}
                            defaultValue={selectedModel.config.systemPrompt}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                            placeholder="Enter system prompt..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        className="glass text-white border-white/20 hover:bg-white/10"
                      >
                        Reset to Default
                      </Button>
                      <Button className="bg-primary-green hover:bg-primary-green/90">
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-strong p-8 rounded-2xl text-center">
              <Brain className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select an AI Model</h3>
              <p className="text-white/60">Choose a model from the list to view its details and configuration</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}