'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { 
  Phone, PhoneCall, Clock, CheckCircle, XCircle, 
  Play, Pause, Volume2, Download, Calendar, User
} from 'lucide-react'
import { toast } from 'sonner'

export default function CallsPage() {
  const [isDialing, setIsDialing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedScript, setSelectedScript] = useState('sales')

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
    { id: 'sales', name: 'Sales Call', description: 'Product demonstration and closing' },
    { id: 'support', name: 'Support Call', description: 'Customer service and troubleshooting' },
    { id: 'appointment', name: 'Appointment Booking', description: 'Schedule meetings and consultations' },
    { id: 'survey', name: 'Survey Call', description: 'Customer feedback collection' },
    { id: 'followup', name: 'Follow-up Call', description: 'Post-purchase or meeting follow-up' }
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
      toast.success('Call completed successfully!')
      setPhoneNumber('')
    }, 3000)
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Voice Calls</h1>
        <p className="text-white/80">Manage and monitor your AI-powered voice calls</p>
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