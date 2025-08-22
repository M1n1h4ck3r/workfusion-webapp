'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Brain, Zap, Play, Save, Settings, Plus, Trash2, Copy,
  GitBranch, Clock, Target, AlertTriangle, CheckCircle2,
  Eye, BarChart3, DollarSign, Lightbulb, RefreshCw,
  Layers, Route, MessageSquare, Database, Globe, Mail,
  Cpu, Filter, Search, Download, Upload, X, Edit3
} from 'lucide-react'
import { toast } from 'sonner'
import { workflowOrchestrator, WorkflowTemplate, WorkflowNode, WorkflowInsight } from '@/services/workflow-orchestrator'

interface CanvasNode extends WorkflowNode {
  selected: boolean
  dragging: boolean
}

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = useState<CanvasNode[]>([])
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null)
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [workflowDescription, setWorkflowDescription] = useState('')
  const [insights, setInsights] = useState<WorkflowInsight[]>([])
  const [showInsights, setShowInsights] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const nodeTypes = [
    { type: 'trigger', name: 'Webhook Trigger', icon: Globe, color: 'text-green-400', category: 'triggers' },
    { type: 'ai_analyze', name: 'AI Analysis', icon: Brain, color: 'text-purple-400', category: 'ai' },
    { type: 'condition', name: 'Condition', icon: GitBranch, color: 'text-blue-400', category: 'logic' },
    { type: 'action', name: 'HTTP Request', icon: Globe, color: 'text-orange-400', category: 'actions' },
    { type: 'delay', name: 'Delay', icon: Clock, color: 'text-yellow-400', category: 'utility' },
    { type: 'parallel', name: 'Parallel', icon: Layers, color: 'text-cyan-400', category: 'logic' },
    { type: 'loop', name: 'Loop', icon: RefreshCw, color: 'text-pink-400', category: 'logic' },
    { type: 'merge', name: 'Merge', icon: Route, color: 'text-indigo-400', category: 'logic' }
  ]

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const templateList = await workflowOrchestrator.getAllTemplates()
      setTemplates(templateList)
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const analyzeWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add some nodes to analyze the workflow')
      return
    }

    setIsAnalyzing(true)
    try {
      const workflowInsights = await workflowOrchestrator.analyzeWorkflowWithAI(nodes)
      setInsights(workflowInsights)
      setShowInsights(true)
      toast.success(`Found ${workflowInsights.length} optimization opportunities`)
    } catch (error) {
      toast.error('Failed to analyze workflow')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add some nodes before saving')
      return
    }

    try {
      const templateId = await workflowOrchestrator.createTemplate({
        name: workflowName,
        description: workflowDescription,
        category: 'custom',
        tags: [],
        nodes: nodes.map(({ selected, dragging, ...node }) => node),
        connections: [],
        variables: [],
        triggers: []
      })
      
      toast.success('Workflow saved successfully')
      await loadTemplates()
    } catch (error) {
      toast.error('Failed to save workflow')
    }
  }

  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add some nodes before executing')
      return
    }

    try {
      // First save the workflow
      const templateId = await workflowOrchestrator.createTemplate({
        name: `${workflowName} (Test)`,
        description: workflowDescription,
        category: 'test',
        tags: ['test'],
        nodes: nodes.map(({ selected, dragging, ...node }) => node),
        connections: [],
        variables: [],
        triggers: []
      })

      // Then execute it
      const executionId = await workflowOrchestrator.executeWorkflow(templateId, {}, null, 'test')
      toast.success(`Workflow execution started: ${executionId}`)
    } catch (error) {
      toast.error('Failed to execute workflow')
    }
  }

  const addNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    const nodeInfo = nodeTypes.find(nt => nt.type === nodeType)
    if (!nodeInfo) return

    const newNode: CanvasNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: nodeType as any,
      name: nodeInfo.name,
      description: `${nodeInfo.name} node`,
      position,
      config: {},
      connections: [],
      status: 'idle',
      selected: false,
      dragging: false,
      metadata: {
        category: nodeInfo.category,
        version: '1.0.0',
        author: 'system'
      }
    }

    setNodes(prev => [...prev, newNode])
  }, [nodeTypes])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedItem) return

    const rect = e.currentTarget.getBoundingClientRect()
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    addNode(draggedItem, position)
    setDraggedItem(null)
  }, [draggedItem, addNode])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const selectNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.map(node => ({
      ...node,
      selected: node.id === nodeId
    })))
    
    const node = nodes.find(n => n.id === nodeId)
    setSelectedNode(node || null)
  }, [nodes])

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return
    
    setNodes(prev => prev.filter(node => node.id !== selectedNode.id))
    setSelectedNode(null)
    toast.success('Node deleted')
  }, [selectedNode])

  const duplicateSelectedNode = useCallback(() => {
    if (!selectedNode) return
    
    const newNode: CanvasNode = {
      ...selectedNode,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50
      },
      selected: false
    }
    
    setNodes(prev => [...prev, newNode])
    toast.success('Node duplicated')
  }, [selectedNode])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Target
      case 'cost_reduction': return DollarSign
      case 'performance': return Zap
      case 'reliability': return CheckCircle2
      case 'security': return AlertTriangle
      default: return Lightbulb
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="glass border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-xl font-bold bg-transparent text-white border-none outline-none"
                placeholder="Workflow Name"
              />
              <input
                type="text"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="text-sm bg-transparent text-white/60 border-none outline-none block mt-1"
                placeholder="Add description..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
                {nodes.length} nodes
              </Badge>
              {insights.length > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {insights.length} insights
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Templates
            </Button>
            
            <Button
              onClick={analyzeWorkflow}
              disabled={isAnalyzing || nodes.length === 0}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <Brain className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
            </Button>
            
            <Button
              onClick={executeWorkflow}
              disabled={nodes.length === 0}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Run
            </Button>
            
            <Button
              onClick={saveWorkflow}
              disabled={nodes.length === 0}
              className="bg-primary-green hover:bg-primary-green/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 glass border-r border-white/10 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Node Library</h3>
          
          {Object.entries(
            nodeTypes.reduce((acc, node) => {
              if (!acc[node.category]) acc[node.category] = []
              acc[node.category].push(node)
              return acc
            }, {} as Record<string, typeof nodeTypes>)
          ).map(([category, categoryNodes]) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                {category}
              </h4>
              
              <div className="space-y-2">
                {categoryNodes.map((nodeType) => (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={() => setDraggedItem(nodeType.type)}
                    className="glass p-3 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <nodeType.icon className={`h-5 w-5 ${nodeType.color}`} />
                      <div>
                        <p className="text-white text-sm font-medium">{nodeType.name}</p>
                        <p className="text-white/40 text-xs">{nodeType.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <div
            className="w-full h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Nodes */}
            {nodes.map((node) => {
              const NodeIcon = nodeTypes.find(nt => nt.type === node.type)?.icon || Brain
              const nodeColor = nodeTypes.find(nt => nt.type === node.type)?.color || 'text-white'
              
              return (
                <motion.div
                  key={node.id}
                  className={`absolute glass-strong p-4 rounded-xl cursor-pointer transition-all ${
                    node.selected ? 'ring-2 ring-primary-green shadow-lg' : 'hover:bg-white/10'
                  }`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: 200
                  }}
                  onClick={() => selectNode(node.id)}
                  drag
                  dragMomentum={false}
                  onDragStart={() => {
                    setNodes(prev => prev.map(n => 
                      n.id === node.id ? { ...n, dragging: true } : n
                    ))
                  }}
                  onDragEnd={(_, info) => {
                    setNodes(prev => prev.map(n => 
                      n.id === node.id 
                        ? { 
                            ...n, 
                            dragging: false,
                            position: {
                              x: n.position.x + info.offset.x,
                              y: n.position.y + info.offset.y
                            }
                          }
                        : n
                    ))
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, zIndex: 1000 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <NodeIcon className={`h-6 w-6 ${nodeColor}`} />
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        node.status === 'completed' ? 'bg-green-400' :
                        node.status === 'running' ? 'bg-blue-400 animate-pulse' :
                        node.status === 'failed' ? 'bg-red-400' :
                        'bg-gray-400'
                      }`} />
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium text-sm mb-1">{node.name}</h4>
                  <p className="text-white/60 text-xs">{node.description}</p>
                  
                  {node.selected && (
                    <motion.div
                      className="absolute -top-2 -right-2 flex space-x-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateSelectedNode()
                        }}
                        className="w-6 h-6 bg-primary-blue hover:bg-primary-blue/80 rounded-full flex items-center justify-center"
                      >
                        <Copy className="h-3 w-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSelectedNode()
                        }}
                        className="w-6 h-6 bg-red-500 hover:bg-red-500/80 rounded-full flex items-center justify-center"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {/* Empty State */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Build Your Workflow</h3>
                  <p className="text-white/60 mb-4">Drag nodes from the library to start building</p>
                  <Button
                    onClick={() => addNode('trigger', { x: 400, y: 200 })}
                    className="bg-primary-green hover:bg-primary-green/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Node
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 glass border-l border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Node Properties</h3>
              <Button
                onClick={() => setSelectedNode(null)}
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => {
                    setNodes(prev => prev.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, name: e.target.value }
                        : node
                    ))
                    setSelectedNode({ ...selectedNode, name: e.target.value })
                  }}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-white/60 text-sm mb-2">Description</label>
                <textarea
                  value={selectedNode.description}
                  onChange={(e) => {
                    setNodes(prev => prev.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, description: e.target.value }
                        : node
                    ))
                    setSelectedNode({ ...selectedNode, description: e.target.value })
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Type</label>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const NodeIcon = nodeTypes.find(nt => nt.type === selectedNode.type)?.icon || Brain
                    const nodeColor = nodeTypes.find(nt => nt.type === selectedNode.type)?.color || 'text-white'
                    return <NodeIcon className={`h-5 w-5 ${nodeColor}`} />
                  })()}
                  <span className="text-white">{selectedNode.type}</span>
                </div>
              </div>

              {selectedNode.type === 'ai_analyze' && (
                <div>
                  <label className="block text-white/60 text-sm mb-2">AI Prompt</label>
                  <textarea
                    value={selectedNode.config.prompt || ''}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        config: { ...selectedNode.config, prompt: e.target.value }
                      }
                      setNodes(prev => prev.map(node => 
                        node.id === selectedNode.id ? updatedNode : node
                      ))
                      setSelectedNode(updatedNode)
                    }}
                    placeholder="Enter AI analysis prompt..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                  />
                </div>
              )}

              {selectedNode.type === 'delay' && (
                <div>
                  <label className="block text-white/60 text-sm mb-2">Delay (ms)</label>
                  <input
                    type="number"
                    value={(selectedNode.config.delay || 1000).toString()}
                    onChange={(e) => {
                      const updatedNode = {
                        ...selectedNode,
                        config: { ...selectedNode.config, delay: parseInt(e.target.value) }
                      }
                      setNodes(prev => prev.map(node => 
                        node.id === selectedNode.id ? updatedNode : node
                      ))
                      setSelectedNode(updatedNode)
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">AI Workflow Insights</h2>
                <button
                  onClick={() => setShowInsights(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {insights.map((insight, index) => {
                  const InsightIcon = getInsightIcon(insight.type)
                  const severityColor = getInsightColor(insight.severity)
                  
                  return (
                    <motion.div
                      key={index}
                      className="glass p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <InsightIcon className={`h-6 w-6 ${severityColor} mt-1`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-white font-semibold">{insight.title}</h3>
                            <Badge className={`bg-${insight.severity === 'high' ? 'red' : insight.severity === 'medium' ? 'yellow' : 'blue'}-500/20 text-${insight.severity === 'high' ? 'red' : insight.severity === 'medium' ? 'yellow' : 'blue'}-400 border-${insight.severity === 'high' ? 'red' : insight.severity === 'medium' ? 'yellow' : 'blue'}-500/30`}>
                              {insight.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-white/70 text-sm mb-2">{insight.description}</p>
                          <p className="text-white/60 text-sm mb-3">{insight.impact}</p>
                          
                          <div className="bg-white/5 p-3 rounded-lg">
                            <h4 className="text-white/80 font-medium text-sm mb-2">Recommendation:</h4>
                            <p className="text-white/70 text-sm">{insight.recommendation}</p>
                            
                            {insight.implementation && (
                              <div className="mt-2">
                                <h5 className="text-white/60 text-xs mb-1">Implementation:</h5>
                                <ul className="text-white/60 text-xs space-y-1">
                                  {insight.implementation.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex items-center space-x-2">
                                      <div className="w-1 h-1 bg-white/40 rounded-full" />
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 text-xs">
                            <span className="text-white/40">Effort: {insight.effort}</span>
                            {insight.potentialSavings && (
                              <span className="text-green-400">
                                Potential savings: {insight.potentialSavings}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {insights.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Workflow Looks Great!</h3>
                  <p className="text-white/60">No optimization opportunities found at this time.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    className="glass p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Load template
                      setNodes(template.nodes.map(node => ({ ...node, selected: false, dragging: false })))
                      setWorkflowName(template.name)
                      setWorkflowDescription(template.description)
                      setShowTemplates(false)
                      toast.success('Template loaded')
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <GitBranch className="h-5 w-5 text-primary-green" />
                      <h3 className="text-white font-semibold">{template.name}</h3>
                    </div>
                    
                    <p className="text-white/60 text-sm mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} className="bg-primary-blue/20 text-primary-blue border-primary-blue/30 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-white/40 text-xs">{template.nodes.length} nodes</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {templates.length === 0 && (
                <div className="text-center py-8">
                  <GitBranch className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Templates Available</h3>
                  <p className="text-white/60">Create your first workflow to generate templates</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}