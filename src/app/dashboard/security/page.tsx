'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Shield, Lock, Key, AlertTriangle, CheckCircle2, XCircle,
  Eye, EyeOff, Users, Activity, Globe, Database, Cloud,
  Fingerprint, Smartphone, Mail, FileText, Download, RefreshCw,
  TrendingUp, TrendingDown, Info, Settings, ChevronRight,
  ShieldCheck, ShieldAlert, ShieldOff, UserCheck, UserX,
  Wifi, WifiOff, Server, HardDrive, Cpu, BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface SecurityEvent {
  id: string
  type: 'login' | 'access' | 'permission' | 'suspicious' | 'blocked'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  user?: string
  ip?: string
  timestamp: string
  status: 'resolved' | 'investigating' | 'pending'
}

interface SecurityMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'access' | 'compliance'>('overview')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  // Mock security data
  const securityScore = 92
  const threatLevel = 'low'
  
  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      severity: 'low',
      description: 'Successful login from new device',
      user: 'john@example.com',
      ip: '192.168.1.100',
      timestamp: '5 minutes ago',
      status: 'resolved'
    },
    {
      id: '2',
      type: 'suspicious',
      severity: 'medium',
      description: 'Multiple failed login attempts',
      user: 'unknown',
      ip: '203.45.67.89',
      timestamp: '1 hour ago',
      status: 'investigating'
    },
    {
      id: '3',
      type: 'access',
      severity: 'high',
      description: 'Unauthorized API access attempt',
      ip: '185.220.101.45',
      timestamp: '3 hours ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'blocked',
      severity: 'critical',
      description: 'DDoS attack blocked',
      ip: '45.67.89.123',
      timestamp: '6 hours ago',
      status: 'resolved'
    }
  ]

  const securityMetrics: SecurityMetric[] = [
    { name: 'Encryption Coverage', value: 100, target: 100, unit: '%', trend: 'stable', status: 'good' },
    { name: 'Vulnerability Score', value: 2, target: 0, unit: '', trend: 'down', status: 'warning' },
    { name: 'Patch Compliance', value: 98, target: 100, unit: '%', trend: 'up', status: 'good' },
    { name: 'Access Control', value: 95, target: 95, unit: '%', trend: 'stable', status: 'good' }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'investigating': return <Activity className="h-4 w-4 text-yellow-400" />
      case 'pending': return <AlertTriangle className="h-4 w-4 text-orange-400" />
      default: return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  const handleSecurityScan = async () => {
    setIsScanning(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('Security scan completed. No threats detected.')
    } catch (error) {
      toast.error('Security scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-white/80">Monitor and manage platform security</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSecurityScan}
            disabled={isScanning}
            className="bg-gradient-primary hover:opacity-90 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Run Security Scan'}
          </Button>
          
          <Button
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Score */}
      <motion.div
        className="glass-strong p-8 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Security Score</h2>
            <p className="text-white/60">Overall security posture assessment</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${securityScore * 3.51} 351.86`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06D6A0" />
                    <stop offset="100%" stopColor="#118AB2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-3xl font-bold text-white">{securityScore}</p>
                  <p className="text-white/60 text-xs">/ 100</p>
                </div>
              </div>
            </div>
            
            <Badge className={`mt-4 ${
              threatLevel === 'low' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              threatLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              Threat Level: {threatLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {securityMetrics.map((metric) => (
            <div key={metric.name} className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">{metric.name}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                ) : (
                  <Activity className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-white">{metric.value}</span>
                <span className="text-white/60 text-sm">{metric.unit}</span>
              </div>
              <Progress 
                value={(metric.value / metric.target) * 100} 
                className="mt-2 h-1"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'threats', label: 'Threat Detection', icon: ShieldAlert },
          { id: 'access', label: 'Access Control', icon: UserCheck },
          { id: 'compliance', label: 'Compliance', icon: FileText }
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Security Events */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Security Events</h3>
              <Button
                variant="outline"
                size="sm"
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {securityEvents.map((event) => (
                <div
                  key={event.id}
                  className="glass p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setShowDetails(event.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(event.status)}
                      <div>
                        <p className="text-white font-medium">{event.description}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          {event.user && (
                            <span className="text-white/60 text-sm">{event.user}</span>
                          )}
                          {event.ip && (
                            <span className="text-white/60 text-sm">{event.ip}</span>
                          )}
                          <span className="text-white/40 text-sm">{event.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-green-400" />
                Active Protections
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: 'DDoS Protection', status: true },
                  { name: 'WAF (Web Application Firewall)', status: true },
                  { name: 'SSL/TLS Encryption', status: true },
                  { name: 'Bot Protection', status: true },
                  { name: 'Rate Limiting', status: true }
                ].map((protection) => (
                  <div key={protection.name} className="flex items-center justify-between p-2">
                    <span className="text-white/80">{protection.name}</span>
                    {protection.status ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
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
                <Lock className="h-5 w-5 mr-2 text-blue-400" />
                Authentication Methods
              </h3>
              
              <div className="space-y-3">
                {[
                  { method: 'Multi-Factor Authentication', enabled: true, users: 847 },
                  { method: 'Single Sign-On (SSO)', enabled: true, users: 523 },
                  { method: 'Biometric Authentication', enabled: false, users: 0 },
                  { method: 'OAuth 2.0', enabled: true, users: 1250 },
                  { method: 'API Key Authentication', enabled: true, users: 89 }
                ].map((auth) => (
                  <div key={auth.method} className="flex items-center justify-between p-2">
                    <div>
                      <span className="text-white/80">{auth.method}</span>
                      {auth.enabled && (
                        <p className="text-white/40 text-xs">{auth.users} users</p>
                      )}
                    </div>
                    <Badge className={auth.enabled 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {auth.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'threats' && (
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Threat Detection System</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="glass p-4 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-white/60 text-sm">Active Threats</p>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <Shield className="h-8 w-8 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">247</p>
              <p className="text-white/60 text-sm">Blocked Today</p>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <Activity className="h-8 w-8 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-white/60 text-sm">Detection Rate</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Real-time Threat Feed</h4>
            {[
              { type: 'Brute Force Attack', source: '192.168.1.100', status: 'blocked', time: '2 min ago' },
              { type: 'SQL Injection Attempt', source: '10.0.0.50', status: 'blocked', time: '5 min ago' },
              { type: 'XSS Attack', source: '172.16.0.25', status: 'blocked', time: '12 min ago' },
              { type: 'Port Scanning', source: '203.0.113.0', status: 'monitoring', time: '15 min ago' }
            ].map((threat, index) => (
              <div key={index} className="glass p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{threat.type}</p>
                  <p className="text-white/60 text-sm">Source: {threat.source}</p>
                </div>
                <div className="text-right">
                  <Badge className={threat.status === 'blocked' 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }>
                    {threat.status}
                  </Badge>
                  <p className="text-white/40 text-xs mt-1">{threat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'access' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Access Control Management</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white/80 font-medium mb-3">User Roles</h4>
                <div className="space-y-2">
                  {[
                    { role: 'Super Admin', users: 2, permissions: 'Full Access' },
                    { role: 'Admin', users: 8, permissions: 'Manage Users & Content' },
                    { role: 'Editor', users: 24, permissions: 'Edit Content' },
                    { role: 'Viewer', users: 156, permissions: 'Read Only' }
                  ].map((role) => (
                    <div key={role.role} className="glass p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{role.role}</p>
                          <p className="text-white/60 text-xs">{role.permissions}</p>
                        </div>
                        <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
                          {role.users} users
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white/80 font-medium mb-3">Recent Access Logs</h4>
                <div className="space-y-2">
                  {[
                    { user: 'john@example.com', action: 'Login', time: '5 min ago', status: 'success' },
                    { user: 'sarah@example.com', action: 'API Access', time: '12 min ago', status: 'success' },
                    { user: 'mike@example.com', action: 'File Download', time: '25 min ago', status: 'success' },
                    { user: 'unknown', action: 'Login Attempt', time: '1 hour ago', status: 'failed' }
                  ].map((log, index) => (
                    <div key={index} className="glass p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm">{log.user}</p>
                          <p className="text-white/60 text-xs">{log.action}</p>
                        </div>
                        <div className="text-right">
                          {log.status === 'success' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <p className="text-white/40 text-xs">{log.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Compliance & Regulations</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'GDPR', status: 'Compliant', lastAudit: '30 days ago', score: 98 },
              { name: 'CCPA', status: 'Compliant', lastAudit: '45 days ago', score: 95 },
              { name: 'HIPAA', status: 'Partial', lastAudit: '60 days ago', score: 78 },
              { name: 'SOC 2', status: 'In Progress', lastAudit: 'Pending', score: 65 },
              { name: 'ISO 27001', status: 'Compliant', lastAudit: '15 days ago', score: 92 },
              { name: 'PCI DSS', status: 'Compliant', lastAudit: '20 days ago', score: 96 }
            ].map((compliance) => (
              <div key={compliance.name} className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{compliance.name}</h4>
                  <Badge className={
                    compliance.status === 'Compliant' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    compliance.status === 'Partial' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }>
                    {compliance.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Compliance Score</span>
                    <span className="text-white font-medium">{compliance.score}%</span>
                  </div>
                  <Progress value={compliance.score} className="h-2" />
                  <p className="text-white/40 text-xs">Last audit: {compliance.lastAudit}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}