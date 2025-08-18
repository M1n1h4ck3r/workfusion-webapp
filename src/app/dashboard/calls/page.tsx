'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Phone, PhoneCall, Clock, CheckCircle, XCircle, 
  Play, Pause, Volume2, Download, Calendar, User,
  Mic, MicOff, Settings, BarChart3, Brain,
  MessageSquare, Zap, Monitor, Activity,
  PieChart, TrendingUp, FileAudio, Headphones
} from 'lucide-react'
import { toast } from 'sonner'

export default function CallsPage() {
  const [isDialing, setIsDialing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedScript, setSelectedScript] = useState('sales')
  const [activeTab, setActiveTab] = useState('dialer')
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [sentiment, setSentiment] = useState('neutral')
  const [confidence, setConfidence] = useState(85)

  // Mock call history data
  const callHistory = [
    {
      id: 1,
      phoneNumber: '+1 (555) 123-4567',
      contact: 'John Smith',
      duration: '3:45',
      status: 'completed',
      script: 'Sales Call',
      timestamp: '2024-01-15 14:30',
      recording: true
    },
    {
      id: 2,
      phoneNumber: '+1 (555) 987-6543',
      contact: 'Sarah Johnson',
      duration: '2:15',
      status: 'completed',
      script: 'Support Call',
      timestamp: '2024-01-15 13:15',
      recording: true
    },
    {
      id: 3,
      phoneNumber: '+1 (555) 456-7890',
      contact: 'Mike Wilson',
      duration: '0:30',
      status: 'failed',
      script: 'Appointment Booking',
      timestamp: '2024-01-15 12:00',
      recording: false
    }
  ]

  const scripts = [
    { id: 'sales', name: 'Sales Call', description: 'Product demonstration and closing', category: 'Sales' },
    { id: 'support', name: 'Support Call', description: 'Customer service and troubleshooting', category: 'Support' },
    { id: 'appointment', name: 'Appointment Booking', description: 'Schedule meetings and consultations', category: 'Booking' },
    { id: 'survey', name: 'Survey Call', description: 'Customer feedback collection', category: 'Research' },
    { id: 'followup', name: 'Follow-up Call', description: 'Post-purchase or meeting follow-up', category: 'Retention' },
    { id: 'lead-qualification', name: 'Lead Qualification', description: 'Qualify potential prospects', category: 'Sales' },
    { id: 'payment-reminder', name: 'Payment Reminder', description: 'Follow up on overdue payments', category: 'Finance' }
  ]

  const realtimeMetrics = {
    totalCalls: 1247,
    activeCalls: 3,
    successRate: 78,
    avgDuration: '4:32',
    sentiment: {
      positive: 45,
      neutral: 35,
      negative: 20
    }
  }

  const voiceAnalytics = [
    { metric: 'Clarity', value: 92, color: 'text-green-400' },
    { metric: 'Pace', value: 88, color: 'text-blue-400' },
    { metric: 'Confidence', value: 85, color: 'text-primary-green' },
    { metric: 'Engagement', value: 91, color: 'text-yellow-400' }
  ]

  const handleStartCall = () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number')
      return
    }

    setIsDialing(true)
    toast.info('Initiating AI voice call...')

    // Simulate call process
    setTimeout(() => {
      setIsDialing(false)
      setIsCallActive(true)
      setIsRecording(true)
      toast.success('Call connected!')
      
      // Simulate call duration counter
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

      // End call after 10 seconds for demo
      setTimeout(() => {
        clearInterval(interval)
        setIsCallActive(false)
        setIsRecording(false)
        setCallDuration(0)
        toast.success('Call completed successfully!')
        setPhoneNumber('')
      }, 10000)
    }, 3000)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setIsRecording(false)
    setCallDuration(0)
    toast.success('Call ended')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    toast.info(isRecording ? 'Recording paused' : 'Recording resumed')
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'in-progress': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'failed': return XCircle
      case 'in-progress': return Clock
      default: return Clock
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Voice Calls</h1>
          <p className="text-white/80">Advanced AI-powered voice communication system</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="mr-1 h-3 w-3" />
            {realtimeMetrics.activeCalls} Active
          </Badge>
          <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
            <TrendingUp className="mr-1 h-3 w-3" />
            {realtimeMetrics.successRate}% Success
          </Badge>
        </div>
      </div>

      {/* Live Call Monitor - Show when call is active */}
      {isCallActive && (
        <motion.div
          className="glass-strong border-2 border-primary-green/50 rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary-green animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Call in Progress</h3>
                <p className="text-white/60">{phoneNumber}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{formatDuration(callDuration)}</div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/60">Live</span>
              </div>
            </div>
          </div>

          {/* Real-time Analytics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="glass p-4 rounded-lg text-center">
              <Brain className="h-6 w-6 text-primary-blue mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{confidence}%</div>
              <div className="text-xs text-white/60">AI Confidence</div>
            </div>
            
            <div className="glass p-4 rounded-lg text-center">
              <MessageSquare className="h-6 w-6 text-primary-green mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Live</div>
              <div className="text-xs text-white/60">Conversation</div>
            </div>
            
            <div className="glass p-4 rounded-lg text-center">
              <div className={`text-lg font-bold ${getSentimentColor(sentiment)}`}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </div>
              <div className="text-xs text-white/60">Sentiment</div>
            </div>
            
            <div className="glass p-4 rounded-lg text-center">
              <Volume2 className="h-6 w-6 text-primary-yellow mx-auto mb-2" />
              <div className="text-lg font-bold text-white">Clear</div>
              <div className="text-xs text-white/60">Audio Quality</div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleRecording}
              variant="outline"
              className={`glass border-white/20 ${isRecording ? 'text-red-400 border-red-400/50' : 'text-white'}`}
            >
              {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isRecording ? 'Recording' : 'Record'}
            </Button>
            
            <Button
              onClick={handleEndCall}
              className="bg-red-500 hover:bg-red-600 text-white px-8"
            >
              <PhoneCall className="h-4 w-4 mr-2 rotate-[135deg]" />
              End Call
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'dialer', label: 'Smart Dialer', icon: Phone },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'monitoring', label: 'Live Monitor', icon: Monitor },
          { id: 'recordings', label: 'Recordings', icon: FileAudio }
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

      {/* Quick Call Section */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Start New Call</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Phone Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="input-glass"
                disabled={isDialing}
              />
            </div>
            
            <div>
              <label className="text-white/80 text-sm mb-2 block">Call Script</label>
              <select 
                value={selectedScript}
                onChange={(e) => setSelectedScript(e.target.value)}
                className="input-glass w-full"
                disabled={isDialing}
              >
                {scripts.map((script) => (
                  <option key={script.id} value={script.id}>
                    {script.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-white/60 mt-1">
                {scripts.find(s => s.id === selectedScript)?.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              onClick={handleStartCall}
              disabled={isDialing || !phoneNumber}
              className="btn-primary h-20 w-20 rounded-full text-lg"
            >
              {isDialing ? (
                <LoadingSpinner />
              ) : (
                <PhoneCall className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Call History */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Call History</h2>
        
        <div className="space-y-3">
          {callHistory.map((call) => {
            const StatusIcon = getStatusIcon(call.status)
            return (
              <div key={call.id} className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary-green" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{call.contact}</p>
                        <Badge className="bg-white/10 text-white/70 border-white/20">
                          {call.script}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm">{call.phoneNumber}</p>
                      <p className="text-white/50 text-xs">{call.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(call.status)}`} />
                        <span className={`text-sm ${getStatusColor(call.status)}`}>
                          {call.status}
                        </span>
                      </div>
                      {call.duration && (
                        <p className="text-white/60 text-sm">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {call.duration}
                        </p>
                      )}
                    </div>
                    
                    {call.recording && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-strong p-6 rounded-xl text-center">
          <Phone className="h-8 w-8 text-primary-green mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">24</p>
          <p className="text-white/60">Total Calls</p>
        </div>
        
        <div className="glass-strong p-6 rounded-xl text-center">
          <Clock className="h-8 w-8 text-primary-yellow mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">45:30</p>
          <p className="text-white/60">Total Duration</p>
        </div>
        
        <div className="glass-strong p-6 rounded-xl text-center">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-white">92%</p>
          <p className="text-white/60">Success Rate</p>
        </div>
      </motion.div>
    </div>
  )
}