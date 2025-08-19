import { aiPerformanceMonitor } from '@/services/ai-performance-monitor'

export class AIMetricsTracker {
  private static instance: AIMetricsTracker
  private isEnabled = true

  static getInstance(): AIMetricsTracker {
    if (!AIMetricsTracker.instance) {
      AIMetricsTracker.instance = new AIMetricsTracker()
    }
    return AIMetricsTracker.instance
  }

  enable(): void {
    this.isEnabled = true
  }

  disable(): void {
    this.isEnabled = false
  }

  async trackRequest<T>(
    modelId: string,
    requestData: {
      endpoint: string
      inputTokens?: number
      userId?: string
      userAgent?: string
    },
    request: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) {
      return await request()
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const startTime = Date.now()
    
    let result: T
    let success = true
    let errorType: string | undefined
    let errorMessage: string | undefined
    let outputTokens = 0
    let cost = 0

    try {
      result = await request()
      
      // Try to extract token information from response
      if (result && typeof result === 'object') {
        const response = result as any
        if (response.usage) {
          outputTokens = response.usage.completion_tokens || response.usage.output_tokens || 0
          if (response.usage.total_tokens) {
            // Estimate input tokens if not provided
            requestData.inputTokens = requestData.inputTokens || (response.usage.total_tokens - outputTokens)
          }
        }
      }

      // Calculate cost (this would typically come from the AI service)
      cost = this.calculateCost(modelId, requestData.inputTokens || 0, outputTokens)

    } catch (error) {
      success = false
      if (error instanceof Error) {
        errorType = error.constructor.name
        errorMessage = error.message
      } else {
        errorType = 'UnknownError'
        errorMessage = String(error)
      }
      throw error
    } finally {
      const endTime = Date.now()
      const latency = endTime - startTime

      // Record the metric
      await aiPerformanceMonitor.recordMetric({
        modelId,
        requestId,
        latency,
        tokensInput: requestData.inputTokens || 0,
        tokensOutput: outputTokens,
        cost,
        success,
        errorType,
        errorMessage,
        userAgent: requestData.userAgent,
        userId: requestData.userId,
        endpoint: requestData.endpoint
      })
    }

    return result!
  }

  private calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
    // Default pricing - would typically come from model configuration
    const defaultPricing = {
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
    }

    const pricing = (defaultPricing as any)[modelId] || { input: 0.001, output: 0.002 }
    
    return ((inputTokens / 1000) * pricing.input) + ((outputTokens / 1000) * pricing.output)
  }

  // Simulate some realistic metrics for demo purposes
  async simulateRealisticUsage(): Promise<void> {
    if (!this.isEnabled) return

    const models = ['gpt-4-turbo', 'claude-3-sonnet', 'gpt-3.5-turbo']
    const endpoints = ['/api/chat', '/api/completion', '/api/analysis']
    const users = ['user1', 'user2', 'user3', 'admin']

    // Generate 5-15 random requests
    const requestCount = Math.floor(Math.random() * 10) + 5
    
    for (let i = 0; i < requestCount; i++) {
      const modelId = models[Math.floor(Math.random() * models.length)]
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      const userId = users[Math.floor(Math.random() * users.length)]
      
      // Simulate request characteristics
      const inputTokens = Math.floor(Math.random() * 1000) + 50
      const outputTokens = Math.floor(Math.random() * 500) + 25
      const latency = Math.floor(Math.random() * 2000) + 500 // 500-2500ms
      const success = Math.random() > 0.05 // 95% success rate
      const cost = this.calculateCost(modelId, inputTokens, outputTokens)

      await aiPerformanceMonitor.recordMetric({
        modelId,
        requestId: `sim_req_${Date.now()}_${i}`,
        latency,
        tokensInput: inputTokens,
        tokensOutput: outputTokens,
        cost,
        success,
        errorType: success ? undefined : 'SimulatedError',
        errorMessage: success ? undefined : 'Simulated error for testing',
        userId,
        endpoint
      })

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Start background simulation for demo
  startSimulation(): void {
    if (!this.isEnabled) return

    // Run simulation every 30 seconds
    setInterval(() => {
      this.simulateRealisticUsage().catch(console.error)
    }, 30000)

    // Initial simulation
    setTimeout(() => {
      this.simulateRealisticUsage().catch(console.error)
    }, 2000)
  }
}

export const aiMetricsTracker = AIMetricsTracker.getInstance()