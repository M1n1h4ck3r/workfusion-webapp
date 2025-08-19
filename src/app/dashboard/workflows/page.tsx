'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Play, Pause, Settings, Trash2, Edit3, Copy, Share2,
  GitBranch, Zap, Clock, CheckCircle2, XCircle, AlertCircle,
  ArrowRight, Filter, Search, Download, Upload, RefreshCw,
  Activity, Target, TrendingUp, Users, MessageSquare, Mail,
  Phone, Calendar, Database, Cloud, Shield, Key, Globe,
  Cpu, Brain, BarChart3, FileText, Image, Video, Music
} from 'lucide-react'
import { toast } from 'sonner'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'loop' | 'output'
  name: string
  description: string
  icon: any
  config: any
  status?: 'idle' | 'running' | 'success' | 'error'
  connections: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  triggers: number
  actions: number
  lastRun?: string
  nextRun?: string
  runs: number
  successRate: number
  nodes: WorkflowNode[]
}

const triggerTypes = [
  { id: 'webhook', name: 'Webhook', icon: Globe, color: 'text-blue-400' },
  { id: 'schedule', name: 'Schedule', icon: Clock, color: 'text-green-400' },
  { id: 'email', name: 'Email', icon: Mail, color: 'text-purple-400' },
  { id: 'form', name: 'Form Submit', icon: FileText, color: 'text-yellow-400' },
  { id: 'api', name: 'API Call', icon: Cloud, color: 'text-cyan-400' }
]

const actionTypes = [
  { id: 'ai_chat', name: 'AI Chat', icon: MessageSquare, color: 'text-primary-green' },
  { id: 'send_email', name: 'Send Email', icon: Mail, color: 'text-blue-400' },
  { id: 'sms', name: 'Send SMS', icon: Phone, color: 'text-purple-400' },
  { id: 'database', name: 'Database', icon: Database, color: 'text-orange-400' },
  { id: 'transform', name: 'Transform Data', icon: GitBranch, color: 'text-pink-400' },
  { id: 'http', name: 'HTTP Request', icon: Globe, color: 'text-cyan-400' }
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Customer Onboarding',
      description: 'Automated customer onboarding with AI assistance',
      status: 'active',
      triggers: 2,
      actions: 5,
      lastRun: '2 hours ago',
      nextRun: 'In 1 hour',
      runs: 247,
      successRate: 98.7,
      nodes: []
    },
    {
      id: '2',
      name: 'Lead Qualification',
      description: 'AI-powered lead scoring and qualification',
      status: 'active',
      triggers: 1,
      actions: 3,
      lastRun: '5 minutes ago',
      nextRun: 'On trigger',
      runs: 892,
      successRate: 95.4,
      nodes: []
    },
    {
      id: '3',
      name: 'Support Ticket Routing',
      description: 'Intelligent support ticket classification and routing',
      status: 'paused',
      triggers: 1,
      actions: 4,
      lastRun: '1 day ago',
      runs: 156,
      successRate: 91.2,
      nodes: []
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        const newStatus = w.status === 'active' ? 'paused' : 'active'
        toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'}`)
        return { ...w, status: newStatus }
      }
      return w
    }))
  }

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id))
    toast.success('Workflow deleted')
  }

  const filteredWorkflows = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || w.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Workflow Automation</h1>
          <p className="text-white/80">Create and manage automated workflows with AI integration</p>
        </div>
        
        <Button
          onClick={() => setShowBuilder(true)}
          className="bg-gradient-primary hover:opacity-90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Workflows</p>
              <p className="text-2xl font-bold text-white mt-1">{workflows.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
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
              <p className="text-white/60 text-sm">Active Workflows</p>
              <p className="text-2xl font-bold text-white mt-1">
                {workflows.filter(w => w.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
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
              <p className="text-white/60 text-sm">Total Executions</p>
              <p className="text-2xl font-bold text-white mt-1">
                {workflows.reduce((acc, w) => acc + w.runs, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
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
              <p className="text-white/60 text-sm">Avg Success Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-green"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className={filterStatus === 'all' ? 'bg-primary-green' : 'glass text-white border-white/20'}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
            className={filterStatus === 'active' ? 'bg-primary-green' : 'glass text-white border-white/20'}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'paused' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('paused')}
            className={filterStatus === 'paused' ? 'bg-primary-green' : 'glass text-white border-white/20'}
          >
            Paused
          </Button>
        </div>
      </div>

      {/* Workflows List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              className="glass-strong p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{workflow.name}</h3>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-white/40 text-xs">Triggers</p>
                      <p className="text-white font-medium">{workflow.triggers}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Actions</p>
                      <p className="text-white font-medium">{workflow.actions}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Executions</p>
                      <p className="text-white font-medium">{workflow.runs}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Success Rate</p>
                      <p className="text-white font-medium">{workflow.successRate}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-white/50">
                    {workflow.lastRun && (
                      <span>Last run: {workflow.lastRun}</span>
                    )}
                    {workflow.nextRun && (
                      <span>Next run: {workflow.nextRun}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => handleToggleWorkflow(workflow.id)}
                    size="sm"
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setSelectedWorkflow(workflow)
                      setShowBuilder(true)
                    }}
                    size="sm"
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => toast.success('Workflow duplicated')}
                    size="sm"
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    size="sm"
                    variant="outline"
                    className="glass text-red-400 border-red-400/20 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Workflow Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
                </h2>
                <button
                  onClick={() => {
                    setShowBuilder(false)
                    setSelectedWorkflow(null)
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Workflow Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Workflow Name</label>
                    <input
                      type="text"
                      placeholder="Enter workflow name"
                      defaultValue={selectedWorkflow?.name}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Description</label>
                    <textarea
                      placeholder="Enter workflow description"
                      defaultValue={selectedWorkflow?.description}
                      rows={3}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-green resize-none"
                    />
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Triggers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {triggerTypes.map((trigger) => (
                      <button
                        key={trigger.id}
                        className="glass p-4 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <trigger.icon className={`h-6 w-6 ${trigger.color} mb-2`} />
                        <p className="text-white text-sm font-medium">{trigger.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {actionTypes.map((action) => (
                      <button
                        key={action.id}
                        className="glass p-4 rounded-lg hover:bg-white/10 transition-colors text-left"
                      >
                        <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
                        <p className="text-white text-sm font-medium">{action.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => {
                      setShowBuilder(false)
                      setSelectedWorkflow(null)
                    }}
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(selectedWorkflow ? 'Workflow updated' : 'Workflow created')
                      setShowBuilder(false)
                      setSelectedWorkflow(null)
                    }}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {selectedWorkflow ? 'Update Workflow' : 'Create Workflow'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}