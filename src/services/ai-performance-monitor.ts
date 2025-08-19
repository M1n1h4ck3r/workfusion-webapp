import { aiModelManager } from './ai-model-manager'
import { WebSocketClient } from '@/lib/websocket-client'

export interface PerformanceMetric {
  id: string
  modelId: string
  timestamp: string
  requestId: string
  latency: number
  tokensInput: number
  tokensOutput: number
  cost: number
  success: boolean
  errorType?: string
  errorMessage?: string
  userAgent?: string
  userId?: string
  endpoint: string
}

export interface AggregatedMetrics {
  modelId: string
  timeWindow: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageLatency: number
  totalCost: number
  totalTokensInput: number
  totalTokensOutput: number
  throughput: number
  errorRate: number
  costPerRequest: number
  costPerToken: number
}

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: AlertCondition
  threshold: number
  enabled: boolean
  recipients: string[]
  cooldownMinutes: number
  lastTriggered?: string
}

export interface AlertCondition {
  metric: 'latency' | 'error_rate' | 'cost_per_hour' | 'throughput' | 'success_rate'
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  timeWindow: 'minute' | 'hour' | 'day'
  modelIds?: string[]
}

export interface Alert {
  id: string
  ruleId: string
  modelId: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  acknowledged: boolean
  resolvedAt?: string
}

export interface ModelHealthScore {
  modelId: string
  score: number
  factors: {
    latency: number
    errorRate: number
    throughput: number
    availability: number
    cost: number
  }
  recommendations: string[]
  lastUpdated: string
}

