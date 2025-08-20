import { aiModelManager } from './ai-model-manager'

export interface WorkflowNode {
  id: string
  type: 'trigger' | 'condition' | 'action' | 'loop' | 'parallel' | 'merge' | 'delay' | 'ai_analyze'
  name: string
  description: string
  position: { x: number; y: number }
  config: NodeConfig
  connections: NodeConnection[]
  status: 'idle' | 'running' | 'completed' | 'failed' | 'skipped'
  executionTime?: number
  error?: string
  metadata: NodeMetadata
}

export interface NodeConnection {
  sourceNodeId: string
  sourcePort: string
  targetNodeId: string
  targetPort: string
  condition?: ConnectionCondition
}

export interface ConnectionCondition {
  type: 'always' | 'success' | 'failure' | 'custom'
  expression?: string
  weight?: number
}

export interface NodeConfig {
  [key: string]: unknown
  timeout?: number
  retries?: number
  onError?: 'stop' | 'continue' | 'retry'
  aiModel?: string
  prompt?: string
  variables?: Record<string, unknown>
}

export interface NodeMetadata {
  category: string
  version: string
  author: string
  documentation?: string
  examples?: unknown[]
  cost?: number
  avgExecutionTime?: number
  successRate?: number
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  nodes: WorkflowNode[]
  connections: NodeConnection[]
  variables: WorkflowVariable[]
  triggers: WorkflowTrigger[]
  metadata: TemplateMetadata
}

export interface WorkflowVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  defaultValue?: unknown
  required: boolean
  description: string
  validation?: VariableValidation
}

export interface VariableValidation {
  pattern?: string
  min?: number
  max?: number
  options?: string[]
}

export interface WorkflowTrigger {
  id: string
  type: 'webhook' | 'schedule' | 'email' | 'file' | 'database' | 'api' | 'manual'
  name: string
  config: TriggerConfig
  enabled: boolean
}

export interface TriggerConfig {
  [key: string]: unknown
  schedule?: string // cron expression
  webhookPath?: string
  emailFilter?: EmailFilter
  filePattern?: string
  sqlQuery?: string
}

export interface EmailFilter {
  from?: string
  subject?: string
  bodyContains?: string
  attachments?: boolean
}

export interface TemplateMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  requiredIntegrations: string[]
  costEstimate: number
  useCase: string[]
  industry: string[]
  created: string
  updated: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  templateId?: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused'
  startTime: string
  endTime?: string
  duration?: number
  triggeredBy: string
  triggerData?: unknown
  currentNode?: string
  nodeExecutions: NodeExecution[]
  variables: Record<string, any>
  metrics: ExecutionMetrics
  error?: ExecutionError
}

export interface NodeExecution {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startTime?: string
  endTime?: string
  duration?: number
  input?: unknown
  output?: unknown
  error?: string
  retryCount: number
  cost?: number
}

export interface ExecutionMetrics {
  totalNodes: number
  completedNodes: number
  failedNodes: number
  skippedNodes: number
  totalCost: number
  aiModelCalls: number
  dataProcessed: number
  networkRequests: number
}

export interface ExecutionError {
  nodeId: string
  type: string
  message: string
  stack?: string
  recoverable: boolean
  suggestedFix?: string
}

export interface WorkflowInsight {
  type: 'optimization' | 'cost_reduction' | 'performance' | 'reliability' | 'security'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  impact: string
  recommendation: string
  effort: 'low' | 'medium' | 'high'
  potentialSavings?: number
  implementation?: string[]
}

export class WorkflowOrchestrator {
  private executions: Map<string, WorkflowExecution> = new Map()
  private templates: Map<string, WorkflowTemplate> = new Map()
  private nodeRegistry: Map<string, NodeDefinition> = new Map()
  private activeExecutions: Set<string> = new Set()
  private executionQueue: string[] = []

  constructor() {
    this.initializeBuiltInNodes()
    this.initializeDefaultTemplates()
    this.startExecutionEngine()
  }

