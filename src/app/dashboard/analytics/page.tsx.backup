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

  const recentActivity = [
    {
      id: 1,
      service: 'AI Chatbot',
      user: 'john@example.com',
      action: 'Chat session with Alex Hormozi',
      tokens: 5,
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      service: 'WhatsApp',
      user: 'sarah@example.com',
      action: 'Bulk message to 25 contacts',
      tokens: 75,
      timestamp: '5 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      service: 'TTS',
      user: 'mike@example.com',
      action: 'Generated 30-second audio',
      tokens: 3,
      timestamp: '8 minutes ago',
      status: 'success'
    },
    {
      id: 4,
      service: 'Voice Call',
      user: 'emily@example.com',
      action: 'Sales call - 4:32 duration',
      tokens: 15,
      timestamp: '12 minutes ago',
      status: 'success'
    },
    {
      id: 5,
      service: 'AI Chatbot',
      user: 'alex@example.com',
      action: 'Extended conversation',
      tokens: 8,
      timestamp: '15 minutes ago',
      status: 'failed'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

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
            onClick={() => setActiveTab(tab.id)}
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

      {/* Usage Analytics Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* AI Model Usage */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary-green" />
              AI Model Performance
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { model: 'GPT-4 Turbo', usage: 78, cost: 312.45, calls: 45621 },
                  { model: 'Claude 3 Sonnet', usage: 56, cost: 178.92, calls: 32147 },
                  { model: 'GPT-3.5 Turbo', usage: 34, cost: 89.34, calls: 28934 },
                  { model: 'Gemini Pro', usage: 23, cost: 45.67, calls: 15672 }
                ].map((model) => (
                  <div key={model.model} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{model.model}</span>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-white">{formatNumber(model.calls)} calls</span>
                        <span className="text-green-400">${model.cost}</span>
                      </div>
                    </div>
                    <Progress value={model.usage} className="h-2" />
                    <div className="text-xs text-white/60 text-right">
                      {model.usage}% usage
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-white">Usage Insights</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• GPT-4 Turbo most popular for complex reasoning</p>
                  <p>• Claude 3 preferred for long-form content</p>
                  <p>• GPT-3.5 Turbo cost-effective for simple tasks</p>
                  <p>• Gemini Pro excellent for multilingual content</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Analytics */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-blue" />
                User Engagement
              </h3>
              
              <div className="space-y-4">
                {[
                  { segment: 'Power Users', count: 234, engagement: 92 },
                  { segment: 'Regular Users', count: 567, engagement: 76 },
                  { segment: 'Casual Users', count: 345, engagement: 45 },
                  { segment: 'Trial Users', count: 107, engagement: 28 }
                ].map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <span className="text-white/80">{segment.segment}</span>
                      <p className="text-white/60 text-xs">{segment.count} users</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">{segment.engagement}%</span>
                      <p className="text-white/60 text-xs">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary-yellow" />
                Geographic Distribution
              </h3>
              
              <div className="space-y-3">
                {[
                  { country: 'United States', users: 547, flag: '🇺🇸' },
                  { country: 'United Kingdom', users: 234, flag: '🇬🇧' },
                  { country: 'Germany', users: 189, flag: '🇩🇪' },
                  { country: 'France', users: 156, flag: '🇫🇷' },
                  { country: 'Canada', users: 127, flag: '🇨🇦' }
                ].map((country) => (
                  <div key={country.country} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-white/80">{country.country}</span>
                    </div>
                    <span className="text-white font-medium">{country.users}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* System Health */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">99.97%</h3>
                <p className="text-white/60">Uptime</p>
                <p className="text-green-400 text-sm mt-2">Excellent</p>
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Timer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">1.6s</h3>
                <p className="text-white/60">Avg Response Time</p>
                <p className="text-blue-400 text-sm mt-2">Good</p>
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">99.85%</h3>
                <p className="text-white/60">Reliability</p>
                <p className="text-green-400 text-sm mt-2">Excellent</p>
              </div>
            </motion.div>
          </div>

          {/* Performance Trends */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary-green" />
              Performance Metrics
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { metric: 'Response Time', value: '1.6s', target: '<2s', status: 'good' },
                  { metric: 'Error Rate', value: '0.03%', target: '<0.1%', status: 'excellent' },
                  { metric: 'Throughput', value: '1.2k/min', target: '>1k/min', status: 'good' },
                  { metric: 'Memory Usage', value: '67%', target: '<80%', status: 'good' }
                ].map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between p-3 glass rounded-lg">
                    <span className="text-white/80">{metric.metric}</span>
                    <div className="text-right">
                      <span className="text-white font-medium">{metric.value}</span>
                      <p className={`text-xs ${metric.status === 'excellent' ? 'text-green-400' : metric.status === 'good' ? 'text-blue-400' : 'text-yellow-400'}`}>
                        Target: {metric.target}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="text-md font-medium text-white mb-3">System Status</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• All systems operational</p>
                  <p>• API endpoints responding normally</p>
                  <p>• Database performance optimal</p>
                  <p>• CDN latency within SLA</p>
                  <p>• No scheduled maintenance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +6.4%
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-white/60 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(49750.80)}</p>
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-400" />
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  -2.1%
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-white/60 text-sm">Churn Rate</p>
                <p className="text-2xl font-bold text-white">2.1%</p>
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Target className="h-8 w-8 text-purple-400" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  +12.3%
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-white/60 text-sm">Customer LTV</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(847.50)}</p>
              </div>
            </motion.div>

            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Percent className="h-8 w-8 text-yellow-400" />
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Healthy
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-white/60 text-sm">Profit Margin</p>
                <p className="text-2xl font-bold text-white">73.2%</p>
              </div>
            </motion.div>
          </div>

          {/* Business Intelligence */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary-blue" />
              Business Intelligence
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">Revenue by Plan</h4>
                {[
                  { plan: 'Enterprise', revenue: 68000, users: 68 },
                  { plan: 'Business', revenue: 37800, users: 189 },
                  { plan: 'Professional', revenue: 37150, users: 743 },
                  { plan: 'Starter', revenue: 36940, users: 1847 }
                ].map((plan) => {
                  const total = 68000 + 37800 + 37150 + 36940
                  const percentage = (plan.revenue / total) * 100
                  
                  return (
                    <div key={plan.plan} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">{plan.plan}</span>
                        <span className="text-white">{formatCurrency(plan.revenue)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>{percentage.toFixed(1)}% of revenue</span>
                        <span>{plan.users} users</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-white">Key Insights</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Enterprise accounts drive highest revenue per user</p>
                  <p>• Professional plan has best conversion rate</p>
                  <p>• Starter users upgrade within 2.3 months average</p>
                  <p>• Business tier adoption up 45% this quarter</p>
                  <p>• Customer satisfaction score: 4.7/5</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

          {/* Recent Activity */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Button variant="outline" size="sm" className="glass text-white border-white/20 hover:bg-white/10">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary-green" />
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-white/60 text-sm">{activity.user}</span>
                          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
                            {activity.service}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                          <Zap className="mr-1 h-2 w-2" />
                          {activity.tokens}
                        </Badge>
                      </div>
                      <p className="text-white/50 text-xs mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                Load More Activity
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-strong p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full glass text-white border-white/20 hover:bg-white/10 justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Usage Report
                </Button>
                <Button variant="outline" className="w-full glass text-white border-white/20 hover:bg-white/10 justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
                <Button variant="outline" className="w-full glass text-white border-white/20 hover:bg-white/10 justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Custom Dashboard
                </Button>
              </div>
            </div>
            
            <div className="glass-strong p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Peak Usage Time</span>
                  <span className="text-white font-medium">2-4 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Most Active Day</span>
                  <span className="text-white font-medium">Tuesday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Avg Response Time</span>
                  <span className="text-white font-medium">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Error Rate</span>
                  <span className="text-green-400 font-medium">1.3%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}