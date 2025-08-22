'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, Upload, Settings, Play, Pause, CheckCircle,
  FileText, Database, Target, TrendingUp, Zap,
  Clock, DollarSign, BarChart3, LineChart,
  Cpu, Server, Cloud, Save, Download, 
  AlertCircle, Info, Sparkles, Layers
} from 'lucide-react'
import { toast } from 'sonner'

interface TrainingDataset {
  id: string
  name: string
  type: 'text' | 'conversation' | 'instruction' | 'classification'
  size: number
  format: 'jsonl' | 'csv' | 'txt'
  status: 'uploaded' | 'processing' | 'ready' | 'error'
  uploadedAt: string
  samples: number
}

interface FineTuningJob {
  id: string
  name: string
  baseModel: string
  dataset: string
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  epochs: number
  learningRate: number
  batchSize: number
  startedAt: string
  completedAt?: string
  metrics: {
    loss: number
    accuracy: number
    perplexity: number
  }
  cost: number
}

export default function AITrainingPage() {
  const [activeTab, setActiveTab] = useState<'datasets' | 'training' | 'models' | 'evaluation'>('datasets')
  const [datasets, setDatasets] = useState<TrainingDataset[]>([
    {
      id: 'dataset-1',
      name: 'Customer Support Conversations',
      type: 'conversation',
      size: 2.5,
      format: 'jsonl',
      status: 'ready',
      uploadedAt: '2024-01-15',
      samples: 1250
    },
    {
      id: 'dataset-2',
      name: 'Product Knowledge Base',
      type: 'instruction',
      size: 8.3,
      format: 'jsonl',
      status: 'ready',
      uploadedAt: '2024-01-10',
      samples: 4150
    }
  ])
  
  const [trainingJobs, setTrainingJobs] = useState<FineTuningJob[]>([
    {
      id: 'job-1',
      name: 'Support Bot v2.1',
      baseModel: 'gpt-3.5-turbo',
      dataset: 'dataset-1',
      status: 'running',
      progress: 65,
      epochs: 3,
      learningRate: 0.0001,
      batchSize: 16,
      startedAt: '2024-01-15 10:30',
      metrics: {
        loss: 0.45,
        accuracy: 0.87,
        perplexity: 2.3
      },
      cost: 12.50
    }
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<string>('')
  const [trainingConfig, setTrainingConfig] = useState({
    name: '',
    baseModel: 'gpt-3.5-turbo',
    epochs: 3,
    learningRate: 0.0001,
    batchSize: 16,
    validationSplit: 0.1
  })

  const handleDatasetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newDataset: TrainingDataset = {
        id: `dataset-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        type: 'text',
        size: file.size / (1024 * 1024), // MB
        format: file.name.endsWith('.jsonl') ? 'jsonl' : file.name.endsWith('.csv') ? 'csv' : 'txt',
        status: 'processing',
        uploadedAt: new Date().toISOString().split('T')[0],
        samples: Math.floor(Math.random() * 5000) + 100
      }
      
      setDatasets(prev => [...prev, newDataset])
      toast.success('Dataset uploaded successfully!')
      
      // Simulate processing
      setTimeout(() => {
        setDatasets(prev => prev.map(d => 
          d.id === newDataset.id ? { ...d, status: 'ready' } : d
        ))
        toast.success('Dataset processing completed!')
      }, 5000)
      
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const startTraining = async () => {
    if (!trainingConfig.name || !selectedDataset) {
      toast.error('Please provide a name and select a dataset')
      return
    }

    const newJob: FineTuningJob = {
      id: `job-${Date.now()}`,
      name: trainingConfig.name,
      baseModel: trainingConfig.baseModel,
      dataset: selectedDataset,
      status: 'queued',
      progress: 0,
      epochs: trainingConfig.epochs,
      learningRate: trainingConfig.learningRate,
      batchSize: trainingConfig.batchSize,
      startedAt: new Date().toISOString(),
      metrics: {
        loss: 0,
        accuracy: 0,
        perplexity: 0
      },
      cost: 0
    }

    setTrainingJobs(prev => [...prev, newJob])
    toast.success('Training job started!')

    // Simulate training progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10 + 5
      if (progress >= 100) {
        clearInterval(interval)
        progress = 100
        
        setTrainingJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { 
                ...job, 
                status: 'completed', 
                progress: 100,
                completedAt: new Date().toISOString(),
                metrics: {
                  loss: 0.23,
                  accuracy: 0.94,
                  perplexity: 1.8
                },
                cost: 24.75
              }
            : job
        ))
        toast.success('Training completed!')
      } else {
        setTrainingJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { 
                ...job, 
                status: 'running', 
                progress: Math.round(progress),
                metrics: {
                  loss: Math.max(0.1, 1 - (progress / 100) * 0.8),
                  accuracy: Math.min(0.95, (progress / 100) * 0.9 + 0.1),
                  perplexity: Math.max(1.2, 5 - (progress / 100) * 3.5)
                },
                cost: (progress / 100) * 30
              }
            : job
        ))
      }
    }, 2000)

    // Clear form
    setTrainingConfig({
      name: '',
      baseModel: 'gpt-3.5-turbo',
      epochs: 3,
      learningRate: 0.0001,
      batchSize: 16,
      validationSplit: 0.1
    })
    setSelectedDataset('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': case 'completed': return 'text-green-400'
      case 'running': case 'processing': return 'text-yellow-400'
      case 'queued': case 'uploaded': return 'text-blue-400'
      case 'error': case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      ready: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      running: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      uploaded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[status as keyof typeof colors] || colors.queued
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Model Training</h1>
          <p className="text-white/80">Fine-tune custom AI models for your specific use cases</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
            <Database className="mr-1 h-3 w-3" />
            {datasets.length} Datasets
          </Badge>
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
            <Brain className="mr-1 h-3 w-3" />
            {trainingJobs.filter(j => j.status === 'completed').length} Models Trained
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'datasets', label: 'Datasets', icon: Database },
          { id: 'training', label: 'Training', icon: Brain },
          { id: 'models', label: 'Models', icon: Cpu },
          { id: 'evaluation', label: 'Evaluation', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'datasets' | 'training' | 'models' | 'evaluation')}
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

      {/* Datasets Tab */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Training Datasets</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  id="dataset-upload"
                  accept=".jsonl,.csv,.txt"
                  className="hidden"
                  onChange={handleDatasetUpload}
                />
                <label
                  htmlFor="dataset-upload"
                  className="btn-primary cursor-pointer flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Dataset
                </label>
              </div>
            </div>

            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  className="glass p-4 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-blue/20 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-blue" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{dataset.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span>{dataset.size.toFixed(1)} MB</span>
                          <span>{dataset.samples.toLocaleString()} samples</span>
                          <span className="capitalize">{dataset.type}</span>
                          <span className="uppercase">{dataset.format}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusBadge(dataset.status)}>
                        {dataset.status}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20"
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass text-white border-white/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {dataset.status === 'processing' && (
                    <div className="mt-4">
                      <Progress value={Math.random() * 60 + 20} className="h-2" />
                      <p className="text-xs text-white/60 mt-1">Processing dataset...</p>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isUploading && (
                <motion.div
                  className="glass p-4 rounded-lg border-2 border-dashed border-primary-green/50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <LoadingSpinner size="sm" />
                    <span className="text-white">Uploading dataset...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Dataset Guidelines */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary-blue" />
              Dataset Guidelines
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-2">Supported Formats</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                    <strong>JSONL:</strong> Structured conversations and instructions
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 text-primary-blue flex-shrink-0 mt-0.5" />
                    <strong>CSV:</strong> Classification and tabular data
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 text-primary-yellow flex-shrink-0 mt-0.5" />
                    <strong>TXT:</strong> Plain text for language modeling
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Best Practices</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                    High-quality, diverse examples (500+ samples)
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                    Consistent formatting and structure
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 text-primary-green flex-shrink-0 mt-0.5" />
                    Representative of target use cases
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === 'training' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Training Configuration */}
          <div className="lg:col-span-1">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">New Training Job</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm mb-2 block">Model Name</label>
                  <Input
                    value={trainingConfig.name}
                    onChange={(e) => setTrainingConfig(prev => ({...prev, name: e.target.value}))}
                    placeholder="My Custom Model"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">Base Model</label>
                  <select
                    value={trainingConfig.baseModel}
                    onChange={(e) => setTrainingConfig(prev => ({...prev, baseModel: e.target.value}))}
                    className="input-glass w-full"
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">Training Dataset</label>
                  <select
                    value={selectedDataset}
                    onChange={(e) => setSelectedDataset(e.target.value)}
                    className="input-glass w-full"
                  >
                    <option value="">Select a dataset...</option>
                    {datasets.filter(d => d.status === 'ready').map(dataset => (
                      <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Epochs</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={trainingConfig.epochs}
                      onChange={(e) => setTrainingConfig(prev => ({...prev, epochs: parseInt(e.target.value)}))}
                      className="input-glass"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Batch Size</label>
                    <Input
                      type="number"
                      min="1"
                      max="64"
                      value={trainingConfig.batchSize}
                      onChange={(e) => setTrainingConfig(prev => ({...prev, batchSize: parseInt(e.target.value)}))}
                      className="input-glass"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/80 text-sm mb-2 block">Learning Rate</label>
                  <Input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    max="0.01"
                    value={trainingConfig.learningRate}
                    onChange={(e) => setTrainingConfig(prev => ({...prev, learningRate: parseFloat(e.target.value)}))}
                    className="input-glass"
                  />
                </div>

                <Button
                  onClick={startTraining}
                  className="w-full btn-primary"
                  disabled={!trainingConfig.name || !selectedDataset}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Training Jobs */}
          <div className="lg:col-span-2">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Training Jobs</h3>
              
              <div className="space-y-4">
                {trainingJobs.map((job) => (
                  <div key={job.id} className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{job.name}</h4>
                        <p className="text-sm text-white/60">Base: {job.baseModel}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                        
                        {job.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass text-white border-white/20"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {(job.status === 'running' || job.status === 'completed') && (
                      <>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white/70">Progress</span>
                            <span className="text-sm text-white">{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-white font-medium">{job.metrics.loss.toFixed(3)}</div>
                            <div className="text-white/60">Loss</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                            <div className="text-white/60">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium">{job.metrics.perplexity.toFixed(1)}</div>
                            <div className="text-white/60">Perplexity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium">${job.cost.toFixed(2)}</div>
                            <div className="text-white/60">Cost</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {trainingJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">No training jobs yet</p>
                    <p className="text-white/40 text-sm">Start your first training job to see it here</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Custom Trained Models</h3>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {trainingJobs.filter(job => job.status === 'completed').map((job) => (
              <div key={job.id} className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-green/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-green" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{job.name}</h4>
                      <p className="text-white/60 text-sm">Based on {job.baseModel}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass text-white border-white/20"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass text-white border-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{(job.metrics.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-white/60">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{job.metrics.perplexity.toFixed(1)}</div>
                    <div className="text-white/60">Perplexity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">${job.cost.toFixed(2)}</div>
                    <div className="text-white/60">Training Cost</div>
                  </div>
                </div>
              </div>
            ))}
            
            {trainingJobs.filter(job => job.status === 'completed').length === 0 && (
              <div className="col-span-2 text-center py-8">
                <Cpu className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">No trained models yet</p>
                <p className="text-white/40 text-sm">Complete a training job to see your custom models here</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Evaluation Tab */}
      {activeTab === 'evaluation' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-primary-green" />
              Training Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Training Loss</span>
                  <span className="text-green-400 font-medium">Decreasing ↓</span>
                </div>
                <Progress value={75} className="h-2 mb-2" />
                <div className="text-xs text-white/60">
                  Current: 0.23 | Target: &lt;0.20
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Validation Accuracy</span>
                  <span className="text-green-400 font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2 mb-2" />
                <div className="text-xs text-white/60">
                  Baseline: 87% | Improvement: +7.2%
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Perplexity</span>
                  <span className="text-yellow-400 font-medium">1.8</span>
                </div>
                <Progress value={70} className="h-2 mb-2" />
                <div className="text-xs text-white/60">
                  Lower is better | Industry avg: 2.4
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary-blue" />
              Performance Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-white/80">Response Quality</span>
                <div className="flex items-center space-x-2">
                  <Progress value={92} className="h-2 w-20" />
                  <span className="text-white font-medium text-sm">92%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-white/80">Factual Accuracy</span>
                <div className="flex items-center space-x-2">
                  <Progress value={89} className="h-2 w-20" />
                  <span className="text-white font-medium text-sm">89%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-white/80">Consistency</span>
                <div className="flex items-center space-x-2">
                  <Progress value={95} className="h-2 w-20" />
                  <span className="text-white font-medium text-sm">95%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-white/80">Relevance</span>
                <div className="flex items-center space-x-2">
                  <Progress value={87} className="h-2 w-20" />
                  <span className="text-white font-medium text-sm">87%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}