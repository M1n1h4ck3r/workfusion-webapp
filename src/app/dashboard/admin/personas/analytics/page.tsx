'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PersonaService, type Persona, type PersonaUsageStats } from '@/services/persona-service'
import { LoadingSpinner } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3, TrendingUp, Users, MessageSquare,
  Star, Clock, Download, RefreshCw, Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface PersonaAnalytics {
  persona: Persona
  stats: {
    totalChats: number
    totalTokens: number
    avgRating: number
    totalRatings: number
    activeUsers: number
    lastUsed: string
    growth: number // percentage growth
  }
}

export default function PersonaAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PersonaAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [sortBy, setSortBy] = useState<'chats' | 'rating' | 'tokens' | 'users'>('chats')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      
      // Get all personas
      const personas = await PersonaService.getActivePersonas()
      
      // Get analytics for each persona
      const analyticsData: PersonaAnalytics[] = []
      
      for (const persona of personas) {
        const usageStats = await PersonaService.getUsageStats(persona.id)
        
        // Filter by time range
        const now = new Date()
        const filterDate = new Date()
        
        switch (timeRange) {
          case '7d':
            filterDate.setDate(now.getDate() - 7)
            break
          case '30d':
            filterDate.setDate(now.getDate() - 30)
            break
          case '90d':
            filterDate.setDate(now.getDate() - 90)
            break
          default:
            filterDate.setFullYear(2020) // Include all data
        }
        
        const filteredStats = usageStats.filter(stat => 
          new Date(stat.started_at) >= filterDate
        )
        
        // Calculate metrics
        const totalChats = filteredStats.length
        const totalTokens = filteredStats.reduce((sum, stat) => sum + stat.tokens_used, 0)
        const ratings = filteredStats.filter(stat => stat.rating).map(stat => stat.rating!)
        const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
        const activeUsers = new Set(filteredStats.map(stat => stat.user_id)).size
        const lastUsed = filteredStats.length > 0 ? filteredStats[0].started_at : ''
        
        // Calculate growth (simplified - comparing to previous period)
        const previousPeriodStart = new Date(filterDate)
        const periodLength = now.getTime() - filterDate.getTime()
        previousPeriodStart.setTime(filterDate.getTime() - periodLength)
        
        const previousStats = usageStats.filter(stat => {
          const statDate = new Date(stat.started_at)
          return statDate >= previousPeriodStart && statDate < filterDate
        })
        
        const growth = previousStats.length > 0 
          ? ((totalChats - previousStats.length) / previousStats.length) * 100 
          : 0
        
        analyticsData.push({
          persona,
          stats: {
            totalChats,
            totalTokens,
            avgRating,
            totalRatings: ratings.length,
            activeUsers,
            lastUsed,
            growth
          }
        })
      }
      
      // Sort analytics
      analyticsData.sort((a, b) => {
        switch (sortBy) {
          case 'chats':
            return b.stats.totalChats - a.stats.totalChats
          case 'rating':
            return b.stats.avgRating - a.stats.avgRating
          case 'tokens':
            return b.stats.totalTokens - a.stats.totalTokens
          case 'users':
            return b.stats.activeUsers - a.stats.activeUsers
          default:
            return 0
        }
      })
      
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalMetrics = () => {
    return analytics.reduce(
      (totals, item) => ({
        totalChats: totals.totalChats + item.stats.totalChats,
        totalTokens: totals.totalTokens + item.stats.totalTokens,
        activePersonas: analytics.filter(a => a.stats.totalChats > 0).length,
        totalUsers: new Set(analytics.flatMap(a => [a.stats.activeUsers])).size
      }),
      { totalChats: 0, totalTokens: 0, activePersonas: 0, totalUsers: 0 }
    )
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      case 'all': return 'All time'
    }
  }

  const exportData = () => {
    const csvData = analytics.map(item => ({
      name: item.persona.name,
      category: item.persona.category,
      totalChats: item.stats.totalChats,
      totalTokens: item.stats.totalTokens,
      avgRating: item.stats.avgRating.toFixed(2),
      activeUsers: item.stats.activeUsers,
      growth: item.stats.growth.toFixed(1) + '%',
      lastUsed: item.stats.lastUsed
    }))
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `persona-analytics-${timeRange}.csv`
    a.click()
    
    toast.success('Analytics exported successfully')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/80">Loading analytics...</span>
      </div>
    )
  }

  const totals = getTotalMetrics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Persona Analytics</h1>
          <p className="text-white/80">Performance insights and usage statistics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadAnalytics}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={exportData}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-strong p-4 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input-glass w-full"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div>
            <label className="text-white/80 text-sm mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-glass w-full"
            >
              <option value="chats">Total Chats</option>
              <option value="rating">Average Rating</option>
              <option value="tokens">Tokens Used</option>
              <option value="users">Active Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MessageSquare className="h-8 w-8 mx-auto mb-3 text-primary-green" />
          <div className="text-3xl font-bold text-white mb-1">
            {totals.totalChats.toLocaleString()}
          </div>
          <div className="text-white/60 text-sm">Total Conversations</div>
          <div className="text-xs text-white/50 mt-1">{getTimeRangeLabel()}</div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Users className="h-8 w-8 mx-auto mb-3 text-blue-400" />
          <div className="text-3xl font-bold text-white mb-1">
            {totals.activePersonas}
          </div>
          <div className="text-white/60 text-sm">Active Personas</div>
          <div className="text-xs text-white/50 mt-1">With usage data</div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-400" />
          <div className="text-3xl font-bold text-white mb-1">
            {(totals.totalTokens / 1000).toFixed(1)}K
          </div>
          <div className="text-white/60 text-sm">Tokens Processed</div>
          <div className="text-xs text-white/50 mt-1">Total usage</div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-400" />
          <div className="text-3xl font-bold text-white mb-1">
            {analytics.length > 0 ? (analytics.reduce((sum, a) => sum + a.stats.avgRating, 0) / analytics.length).toFixed(1) : 'N/A'}
          </div>
          <div className="text-white/60 text-sm">Average Rating</div>
          <div className="text-xs text-white/50 mt-1">Across all personas</div>
        </motion.div>
      </div>

      {/* Persona Performance Table */}
      <motion.div
        className="glass-strong rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Persona Performance</h2>
          <p className="text-white/60 text-sm mt-1">{getTimeRangeLabel()} • Sorted by {sortBy}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-white/80 font-medium">Persona</th>
                <th className="text-center p-4 text-white/80 font-medium">Chats</th>
                <th className="text-center p-4 text-white/80 font-medium">Rating</th>
                <th className="text-center p-4 text-white/80 font-medium">Tokens</th>
                <th className="text-center p-4 text-white/80 font-medium">Users</th>
                <th className="text-center p-4 text-white/80 font-medium">Growth</th>
                <th className="text-center p-4 text-white/80 font-medium">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((item, index) => (
                <tr key={item.persona.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {item.persona.avatar_type === 'image' && item.persona.avatar_url ? (
                          <img 
                            src={item.persona.avatar_url} 
                            alt={item.persona.name} 
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-2xl">{item.persona.avatar_emoji || '🤖'}</div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.persona.name}</div>
                        <div className="text-white/60 text-sm">{item.persona.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-white font-semibold">{item.stats.totalChats}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-semibold">
                        {item.stats.avgRating > 0 ? item.stats.avgRating.toFixed(1) : 'N/A'}
                      </span>
                      {item.stats.totalRatings > 0 && (
                        <span className="text-white/60 text-xs">({item.stats.totalRatings})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-white font-semibold">
                      {(item.stats.totalTokens / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-white font-semibold">{item.stats.activeUsers}</div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge
                      className={
                        item.stats.growth > 0
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : item.stats.growth < 0
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }
                    >
                      {item.stats.growth > 0 ? '+' : ''}{item.stats.growth.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="h-3 w-3 text-white/50" />
                      <span className="text-white/70 text-sm">
                        {item.stats.lastUsed 
                          ? new Date(item.stats.lastUsed).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analytics.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-white/30" />
            <h3 className="text-lg font-semibold text-white mb-2">No data available</h3>
            <p className="text-white/60">
              No usage data found for the selected time period.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}