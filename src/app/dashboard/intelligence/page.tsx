'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp, TrendingDown, Minus, Brain, Sparkles, AlertTriangle,
  BarChart3, PieChart, LineChart, Activity, Target, Zap,
  DollarSign, Users, ShoppingCart, Package, Clock, Calendar,
  ChevronRight, ChevronUp, ChevronDown, Info, CheckCircle2,
  AlertCircle, XCircle, Lightbulb, Shield, TrendingUp as Trend,
  Eye, Download, Share2, Settings, RefreshCw, Filter, Plus,
  ArrowUp, ArrowDown, Maximize2, Minimize2, Bell, Search, FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  aiBusinessIntelligence, 
  BusinessMetric, 
  InsightData, 
  IntelligenceReport,
  Prediction,
  Risk,
  Opportunity
} from '@/services/ai-intelligence'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

type ViewMode = 'dashboard' | 'insights' | 'predictions' | 'report'

export default function IntelligencePage() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([])
  const [report, setReport] = useState<IntelligenceReport | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedMetric, setSelectedMetric] = useState<BusinessMetric | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showInsightDetails, setShowInsightDetails] = useState<InsightData | null>(null)

  useEffect(() => {
    loadIntelligenceData()
    
    if (autoRefresh) {
      const interval = setInterval(loadIntelligenceData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadIntelligenceData = async () => {
    try {
      const [businessMetrics, intelligenceReport] = await Promise.all([
        aiBusinessIntelligence.getBusinessMetrics(),
        aiBusinessIntelligence.analyzeBusinessPerformance()
      ])
      
      setMetrics(businessMetrics)
      setReport(intelligenceReport)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load intelligence data:', error)
      toast.error('Failed to load business intelligence data')
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-400" />
      case 'down': return <TrendingDown className="h-5 w-5 text-red-400" />
      default: return <Minus className="h-5 w-5 text-yellow-400" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-yellow-400" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-400" />
      case 'recommendation': return <CheckCircle2 className="h-5 w-5 text-blue-400" />
      case 'achievement': return <Trophy className="h-5 w-5 text-green-400" />
      default: return <Info className="h-5 w-5 text-white/60" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-white/60'
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return `$${(value / 1000).toFixed(1)}K`
    }
    if (unit === 'users' || unit === 'requests') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`
    }
    return value.toLocaleString()
  }

  // Chart configurations
  const createLineChartData = (metric: BusinessMetric) => ({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
    datasets: [
      {
        label: metric.name,
        data: [
          metric.previousValue * 0.7,
          metric.previousValue * 0.85,
          metric.previousValue * 0.95,
          metric.previousValue,
          metric.value
        ],
        borderColor: '#06D6A0',
        backgroundColor: 'rgba(6, 214, 160, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Forecast',
        data: [null, null, null, null, metric.value, metric.forecast?.nextPeriod],
        borderColor: '#A855F7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  })

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: 'rgba(255, 255, 255, 0.8)' }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <Brain className="h-12 w-12 text-primary-green mx-auto mb-4 animate-pulse" />
          <p className="text-white/80">Analyzing business intelligence...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary-green" />
            AI Business Intelligence
          </h1>
          <p className="text-white/80">Real-time insights powered by advanced AI analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            className={`glass text-white border-white/20 ${autoRefresh ? 'bg-white/10' : 'hover:bg-white/10'}`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          <Button
            onClick={loadIntelligenceData}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="glass-strong p-2 rounded-xl flex items-center space-x-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'insights', label: 'AI Insights', icon: Sparkles },
          { id: 'predictions', label: 'Predictions', icon: Trend },
          { id: 'report', label: 'Full Report', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                viewMode === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.slice(0, 4).map((metric, index) => (
              <motion.div
                key={metric.id}
                className="glass-strong p-6 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMetric(metric)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/60 text-sm">{metric.name}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatValue(metric.value, metric.unit)}
                    </p>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                  </span>
                  <span className="text-white/40 text-xs">vs last period</span>
                </div>

                <Progress 
                  value={Math.min(100, Math.abs(metric.changePercent * 2))}
                  className="h-2 mb-3"
                />

                {metric.anomaly?.detected && (
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Anomaly Detected
                  </Badge>
                )}

                {metric.insights && metric.insights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/60 text-xs mb-2">AI Insights</p>
                    {metric.insights.slice(0, 1).map((insight) => (
                      <div 
                        key={insight.id}
                        className="flex items-start space-x-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowInsightDetails(insight)
                        }}
                      >
                        {getInsightIcon(insight.type)}
                        <p className="text-white/80 text-xs line-clamp-2">
                          {insight.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          {selectedMetric && (
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {selectedMetric.name} Analysis
                </h3>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="text-white/60 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <div className="glass p-4 rounded-lg">
                  <h4 className="text-white/80 text-sm mb-4">Historical Trend & Forecast</h4>
                  <div className="h-64">
                    <Line 
                      data={createLineChartData(selectedMetric)} 
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Forecast Details */}
                {selectedMetric.forecast && (
                  <div className="glass p-4 rounded-lg">
                    <h4 className="text-white/80 text-sm mb-4">AI Forecast</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Next Period</span>
                        <span className="text-white font-medium">
                          {formatValue(selectedMetric.forecast.nextPeriod, selectedMetric.unit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Confidence</span>
                        <span className="text-white">
                          {(selectedMetric.forecast.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Range</span>
                        <span className="text-white text-sm">
                          {formatValue(selectedMetric.forecast.lowerBound, selectedMetric.unit)} - 
                          {formatValue(selectedMetric.forecast.upperBound, selectedMetric.unit)}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-white/60 text-xs mb-2">Seasonality Pattern</p>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {selectedMetric.forecast.seasonality?.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && report && (
        <div className="space-y-6">
          {/* Key Findings */}
          <div className="glass-strong p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Key Findings</h3>
            <div className="space-y-4">
              {report.keyFindings.map((finding, index) => (
                <motion.div
                  key={finding.id}
                  className="glass p-4 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{finding.title}</h4>
                    <Badge className={`${
                      finding.significance === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      finding.significance === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {finding.significance}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{finding.description}</p>
                  <div className="space-y-1">
                    {finding.evidence.map((evidence, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-white/60 text-xs">{evidence}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/40 text-xs">
                      Confidence: {(finding.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-strong p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  className="glass p-4 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-yellow-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{rec.title}</h4>
                      <p className="text-white/60 text-sm mb-3">{rec.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-white/40 text-xs">Impact:</span>
                          <Badge className={`${
                            rec.impact === 'high' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            rec.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          } text-xs`}>
                            {rec.impact}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white/40 text-xs">Effort:</span>
                          <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                            {rec.effort}
                          </Badge>
                        </div>
                      </div>

                      <div className="glass p-3 rounded">
                        <p className="text-white/80 text-xs">{rec.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictions View */}
      {viewMode === 'predictions' && report && (
        <div className="space-y-6">
          {report.predictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {prediction.metric} Prediction
                </h3>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {(prediction.confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {prediction.scenarios.map((scenario) => (
                  <div key={scenario.name} className="glass p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{scenario.name}</h4>
                    <p className="text-2xl font-bold text-white mb-2">
                      ${(scenario.value / 1000).toFixed(0)}K
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Probability</span>
                        <span className="text-white">{(scenario.probability * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={scenario.probability * 100} className="h-2" />
                      <p className="text-white/60 text-xs mt-2">{scenario.impact}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 glass rounded-lg">
                <p className="text-white/60 text-sm mb-2">Methodology</p>
                <p className="text-white/80 text-sm">{prediction.methodology}</p>
              </div>
            </motion.div>
          ))}

          {/* Risks & Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-400" />
                Identified Risks
              </h3>
              <div className="space-y-3">
                {report.risks.map((risk) => (
                  <div key={risk.id} className="glass p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{risk.title}</h4>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        {(risk.probability * 100).toFixed(0)}% likely
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{risk.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/40 text-xs">Impact:</span>
                      <span className={`text-xs ${getImpactColor(risk.impact)}`}>
                        {risk.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-400" />
                Opportunities
              </h3>
              <div className="space-y-3">
                {report.opportunities.map((opp) => (
                  <div key={opp.id} className="glass p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{opp.title}</h4>
                    <p className="text-white/60 text-sm mb-2">{opp.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-medium">
                        ${(opp.potentialValue / 1000000).toFixed(1)}M potential
                      </span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        {(opp.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Report View */}
      {viewMode === 'report' && report && (
        <div className="glass-strong p-6 rounded-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
            <p className="text-white/60">{report.summary}</p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge className="bg-white/5 text-white/70 border-white/10">
                {report.type}
              </Badge>
              <span className="text-white/40 text-sm">{report.period}</span>
              <span className="text-white/40 text-sm">
                Generated {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Data Quality Score */}
          <div className="glass p-4 rounded-lg mb-6">
            <h3 className="text-white font-medium mb-3">Data Quality Assessment</h3>
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Overall', value: report.dataQuality.overall },
                { label: 'Completeness', value: report.dataQuality.completeness },
                { label: 'Accuracy', value: report.dataQuality.accuracy },
                { label: 'Consistency', value: report.dataQuality.consistency },
                { label: 'Timeliness', value: report.dataQuality.timeliness }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-white/60 text-xs mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${
                    item.value >= 90 ? 'text-green-400' :
                    item.value >= 70 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {item.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Full Report
          </Button>
        </div>
      )}

      {/* Insight Details Modal */}
      <AnimatePresence>
        {showInsightDetails && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInsightDetails(null)}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getInsightIcon(showInsightDetails.type)}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {showInsightDetails.title}
                    </h3>
                    <Badge className="mt-1 bg-white/5 text-white/70 border-white/10">
                      {showInsightDetails.type}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setShowInsightDetails(null)}
                  className="text-white/60 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <p className="text-white/80 mb-4">{showInsightDetails.description}</p>

              {showInsightDetails.actions && showInsightDetails.actions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Recommended Actions</h4>
                  {showInsightDetails.actions.map((action) => (
                    <div key={action.id} className="glass p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{action.label}</span>
                        <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                          {action.complexity} complexity
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm mb-2">{action.description}</p>
                      <p className="text-green-400 text-sm">{action.estimatedImpact}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <span className="text-white/40 text-sm">
                  Confidence: {(showInsightDetails.confidence * 100).toFixed(0)}%
                </span>
                <Button className="bg-gradient-primary hover:opacity-90 text-white">
                  Take Action
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Trophy component fix
const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
)