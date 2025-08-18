interface APIUsageMetrics {
  endpoint: string
  method: string
  statusCode: number
  responseTime: number
  timestamp: Date
  apiKeyId?: string
  userAgent?: string
  ipAddress?: string
  rateLimited: boolean
}

interface RateLimitConfig {
  endpoint: string
  requests: number
  windowMs: number
  message?: string
}

interface RateLimitState {
  count: number
  resetTime: number
}

class APIMonitoringService {
  private metrics: APIUsageMetrics[] = []
  private rateLimits: Map<string, RateLimitConfig> = new Map()
  private rateLimitState: Map<string, RateLimitState> = new Map()

  constructor() {
    // Initialize default rate limits
    this.setRateLimit('/api/v1/chat/completions', 100, 60000) // 100 requests per minute
    this.setRateLimit('/api/v1/tts/generate', 50, 60000) // 50 requests per minute
    this.setRateLimit('/api/v1/whatsapp/send', 30, 60000) // 30 requests per minute
    this.setRateLimit('/api/v1/analytics/usage', 200, 60000) // 200 requests per minute
  }

  // Rate limiting methods
  setRateLimit(endpoint: string, requests: number, windowMs: number, message?: string) {
    this.rateLimits.set(endpoint, {
      endpoint,
      requests,
      windowMs,
      message: message || `Rate limit exceeded. Try again in ${windowMs / 1000} seconds.`
    })
  }

  checkRateLimit(endpoint: string, identifier: string): { allowed: boolean; remaining?: number; resetTime?: number } {
    const rateLimit = this.rateLimits.get(endpoint)
    if (!rateLimit) {
      return { allowed: true }
    }

    const key = `${endpoint}:${identifier}`
    const now = Date.now()
    const state = this.rateLimitState.get(key)

    if (!state || now > state.resetTime) {
      // Reset or initialize rate limit window
      this.rateLimitState.set(key, {
        count: 1,
        resetTime: now + rateLimit.windowMs
      })
      return {
        allowed: true,
        remaining: rateLimit.requests - 1,
        resetTime: now + rateLimit.windowMs
      }
    }

    if (state.count >= rateLimit.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: state.resetTime
      }
    }

    // Increment count
    state.count++
    this.rateLimitState.set(key, state)

