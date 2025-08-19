'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, MessageSquare,
  Phone, Mic, Zap, Calendar, Download, Filter, RefreshCw,
  LineChart, PieChart, Target, Globe, ArrowUpRight, ArrowDownRight,
  Activity, Eye, Brain, Cpu, Shield, AlertCircle, DollarSign,
  Percent, Timer, CheckCircle2, Clock
} from 'lucide-react'
import { toast } from 'sonner'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'performance' | 'business'>('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  const metrics = [
    { value: 'all', label: 'All Services' },
    { value: 'chatbot', label: 'AI Chatbots' },
    { value: 'tts', label: 'Text to Speech' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'calls', label: 'Voice Calls' }
  ]

  // Mock analytics data
  const overviewStats = [
    {
      title: 'Total API Calls',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-primary-green'
    },
    {
      title: 'Tokens Consumed',
      value: '18,392',
      change: '+8.2%',
      trend: 'up',
      icon: Zap,
      color: 'text-primary-yellow'
    },
    {
      title: 'Active Users',
      value: '127',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'text-primary-blue'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-400'
    }
  ]

  const serviceUsage = [
    { name: 'AI Chatbots', calls: 1247, tokens: 8934, percentage: 44 },
    { name: 'WhatsApp Bot', calls: 892, tokens: 4521, percentage: 31 },
    { name: 'Text to Speech', calls: 456, tokens: 3127, percentage: 16 },
    { name: 'Voice Calls', calls: 252, tokens: 1810, percentage: 9 }
  ]

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400'
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Analytics data refreshed')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics & Intelligence</h1>
          <p className="text-white/80">Comprehensive insights into platform performance and usage</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-glass w-auto"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={() => toast.success('Analytics data exported to CSV')}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'usage', label: 'Usage Analytics', icon: Activity },
          { id: 'performance', label: 'Performance', icon: Cpu },
          { id: 'business', label: 'Business Metrics', icon: DollarSign }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => {
              const TrendIcon = getTrendIcon(stat.trend)
              return (
                <motion.div
                  key={stat.title}
                  className="glass-strong p-6 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <div className={`flex items-center mt-2 ${getTrendColor(stat.trend)}`}>
                        <TrendIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Service Usage Breakdown */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Service Usage Breakdown</h2>
              <Button variant="outline" size="sm" className="glass text-white border-white/20 hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="space-y-4">
              {serviceUsage.map((service, index) => (
                <div key={service.name} className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <span className="text-white/60 text-sm">{service.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <motion.div
                      className="bg-gradient-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${service.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>{service.calls.toLocaleString()} calls</span>
                    <span>{service.tokens.toLocaleString()} tokens</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Other tabs would go here - keeping this simple for now */}
    </div>
  )
}