'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Activity, AlertTriangle, CheckCircle2, Clock, DollarSign,
  TrendingUp, TrendingDown, Zap, Brain, RefreshCw, Settings,
  Eye, EyeOff, Bell, BellOff, Play, Pause, Gauge, Target,
  BarChart3, LineChart, PieChart, Monitor, Shield, Wifi,
  WifiOff, Server, AlertCircle, Info, X, Filter, Download
} from 'lucide-react'
import { toast } from 'sonner'
import { aiPerformanceMonitor } from '@/services/ai-performance-monitor'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AIMonitoringPage() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h')
  const [showAlerts, setShowAlerts] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [alertFilters, setAlertFilters] = useState<string[]>([])
  const updateInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startMonitoring()
    return () => stopMonitoring()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      updateInterval.current = setInterval(loadDashboardData, 5000) // Update every 5 seconds
      return () => {
        if (updateInterval.current) clearInterval(updateInterval.current)
      }
    }
  }, [autoRefresh])

  const startMonitoring = async () => {
    try {
      aiPerformanceMonitor.startMonitoring()
      setIsMonitoring(true)
      
      // Subscribe to real-time updates
      const unsubscribe = aiPerformanceMonitor.subscribe((data) => {
        if (data.type === 'metric') {
          loadDashboardData() // Refresh dashboard on new metrics
        } else if (data.type === 'alert') {
          toast.error(`Alert: ${data.data.message}`)
        } else if (data.type === 'health_score') {
          // Handle health score updates
          setDashboardData((prev: any) => {
            if (!prev) return prev
            const updatedModels = prev.modelMetrics.map((model: any) => 
              model.modelId === data.data.modelId 
                ? { ...model, healthScore: data.data.score }
                : model
            )
            return { ...prev, modelMetrics: updatedModels }
          })
        }
      })

      await loadDashboardData()
      toast.success('Real-time monitoring started')
      
      return unsubscribe
    } catch (error) {
      toast.error('Failed to start monitoring')
      console.error(error)
    }
  }

  const stopMonitoring = () => {
    aiPerformanceMonitor.stopMonitoring()
    setIsMonitoring(false)
    if (updateInterval.current) {
      clearInterval(updateInterval.current)
    }
    toast.info('Monitoring stopped')
  }

  const loadDashboardData = async () => {
    try {
      const data = await aiPerformanceMonitor.getRealTimeDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount)
  }

  // Chart configurations
  const requestsChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${59 - i}m ago`),
    datasets: [
      {
        label: 'Requests',
        data: dashboardData?.trends.requestsPerMinute || [],
        borderColor: 'rgb(6, 214, 160)',
        backgroundColor: 'rgba(6, 214, 160, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const latencyChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${59 - i}m ago`),
    datasets: [
      {
        label: 'Latency (ms)',
        data: dashboardData?.trends.latencyTrend || [],
        borderColor: 'rgb(17, 138, 178)',
        backgroundColor: 'rgba(17, 138, 178, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const errorRateChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${59 - i}m ago`),
    datasets: [
      {
        label: 'Error Rate (%)',
        data: dashboardData?.trends.errorRateTrend || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const costChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${59 - i}m ago`),
    datasets: [
      {
        label: 'Cost ($)',
        data: dashboardData?.trends.costTrend || [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const modelDistributionData = {
    labels: dashboardData?.modelMetrics.map((m: any) => m.modelName) || [],
    datasets: [
      {
        data: dashboardData?.modelMetrics.map((m: any) => m.requests) || [],
        backgroundColor: [
          'rgba(6, 214, 160, 0.8)',
          'rgba(17, 138, 178, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(6, 214, 160)',
          'rgb(17, 138, 178)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-white/80">Loading monitoring dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real-time AI Monitoring</h1>
          <p className="text-white/80">Monitor AI model performance, costs, and health in real-time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-white/60 text-sm">
              {isMonitoring ? 'Live' : 'Offline'}
            </span>
          </div>
          
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            size="sm"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            {autoRefresh ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Auto Refresh
          </Button>
          
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white mt-1">
                {dashboardData.overview.totalRequests.toLocaleString()}
              </p>
            </div>
            <Activity className="h-8 w-8 text-primary-green" />
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
              <p className="text-white/60 text-sm">Avg Latency</p>
              <p className="text-2xl font-bold text-white mt-1">
                {dashboardData.overview.averageLatency}ms
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
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
              <p className="text-white/60 text-sm">Error Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {dashboardData.overview.errorRate}%
              </p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${dashboardData.overview.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`} />
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
              <p className="text-white/60 text-sm">Total Cost</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(dashboardData.overview.totalCost)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Models</p>
              <p className="text-2xl font-bold text-white mt-1">
                {dashboardData.overview.activeModels}
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Requests Trend */}
        <div className="glass-strong p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Requests Per Minute</h3>
          <div className="h-64">
            <Line data={requestsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Latency Trend */}
        <div className="glass-strong p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Average Latency</h3>
          <div className="h-64">
            <Line data={latencyChartData} options={chartOptions} />
          </div>
        </div>

        {/* Error Rate Trend */}
        <div className="glass-strong p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Error Rate</h3>
          <div className="h-64">
            <Line data={errorRateChartData} options={chartOptions} />
          </div>
        </div>

        {/* Model Distribution */}
        <div className="glass-strong p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Request Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={modelDistributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: 15
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Model Performance Table */}
      <div className="glass-strong p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Model Performance</h3>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 pb-3">Model</th>
                <th className="text-left text-white/60 pb-3">Health</th>
                <th className="text-right text-white/60 pb-3">Requests</th>
                <th className="text-right text-white/60 pb-3">Latency</th>
                <th className="text-right text-white/60 pb-3">Error Rate</th>
                <th className="text-right text-white/60 pb-3">Cost</th>
                <th className="text-right text-white/60 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.modelMetrics.map((model: any, index: number) => (
                <motion.tr
                  key={model.modelId}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5 text-primary-green" />
                      <div>
                        <p className="text-white font-medium">{model.modelName}</p>
                        <p className="text-white/40 text-xs">{model.modelId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getHealthBadgeColor(model.healthScore)}>
                        {model.healthScore}%
                      </Badge>
                      <Gauge className={`h-4 w-4 ${getHealthColor(model.healthScore)}`} />
                    </div>
                  </td>
                  <td className="py-4 text-right text-white">{model.requests.toLocaleString()}</td>
                  <td className="py-4 text-right text-white">{model.latency}ms</td>
                  <td className="py-4 text-right">
                    <span className={`${model.errorRate > 5 ? 'text-red-400' : 'text-green-400'}`}>
                      {model.errorRate}%
                    </span>
                  </td>
                  <td className="py-4 text-right text-white">{formatCurrency(model.cost)}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {model.healthScore >= 80 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : model.healthScore >= 60 ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && dashboardData.alerts.length > 0 && (
        <div className="glass-strong p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-yellow-400" />
              Active Alerts ({dashboardData.alerts.length})
            </h3>
            <Button
              onClick={() => setShowAlerts(false)}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {dashboardData.alerts.map((alert: any, index: number) => (
              <motion.div
                key={alert.id}
                className="glass p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'high' ? 'text-orange-400' :
                      alert.severity === 'medium' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div>
                      <h4 className="text-white font-medium">{alert.message}</h4>
                      <p className="text-white/60 text-sm">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}