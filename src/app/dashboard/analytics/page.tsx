'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, MessageSquare,
  Phone, Mic, Zap, Calendar, Download, Filter, RefreshCw
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('all')

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/80">Monitor your AI service usage and performance</p>
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
          
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="input-glass w-auto"
          >
            {metrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
          
          <Button variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

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
  )
}