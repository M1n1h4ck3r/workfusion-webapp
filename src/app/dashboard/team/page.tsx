'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Progress } from '@/components/ui/progress'
import { 
  Users, UserPlus, Settings, Crown, Shield, 
  Eye, MessageCircle, FileText, Share2, Clock,
  Activity, Bell, Search, Filter, MoreVertical,
  Folder, Star, Edit3, Trash2, Copy, Download,
  Zap, Target, TrendingUp, Calendar, Mail,
  Video, Phone, Globe, Lock, Unlock, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  avatar?: string
  status: 'online' | 'away' | 'offline'
  lastSeen: string
  permissions: {
    canEditWorkspace: boolean
    canManageMembers: boolean
    canDeleteFiles: boolean
    canAccessBilling: boolean
  }
  activity: {
    documentsEdited: number
    messagesPosted: number
    lastActivity: string
  }
}

interface Workspace {
  id: string
  name: string
  description: string
  type: 'project' | 'team' | 'client'
  members: number
  files: number
  createdAt: string
  lastActivity: string
  isStarred: boolean
  privacy: 'public' | 'private' | 'restricted'
}

interface SharedResource {
  id: string
  name: string
  type: 'document' | 'template' | 'dataset' | 'model'
  owner: string
  sharedWith: string[]
  lastModified: string
  size: string
  status: 'editing' | 'review' | 'approved' | 'draft'
}

