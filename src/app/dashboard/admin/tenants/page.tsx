'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Building2, Users, Shield, Database, CreditCard, Settings,
  Plus, Edit, Trash2, ChevronRight, ChevronDown, Search,
  Globe, Lock, Key, Activity, Calendar, DollarSign,
  UserPlus, Mail, Check, X, AlertTriangle, Info,
  Package, Layers, Award, Clock, TrendingUp, FileText,
  UserCheck, UserX, Building, MapPin, Phone, Tag,
  BarChart3, PieChart, Briefcase, Target, Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { tenantManager, Tenant, Organization, User, AuditLog } from '@/services/tenant-manager'

type TabType = 'overview' | 'organizations' | 'users' | 'permissions' | 'billing' | 'audit'

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTenants()
  }, [])

  useEffect(() => {
    if (selectedTenant) {
      loadTenantDetails(selectedTenant.id)
    }
  }, [selectedTenant, activeTab])

  const loadTenants = async () => {
    try {
      // In a real app, this would fetch from an API
      const demoTenant = await tenantManager.getTenant('tenant_demo')
      if (demoTenant) {
        setTenants([demoTenant])
        setSelectedTenant(demoTenant)
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load tenants:', error)
      toast.error('Failed to load tenants')
      setIsLoading(false)
    }
  }

  const loadTenantDetails = async (tenantId: string) => {
    try {
      const [orgs, tenantUsers, logs] = await Promise.all([
        tenantManager.getOrganizations(tenantId),
        tenantManager.getUsers(tenantId),
        tenantManager.getAuditLogs(tenantId, { limit: 100 })
      ])
      
      setOrganizations(orgs)
      setUsers(tenantUsers)
      setAuditLogs(logs)
    } catch (error) {
      console.error('Failed to load tenant details:', error)
      toast.error('Failed to load tenant details')
    }
  }

  const handleCreateTenant = async (tenantData: any) => {
    try {
      const newTenant = await tenantManager.createTenant(tenantData)
      setTenants([...tenants, newTenant])
      setShowCreateModal(false)
      toast.success('Tenant created successfully')
    } catch (error) {
      toast.error('Failed to create tenant')
    }
  }

  const handleInviteUser = async (email: string, role: string) => {
    if (!selectedTenant) return
    
    try {
      await tenantManager.inviteUser(selectedTenant.id, email, role)
      toast.success(`Invitation sent to ${email}`)
      setShowInviteModal(false)
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'trial': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'professional': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'starter': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB'
    const gb = bytes
    if (gb >= 1000) return `${(gb / 1000).toFixed(1)} TB`
    return `${gb} GB`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-white/80">Loading tenant management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Multi-tenant Management</h1>
          <p className="text-white/80">Manage tenants, organizations, users, and permissions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-primary hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Tenant
          </Button>
        </div>
      </div>

      {/* Tenant Selector */}
      <div className="glass-strong p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Current Tenant</h2>
          <Badge className={getStatusColor(selectedTenant?.subscription.status || '')}>
            {selectedTenant?.subscription.status}
          </Badge>
        </div>

        {selectedTenant && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-5 w-5 text-primary-green" />
                <Badge className={getPlanColor(selectedTenant.subscription.plan)}>
                  {selectedTenant.subscription.plan}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white">{selectedTenant.name}</p>
              <p className="text-white/60 text-sm">{selectedTenant.slug}</p>
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-white/60 text-sm">
                  {users.length}/{selectedTenant.limits.maxUsers}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">Users</p>
              <Progress 
                value={(users.length / selectedTenant.limits.maxUsers) * 100}
                className="mt-2 h-2"
              />
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Database className="h-5 w-5 text-purple-400" />
                <span className="text-white/60 text-sm">
                  {formatBytes(30)}/{formatBytes(selectedTenant.limits.maxStorage)}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">Storage</p>
              <Progress 
                value={(30 / selectedTenant.limits.maxStorage) * 100}
                className="mt-2 h-2"
              />
            </div>

            <div className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-yellow-400" />
                <span className="text-white/60 text-sm">
                  {organizations.length} orgs
                </span>
              </div>
              <p className="text-lg font-semibold text-white">Organizations</p>
              <p className="text-white/60 text-sm mt-1">
                {selectedTenant.metadata.companySize} company
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="glass-strong rounded-2xl">
        <div className="flex items-center space-x-1 p-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'organizations', label: 'Organizations', icon: Building },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'permissions', label: 'Permissions', icon: Shield },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'audit', label: 'Audit Logs', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && selectedTenant && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Subscription Details */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Plan</span>
                      <Badge className={getPlanColor(selectedTenant.subscription.plan)}>
                        {selectedTenant.subscription.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Billing</span>
                      <span className="text-white">{selectedTenant.subscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Seats</span>
                      <span className="text-white">{selectedTenant.subscription.seats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Period End</span>
                      <span className="text-white">
                        {new Date(selectedTenant.subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/60">API Requests</span>
                        <span className="text-white text-sm">45K / 100K</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/60">AI Tokens</span>
                        <span className="text-white text-sm">350K / 1M</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/60">Workflows</span>
                        <span className="text-white text-sm">23 / 100</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/60">Integrations</span>
                        <span className="text-white text-sm">8 / 20</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">2FA</span>
                      {selectedTenant.settings.twoFactorAuth ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">SSO</span>
                      {selectedTenant.settings.ssoEnabled ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">API Access</span>
                      {selectedTenant.settings.apiAccess ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Audit Logs</span>
                      {selectedTenant.settings.auditLogEnabled ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="glass p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Activity Overview</h3>
                <div className="h-64 flex items-center justify-center text-white/40">
                  <PieChart className="h-32 w-32" />
                  <p className="ml-4">Activity visualization would go here</p>
                </div>
              </div>
            </div>
          )}

          {/* Organizations Tab */}
          {activeTab === 'organizations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Organizations ({organizations.length})
                </h3>
                <Button
                  size="sm"
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Organization
                </Button>
              </div>

              <div className="space-y-3">
                {organizations.map((org) => (
                  <div key={org.id} className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-primary-green" />
                        <div>
                          <p className="text-white font-medium">{org.name}</p>
                          <p className="text-white/60 text-sm">{org.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-white/5 text-white/70 border-white/10">
                          {org.settings.visibility}
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Users ({users.length}/{selectedTenant?.limits.maxUsers})
                </h3>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  size="sm"
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite User
                </Button>
              </div>

              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-green/20 to-primary-blue/20 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-white/60 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {user.role.name}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
              <div className="glass p-6 rounded-xl">
                <p className="text-white/60">
                  Permission management interface would be implemented here
                </p>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && selectedTenant && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-white font-medium mb-3">Current Plan</h4>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">
                      {selectedTenant.subscription.plan}
                    </p>
                    <p className="text-white/60">
                      {selectedTenant.subscription.seats} seats • {selectedTenant.subscription.billingCycle}
                    </p>
                  </div>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-white font-medium mb-3">Next Payment</h4>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">$599</p>
                    <p className="text-white/60">
                      Due {new Date(selectedTenant.subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Audit Logs ({auditLogs.length})
              </h3>
              <div className="space-y-2">
                {auditLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="glass p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-white/40" />
                        <div>
                          <p className="text-white text-sm">
                            <span className="font-medium">{log.action}</span> on {log.resource}
                          </p>
                          <p className="text-white/40 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={log.status === 'success' ? 
                        'bg-green-500/20 text-green-400 border-green-500/30' : 
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}