export class AIPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private aggregatedMetrics: Map<string, AggregatedMetrics[]> = new Map()
  private alerts: Alert[] = []
  private alertRules: AlertRule[] = []
  private websocket: WebSocketClient
  private subscribers: Set<(data: any) => void> = new Set()
  private isMonitoring = false

  constructor() {
    this.websocket = new WebSocketClient()
    this.initializeDefaultAlertRules()
    this.startAggregation()
  }

  // Real-time Metrics Collection
  async recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): Promise<void> {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    }

    // Store metric
    const modelMetrics = this.metrics.get(metric.modelId) || []
    modelMetrics.push(fullMetric)
    
    // Keep only last 10000 metrics per model
    if (modelMetrics.length > 10000) {
      modelMetrics.splice(0, modelMetrics.length - 10000)
    }
    
    this.metrics.set(metric.modelId, modelMetrics)

    // Update AI model manager with usage data
    await aiModelManager.trackUsage(metric.modelId, {
      requests: 1,
      tokens: metric.tokensInput + metric.tokensOutput,
      cost: metric.cost,
      errors: metric.success ? 0 : 1,
      averageLatency: metric.latency,
      period: 'hour'
    })

    // Broadcast to subscribers
    this.broadcastMetric(fullMetric)

    // Check alert rules
    await this.checkAlertRules(metric.modelId)
  }

  // Real-time Subscriptions
  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private broadcastMetric(metric: PerformanceMetric): void {
    const broadcast = {
      type: 'metric',
      data: metric
    }
    
    this.subscribers.forEach(callback => {
      try {
        callback(broadcast)
      } catch (error) {
        console.error('Error in metric subscription callback:', error)
      }
    })

    // Send via WebSocket if connected
    this.websocket.send('ai_metric', broadcast)
  }

  // Metrics Retrieval
  async getMetrics(
    modelId?: string,
    startTime?: string,
    endTime?: string,
    limit = 1000
  ): Promise<PerformanceMetric[]> {
    let allMetrics: PerformanceMetric[] = []

    if (modelId) {
      allMetrics = this.metrics.get(modelId) || []
    } else {
      for (const metrics of this.metrics.values()) {
        allMetrics.push(...metrics)
      }
    }

    // Filter by time range
    if (startTime || endTime) {
      allMetrics = allMetrics.filter(metric => {
        const timestamp = new Date(metric.timestamp)
        if (startTime && timestamp < new Date(startTime)) return false
        if (endTime && timestamp > new Date(endTime)) return false
        return true
      })
    }

    // Sort by timestamp (newest first) and limit
    return allMetrics
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  async getAggregatedMetrics(
    modelId: string,
    timeWindow: 'minute' | 'hour' | 'day' = 'hour',
    limit = 24
  ): Promise<AggregatedMetrics[]> {
    const metrics = this.aggregatedMetrics.get(`${modelId}_${timeWindow}`) || []
    return metrics
      .sort((a, b) => new Date(b.timeWindow).getTime() - new Date(a.timeWindow).getTime())
      .slice(0, limit)
  }

  // Real-time Dashboard Data
  async getRealTimeDashboard(): Promise<{
    overview: {
      totalRequests: number
      averageLatency: number
      errorRate: number
      totalCost: number
      activeModels: number
    }
    modelMetrics: Array<{
      modelId: string
      modelName: string
      requests: number
      latency: number
      errorRate: number
      cost: number
      healthScore: number
    }>
    alerts: Alert[]
    trends: {
      requestsPerMinute: number[]
      latencyTrend: number[]
      errorRateTrend: number[]
      costTrend: number[]
    }
  }> {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Get recent metrics
    const recentMetrics = await this.getMetrics(undefined, oneHourAgo.toISOString())
    
    // Calculate overview
    const totalRequests = recentMetrics.length
    const successfulRequests = recentMetrics.filter(m => m.success).length
    const averageLatency = recentMetrics.reduce((sum, m) => sum + m.latency, 0) / Math.max(1, totalRequests)
    const errorRate = ((totalRequests - successfulRequests) / Math.max(1, totalRequests)) * 100
    const totalCost = recentMetrics.reduce((sum, m) => sum + m.cost, 0)
    
    const models = await aiModelManager.getAllModels()
    const activeModels = models.filter(m => m.status === 'active').length

    // Calculate per-model metrics
    const modelMetrics = await Promise.all(
      models
        .filter(m => m.status === 'active')
        .map(async model => {
          const modelRecentMetrics = recentMetrics.filter(m => m.modelId === model.id)
          const modelRequests = modelRecentMetrics.length
          const modelSuccessful = modelRecentMetrics.filter(m => m.success).length
          const modelLatency = modelRecentMetrics.reduce((sum, m) => sum + m.latency, 0) / Math.max(1, modelRequests)
          const modelErrorRate = ((modelRequests - modelSuccessful) / Math.max(1, modelRequests)) * 100
          const modelCost = modelRecentMetrics.reduce((sum, m) => sum + m.cost, 0)
          const healthScore = await this.calculateHealthScore(model.id)

          return {
            modelId: model.id,
            modelName: model.name,
            requests: modelRequests,
            latency: Math.round(modelLatency),
            errorRate: Math.round(modelErrorRate * 10) / 10,
            cost: Math.round(modelCost * 10000) / 10000,
            healthScore: healthScore.score
          }
        })
    )

    // Calculate trends (last 60 minutes, per minute)
    const trends = this.calculateTrends(recentMetrics)

    return {
      overview: {
        totalRequests,
        averageLatency: Math.round(averageLatency),
        errorRate: Math.round(errorRate * 10) / 10,
        totalCost: Math.round(totalCost * 10000) / 10000,
        activeModels
      },
      modelMetrics,
      alerts: this.getActiveAlerts(),
      trends
    }
  }

  // Health Scoring
  async calculateHealthScore(modelId: string): Promise<ModelHealthScore> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const metrics = await this.getMetrics(modelId, oneHourAgo.toISOString())
    
    if (metrics.length === 0) {
      return {
        modelId,
        score: 50,
        factors: {
          latency: 50,
          errorRate: 50,
          throughput: 50,
          availability: 50,
          cost: 50
        },
        recommendations: ['No recent activity to analyze'],
        lastUpdated: new Date().toISOString()
      }
    }

    const successfulRequests = metrics.filter(m => m.success).length
    const avgLatency = metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length
    const errorRate = ((metrics.length - successfulRequests) / metrics.length) * 100
    const throughput = metrics.length / 60 // per minute
    const avgCost = metrics.reduce((sum, m) => sum + m.cost, 0) / metrics.length

    // Score factors (0-100)
    const latencyScore = Math.max(0, 100 - (avgLatency / 30)) // 3000ms = 0 score
    const errorRateScore = Math.max(0, 100 - (errorRate * 10)) // 10% error = 0 score
    const throughputScore = Math.min(100, throughput * 2) // 50 req/min = 100 score
    const availabilityScore = successfulRequests > 0 ? 100 : 0
    const costScore = Math.max(0, 100 - (avgCost * 10000)) // $0.01 = 0 score

    const overallScore = (
      latencyScore * 0.25 +
      errorRateScore * 0.3 +
      throughputScore * 0.2 +
      availabilityScore * 0.15 +
      costScore * 0.1
    )

    const recommendations: string[] = []
    if (latencyScore < 70) recommendations.push('High latency detected - consider optimization')
    if (errorRateScore < 80) recommendations.push('Error rate is elevated - check model configuration')
    if (throughputScore < 50) recommendations.push('Low throughput - consider scaling up')
    if (costScore < 60) recommendations.push('High cost per request - optimize usage patterns')

    return {
      modelId,
      score: Math.round(overallScore),
      factors: {
        latency: Math.round(latencyScore),
        errorRate: Math.round(errorRateScore),
        throughput: Math.round(throughputScore),
        availability: Math.round(availabilityScore),
        cost: Math.round(costScore)
      },
      recommendations,
      lastUpdated: new Date().toISOString()
    }
  }

  // Alert Management
  async createAlertRule(rule: Omit<AlertRule, 'id'>): Promise<string> {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fullRule: AlertRule = { ...rule, id }
    
    this.alertRules.push(fullRule)
    return id
  }

  async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<void> {
    const index = this.alertRules.findIndex(r => r.id === ruleId)
    if (index !== -1) {
      this.alertRules[index] = { ...this.alertRules[index], ...updates }
    }
  }

  async deleteAlertRule(ruleId: string): Promise<void> {
    this.alertRules = this.alertRules.filter(r => r.id !== ruleId)
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules]
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.acknowledged && !a.resolvedAt)
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolvedAt = new Date().toISOString()
    }
  }

  // Monitoring Control
  startMonitoring(): void {
    if (this.isMonitoring) return
    
    this.isMonitoring = true
    this.websocket.connect()
    
    // Set up real-time metric collection intervals
    setInterval(() => this.processAggregations(), 60000) // Every minute
    setInterval(() => this.cleanupOldMetrics(), 300000) // Every 5 minutes
    setInterval(() => this.runHealthChecks(), 120000) // Every 2 minutes
  }

  stopMonitoring(): void {
    this.isMonitoring = false
    this.websocket.disconnect()
  }

  // Private Methods
  private initializeDefaultAlertRules(): void {
    const defaultRules: Omit<AlertRule, 'id'>[] = [
      {
        name: 'High Latency Alert',
        description: 'Triggers when average latency exceeds 3 seconds',
        condition: {
          metric: 'latency',
          operator: 'gt',
          timeWindow: 'minute'
        },
        threshold: 3000,
        enabled: true,
        recipients: ['admin@workfusion.com'],
        cooldownMinutes: 15
      },
      {
        name: 'High Error Rate Alert',
        description: 'Triggers when error rate exceeds 5%',
        condition: {
          metric: 'error_rate',
          operator: 'gt',
          timeWindow: 'minute'
        },
        threshold: 5,
        enabled: true,
        recipients: ['admin@workfusion.com'],
        cooldownMinutes: 10
      },
      {
        name: 'High Cost Alert',
        description: 'Triggers when hourly cost exceeds $10',
        condition: {
          metric: 'cost_per_hour',
          operator: 'gt',
          timeWindow: 'hour'
        },
        threshold: 10,
        enabled: true,
        recipients: ['admin@workfusion.com'],
        cooldownMinutes: 30
      }
    ]

    defaultRules.forEach(rule => {
      this.createAlertRule(rule)
    })
  }

  private startAggregation(): void {
    // Aggregate metrics every minute
    setInterval(() => {
      this.aggregateMetrics('minute')
    }, 60000)

    // Aggregate metrics every hour
    setInterval(() => {
      this.aggregateMetrics('hour')
    }, 3600000)

    // Aggregate metrics every day
    setInterval(() => {
      this.aggregateMetrics('day')
    }, 86400000)
  }

  private async aggregateMetrics(timeWindow: 'minute' | 'hour' | 'day'): Promise<void> {
    const now = new Date()
    const windowMs = timeWindow === 'minute' ? 60000 : timeWindow === 'hour' ? 3600000 : 86400000
    const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs)
    const windowEnd = new Date(windowStart.getTime() + windowMs)

    const models = await aiModelManager.getAllModels()
    
    for (const model of models) {
      const metrics = await this.getMetrics(
        model.id,
        windowStart.toISOString(),
        windowEnd.toISOString()
      )

      if (metrics.length === 0) continue

      const successfulRequests = metrics.filter(m => m.success).length
      const failedRequests = metrics.length - successfulRequests
      const totalTokensInput = metrics.reduce((sum, m) => sum + m.tokensInput, 0)
      const totalTokensOutput = metrics.reduce((sum, m) => sum + m.tokensOutput, 0)
      const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0)
      const totalLatency = metrics.reduce((sum, m) => sum + m.latency, 0)

      const aggregated: AggregatedMetrics = {
        modelId: model.id,
        timeWindow: windowStart.toISOString(),
        totalRequests: metrics.length,
        successfulRequests,
        failedRequests,
        averageLatency: totalLatency / metrics.length,
        totalCost,
        totalTokensInput,
        totalTokensOutput,
        throughput: metrics.length / (windowMs / 60000), // per minute
        errorRate: (failedRequests / metrics.length) * 100,
        costPerRequest: totalCost / metrics.length,
        costPerToken: totalCost / (totalTokensInput + totalTokensOutput)
      }

      const key = `${model.id}_${timeWindow}`
      const existing = this.aggregatedMetrics.get(key) || []
      existing.push(aggregated)

      // Keep only last 1000 aggregations
      if (existing.length > 1000) {
        existing.splice(0, existing.length - 1000)
      }

      this.aggregatedMetrics.set(key, existing)
    }
  }

  private async checkAlertRules(modelId: string): Promise<void> {
    for (const rule of this.alertRules.filter(r => r.enabled)) {
      // Check cooldown
      if (rule.lastTriggered) {
        const cooldownEnd = new Date(rule.lastTriggered)
        cooldownEnd.setMinutes(cooldownEnd.getMinutes() + rule.cooldownMinutes)
        if (new Date() < cooldownEnd) continue
      }

      // Skip if rule is model-specific and doesn't match
      if (rule.condition.modelIds && !rule.condition.modelIds.includes(modelId)) continue

      const shouldTrigger = await this.evaluateAlertCondition(rule.condition, modelId)
      
      if (shouldTrigger) {
        await this.triggerAlert(rule, modelId)
      }
    }
  }

  private async evaluateAlertCondition(
    condition: AlertCondition,
    modelId: string
  ): Promise<boolean> {
    const windowMs = condition.timeWindow === 'minute' ? 60000 : 
                    condition.timeWindow === 'hour' ? 3600000 : 86400000
    const startTime = new Date(Date.now() - windowMs)
    
    const metrics = await this.getMetrics(modelId, startTime.toISOString())
    
    if (metrics.length === 0) return false

    let value: number
    
    switch (condition.metric) {
      case 'latency':
        value = metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length
        break
      case 'error_rate':
        const errors = metrics.filter(m => !m.success).length
        value = (errors / metrics.length) * 100
        break
      case 'cost_per_hour':
        const totalCost = metrics.reduce((sum, m) => sum + m.cost, 0)
        value = totalCost * (3600000 / windowMs) // normalize to per hour
        break
      case 'throughput':
        value = metrics.length / (windowMs / 60000) // per minute
        break
      case 'success_rate':
        const successful = metrics.filter(m => m.success).length
        value = (successful / metrics.length) * 100
        break
      default:
        return false
    }

    switch (condition.operator) {
      case 'gt': return value > this.alertRules.find(r => r.condition === condition)!.threshold
      case 'lt': return value < this.alertRules.find(r => r.condition === condition)!.threshold
      case 'eq': return value === this.alertRules.find(r => r.condition === condition)!.threshold
      case 'gte': return value >= this.alertRules.find(r => r.condition === condition)!.threshold
      case 'lte': return value <= this.alertRules.find(r => r.condition === condition)!.threshold
      default: return false
    }
  }

  private async triggerAlert(rule: AlertRule, modelId: string): Promise<void> {
    const model = await aiModelManager.getModel(modelId)
    const modelName = model?.name || modelId

    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      modelId,
      message: `${rule.name}: ${modelName} - ${rule.description}`,
      severity: this.determineSeverity(rule),
      timestamp: new Date().toISOString(),
      acknowledged: false
    }

    this.alerts.push(alert)
    
    // Update rule last triggered
    rule.lastTriggered = new Date().toISOString()

    // Broadcast alert
    this.broadcastAlert(alert)

    // Send notifications (in production, integrate with email/Slack/etc.)
    console.warn(`ALERT: ${alert.message}`)
  }

  private determineSeverity(rule: AlertRule): Alert['severity'] {
    if (rule.condition.metric === 'error_rate' && rule.threshold > 10) return 'critical'
    if (rule.condition.metric === 'latency' && rule.threshold > 5000) return 'high'
    if (rule.condition.metric === 'cost_per_hour' && rule.threshold > 50) return 'high'
    return 'medium'
  }

  private broadcastAlert(alert: Alert): void {
    const broadcast = {
      type: 'alert',
      data: alert
    }
    
    this.subscribers.forEach(callback => {
      try {
        callback(broadcast)
      } catch (error) {
        console.error('Error in alert subscription callback:', error)
      }
    })

    this.websocket.send('ai_alert', broadcast)
  }

  private calculateTrends(metrics: PerformanceMetric[]): {
    requestsPerMinute: number[]
    latencyTrend: number[]
    errorRateTrend: number[]
    costTrend: number[]
  } {
    const now = new Date()
    const trends = {
      requestsPerMinute: new Array(60).fill(0),
      latencyTrend: new Array(60).fill(0),
      errorRateTrend: new Array(60).fill(0),
      costTrend: new Array(60).fill(0)
    }

    // Group metrics by minute
    for (let i = 0; i < 60; i++) {
      const minuteStart = new Date(now.getTime() - (i + 1) * 60000)
      const minuteEnd = new Date(now.getTime() - i * 60000)
      
      const minuteMetrics = metrics.filter(m => {
        const timestamp = new Date(m.timestamp)
        return timestamp >= minuteStart && timestamp < minuteEnd
      })

      const index = 59 - i // Reverse order (oldest to newest)
      
      trends.requestsPerMinute[index] = minuteMetrics.length
      
      if (minuteMetrics.length > 0) {
        trends.latencyTrend[index] = minuteMetrics.reduce((sum, m) => sum + m.latency, 0) / minuteMetrics.length
        trends.errorRateTrend[index] = (minuteMetrics.filter(m => !m.success).length / minuteMetrics.length) * 100
        trends.costTrend[index] = minuteMetrics.reduce((sum, m) => sum + m.cost, 0)
      }
    }

    return trends
  }

  private processAggregations(): void {
    // This is called every minute to process aggregations
    this.aggregateMetrics('minute')
  }

  private cleanupOldMetrics(): void {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
    
    for (const [modelId, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(m => new Date(m.timestamp) > cutoff)
      this.metrics.set(modelId, filtered)
    }

    // Clean up old alerts
    this.alerts = this.alerts.filter(a => 
      new Date(a.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
    )
  }

  private async runHealthChecks(): Promise<void> {
    const models = await aiModelManager.getAllModels()
    
    for (const model of models.filter(m => m.status === 'active')) {
      const healthScore = await this.calculateHealthScore(model.id)
      
      // Broadcast health score update
      this.subscribers.forEach(callback => {
        try {
          callback({
            type: 'health_score',
            data: healthScore
          })
        } catch (error) {
          console.error('Error in health score subscription callback:', error)
        }
      })
    }
  }
}

export const aiPerformanceMonitor = new AIPerformanceMonitor()