    return {
      allowed: true,
      remaining: rateLimit.requests - state.count,
      resetTime: state.resetTime
    }
  }

  // Metrics tracking methods
  trackRequest(metric: Omit<APIUsageMetrics, 'timestamp' | 'rateLimited'>) {
    const fullMetric: APIUsageMetrics = {
      ...metric,
      timestamp: new Date(),
      rateLimited: false
    }

    this.metrics.push(fullMetric)

    // Keep only last 10000 metrics to prevent memory issues
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-5000)
    }

    return fullMetric
  }

  trackRateLimitedRequest(endpoint: string, method: string, apiKeyId?: string) {
    const metric: APIUsageMetrics = {
      endpoint,
      method,
      statusCode: 429,
      responseTime: 0,
      timestamp: new Date(),
      apiKeyId,
      rateLimited: true
    }

    this.metrics.push(metric)
    return metric
  }

  // Analytics methods
  getMetricsByTimeRange(startTime: Date, endTime: Date): APIUsageMetrics[] {
    return this.metrics.filter(
      metric => metric.timestamp >= startTime && metric.timestamp <= endTime
    )
  }

  getMetricsByEndpoint(endpoint: string, timeRange?: { start: Date; end: Date }): APIUsageMetrics[] {
    let filtered = this.metrics.filter(metric => metric.endpoint === endpoint)
    
    if (timeRange) {
      filtered = filtered.filter(
        metric => metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
      )
    }

    return filtered
  }

  getMetricsByApiKey(apiKeyId: string, timeRange?: { start: Date; end: Date }): APIUsageMetrics[] {
    let filtered = this.metrics.filter(metric => metric.apiKeyId === apiKeyId)
    
    if (timeRange) {
      filtered = filtered.filter(
        metric => metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
      )
    }

    return filtered
  }

  // Usage statistics
  getUsageStatistics(timeRange?: { start: Date; end: Date }) {
    let metrics = this.metrics

    if (timeRange) {
      metrics = this.getMetricsByTimeRange(timeRange.start, timeRange.end)
    }

    const totalRequests = metrics.length
    const successfulRequests = metrics.filter(m => m.statusCode >= 200 && m.statusCode < 400).length
    const errorRequests = metrics.filter(m => m.statusCode >= 400).length
    const rateLimitedRequests = metrics.filter(m => m.rateLimited).length

    const averageResponseTime = metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length
      : 0

    // Group by endpoint
    const endpointStats = metrics.reduce((acc, metric) => {
      const endpoint = metric.endpoint
      if (!acc[endpoint]) {
        acc[endpoint] = {
          requests: 0,
          averageResponseTime: 0,
          successRate: 0,
          errors: 0
        }
      }
      acc[endpoint].requests++
      acc[endpoint].averageResponseTime += metric.responseTime
      if (metric.statusCode >= 400) {
        acc[endpoint].errors++
      }
      return acc
    }, {} as Record<string, any>)

    // Calculate averages and success rates
    Object.keys(endpointStats).forEach(endpoint => {
      const stats = endpointStats[endpoint]
      stats.averageResponseTime = stats.averageResponseTime / stats.requests
      stats.successRate = ((stats.requests - stats.errors) / stats.requests) * 100
    })

    // Group by API key
    const apiKeyStats = metrics.reduce((acc, metric) => {
      if (!metric.apiKeyId) return acc
      
      const keyId = metric.apiKeyId
      if (!acc[keyId]) {
        acc[keyId] = {
          requests: 0,
          averageResponseTime: 0,
          successRate: 0,
          errors: 0,
          rateLimited: 0
        }
      }
      acc[keyId].requests++
      acc[keyId].averageResponseTime += metric.responseTime
      if (metric.statusCode >= 400) {
        acc[keyId].errors++
      }
      if (metric.rateLimited) {
        acc[keyId].rateLimited++
      }
      return acc
    }, {} as Record<string, any>)

    // Calculate API key averages and success rates
    Object.keys(apiKeyStats).forEach(keyId => {
      const stats = apiKeyStats[keyId]
      stats.averageResponseTime = stats.averageResponseTime / stats.requests
      stats.successRate = ((stats.requests - stats.errors) / stats.requests) * 100
    })

    return {
      totalRequests,
      successfulRequests,
      errorRequests,
      rateLimitedRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      averageResponseTime: Math.round(averageResponseTime),
      endpointStats,
      apiKeyStats
    }
  }

  // Real-time monitoring
  getRealtimeMetrics(lastMinutes: number = 5) {
    const cutoff = new Date(Date.now() - lastMinutes * 60 * 1000)
    const recentMetrics = this.getMetricsByTimeRange(cutoff, new Date())

    const requestsPerMinute = recentMetrics.reduce((acc, metric) => {
      const minute = new Date(metric.timestamp).toISOString().slice(0, 16)
      acc[minute] = (acc[minute] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const currentRPS = recentMetrics.length / (lastMinutes * 60)
    const errorRate = recentMetrics.filter(m => m.statusCode >= 400).length / recentMetrics.length * 100

    return {
      requestsPerMinute,
      currentRPS: Math.round(currentRPS * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      recentRequests: recentMetrics.length
    }
  }

  // Health check
  getSystemHealth() {
    const last5Minutes = this.getRealtimeMetrics(5)
    const last30Minutes = this.getUsageStatistics({
      start: new Date(Date.now() - 30 * 60 * 1000),
      end: new Date()
    })

    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'down',
      uptime: 99.9, // This would come from actual uptime monitoring
      responseTime: last30Minutes.averageResponseTime,
      errorRate: last5Minutes.errorRate,
      requestRate: last5Minutes.currentRPS,
      issues: [] as string[]
    }

    // Determine health status based on metrics
    if (health.errorRate > 10) {
      health.status = 'degraded'
      health.issues.push('High error rate detected')
    }

    if (health.responseTime > 2000) {
      health.status = health.status === 'down' ? 'down' : 'degraded'
      health.issues.push('High response times detected')
    }

    if (last5Minutes.recentRequests === 0 && last30Minutes.totalRequests > 0) {
      health.status = 'down'
      health.issues.push('No recent requests detected')
    }

    return health
  }

  // Export/Import data
  exportMetrics(format: 'json' | 'csv' = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.metrics, null, 2)
    }

    // CSV format
    const headers = ['timestamp', 'endpoint', 'method', 'statusCode', 'responseTime', 'apiKeyId', 'rateLimited']
    const csvRows = [
      headers.join(','),
      ...this.metrics.map(m => [
        m.timestamp.toISOString(),
        m.endpoint,
        m.method,
        m.statusCode,
        m.responseTime,
        m.apiKeyId || '',
        m.rateLimited
      ].join(','))
    ]

    return csvRows.join('\n')
  }

  // Clear old data
  clearOldMetrics(olderThanDays: number = 30) {
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
    this.metrics = this.metrics.filter(metric => metric.timestamp >= cutoff)
  }

  // Get current rate limit status for all endpoints
  getCurrentRateLimits() {
    const now = Date.now()
    const limits: Record<string, any> = {}

    this.rateLimits.forEach((config, endpoint) => {
      limits[endpoint] = {
        requests: config.requests,
        windowMs: config.windowMs,
        current: Array.from(this.rateLimitState.entries())
          .filter(([key]) => key.startsWith(endpoint))
          .map(([key, state]) => ({
            identifier: key.split(':')[1],
            count: state.count,
            remaining: config.requests - state.count,
            resetTime: state.resetTime,
            active: now <= state.resetTime
          }))
      }
    })

    return limits
  }
}

// Singleton instance
export const apiMonitoringService = new APIMonitoringService()

// Middleware helper for Express-like frameworks
export function createRateLimitMiddleware(endpoint: string) {
  return (req: any, res: any, next: any) => {
    const identifier = req.headers['x-api-key'] || req.ip || 'anonymous'
    const result = apiMonitoringService.checkRateLimit(endpoint, identifier)

    if (!result.allowed) {
      apiMonitoringService.trackRateLimitedRequest(endpoint, req.method, req.headers['x-api-key'])
      
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime! - Date.now()) / 1000)
      })
      return
    }

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', apiMonitoringService.rateLimits.get(endpoint)?.requests || 0)
    res.setHeader('X-RateLimit-Remaining', result.remaining || 0)
    res.setHeader('X-RateLimit-Reset', Math.ceil((result.resetTime || 0) / 1000))

    next()
  }
}

// Request tracking helper
export function trackAPIRequest(req: any, res: any, responseTime: number) {
  apiMonitoringService.trackRequest({
    endpoint: req.url || req.path,
    method: req.method,
    statusCode: res.statusCode,
    responseTime,
    apiKeyId: req.headers['x-api-key'],
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip
  })
}