  // Template Management
  async createTemplate(template: Omit<WorkflowTemplate, 'id' | 'metadata'>): Promise<string> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullTemplate: WorkflowTemplate = {
      ...template,
      id,
      metadata: {
        difficulty: 'intermediate',
        estimatedTime: this.estimateExecutionTime(template.nodes),
        requiredIntegrations: this.extractRequiredIntegrations(template.nodes),
        costEstimate: this.estimateExecutionCost(template.nodes),
        useCase: [],
        industry: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    }

    // Validate template
    const validation = await this.validateTemplate(fullTemplate)
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`)
    }

    this.templates.set(id, fullTemplate)
    return id
  }

  async getTemplate(templateId: string): Promise<WorkflowTemplate | undefined> {
    return this.templates.get(templateId)
  }

  async getAllTemplates(category?: string): Promise<WorkflowTemplate[]> {
    const templates = Array.from(this.templates.values())
    if (category) {
      return templates.filter(t => t.category === category)
    }
    return templates
  }

  async analyzeWorkflowWithAI(nodes: WorkflowNode[]): Promise<WorkflowInsight[]> {
    const insights: WorkflowInsight[] = []

    // Analyze for optimization opportunities
    const aiNodes = nodes.filter(n => n.type === 'ai_analyze' || n.config.aiModel)
    if (aiNodes.length > 0) {
      const costAnalysis = await this.analyzeAICosts(aiNodes)
      if (costAnalysis.canOptimize) {
        insights.push({
          type: 'cost_reduction',
          severity: 'medium',
          title: 'AI Model Cost Optimization',
          description: `${aiNodes.length} AI nodes could benefit from model optimization`,
          impact: `Potential savings of ${costAnalysis.potentialSavings}% in AI costs`,
          recommendation: 'Use smaller models for simple tasks, implement intelligent routing',
          effort: 'medium',
          potentialSavings: costAnalysis.potentialSavings,
          implementation: [
            'Review AI node requirements',
            'Implement model selection logic',
            'Add cost monitoring'
          ]
        })
      }
    }

    // Analyze workflow structure
    const parallelOpportunities = this.findParallelizationOpportunities(nodes)
    if (parallelOpportunities.length > 0) {
      insights.push({
        type: 'performance',
        severity: 'medium',
        title: 'Parallelization Opportunities',
        description: `${parallelOpportunities.length} sequential nodes could run in parallel`,
        impact: 'Reduce execution time by up to 50%',
        recommendation: 'Convert sequential operations to parallel where possible',
        effort: 'low',
        implementation: [
          'Identify independent operations',
          'Add parallel execution nodes',
          'Update workflow connections'
        ]
      })
    }

    // Security analysis
    const securityIssues = this.analyzeSecurityRisks(nodes)
    if (securityIssues.length > 0) {
      insights.push({
        type: 'security',
        severity: 'high',
        title: 'Security Vulnerabilities',
        description: `${securityIssues.length} potential security risks found`,
        impact: 'Data exposure, unauthorized access',
        recommendation: 'Implement security best practices and validation',
        effort: 'high',
        implementation: [
          'Add input validation',
          'Implement authentication',
          'Encrypt sensitive data'
        ]
      })
    }

    return insights
  }

  // Workflow Execution
  async executeWorkflow(
    templateId: string,
    variables: Record<string, any> = {},
    triggerData: unknown = null,
    triggeredBy: string = 'manual'
  ): Promise<string> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: template.id,
      templateId,
      status: 'queued',
      startTime: new Date().toISOString(),
      triggeredBy,
      triggerData,
      nodeExecutions: template.nodes.map(node => ({
        nodeId: node.id,
        status: 'pending',
        retryCount: 0
      })),
      variables: { ...variables },
      metrics: {
        totalNodes: template.nodes.length,
        completedNodes: 0,
        failedNodes: 0,
        skippedNodes: 0,
        totalCost: 0,
        aiModelCalls: 0,
        dataProcessed: 0,
        networkRequests: 0
      }
    }

    this.executions.set(executionId, execution)
    this.executionQueue.push(executionId)

    return executionId
  }

  async getExecution(executionId: string): Promise<WorkflowExecution | undefined> {
    return this.executions.get(executionId)
  }

  async pauseExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (execution && execution.status === 'running') {
      execution.status = 'paused'
      this.executions.set(executionId, execution)
    }
  }

  async resumeExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (execution && execution.status === 'paused') {
      execution.status = 'queued'
      this.executionQueue.push(executionId)
      this.executions.set(executionId, execution)
    }
  }

  async cancelExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId)
    if (execution) {
      execution.status = 'cancelled'
      execution.endTime = new Date().toISOString()
      if (execution.startTime) {
        execution.duration = Date.now() - new Date(execution.startTime).getTime()
      }
      this.executions.set(executionId, execution)
      this.activeExecutions.delete(executionId)
    }
  }

  // Node Registry
  registerNode(nodeType: string, definition: NodeDefinition): void {
    this.nodeRegistry.set(nodeType, definition)
  }

  getRegisteredNodes(): Map<string, NodeDefinition> {
    return new Map(this.nodeRegistry)
  }

  // Analytics and Insights
  async getWorkflowAnalytics(timeRange: 'day' | 'week' | 'month' = 'week'): Promise<WorkflowAnalytics> {
    const executions = Array.from(this.executions.values())
    const cutoff = new Date()
    
    switch (timeRange) {
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1)
        break
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7)
        break
      case 'month':
        cutoff.setDate(cutoff.getDate() - 30)
        break
    }

    const filteredExecutions = executions.filter(e => 
      new Date(e.startTime) > cutoff
    )

    const totalExecutions = filteredExecutions.length
    const successfulExecutions = filteredExecutions.filter(e => e.status === 'completed').length
    const failedExecutions = filteredExecutions.filter(e => e.status === 'failed').length
    const totalCost = filteredExecutions.reduce((sum, e) => sum + e.metrics.totalCost, 0)
    const avgDuration = filteredExecutions
      .filter(e => e.duration)
      .reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, filteredExecutions.length)

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      totalCost,
      avgDuration,
      mostUsedTemplates: this.getMostUsedTemplates(filteredExecutions),
      performanceMetrics: this.calculatePerformanceMetrics(filteredExecutions),
      costBreakdown: this.calculateCostBreakdown(filteredExecutions)
    }
  }

  // Private Methods
  private async startExecutionEngine(): Promise<void> {
    setInterval(async () => {
      await this.processExecutionQueue()
    }, 1000) // Process queue every second
  }

  private async processExecutionQueue(): Promise<void> {
    if (this.executionQueue.length === 0 || this.activeExecutions.size >= 10) {
      return // No executions to process or at max capacity
    }

    const executionId = this.executionQueue.shift()!
    const execution = this.executions.get(executionId)
    
    if (!execution || execution.status !== 'queued') {
      return
    }

    this.activeExecutions.add(executionId)
    execution.status = 'running'
    this.executions.set(executionId, execution)

    try {
      await this.runWorkflowExecution(execution)
    } catch (error) {
      console.error(`Workflow execution ${executionId} failed:`, error)
      execution.status = 'failed'
      execution.error = {
        nodeId: execution.currentNode || 'unknown',
        type: 'execution_error',
        message: error instanceof Error ? error.message : 'Unknown error',
        recoverable: false
      }
    } finally {
      execution.endTime = new Date().toISOString()
      if (execution.startTime) {
        execution.duration = Date.now() - new Date(execution.startTime).getTime()
      }
      this.executions.set(executionId, execution)
      this.activeExecutions.delete(executionId)
    }
  }

  private async runWorkflowExecution(execution: WorkflowExecution): Promise<void> {
    const template = this.templates.get(execution.templateId!)
    if (!template) throw new Error('Template not found')

    // Find entry nodes (nodes with no incoming connections)
    const entryNodes = template.nodes.filter(node => 
      !template.nodes.some(otherNode => 
        otherNode.connections.some(conn => conn.targetNodeId === node.id)
      )
    )

    // Execute nodes starting from entry points
    for (const entryNode of entryNodes) {
      await this.executeNode(entryNode, execution, template)
    }

    // Mark execution as completed if no failures
    if (execution.nodeExecutions.every(ne => ne.status !== 'failed')) {
      execution.status = 'completed'
      execution.metrics.completedNodes = execution.nodeExecutions.filter(ne => ne.status === 'completed').length
    } else {
      execution.status = 'failed'
      execution.metrics.failedNodes = execution.nodeExecutions.filter(ne => ne.status === 'failed').length
    }
  }

  private async executeNode(
    node: WorkflowNode, 
    execution: WorkflowExecution, 
    template: WorkflowTemplate
  ): Promise<void> {
    const nodeExecution = execution.nodeExecutions.find(ne => ne.nodeId === node.id)!
    
    nodeExecution.status = 'running'
    nodeExecution.startTime = new Date().toISOString()
    execution.currentNode = node.id

    try {
      const nodeDefinition = this.nodeRegistry.get(node.type)
      if (!nodeDefinition) {
        throw new Error(`Node type ${node.type} not registered`)
      }

      const result = await nodeDefinition.execute(node, execution, template)
      
      nodeExecution.status = 'completed'
      nodeExecution.output = result
      
      // Execute connected nodes
      const connectedNodes = node.connections
        .filter(conn => this.evaluateConnectionCondition(conn, result))
        .map(conn => template.nodes.find(n => n.id === conn.targetNodeId)!)
        .filter(Boolean)

      for (const connectedNode of connectedNodes) {
        await this.executeNode(connectedNode, execution, template)
      }
      
    } catch (error) {
      nodeExecution.status = 'failed'
      nodeExecution.error = error instanceof Error ? error.message : 'Unknown error'
      
      if (node.config.onError === 'continue') {
        // Continue execution despite error
        nodeExecution.status = 'skipped'
      } else if (node.config.onError === 'retry' && nodeExecution.retryCount < (node.config.retries || 0)) {
        nodeExecution.retryCount++
        nodeExecution.status = 'pending'
        await this.executeNode(node, execution, template)
      } else {
        throw error
      }
    } finally {
      nodeExecution.endTime = new Date().toISOString()
      if (nodeExecution.startTime) {
        nodeExecution.duration = Date.now() - new Date(nodeExecution.startTime).getTime()
      }
    }
  }

  private evaluateConnectionCondition(connection: NodeConnection, nodeResult: unknown): boolean {
    if (!connection.condition || connection.condition.type === 'always') {
      return true
    }
    
    if (connection.condition.type === 'success') {
      return nodeResult && !nodeResult.error
    }
    
    if (connection.condition.type === 'failure') {
      return nodeResult && nodeResult.error
    }
    
    if (connection.condition.type === 'custom' && connection.condition.expression) {
      try {
        // Simple expression evaluation (in production, use a safer expression evaluator)
        return new Function('result', `return ${connection.condition.expression}`)(nodeResult)
      } catch {
        return false
      }
    }
    
    return false
  }

  private initializeBuiltInNodes(): void {
    // Register built-in node types
    this.registerNode('ai_analyze', {
      name: 'AI Analysis',
      description: 'Analyze data using AI models',
      category: 'ai',
      execute: async (node, execution) => {
        const modelId = node.config.aiModel || await aiModelManager.selectOptimalModel({
          input: node.config.prompt || '',
          capability: 'chat',
          priority: 'quality'
        })
        
        // Simulate AI analysis
        execution.metrics.aiModelCalls++
        execution.metrics.totalCost += 0.01
        
        return {
          analysis: `AI analysis result for: ${node.config.prompt}`,
          confidence: 0.95,
          model: modelId
        }
      }
    })

    this.registerNode('condition', {
      name: 'Condition',
      description: 'Conditional logic branching',
      category: 'logic',
      execute: async (node) => {
        // Evaluate condition
        return { result: true, path: 'success' }
      }
    })

    this.registerNode('delay', {
      name: 'Delay',
      description: 'Wait for specified time',
      category: 'utility',
      execute: async (node) => {
        const delay = node.config.delay || 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        return { delayed: delay }
      }
    })
  }

  private initializeDefaultTemplates(): void {
    // Add some default workflow templates
    const defaultTemplates: Omit<WorkflowTemplate, 'id' | 'metadata'>[] = [
      {
        name: 'Customer Support Automation',
        description: 'Automated customer support with AI analysis and routing',
        category: 'customer_service',
        tags: ['ai', 'support', 'automation'],
        nodes: [],
        connections: [],
        variables: [],
        triggers: []
      }
    ]

    defaultTemplates.forEach(template => {
      this.createTemplate(template).catch(console.error)
    })
  }

  private async validateTemplate(template: WorkflowTemplate): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = []
    
    // Check for cycles
    if (this.hasCycles(template.nodes, template.connections)) {
      errors.push('Workflow contains cycles')
    }
    
    // Check for orphaned nodes
    const orphanedNodes = this.findOrphanedNodes(template.nodes)
    if (orphanedNodes.length > 0) {
      errors.push(`Orphaned nodes found: ${orphanedNodes.map(n => n.name).join(', ')}`)
    }
    
    return { isValid: errors.length === 0, errors }
  }

  private hasCycles(nodes: WorkflowNode[], connections: NodeConnection[]): boolean {
    // Simple cycle detection using DFS
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    
    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false
      
      visited.add(nodeId)
      recursionStack.add(nodeId)
      
      const outgoingConnections = connections.filter(c => c.sourceNodeId === nodeId)
      for (const connection of outgoingConnections) {
        if (dfs(connection.targetNodeId)) return true
      }
      
      recursionStack.delete(nodeId)
      return false
    }
    
    for (const node of nodes) {
      if (!visited.has(node.id) && dfs(node.id)) {
        return true
      }
    }
    
    return false
  }

  private findOrphanedNodes(nodes: WorkflowNode[]): WorkflowNode[] {
    return nodes.filter(node => 
      node.connections.length === 0 && 
      !nodes.some(otherNode => 
        otherNode.connections.some(conn => conn.targetNodeId === node.id)
      )
    )
  }

  private estimateExecutionTime(nodes: WorkflowNode[]): number {
    return nodes.length * 2000 // 2 seconds per node average
  }

  private extractRequiredIntegrations(nodes: WorkflowNode[]): string[] {
    const integrations = new Set<string>()
    nodes.forEach(node => {
      if (node.type === 'ai_analyze') integrations.add('ai')
      if (node.config.webhook) integrations.add('webhook')
      if (node.config.email) integrations.add('email')
    })
    return Array.from(integrations)
  }

  private estimateExecutionCost(nodes: WorkflowNode[]): number {
    return nodes.filter(n => n.type === 'ai_analyze').length * 0.01
  }

  private async analyzeAICosts(nodes: WorkflowNode[]): Promise<{ canOptimize: boolean; potentialSavings: number }> {
    let potentialSavings = 0
    let canOptimize = false
    
    for (const node of nodes) {
      if (node.config.aiModel) {
        const model = await aiModelManager.getModel(node.config.aiModel)
        if (model && model.pricing.inputCostPer1k > 0.005) {
          canOptimize = true
          potentialSavings += 25 // 25% potential savings
        }
      }
    }
    
    return { canOptimize, potentialSavings: Math.min(potentialSavings, 50) }
  }

  private findParallelizationOpportunities(nodes: WorkflowNode[]): WorkflowNode[] {
    // Find nodes that could run in parallel
    return nodes.filter(node => 
      !node.connections.some(conn => 
        nodes.some(otherNode => otherNode.id === conn.targetNodeId)
      )
    )
  }

  private analyzeSecurityRisks(nodes: WorkflowNode[]): string[] {
    const risks: string[] = []
    
    nodes.forEach(node => {
      if (node.config.webhook && !node.config.authentication) {
        risks.push(`Node ${node.name} has unsecured webhook`)
      }
      if (node.config.apiKey && !node.config.encrypted) {
        risks.push(`Node ${node.name} has unencrypted API key`)
      }
    })
    
    return risks
  }

  private getMostUsedTemplates(executions: WorkflowExecution[]): Array<{ templateId: string; count: number }> {
    const templateCounts = new Map<string, number>()
    
    executions.forEach(exec => {
      if (exec.templateId) {
        templateCounts.set(exec.templateId, (templateCounts.get(exec.templateId) || 0) + 1)
      }
    })
    
    return Array.from(templateCounts.entries())
      .map(([templateId, count]) => ({ templateId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  private calculatePerformanceMetrics(executions: WorkflowExecution[]): Record<string, unknown> {
    return {
      avgExecutionTime: executions
        .filter(e => e.duration)
        .reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, executions.length),
      maxExecutionTime: Math.max(...executions.map(e => e.duration || 0)),
      minExecutionTime: Math.min(...executions.map(e => e.duration || 0))
    }
  }

  private calculateCostBreakdown(executions: WorkflowExecution[]): Record<string, unknown> {
    return {
      aiCosts: executions.reduce((sum, e) => sum + (e.metrics.aiModelCalls * 0.01), 0),
      computeCosts: executions.length * 0.001,
      storageCosts: executions.reduce((sum, e) => sum + (e.metrics.dataProcessed * 0.0001), 0)
    }
  }
}

// Type definitions for node registry
export interface NodeDefinition {
  name: string
  description: string
  category: string
  execute: (
    node: WorkflowNode,
    execution: WorkflowExecution,
    template: WorkflowTemplate
  ) => Promise<any>
}

export interface WorkflowAnalytics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  totalCost: number
  avgDuration: number
  mostUsedTemplates: Array<{ templateId: string; count: number }>
  performanceMetrics: Record<string, unknown>
  costBreakdown: Record<string, unknown>
}

export const workflowOrchestrator = new WorkflowOrchestrator()