// import { aiService } from './ai-service' // Removed unused import

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  modelId: string
  version: string
  status: 'active' | 'inactive' | 'deprecated' | 'training'
  capabilities: ModelCapability[]
  pricing: ModelPricing
  performance: ModelPerformance
  limits: ModelLimits
  config: ModelConfig
  metadata: ModelMetadata
}

export interface ModelCapability {
  type: 'text' | 'code' | 'chat' | 'completion' | 'embedding' | 'image' | 'audio'
  maxTokens: number
  supportsStreaming: boolean
  supportsTools: boolean
  languages: string[]
}

export interface ModelPricing {
  inputCostPer1k: number
  outputCostPer1k: number
  currency: string
  minimumCharge?: number
}

export interface ModelPerformance {
  averageLatency: number
  tokensPerSecond: number
  successRate: number
  errorRate: number
  lastUpdated: string
}

export interface ModelLimits {
  requestsPerMinute: number
  requestsPerDay: number
  tokensPerMinute: number
  tokensPerDay: number
  concurrentRequests: number
}

export interface ModelConfig {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  stopSequences: string[]
  systemPrompt?: string
}

export interface ModelMetadata {
  description: string
  useCase: string[]
  trainingData: string
  knowledgeCutoff?: string
  contextWindow: number
  parametersCount?: string
  created: string
  updated: string
}

export interface ModelUsage {
  modelId: string
  requests: number
  tokens: number
  cost: number
  errors: number
  averageLatency: number
  period: 'hour' | 'day' | 'week' | 'month'
  timestamp: string
}

export interface ModelRoute {
  id: string
  name: string
  description: string
  condition: RouteCondition
  targetModel: string
  priority: number
  enabled: boolean
}

export interface RouteCondition {
  type: 'text_length' | 'complexity' | 'cost' | 'latency' | 'load_balancing'
  operator: 'gt' | 'lt' | 'eq' | 'contains' | 'regex'
  value: string | number
  weight: number
}

export class AIModelManager {
  private models: Map<string, AIModel> = new Map()
  private routes: ModelRoute[] = []
  private usage: Map<string, ModelUsage[]> = new Map()
  private performanceMetrics: Map<string, ModelPerformance> = new Map()

  constructor() {
    this.initializeDefaultModels()
    this.setupPerformanceMonitoring()
  }

  // Model Management
  async registerModel(model: AIModel): Promise<void> {
    this.models.set(model.id, model)
    await this.validateModelConnection(model)
    await this.updateModelMetrics(model.id)
  }

  async getModel(modelId: string): Promise<AIModel | undefined> {
    return this.models.get(modelId)
  }

  async getAllModels(): Promise<AIModel[]> {
    return Array.from(this.models.values())
  }

  async getAvailableModels(capability?: string): Promise<AIModel[]> {
    const models = Array.from(this.models.values())
    if (!capability) return models.filter(m => m.status === 'active')
    
    return models.filter(m => 
      m.status === 'active' && 
      m.capabilities.some(c => c.type === capability)
    )
  }

  async updateModelStatus(modelId: string, status: AIModel['status']): Promise<void> {
    const model = this.models.get(modelId)
    if (model) {
      model.status = status
      model.metadata.updated = new Date().toISOString()
      this.models.set(modelId, model)
    }
  }

  // Intelligent Model Routing
  async selectOptimalModel(
    request: {
      input: string
      capability: string
      priority: 'cost' | 'speed' | 'quality'
      maxCost?: number
      maxLatency?: number
    }
  ): Promise<string> {
    const availableModels = await this.getAvailableModels(request.capability)
    
    if (availableModels.length === 0) {
      throw new Error(`No models available for capability: ${request.capability}`)
    }

    // Apply routing rules
    for (const route of this.routes.filter(r => r.enabled)) {
      if (await this.evaluateRouteCondition(route.condition, request)) {
        const targetModel = availableModels.find(m => m.id === route.targetModel)
        if (targetModel) return targetModel.id
      }
    }

    // Fallback to optimization-based selection
    return this.optimizeModelSelection(availableModels, request)
  }

