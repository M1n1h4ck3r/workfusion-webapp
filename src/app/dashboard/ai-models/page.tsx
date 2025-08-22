'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, Zap, Clock, DollarSign, TrendingUp, 
  Settings, Play, Pause, RotateCw, CheckCircle,
  AlertTriangle, Cpu, Globe, Server, Target,
  BarChart3, PieChart, LineChart, Activity,
  Layers, GitCompare, Sparkles, Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { multiAIService, type AIProvider, type AIModel, type ChatResponse } from '@/services/multi-ai-service'

export default function AIModelsPage() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'models' | 'comparison' | 'monitoring'>('overview')
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResults, setComparisonResults] = useState<{
    prompt: string
    models: Array<{
      model: { id: string; name: string; provider: string }
      response: string
      time: number
      score: number
    }>
  } | null>(null)
  const [testPrompt, setTestPrompt] = useState('Explain quantum computing in simple terms')
  const [healthStatus, setHealthStatus] = useState<Map<string, {
    status: 'healthy' | 'degraded' | 'down'
    responseTime: number
    errorRate: number
  }>>(new Map())
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    loadProvidersAndModels()
    startHealthMonitoring()
  }, [])

  const loadProvidersAndModels = () => {
    const providersData = multiAIService.getProviders()
    const modelsData = multiAIService.getAllModels()
    
    setProviders(providersData)
    setModels(modelsData)
  }

  const startHealthMonitoring = async () => {
    setIsMonitoring(true)
    const health = await multiAIService.checkProviderHealth()
    setHealthStatus(health)
    
    // Update health status every 30 seconds
    const interval = setInterval(async () => {
      const health = await multiAIService.checkProviderHealth()
      setHealthStatus(health)
    }, 30000)

    return () => clearInterval(interval)
  }

  const handleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const runComparison = async () => {
    if (selectedModels.length < 2) {
      toast.error('Please select at least 2 models to compare')
      return
    }

    setIsComparing(true)
    
    try {
      const results = await multiAIService.compareModels({
        messages: [
          { role: 'user', content: testPrompt }
        ],
        model: selectedModels[0],
        provider: 'openai'
      }, selectedModels)

      setComparisonResults(results)
      toast.success(`Comparison completed for ${results.models.length} models`)
    } catch (error) {
      toast.error('Comparison failed. Please try again.')
      console.error('Comparison error:', error)
    } finally {
      setIsComparing(false)
    }
  }

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'healthy': return 'text-green-400'
      case 'degraded': return 'text-yellow-400'
      case 'inactive': return 'text-gray-400'
      case 'down': return 'text-red-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getProviderTypeIcon = (type: string) => {
    switch (type) {
      case 'cloud': return Globe
      case 'local': return Server
      case 'hybrid': return Layers
      default: return Cpu
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'premium': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'standard': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'basic': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const formatCost = (cost: number) => {
    return cost < 0.01 ? `$${(cost * 1000).toFixed(3)}k` : `$${cost.toFixed(3)}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Model Management</h1>
          <p className="text-white/80">Multi-provider AI integration and model comparison</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="mr-1 h-3 w-3" />
            {providers.filter(p => p.status === 'active').length} Active Providers
          </Badge>
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
            <Brain className="mr-1 h-3 w-3" />
            {models.length} Models Available
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'providers', label: 'Providers', icon: Globe },
          { id: 'models', label: 'Models', icon: Brain },
          { id: 'comparison', label: 'Compare', icon: GitCompare },
          { id: 'monitoring', label: 'Monitoring', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Provider Overview */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary-green" />
              Provider Status
            </h3>
            <div className="space-y-3">
              {providers.map((provider) => {
                const health = healthStatus.get(provider.id)
                const ProviderIcon = getProviderTypeIcon(provider.type)
                
                return (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ProviderIcon className="h-4 w-4 text-white/60" />
                      <span className="text-white text-sm">{provider.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-green-400' : health?.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                      <span className={`text-xs ${getProviderStatusColor(health?.status || provider.status)}`}>
                        {health?.status || provider.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Model Statistics */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary-blue" />
              Model Distribution
            </h3>
            <div className="space-y-4">
              {Object.entries(models.reduce((acc, model) => {
                acc[model.capabilities.quality] = (acc[model.capabilities.quality] || 0) + 1
                return acc
              }, {} as Record<string, number>)).map(([quality, count]) => (
                <div key={quality} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 capitalize">{quality}</span>
                    <span className="text-white">{count}</span>
                  </div>
                  <Progress 
                    value={(count / models.length) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-yellow" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.2s</div>
                <div className="text-xs text-white/60">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">99.7%</div>
                <div className="text-xs text-white/60">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">$0.003</div>
                <div className="text-xs text-white/60">Avg Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">87%</div>
                <div className="text-xs text-white/60">Quality Score</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {providers.map((provider) => {
            const health = healthStatus.get(provider.id)
            const ProviderIcon = getProviderTypeIcon(provider.type)
            
            return (
              <motion.div
                key={provider.id}
                className="glass-strong p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-green/20 rounded-xl flex items-center justify-center">
                      <ProviderIcon className="h-6 w-6 text-primary-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      <p className="text-sm text-white/60 capitalize">{provider.type} Provider</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${health?.status === 'healthy' ? 'bg-green-400' : health?.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
                    <Badge className={getProviderStatusColor(health?.status || provider.status)}>
                      {health?.status || provider.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 glass rounded-lg">
                    <div className="text-lg font-bold text-white">{provider.models.length}</div>
                    <div className="text-xs text-white/60">Models</div>
                  </div>
                  <div className="text-center p-3 glass rounded-lg">
                    <div className="text-lg font-bold text-white">
                      {health?.responseTime ? `${health.responseTime}ms` : '-'}
                    </div>
                    <div className="text-xs text-white/60">Response Time</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-white/80">Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(provider.features).map(([feature, enabled]) => (
                      <Badge
                        key={feature}
                        className={`text-xs ${enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 glass text-white border-white/20"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass text-white border-white/20"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search models..."
                className="input-glass w-64"
              />
              <Button
                variant="outline"
                className="glass text-white border-white/20"
              >
                Filter
              </Button>
            </div>
            
            <Button className="btn-primary">
              <Sparkles className="h-4 w-4 mr-2" />
              Add Custom Model
            </Button>
          </div>

          <div className="grid gap-4">
            {models.map((model) => (
              <motion.div
                key={`${model.provider}-${model.id}`}
                className={`glass-strong p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedModels.includes(`${model.provider}:${model.id}`)
                    ? 'border-primary-green/50'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => handleModelSelection(`${model.provider}:${model.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-blue/20 rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-white/60">{providers.find(p => p.id === model.provider)?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={getQualityColor(model.capabilities.quality)}>
                      {model.capabilities.quality}
                    </Badge>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        {formatCost(model.pricing.input / 1000000)}/1K in
                      </div>
                      <div className="text-xs text-white/60">
                        {formatCost(model.pricing.output / 1000000)}/1K out
                      </div>
                    </div>
                    
                    {selectedModels.includes(`${model.provider}:${model.id}`) && (
                      <CheckCircle className="h-5 w-5 text-primary-green" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {(model.contextWindow / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-white/60">Context</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white capitalize">
                      {model.capabilities.responseTime}
                    </div>
                    <div className="text-xs text-white/60">Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {model.capabilities.languages.length}
                    </div>
                    <div className="text-xs text-white/60">Languages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {model.capabilities.specialties.length}
                    </div>
                    <div className="text-xs text-white/60">Specialties</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Model Comparison</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm mb-2 block">Test Prompt</label>
                <Input
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="Enter a prompt to test all selected models..."
                  className="input-glass"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm">Selected Models ({selectedModels.length})</label>
                  <Button
                    onClick={runComparison}
                    disabled={isComparing || selectedModels.length < 2}
                    className="btn-primary"
                  >
                    {isComparing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Comparing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Comparison
                      </>
                    )}
                  </Button>
                </div>
                
                {selectedModels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedModels.map((modelId) => {
                      const [providerId, mId] = modelId.split(':')
                      const model = models.find(m => m.id === (mId || modelId) && m.provider === (providerId || 'openai'))
                      return (
                        <Badge key={modelId} className="bg-primary-green/20 text-primary-green border-primary-green/30">
                          {model?.name || modelId}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">Select models from the Models tab to compare</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Comparison Results */}
          {comparisonResults && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass-strong p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Comparison Results</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {comparisonResults.summary.averageResponseTime.toFixed(0)}ms
                    </div>
                    <div className="text-sm text-white/60">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCost(comparisonResults.summary.averageCost)}
                    </div>
                    <div className="text-sm text-white/60">Avg Cost</div>
                  </div>
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {(comparisonResults.summary.averageQuality * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-white/60">Avg Quality</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {comparisonResults.models.map((result, index) => (
                    <div
                      key={result.model.id}
                      className={`p-4 rounded-lg border-2 ${
                        index === 0 
                          ? 'bg-primary-green/10 border-primary-green/50' 
                          : 'glass border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {index === 0 && (
                            <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                              <Target className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-lg font-semibold text-white">{result.model.name}</h4>
                            <p className="text-sm text-white/60">Ranking Score: {result.ranking.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">
                              {result.response.metadata.responseTime}ms
                            </div>
                            <div className="text-xs text-white/60">Response</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">
                              {formatCost(result.response.usage.cost)}
                            </div>
                            <div className="text-xs text-white/60">Cost</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-white">
                              {(result.response.metadata.quality * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-white/60">Quality</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass p-3 rounded-lg">
                        <p className="text-white/80 text-sm">{result.response.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary-green" />
              Real-time Health Status
            </h3>
            
            <div className="space-y-4">
              {providers.map((provider) => {
                const health = healthStatus.get(provider.id)
                const ProviderIcon = getProviderTypeIcon(provider.type)
                
                return (
                  <div key={provider.id} className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <ProviderIcon className="h-5 w-5 text-white/60" />
                        <span className="text-white font-medium">{provider.name}</span>
                      </div>
                      <Badge className={`${getProviderStatusColor(health?.status || provider.status)} border`}>
                        {health?.status || provider.status}
                      </Badge>
                    </div>
                    
                    {health && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/60">Response Time</div>
                          <div className="text-white font-medium">{health.responseTime}ms</div>
                        </div>
                        <div>
                          <div className="text-white/60">Error Rate</div>
                          <div className="text-white font-medium">{(health.errorRate * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-primary-blue" />
              Performance Trends
            </h3>
            
            <div className="space-y-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Average Response Time</span>
                  <span className="text-white font-medium">1.2s</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Cost Efficiency</span>
                  <span className="text-white font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Quality Score</span>
                  <span className="text-white font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Uptime</span>
                  <span className="text-white font-medium">99.7%</span>
                </div>
                <Progress value={99.7} className="h-2" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}