export interface Integration {
  id: string
  name: string
  description: string
  category: IntegrationCategory
  provider: string
  version: string
  status: 'active' | 'beta' | 'deprecated' | 'coming_soon'
  type: 'api' | 'webhook' | 'oauth' | 'database' | 'file_storage' | 'messaging' | 'analytics'
  logo: string
  banner?: string
  features: string[]
  pricing: IntegrationPricing
  requirements: IntegrationRequirements
  documentation: Documentation
  metrics: IntegrationMetrics
  reviews: Review[]
  configuration: IntegrationConfig
  endpoints?: APIEndpoint[]
  workflows?: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface IntegrationCategory {
  primary: 'communication' | 'productivity' | 'analytics' | 'crm' | 'marketing' | 'development' | 'finance' | 'ai'
  secondary?: string[]
}

export interface IntegrationPricing {
  model: 'free' | 'freemium' | 'subscription' | 'usage_based' | 'one_time'
  price?: number
  currency?: string
  billingCycle?: 'monthly' | 'yearly' | 'per_request'
  tiers?: PricingTier[]
  freeQuota?: number
}

export interface PricingTier {
  name: string
  price: number
  features: string[]
  limits: Record<string, number>
}

export interface IntegrationRequirements {
  minVersion?: string
  dependencies?: string[]
  permissions: string[]
  dataAccess: string[]
  compliance: string[]
}

export interface Documentation {
  quickStart: string
  apiReference?: string
  tutorials: Tutorial[]
  examples: CodeExample[]
  changelog: string
  supportUrl: string
}

export interface Tutorial {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  steps: TutorialStep[]
}

export interface TutorialStep {
  title: string
  content: string
  code?: string
  image?: string
}

export interface CodeExample {
  title: string
  language: string
  code: string
  description: string
}

export interface IntegrationMetrics {
  installs: number
  activeUsers: number
  rating: number
  reviewCount: number
  uptime: number
  responseTime: number
  successRate: number
  lastUpdated: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  helpful: number
  date: string
  verified: boolean
}

export interface IntegrationConfig {
  authType: 'api_key' | 'oauth2' | 'basic' | 'jwt' | 'custom'
  baseUrl?: string
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  rateLimit?: RateLimit
  timeout?: number
  retryPolicy?: RetryPolicy
  webhookUrl?: string
  customFields?: CustomField[]
}

export interface RateLimit {
  requests: number
  window: number
  strategy: 'fixed' | 'sliding' | 'token_bucket'
}

export interface RetryPolicy {
  maxAttempts: number
  backoffStrategy: 'linear' | 'exponential' | 'jitter'
  initialDelay: number
  maxDelay: number
}

export interface CustomField {
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'json'
  label: string
  description: string
  required: boolean
  defaultValue?: any
  validation?: FieldValidation
}

export interface FieldValidation {
  pattern?: string
  min?: number
  max?: number
  options?: string[]
  customValidator?: string
}

export interface APIEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  parameters: APIParameter[]
  requestBody?: RequestBody
  responses: APIResponse[]
  examples: EndpointExample[]
  rateLimit?: RateLimit
  deprecated?: boolean
}

export interface APIParameter {
  name: string
  in: 'path' | 'query' | 'header' | 'cookie'
  type: string
  required: boolean
  description: string
  defaultValue?: any
  enum?: string[]
}

export interface RequestBody {
  contentType: string
  schema: any
  examples: any[]
  required: boolean
}

export interface APIResponse {
  statusCode: number
  description: string
  contentType: string
  schema: any
  examples: any[]
}

export interface EndpointExample {
  title: string
  request: {
    params?: Record<string, any>
    body?: any
    headers?: Record<string, string>
  }
  response: {
    status: number
    body: any
  }
}

export interface MarketplaceFilters {
  category?: string
  type?: string
  status?: string
  priceRange?: { min: number; max: number }
  rating?: number
  tags?: string[]
  search?: string
}

export interface IntegrationStats {
  totalIntegrations: number
  categoryCounts: Record<string, number>
  popularIntegrations: Integration[]
  recentlyAdded: Integration[]
  trending: Integration[]
  averageRating: number
  totalInstalls: number
  activeConnections: number
}