  private async optimizeModelSelection(
    models: AIModel[],
    request: { priority: 'cost' | 'speed' | 'quality'; input: string }
  ): Promise<string> {
    const scoredModels = await Promise.all(
      models.map(async model => {
        const performance = this.performanceMetrics.get(model.id) || model.performance
        const estimatedTokens = this.estimateTokenCount(request.input)
        const estimatedCost = this.calculateCost(model, estimatedTokens)
        
        let score = 0
        
        switch (request.priority) {
          case 'cost':
            score = 1 / (estimatedCost + 0.001) // Lower cost = higher score
            break
          case 'speed':
            score = 1 / (performance.averageLatency + 100) // Lower latency = higher score
            break
          case 'quality':
            score = performance.successRate * performance.tokensPerSecond
            break
        }
        
        return { model, score }
      })
    )
    
    scoredModels.sort((a, b) => b.score - a.score)
    return scoredModels[0].model.id
  }

  // Performance Monitoring
  async trackUsage(modelId: string, usage: Partial<ModelUsage>): Promise<void> {
    const existing = this.usage.get(modelId) || []
    const newUsage: ModelUsage = {
      modelId,
      requests: usage.requests || 0,
      tokens: usage.tokens || 0,
      cost: usage.cost || 0,
      errors: usage.errors || 0,
      averageLatency: usage.averageLatency || 0,
      period: usage.period || 'hour',
      timestamp: new Date().toISOString()
    }
    
    existing.push(newUsage)
    
    // Keep only last 1000 entries
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000)
    }
    
    this.usage.set(modelId, existing)
    await this.updateModelMetrics(modelId)
  }

  async getModelUsage(
    modelId: string, 
    period: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<ModelUsage[]> {
    const usage = this.usage.get(modelId) || []
    const now = new Date()
    const periodMs = this.getPeriodMs(period)
    const cutoff = new Date(now.getTime() - periodMs)
    
    return usage.filter(u => new Date(u.timestamp) > cutoff)
  }

  async getModelPerformance(modelId: string): Promise<ModelPerformance | undefined> {
    return this.performanceMetrics.get(modelId)
  }

  // Cost Analysis
  async getCostAnalysis(
    startDate: string,
    endDate: string,
    groupBy: 'model' | 'capability' | 'user' = 'model'
  ): Promise<any[]> {
    const analysis: any[] = []
    
    for (const [modelId, usageData] of this.usage.entries()) {
      const filtered = usageData.filter(u => 
        u.timestamp >= startDate && u.timestamp <= endDate
      )
      
      const totalCost = filtered.reduce((sum, u) => sum + u.cost, 0)
      const totalRequests = filtered.reduce((sum, u) => sum + u.requests, 0)
      const totalTokens = filtered.reduce((sum, u) => sum + u.tokens, 0)
      
      analysis.push({
        modelId,
        totalCost,
        totalRequests,
        totalTokens,
        averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
        averageCostPerToken: totalTokens > 0 ? totalCost / totalTokens : 0
      })
    }
    
    return analysis.sort((a, b) => b.totalCost - a.totalCost)
  }

  // Model Health Monitoring
  async checkModelHealth(): Promise<Map<string, boolean>> {
    const healthStatus = new Map<string, boolean>()
    
    for (const [modelId, model] of this.models.entries()) {
      try {
        const isHealthy = await this.pingModel(model)
        healthStatus.set(modelId, isHealthy)
        
        if (!isHealthy && model.status === 'active') {
          await this.updateModelStatus(modelId, 'inactive')
        }
      } catch (error) {
        healthStatus.set(modelId, false)
      }
    }
    
    return healthStatus
  }

  // Auto-scaling
  async autoScale(): Promise<void> {
    const models = await this.getAllModels()
    
    for (const model of models) {
      const recentUsage = await this.getModelUsage(model.id, 'hour')
      const requestsPerHour = recentUsage.reduce((sum, u) => sum + u.requests, 0)
      const errorRate = recentUsage.reduce((sum, u) => sum + u.errors, 0) / Math.max(1, requestsPerHour)
      
      // Scale up if high usage and low error rate
      if (requestsPerHour > model.limits.requestsPerMinute * 30 && errorRate < 0.05) {
        await this.scaleModel(model.id, 'up')
      }
      
      // Scale down if low usage
      if (requestsPerHour < model.limits.requestsPerMinute * 5) {
        await this.scaleModel(model.id, 'down')
      }
    }
  }

  // Private Methods
  private initializeDefaultModels(): void {
    const defaultModels: AIModel[] = [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        modelId: 'gpt-4-1106-preview',
        version: '1106',
        status: 'active',
        capabilities: [
          {
            type: 'chat',
            maxTokens: 128000,
            supportsStreaming: true,
            supportsTools: true,
            languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
          }
        ],
        pricing: {
          inputCostPer1k: 0.01,
          outputCostPer1k: 0.03,
          currency: 'USD'
        },
        performance: {
          averageLatency: 1500,
          tokensPerSecond: 50,
          successRate: 99.5,
          errorRate: 0.5,
          lastUpdated: new Date().toISOString()
        },
        limits: {
          requestsPerMinute: 3500,
          requestsPerDay: 200000,
          tokensPerMinute: 150000,
          tokensPerDay: 10000000,
          concurrentRequests: 100
        },
        config: {
          temperature: 0.7,
          maxTokens: 4096,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: []
        },
        metadata: {
          description: 'Most capable GPT-4 model with improved performance',
          useCase: ['reasoning', 'analysis', 'creative writing', 'code generation'],
          trainingData: 'Text and code data up to April 2023',
          knowledgeCutoff: '2023-04',
          contextWindow: 128000,
          parametersCount: '~1.76T',
          created: '2023-11-06T00:00:00Z',
          updated: new Date().toISOString()
        }
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        modelId: 'claude-3-sonnet-20240229',
        version: '20240229',
        status: 'active',
        capabilities: [
          {
            type: 'chat',
            maxTokens: 200000,
            supportsStreaming: true,
            supportsTools: true,
            languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
          }
        ],
        pricing: {
          inputCostPer1k: 0.003,
          outputCostPer1k: 0.015,
          currency: 'USD'
        },
        performance: {
          averageLatency: 1200,
          tokensPerSecond: 60,
          successRate: 99.7,
          errorRate: 0.3,
          lastUpdated: new Date().toISOString()
        },
        limits: {
          requestsPerMinute: 4000,
          requestsPerDay: 300000,
          tokensPerMinute: 200000,
          tokensPerDay: 15000000,
          concurrentRequests: 150
        },
        config: {
          temperature: 0.7,
          maxTokens: 4096,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: []
        },
        metadata: {
          description: 'Balanced model for a wide range of tasks',
          useCase: ['analysis', 'writing', 'math', 'coding', 'reasoning'],
          trainingData: 'Constitutional AI training data',
          contextWindow: 200000,
          created: '2024-02-29T00:00:00Z',
          updated: new Date().toISOString()
        }
      }
    ]

    defaultModels.forEach(model => {
      this.models.set(model.id, model)
      this.performanceMetrics.set(model.id, model.performance)
    })
  }

  private setupPerformanceMonitoring(): void {
    // Update metrics every 5 minutes
    setInterval(async () => {
      for (const modelId of this.models.keys()) {
        await this.updateModelMetrics(modelId)
      }
    }, 5 * 60 * 1000)

    // Health check every minute
    setInterval(async () => {
      await this.checkModelHealth()
    }, 60 * 1000)

    // Auto-scaling check every 10 minutes
    setInterval(async () => {
      await this.autoScale()
    }, 10 * 60 * 1000)
  }

  private async updateModelMetrics(modelId: string): Promise<void> {
    const usage = await this.getModelUsage(modelId, 'hour')
    
    if (usage.length === 0) return

    const totalRequests = usage.reduce((sum, u) => sum + u.requests, 0)
    const totalErrors = usage.reduce((sum, u) => sum + u.errors, 0)
    const totalLatency = usage.reduce((sum, u) => sum + u.averageLatency * u.requests, 0)
    const totalTokens = usage.reduce((sum, u) => sum + u.tokens, 0)

    const metrics: ModelPerformance = {
      averageLatency: totalRequests > 0 ? totalLatency / totalRequests : 0,
      tokensPerSecond: totalTokens / (usage.length * 3600), // per hour to per second
      successRate: totalRequests > 0 ? ((totalRequests - totalErrors) / totalRequests) * 100 : 100,
      errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
      lastUpdated: new Date().toISOString()
    }

    this.performanceMetrics.set(modelId, metrics)
  }

  private async validateModelConnection(model: AIModel): Promise<boolean> {
    try {
      // Test connection with simple request
      // TODO: Implement actual validation when aiService is available
      // const testResponse = await aiService.chat([
      //   { role: 'user', content: 'Hello' }
      // ], {
      //   model: model.modelId,
      //   maxTokens: 10
      // })
      
      // return !!testResponse
      
      // For now, return true for demo purposes
      return true
    } catch (error) {
      console.error(`Model validation failed for ${model.id}:`, error)
      return false
    }
  }

  private async pingModel(model: AIModel): Promise<boolean> {
    try {
      const startTime = Date.now()
      await this.validateModelConnection(model)
      const latency = Date.now() - startTime
      
      // Update latency
      const performance = this.performanceMetrics.get(model.id)
      if (performance) {
        performance.averageLatency = latency
        performance.lastUpdated = new Date().toISOString()
        this.performanceMetrics.set(model.id, performance)
      }
      
      return latency < 10000 // 10 second timeout
    } catch (error) {
      return false
    }
  }

  private async evaluateRouteCondition(
    condition: RouteCondition,
    request: { input: string; capability: string }
  ): Promise<boolean> {
    switch (condition.type) {
      case 'text_length':
        const length = request.input.length
        return this.compareValues(length, condition.operator, condition.value)
      
      case 'complexity':
        const complexity = this.calculateComplexity(request.input)
        return this.compareValues(complexity, condition.operator, condition.value)
      
      default:
        return false
    }
  }

  private compareValues(actual: number, operator: string, expected: string | number): boolean {
    const expectedNum = typeof expected === 'string' ? parseFloat(expected) : expected
    
    switch (operator) {
      case 'gt': return actual > expectedNum
      case 'lt': return actual < expectedNum
      case 'eq': return actual === expectedNum
      default: return false
    }
  }

  private calculateComplexity(text: string): number {
    // Simple complexity calculation based on various factors
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const avgWordsPerSentence = words / Math.max(1, sentences)
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size
    const lexicalDiversity = uniqueWords / Math.max(1, words)
    
    return (avgWordsPerSentence * 0.3) + (lexicalDiversity * 0.7) + Math.log(words) * 0.2
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 0.75 words
    return Math.ceil(text.split(/\s+/).length / 0.75)
  }

  private calculateCost(model: AIModel, tokens: number): number {
    return (tokens / 1000) * model.pricing.inputCostPer1k
  }

  private getPeriodMs(period: string): number {
    switch (period) {
      case 'hour': return 60 * 60 * 1000
      case 'day': return 24 * 60 * 60 * 1000
      case 'week': return 7 * 24 * 60 * 60 * 1000
      case 'month': return 30 * 24 * 60 * 60 * 1000
      default: return 24 * 60 * 60 * 1000
    }
  }

  private async scaleModel(modelId: string, direction: 'up' | 'down'): Promise<void> {
    const model = this.models.get(modelId)
    if (!model) return

    // Simulate scaling by adjusting limits
    if (direction === 'up') {
      model.limits.requestsPerMinute *= 1.5
      model.limits.tokensPerMinute *= 1.5
      model.limits.concurrentRequests = Math.floor(model.limits.concurrentRequests * 1.3)
    } else {
      model.limits.requestsPerMinute = Math.max(100, Math.floor(model.limits.requestsPerMinute * 0.8))
      model.limits.tokensPerMinute = Math.max(10000, Math.floor(model.limits.tokensPerMinute * 0.8))
      model.limits.concurrentRequests = Math.max(10, Math.floor(model.limits.concurrentRequests * 0.8))
    }

    this.models.set(modelId, model)
    console.log(`Scaled ${direction} model ${modelId}`)
  }
}

export const aiModelManager = new AIModelManager()