interface ActivityItem {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  type: 'edit' | 'create' | 'delete' | 'share' | 'comment' | 'join'
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'workspaces' | 'resources' | 'activity'>('overview')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@company.com',
      role: 'owner',
      status: 'online',
      lastSeen: 'now',
      permissions: {
        canEditWorkspace: true,
        canManageMembers: true,
        canDeleteFiles: true,
        canAccessBilling: true
      },
      activity: {
        documentsEdited: 24,
        messagesPosted: 156,
        lastActivity: '2 minutes ago'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      status: 'online',
      lastSeen: '5 minutes ago',
      permissions: {
        canEditWorkspace: true,
        canManageMembers: true,
        canDeleteFiles: false,
        canAccessBilling: false
      },
      activity: {
        documentsEdited: 18,
        messagesPosted: 89,
        lastActivity: '1 hour ago'
      }
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@company.com',
      role: 'editor',
      status: 'away',
      lastSeen: '2 hours ago',
      permissions: {
        canEditWorkspace: false,
        canManageMembers: false,
        canDeleteFiles: false,
        canAccessBilling: false
      },
      activity: {
        documentsEdited: 12,
        messagesPosted: 34,
        lastActivity: '3 hours ago'
      }
    }
  ])

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'ws-1',
      name: 'AI Marketing Campaign',
      description: 'Q1 2024 marketing automation and content generation',
      type: 'project',
      members: 8,
      files: 45,
      createdAt: '2024-01-01',
      lastActivity: '5 minutes ago',
      isStarred: true,
      privacy: 'private'
    },
    {
      id: 'ws-2',
      name: 'Client Portal Development',
      description: 'Custom AI solutions for enterprise clients',
      type: 'client',
      members: 12,
      files: 67,
      createdAt: '2023-12-15',
      lastActivity: '1 hour ago',
      isStarred: false,
      privacy: 'restricted'
    },
    {
      id: 'ws-3',
      name: 'Internal Tools',
      description: 'Company-wide AI tools and templates',
      type: 'team',
      members: 25,
      files: 123,
      createdAt: '2023-11-20',
      lastActivity: '2 hours ago',
      isStarred: true,
      privacy: 'public'
    }
  ])

  const [sharedResources, setSharedResources] = useState<SharedResource[]>([
    {
      id: 'res-1',
      name: 'Brand Voice Guidelines',
      type: 'document',
      owner: 'Sarah Johnson',
      sharedWith: ['team-marketing', 'team-content'],
      lastModified: '2024-01-15 14:30',
      size: '2.4 MB',
      status: 'approved'
    },
    {
      id: 'res-2',
      name: 'Customer Support Templates',
      type: 'template',
      owner: 'Mike Wilson',
      sharedWith: ['team-support'],
      lastModified: '2024-01-15 11:20',
      size: '856 KB',
      status: 'editing'
    },
    {
      id: 'res-3',
      name: 'Product Training Dataset',
      type: 'dataset',
      owner: 'John Smith',
      sharedWith: ['team-ai', 'team-dev'],
      lastModified: '2024-01-14 16:45',
      size: '12.8 MB',
      status: 'review'
    }
  ])

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      user: 'Sarah Johnson',
      action: 'edited',
      target: 'Brand Voice Guidelines',
      timestamp: '5 minutes ago',
      type: 'edit'
    },
    {
      id: 'act-2',
      user: 'Mike Wilson',
      action: 'created',
      target: 'Customer Onboarding Template',
      timestamp: '1 hour ago',
      type: 'create'
    },
    {
      id: 'act-3',
      user: 'Alex Chen',
      action: 'joined',
      target: 'AI Marketing Campaign workspace',
      timestamp: '2 hours ago',
      type: 'join'
    },
    {
      id: 'act-4',
      user: 'Emily Davis',
      action: 'commented on',
      target: 'Q1 Strategy Document',
      timestamp: '3 hours ago',
      type: 'comment'
    }
  ])

  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'viewer'>('editor')
  const [onlineMembers, setOnlineMembers] = useState(0)

  useEffect(() => {
    setOnlineMembers(teamMembers.filter(member => member.status === 'online').length)
  }, [teamMembers])

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address')
      return
    }

    setIsInviting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
    } catch (error) {
      toast.error('Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
    toast.success('Member removed from team')
  }

  const handleChangeRole = (memberId: string, newRole: 'owner' | 'admin' | 'editor' | 'viewer') => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
    toast.success('Member role updated')
  }

  const handleToggleWorkspaceStar = (workspaceId: string) => {
    setWorkspaces(prev => prev.map(ws => 
      ws.id === workspaceId ? { ...ws, isStarred: !ws.isStarred } : ws
    ))
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'admin': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'editor': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'viewer': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getWorkspaceTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return Target
      case 'client': return Globe
      case 'team': return Users
      default: return Folder
    }
  }

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return Unlock
      case 'private': return Lock
      case 'restricted': return Shield
      default: return Lock
    }
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'template': return Copy
      case 'dataset': return Target
      case 'model': return Zap
      default: return FileText
    }
  }

  const getStatusColor2 = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'review': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'editing': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'draft': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit': return Edit3
      case 'create': return FileText
      case 'delete': return Trash2
      case 'share': return Share2
      case 'comment': return MessageCircle
      case 'join': return UserPlus
      default: return Activity
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
          <p className="text-white/80">Manage your team, workspaces, and shared resources</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Eye className="mr-1 h-3 w-3" />
            {onlineMembers} Online
          </Badge>
          <Badge className="bg-primary-blue/20 text-primary-blue border-primary-blue/30">
            <Users className="mr-1 h-3 w-3" />
            {teamMembers.length} Members
          </Badge>
          <Button className="btn-primary">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-primary-green" />
            <span className="text-2xl font-bold text-white">{teamMembers.length}</span>
          </div>
          <p className="text-white/60 text-sm">Team Members</p>
          <p className="text-green-400 text-xs">{onlineMembers} online now</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Folder className="h-8 w-8 text-primary-blue" />
            <span className="text-2xl font-bold text-white">{workspaces.length}</span>
          </div>
          <p className="text-white/60 text-sm">Active Workspaces</p>
          <p className="text-blue-400 text-xs">{workspaces.filter(ws => ws.isStarred).length} starred</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Share2 className="h-8 w-8 text-primary-yellow" />
            <span className="text-2xl font-bold text-white">{sharedResources.length}</span>
          </div>
          <p className="text-white/60 text-sm">Shared Resources</p>
          <p className="text-yellow-400 text-xs">{sharedResources.filter(r => r.status === 'editing').length} in progress</p>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">247</span>
          </div>
          <p className="text-white/60 text-sm">Today's Activities</p>
          <p className="text-red-400 text-xs">+12% from yesterday</p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'workspaces', label: 'Workspaces', icon: Folder },
          { id: 'resources', label: 'Resources', icon: Share2 },
          { id: 'activity', label: 'Activity', icon: Activity }
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
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 glass rounded-lg">
                      <ActivityIcon className="h-5 w-5 text-primary-green" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-white/60 text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Active Workspaces */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Active Workspaces</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {workspaces.slice(0, 4).map((workspace) => {
                  const WorkspaceIcon = getWorkspaceTypeIcon(workspace.type)
                  const PrivacyIcon = getPrivacyIcon(workspace.privacy)
                  
                  return (
                    <div key={workspace.id} className="glass p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <WorkspaceIcon className="h-5 w-5 text-primary-blue" />
                          <div>
                            <h4 className="text-white font-medium">{workspace.name}</h4>
                            <p className="text-white/60 text-xs">{workspace.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <PrivacyIcon className="h-4 w-4 text-white/60" />
                          {workspace.isStarred && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                        <span>{workspace.members} members</span>
                        <span>{workspace.files} files</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Members */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Online Now</h3>
              <div className="space-y-3">
                {teamMembers.filter(member => member.status === 'online').map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-primary-green/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-green" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{member.name}</p>
                      <p className="text-white/60 text-xs capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="glass-strong p-6 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full btn-primary">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
                <Button variant="outline" className="w-full glass text-white border-white/20">
                  <Folder className="mr-2 h-4 w-4" />
                  Create Workspace
                </Button>
                <Button variant="outline" className="w-full glass text-white border-white/20">
                  <Video className="mr-2 h-4 w-4" />
                  Start Meeting
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Invite Member */}
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Invite New Member</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="input-glass"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                className="input-glass"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              <Button
                onClick={handleInviteMember}
                disabled={isInviting}
                className="btn-primary"
              >
                {isInviting ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isInviting ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </motion.div>

          {/* Members List */}
          <motion.div
            className="glass-strong rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Team Members</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Search members..."
                      className="input-glass pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="glass text-white border-white/20">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-green" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-gray-800`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{member.name}</h4>
                          {member.role === 'owner' && <Crown className="h-4 w-4 text-yellow-400" />}
                        </div>
                        <p className="text-white/60 text-sm">{member.email}</p>
                        <p className="text-white/50 text-xs">Last seen: {member.lastSeen}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                          <span>{member.activity.documentsEdited} docs</span>
                          <span>{member.activity.messagesPosted} messages</span>
                        </div>
                      </div>
                      
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Continue with other tabs... */}
      {activeTab === 'workspaces' && (
        <div className="space-y-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Team Workspaces</h3>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => {
                const WorkspaceIcon = getWorkspaceTypeIcon(workspace.type)
                const PrivacyIcon = getPrivacyIcon(workspace.privacy)
                
                return (
                  <div key={workspace.id} className="glass p-6 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <WorkspaceIcon className="h-8 w-8 text-primary-blue" />
                        <div>
                          <h4 className="text-white font-semibold">{workspace.name}</h4>
                          <p className="text-white/60 text-sm capitalize">{workspace.type}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleToggleWorkspaceStar(workspace.id)}
                          className="text-white/60 hover:text-yellow-400 transition-colors"
                        >
                          <Star className={`h-4 w-4 ${workspace.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                        </button>
                        <PrivacyIcon className="h-4 w-4 text-white/60" />
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{workspace.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-white/60 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{workspace.members} members</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{workspace.files} files</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>Created {workspace.createdAt}</span>
                      <span>Active {workspace.lastActivity}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Resources and Activity tabs would follow similar patterns... */}
    </div>
  )
}