export class IntegrationMarketplace {
  private integrations: Map<string, Integration> = new Map()
  private userIntegrations: Map<string, Set<string>> = new Map()
  private integrationInstances: Map<string, IntegrationInstance[]> = new Map()
  private apiUsage: Map<string, APIUsageRecord[]> = new Map()

  constructor() {
    this.initializeDefaultIntegrations()
  }

  // Integration Management
  async registerIntegration(integration: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullIntegration: Integration = {
      ...integration,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.integrations.set(id, fullIntegration)
    return id
  }

  async getIntegration(integrationId: string): Promise<Integration | undefined> {
    return this.integrations.get(integrationId)
  }

  async searchIntegrations(filters: MarketplaceFilters): Promise<Integration[]> {
    let results = Array.from(this.integrations.values())

    // Apply filters
    if (filters.category) {
      results = results.filter(i => i.category.primary === filters.category)
    }

    if (filters.type) {
      results = results.filter(i => i.type === filters.type)
    }

    if (filters.status) {
      results = results.filter(i => i.status === filters.status)
    }

    if (filters.priceRange) {
      results = results.filter(i => {
        const price = i.pricing.price || 0
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max
      })
    }

    if (filters.rating) {
      results = results.filter(i => i.metrics.rating >= filters.rating!)
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(i => 
        filters.tags!.some(tag => i.tags.includes(tag))
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      results = results.filter(i => 
        i.name.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower) ||
        i.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return results
  }

  async getMarketplaceStats(): Promise<IntegrationStats> {
    const integrations = Array.from(this.integrations.values())
    
    const categoryCounts: Record<string, number> = {}
    integrations.forEach(i => {
      categoryCounts[i.category.primary] = (categoryCounts[i.category.primary] || 0) + 1
    })

    const popularIntegrations = [...integrations]
      .sort((a, b) => b.metrics.installs - a.metrics.installs)
      .slice(0, 10)

    const recentlyAdded = [...integrations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    const trending = [...integrations]
      .sort((a, b) => {
        const aScore = a.metrics.installs * 0.3 + a.metrics.activeUsers * 0.5 + a.metrics.rating * 0.2
        const bScore = b.metrics.installs * 0.3 + b.metrics.activeUsers * 0.5 + b.metrics.rating * 0.2
        return bScore - aScore
      })
      .slice(0, 10)

    const totalInstalls = integrations.reduce((sum, i) => sum + i.metrics.installs, 0)
    const totalRatings = integrations.reduce((sum, i) => sum + i.metrics.rating * i.metrics.reviewCount, 0)
    const totalReviews = integrations.reduce((sum, i) => sum + i.metrics.reviewCount, 0)

    return {
      totalIntegrations: integrations.length,
      categoryCounts,
      popularIntegrations,
      recentlyAdded,
      trending,
      averageRating: totalReviews > 0 ? totalRatings / totalReviews : 0,
      totalInstalls,
      activeConnections: this.countActiveConnections()
    }
  }

  // User Integration Management
  async installIntegration(
    userId: string,
    integrationId: string,
    config: IntegrationConfig
  ): Promise<IntegrationInstance> {
    const integration = this.integrations.get(integrationId)
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`)
    }

    // Validate configuration
    await this.validateConfig(integration, config)

    const instance: IntegrationInstance = {
      id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      integrationId,
      config,
      status: 'active',
      installedAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      usage: {
        requests: 0,
        errors: 0,
        lastError: undefined
      }
    }

    // Add to user integrations
    if (!this.userIntegrations.has(userId)) {
      this.userIntegrations.set(userId, new Set())
    }
    this.userIntegrations.get(userId)!.add(integrationId)

    // Store instance
    if (!this.integrationInstances.has(integrationId)) {
      this.integrationInstances.set(integrationId, [])
    }
    this.integrationInstances.get(integrationId)!.push(instance)

    // Update metrics
    integration.metrics.installs++
    integration.metrics.activeUsers++

    return instance
  }

  async getUserIntegrations(userId: string): Promise<IntegrationInstance[]> {
    const userIntegrationIds = this.userIntegrations.get(userId) || new Set()
    const instances: IntegrationInstance[] = []

    for (const integrationId of userIntegrationIds) {
      const integrationInstances = this.integrationInstances.get(integrationId) || []
      instances.push(...integrationInstances.filter(inst => inst.userId === userId))
    }

    return instances
  }

  async uninstallIntegration(userId: string, instanceId: string): Promise<void> {
    // Find and remove instance
    for (const [integrationId, instances] of this.integrationInstances.entries()) {
      const index = instances.findIndex(inst => inst.id === instanceId && inst.userId === userId)
      if (index !== -1) {
        instances.splice(index, 1)
        
        // Update user integrations
        const userIntegrations = this.userIntegrations.get(userId)
        if (userIntegrations && instances.filter(inst => inst.userId === userId).length === 0) {
          userIntegrations.delete(integrationId)
        }

        // Update metrics
        const integration = this.integrations.get(integrationId)
        if (integration) {
          integration.metrics.activeUsers--
        }

        return
      }
    }

    throw new Error(`Integration instance ${instanceId} not found`)
  }

  // API Execution
  async executeAPI(
    instanceId: string,
    endpointId: string,
    params: Record<string, any>
  ): Promise<any> {
    const instance = await this.findInstance(instanceId)
    if (!instance) {
      throw new Error(`Integration instance ${instanceId} not found`)
    }

    const integration = this.integrations.get(instance.integrationId)
    if (!integration) {
      throw new Error(`Integration ${instance.integrationId} not found`)
    }

    const endpoint = integration.endpoints?.find(e => e.id === endpointId)
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointId} not found`)
    }

    // Check rate limits
    await this.checkRateLimit(instanceId, endpoint.rateLimit || integration.configuration.rateLimit)

    try {
      // Simulate API execution
      const result = await this.simulateAPICall(integration, endpoint, params, instance.config)
      
      // Track usage
      await this.trackAPIUsage(instanceId, endpointId, true)
      
      // Update instance usage
      instance.usage.requests++
      instance.lastUsed = new Date().toISOString()

      return result
    } catch (error) {
      // Track error
      await this.trackAPIUsage(instanceId, endpointId, false, error as Error)
      
      // Update instance usage
      instance.usage.errors++
      instance.usage.lastError = {
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      }

      throw error
    }
  }

  // Review Management
  async addReview(
    integrationId: string,
    userId: string,
    review: Omit<Review, 'id' | 'date' | 'helpful'>
  ): Promise<void> {
    const integration = this.integrations.get(integrationId)
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`)
    }

    const fullReview: Review = {
      ...review,
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      helpful: 0
    }

    integration.reviews.push(fullReview)
    
    // Update metrics
    integration.metrics.reviewCount++
    const totalRating = integration.metrics.rating * (integration.metrics.reviewCount - 1) + review.rating
    integration.metrics.rating = totalRating / integration.metrics.reviewCount
  }

  // Private Methods
  private initializeDefaultIntegrations(): void {
    const defaultIntegrations: Array<Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>> = [
      {
        name: 'Slack Integration',
        description: 'Connect your workflows with Slack for team communication and notifications',
        category: { primary: 'communication', secondary: ['collaboration'] },
        provider: 'Slack Technologies',
        version: '2.0.0',
        status: 'active',
        type: 'oauth',
        logo: '/integrations/slack.png',
        features: [
          'Send messages to channels',
          'Create and manage channels',
          'User presence detection',
          'File sharing',
          'Interactive buttons and forms'
        ],
        pricing: {
          model: 'freemium',
          freeQuota: 10000,
          tiers: [
            {
              name: 'Free',
              price: 0,
              features: ['10,000 messages/month', 'Basic webhooks'],
              limits: { messages: 10000, webhooks: 5 }
            },
            {
              name: 'Pro',
              price: 10,
              features: ['Unlimited messages', 'Advanced features'],
              limits: { messages: -1, webhooks: -1 }
            }
          ]
        },
        requirements: {
          permissions: ['workspace:read', 'chat:write', 'files:write'],
          dataAccess: ['messages', 'users', 'channels'],
          compliance: ['GDPR', 'SOC2']
        },
        documentation: {
          quickStart: 'https://api.slack.com/start',
          apiReference: 'https://api.slack.com/methods',
          tutorials: [],
          examples: [],
          changelog: 'https://api.slack.com/changelog',
          supportUrl: 'https://api.slack.com/support'
        },
        metrics: {
          installs: 15420,
          activeUsers: 12350,
          rating: 4.7,
          reviewCount: 892,
          uptime: 99.9,
          responseTime: 150,
          successRate: 99.5,
          lastUpdated: new Date().toISOString()
        },
        reviews: [],
        configuration: {
          authType: 'oauth2',
          baseUrl: 'https://slack.com/api',
          rateLimit: {
            requests: 50,
            window: 60000,
            strategy: 'sliding'
          },
          timeout: 30000,
          retryPolicy: {
            maxAttempts: 3,
            backoffStrategy: 'exponential',
            initialDelay: 1000,
            maxDelay: 10000
          }
        },
        endpoints: [
          {
            id: 'send_message',
            name: 'Send Message',
            method: 'POST',
            path: '/chat.postMessage',
            description: 'Send a message to a channel',
            parameters: [
              {
                name: 'channel',
                in: 'query',
                type: 'string',
                required: true,
                description: 'Channel ID'
              }
            ],
            requestBody: {
              contentType: 'application/json',
              schema: {},
              examples: [],
              required: true
            },
            responses: [
              {
                statusCode: 200,
                description: 'Message sent successfully',
                contentType: 'application/json',
                schema: {},
                examples: []
              }
            ],
            examples: []
          }
        ],
        tags: ['communication', 'team', 'notifications', 'collaboration']
      },
      {
        name: 'OpenAI GPT-4',
        description: 'Integrate advanced AI capabilities with GPT-4 for text generation and analysis',
        category: { primary: 'ai', secondary: ['nlp', 'generation'] },
        provider: 'OpenAI',
        version: '1.0.0',
        status: 'active',
        type: 'api',
        logo: '/integrations/openai.png',
        features: [
          'Text generation and completion',
          'Code generation',
          'Language translation',
          'Sentiment analysis',
          'Question answering'
        ],
        pricing: {
          model: 'usage_based',
          billingCycle: 'per_request',
          price: 0.03,
          currency: 'USD'
        },
        requirements: {
          permissions: ['api:write'],
          dataAccess: ['prompts', 'completions'],
          compliance: ['Data Privacy']
        },
        documentation: {
          quickStart: 'https://platform.openai.com/docs/quickstart',
          apiReference: 'https://platform.openai.com/docs/api-reference',
          tutorials: [],
          examples: [],
          changelog: 'https://platform.openai.com/docs/changelog',
          supportUrl: 'https://help.openai.com'
        },
        metrics: {
          installs: 28750,
          activeUsers: 24300,
          rating: 4.8,
          reviewCount: 1456,
          uptime: 99.8,
          responseTime: 800,
          successRate: 98.5,
          lastUpdated: new Date().toISOString()
        },
        reviews: [],
        configuration: {
          authType: 'api_key',
          baseUrl: 'https://api.openai.com/v1',
          rateLimit: {
            requests: 3500,
            window: 60000,
            strategy: 'token_bucket'
          },
          timeout: 60000,
          retryPolicy: {
            maxAttempts: 2,
            backoffStrategy: 'exponential',
            initialDelay: 2000,
            maxDelay: 20000
          }
        },
        tags: ['ai', 'gpt', 'nlp', 'text-generation', 'analysis']
      },
      {
        name: 'Stripe Payments',
        description: 'Process payments and manage subscriptions with Stripe',
        category: { primary: 'finance', secondary: ['payments', 'billing'] },
        provider: 'Stripe, Inc.',
        version: '3.2.0',
        status: 'active',
        type: 'api',
        logo: '/integrations/stripe.png',
        features: [
          'Payment processing',
          'Subscription management',
          'Invoice generation',
          'Fraud detection',
          'Multi-currency support'
        ],
        pricing: {
          model: 'usage_based',
          price: 2.9,
          currency: 'USD',
          billingCycle: 'per_request'
        },
        requirements: {
          permissions: ['payments:write', 'customers:read'],
          dataAccess: ['transactions', 'customers', 'subscriptions'],
          compliance: ['PCI-DSS', 'GDPR', 'SOC2']
        },
        documentation: {
          quickStart: 'https://stripe.com/docs/quickstart',
          apiReference: 'https://stripe.com/docs/api',
          tutorials: [],
          examples: [],
          changelog: 'https://stripe.com/docs/changelog',
          supportUrl: 'https://support.stripe.com'
        },
        metrics: {
          installs: 32100,
          activeUsers: 28900,
          rating: 4.9,
          reviewCount: 2103,
          uptime: 99.99,
          responseTime: 120,
          successRate: 99.8,
          lastUpdated: new Date().toISOString()
        },
        reviews: [],
        configuration: {
          authType: 'api_key',
          baseUrl: 'https://api.stripe.com/v1',
          rateLimit: {
            requests: 100,
            window: 1000,
            strategy: 'fixed'
          },
          timeout: 30000,
          retryPolicy: {
            maxAttempts: 3,
            backoffStrategy: 'exponential',
            initialDelay: 500,
            maxDelay: 5000
          }
        },
        tags: ['payments', 'billing', 'subscriptions', 'finance', 'e-commerce']
      }
    ]

    defaultIntegrations.forEach(integration => {
      this.registerIntegration(integration)
    })
  }

  private async validateConfig(
    integration: Integration,
    config: IntegrationConfig
  ): Promise<void> {
    // Validate required fields
    if (config.customFields) {
      for (const field of config.customFields) {
        if (field.required && !field.defaultValue) {
          throw new Error(`Required field ${field.name} is missing`)
        }

        if (field.validation) {
          // Validate field value
          if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern)
            if (!regex.test(String(field.defaultValue))) {
              throw new Error(`Field ${field.name} does not match pattern`)
            }
          }
        }
      }
    }

    // Validate auth configuration
    if (integration.configuration.authType === 'api_key' && !config.headers?.['Authorization']) {
      throw new Error('API key is required for this integration')
    }
  }

  private async checkRateLimit(
    instanceId: string,
    rateLimit?: RateLimit
  ): Promise<void> {
    if (!rateLimit) return

    const usage = this.apiUsage.get(instanceId) || []
    const now = Date.now()
    const windowStart = now - rateLimit.window

    const recentRequests = usage.filter(u => u.timestamp > windowStart)
    
    if (recentRequests.length >= rateLimit.requests) {
      throw new Error(`Rate limit exceeded: ${rateLimit.requests} requests per ${rateLimit.window}ms`)
    }
  }

  private async trackAPIUsage(
    instanceId: string,
    endpointId: string,
    success: boolean,
    error?: Error
  ): Promise<void> {
    if (!this.apiUsage.has(instanceId)) {
      this.apiUsage.set(instanceId, [])
    }

    const usage: APIUsageRecord = {
      timestamp: Date.now(),
      endpointId,
      success,
      error: error?.message
    }

    const records = this.apiUsage.get(instanceId)!
    records.push(usage)

    // Keep only last 1000 records
    if (records.length > 1000) {
      records.splice(0, records.length - 1000)
    }
  }

  private async simulateAPICall(
    integration: Integration,
    endpoint: APIEndpoint,
    params: Record<string, any>,
    config: IntegrationConfig
  ): Promise<any> {
    // Simulate API call with realistic response
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100))

    // Return mock response based on integration type
    if (integration.name === 'Slack Integration') {
      return {
        ok: true,
        channel: params.channel,
        ts: Date.now().toString(),
        message: {
          text: params.text,
          user: 'bot',
          ts: Date.now().toString()
        }
      }
    }

    if (integration.name === 'OpenAI GPT-4') {
      return {
        id: `cmpl_${Math.random().toString(36).substr(2, 9)}`,
        object: 'text_completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [{
          text: 'This is a simulated response from GPT-4',
          index: 0,
          finish_reason: 'stop'
        }]
      }
    }

    return { success: true, data: params }
  }

  private findInstance(instanceId: string): IntegrationInstance | undefined {
    for (const instances of this.integrationInstances.values()) {
      const instance = instances.find(inst => inst.id === instanceId)
      if (instance) return instance
    }
    return undefined
  }

  private countActiveConnections(): number {
    let count = 0
    for (const instances of this.integrationInstances.values()) {
      count += instances.filter(inst => inst.status === 'active').length
    }
    return count
  }
}

// Type definitions for internal use
interface IntegrationInstance {
  id: string
  userId: string
  integrationId: string
  config: IntegrationConfig
  status: 'active' | 'paused' | 'error'
  installedAt: string
  lastUsed: string
  usage: {
    requests: number
    errors: number
    lastError?: {
      message: string
      timestamp: string
    }
  }
}

interface APIUsageRecord {
  timestamp: number
  endpointId: string
  success: boolean
  error?: string
}

export const integrationMarketplace = new IntegrationMarketplace()