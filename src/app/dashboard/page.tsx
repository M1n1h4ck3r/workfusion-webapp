'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import {
  Bot,
  MessageSquare,
  Phone,
  Mic,
  CreditCard,
  TrendingUp,
  Zap,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

// Mock data - replace with real data from API
const stats = {
  tokens: {
    current: 482,
    total: 500,
    percentage: 96.4,
    trend: -3.2
  },
  usage: {
    today: 18,
    week: 142,
    month: 892,
    trend: 12.5
  },
  tools: [
    { name: 'AI Chatbots', icon: Bot, usage: 234, color: 'green' },
    { name: 'WhatsApp', icon: MessageSquare, usage: 156, color: 'yellow' },
    { name: 'Voice Calls', icon: Phone, usage: 89, color: 'orange' },
    { name: 'Text to Speech', icon: Mic, usage: 103, color: 'green' }
  ],
  recentActivity: [
    { id: 1, tool: 'AI Chatbot', action: 'Chat with Alex Hormozi', tokens: 12, time: '2 hours ago' },
    { id: 2, tool: 'WhatsApp', action: 'Sent bulk message', tokens: 8, time: '4 hours ago' },
    { id: 3, tool: 'TTS', action: 'Generated audio', tokens: 5, time: '6 hours ago' },
    { id: 4, tool: 'Voice Call', action: 'Test call completed', tokens: 15, time: 'Yesterday' },
    { id: 5, tool: 'AI Chatbot', action: 'Chat with Jordan Peterson', tokens: 10, time: 'Yesterday' }
  ]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week')

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-white/80">
            Here's an overview of your AI playground usage and statistics.
          </p>
        </div>
        
        <Link href="/dashboard/billing">
          <Button className="btn-primary mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Tokens
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Token Balance */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <Badge className={`${stats.tokens.trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.tokens.trend >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(stats.tokens.trend)}%
            </Badge>
          </div>
          
          <h3 className="text-white/80 text-sm mb-1">Token Balance</h3>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-bold text-white">{stats.tokens.current}</span>
            <span className="text-white/60 text-sm">/ {stats.tokens.total}</span>
          </div>
          
          <Progress value={stats.tokens.percentage} className="h-2" />
        </motion.div>

        {/* Today's Usage */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-green-500/20 text-green-400">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {stats.usage.trend}%
            </Badge>
          </div>
          
          <h3 className="text-white/80 text-sm mb-1">Today's Usage</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.usage.today}</span>
            <span className="text-white/60 text-sm">tokens</span>
          </div>
        </motion.div>

        {/* Weekly Usage */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-white/60 text-xs">This Week</span>
          </div>
          
          <h3 className="text-white/80 text-sm mb-1">Weekly Usage</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.usage.week}</span>
            <span className="text-white/60 text-sm">tokens</span>
          </div>
        </motion.div>

        {/* Monthly Usage */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-white/60 text-xs">This Month</span>
          </div>
          
          <h3 className="text-white/80 text-sm mb-1">Monthly Usage</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">{stats.usage.month}</span>
            <span className="text-white/60 text-sm">tokens</span>
          </div>
        </motion.div>
      </div>

      {/* Tools Usage & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tools Usage */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Tools Usage</h2>
            <Badge className="bg-white/10 text-white/80">Last 30 days</Badge>
          </div>

          <div className="space-y-4">
            {stats.tools.map((tool, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${
                      tool.color === 'green' ? 'from-green-400 to-emerald-500' :
                      tool.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                      'from-orange-400 to-red-500'
                    } rounded-lg flex items-center justify-center`}>
                      <tool.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/90">{tool.name}</span>
                  </div>
                  <span className="text-white/80 font-medium">{tool.usage} tokens</span>
                </div>
                <Progress 
                  value={(tool.usage / stats.usage.month) * 100} 
                  className="h-1.5"
                />
              </div>
            ))}
          </div>

          <Link href="/dashboard/analytics">
            <Button variant="ghost" className="w-full mt-6 text-white/80 hover:text-white hover:bg-white/10">
              View Detailed Analytics
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-primary-green/20 text-primary-green text-xs">
                      {activity.tool}
                    </Badge>
                    <span className="text-white/90 text-sm">{activity.action}</span>
                  </div>
                  <span className="text-white/60 text-xs">{activity.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-primary-yellow" />
                  <span className="text-white/80 text-sm font-medium">{activity.tokens}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/playground">
            <Button variant="outline" className="w-full h-24 flex-col space-y-2 glass text-white border-white/20 hover:bg-white/10">
              <Bot className="h-6 w-6" />
              <span>AI Chatbot</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/whatsapp">
            <Button variant="outline" className="w-full h-24 flex-col space-y-2 glass text-white border-white/20 hover:bg-white/10">
              <MessageSquare className="h-6 w-6" />
              <span>WhatsApp</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/tts">
            <Button variant="outline" className="w-full h-24 flex-col space-y-2 glass text-white border-white/20 hover:bg-white/10">
              <Mic className="h-6 w-6" />
              <span>Text to Speech</span>
            </Button>
          </Link>
          
          <Link href="/dashboard/billing">
            <Button variant="outline" className="w-full h-24 flex-col space-y-2 glass text-white border-white/20 hover:bg-white/10">
              <CreditCard className="h-6 w-6" />
              <span>Add Tokens</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}