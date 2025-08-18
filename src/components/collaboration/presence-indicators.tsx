'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, Eye, MessageCircle, Edit3, Video, Phone,
  Clock, Wifi, WifiOff, Circle, Activity, Bell,
  Monitor, Smartphone, Tablet, Volume2, VolumeX
} from 'lucide-react'

interface User {
  id: string
  name: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  status: 'online' | 'away' | 'busy' | 'offline'
  activity: {
    type: 'editing' | 'viewing' | 'commenting' | 'idle' | 'in-call'
    location: string
    timestamp: string
  }
  device: 'desktop' | 'mobile' | 'tablet'
  connection: 'strong' | 'weak' | 'offline'
  preferences: {
    notifications: boolean
    soundEnabled: boolean
    showActivity: boolean
  }
}

interface ActivityFeedItem {
  id: string
  userId: string
  type: 'join' | 'leave' | 'edit' | 'comment' | 'share' | 'call'
  content: string
  timestamp: string
  location?: string
}

export default function PresenceIndicators() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'You',
      role: 'owner',
      status: 'online',
      activity: {
        type: 'editing',
        location: 'Project Documentation',
        timestamp: 'now'
      },
      device: 'desktop',
      connection: 'strong',
      preferences: {
        notifications: true,
        soundEnabled: true,
        showActivity: true
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'admin', 
      status: 'online',
      activity: {
        type: 'viewing',
        location: 'AI Models Dashboard',
        timestamp: '2 minutes ago'
      },
      device: 'desktop',
      connection: 'strong',
      preferences: {
        notifications: true,
        soundEnabled: false,
        showActivity: true
      }
    },
    {
      id: '3',
      name: 'Mike Wilson',
      role: 'editor',
      status: 'away',
      activity: {
        type: 'idle',
        location: 'Team Workspace',
        timestamp: '15 minutes ago'
      },
      device: 'mobile',
      connection: 'weak',
      preferences: {
        notifications: false,
        soundEnabled: true,
        showActivity: false
      }
    },
    {
      id: '4',
      name: 'Emily Davis',
      role: 'editor',
      status: 'busy',
      activity: {
        type: 'in-call',
        location: 'Video Conference',
        timestamp: '5 minutes ago'
      },
      device: 'tablet',
      connection: 'strong',
      preferences: {
        notifications: false,
        soundEnabled: false,
        showActivity: true
      }
    },
    {
      id: '5',
      name: 'Alex Chen',
      role: 'viewer',
      status: 'online',
      activity: {
        type: 'commenting',
        location: 'Brand Guidelines',
        timestamp: 'just now'
      },
      device: 'desktop',
      connection: 'strong',
      preferences: {
        notifications: true,
        soundEnabled: true,
        showActivity: true
      }
    }
  ])

  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([
    {
      id: '1',
      userId: '2',
      type: 'edit',
      content: 'updated the AI Models Dashboard',
      timestamp: '2 minutes ago',
      location: 'AI Models Dashboard'
    },
    {
      id: '2', 
      userId: '5',
      type: 'comment',
      content: 'added a comment to Brand Guidelines',
      timestamp: '5 minutes ago',
      location: 'Brand Guidelines'
    },
    {
      id: '3',
      userId: '4',
      type: 'join',
      content: 'joined the video conference',
      timestamp: '8 minutes ago',
      location: 'Video Conference'
    },
    {
      id: '4',
      userId: '3',
      type: 'edit',
      content: 'modified Team Workspace settings',
      timestamp: '15 minutes ago',
      location: 'Team Workspace'
    },
    {
      id: '5',
      userId: '2',
      type: 'share',
      content: 'shared the training dataset',
      timestamp: '20 minutes ago',
      location: 'AI Training'
    }
  ])

  const [showActivityFeed, setShowActivityFeed] = useState(true)
  const [compactView, setCompactView] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update user activities
      setUsers(prev => prev.map(user => {
        if (user.id !== '1' && Math.random() > 0.7) {
          const activities = ['editing', 'viewing', 'commenting', 'idle'] as const
          const locations = ['Project Documentation', 'AI Models', 'Team Chat', 'Resources']
          
          return {
            ...user,
            activity: {
              type: activities[Math.floor(Math.random() * activities.length)],
              location: locations[Math.floor(Math.random() * locations.length)],
              timestamp: 'just now'
            }
          }
        }
        return user
      }))

      // Add random activity to feed
      if (Math.random() > 0.8) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const actions = ['updated', 'viewed', 'commented on', 'shared']
        const action = actions[Math.floor(Math.random() * actions.length)]
        
        const newActivity: ActivityFeedItem = {
          id: Date.now().toString(),
          userId: randomUser.id,
          type: 'edit',
          content: `${action} ${randomUser.activity.location}`,
          timestamp: 'just now'
        }
        
        setActivityFeed(prev => [newActivity, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [users])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400' 
      case 'busy': return 'bg-red-400'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'editing': return Edit3
      case 'viewing': return Eye
      case 'commenting': return MessageCircle
      case 'in-call': return Video
      case 'idle': return Clock
      default: return Activity
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor
      case 'mobile': return Smartphone
      case 'tablet': return Tablet
      default: return Monitor
    }
  }

  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case 'strong': return Wifi
      case 'weak': return Wifi
      case 'offline': return WifiOff
      default: return Wifi
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-400 bg-purple-500/20'
      case 'admin': return 'text-blue-400 bg-blue-500/20'
      case 'editor': return 'text-green-400 bg-green-500/20'
      case 'viewer': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getFeedIcon = (type: string) => {
    switch (type) {
      case 'join': return Users
      case 'leave': return Users
      case 'edit': return Edit3
      case 'comment': return MessageCircle
      case 'share': return Eye
      case 'call': return Video
      default: return Activity
    }
  }

  const getUserById = (id: string) => {
    return users.find(user => user.id === id)
  }

  const onlineUsers = users.filter(user => user.status === 'online').length
  const totalUsers = users.length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Team Presence</h3>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Circle className="mr-1 h-2 w-2 fill-current" />
            {onlineUsers} of {totalUsers} online
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCompactView(!compactView)}
            className="text-white/60 hover:text-white"
          >
            {compactView ? 'Detailed' : 'Compact'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActivityFeed(!showActivityFeed)}
            className="text-white/60 hover:text-white"
          >
            <Activity className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Presence List */}
        <div className={`${showActivityFeed ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3`}>
          <AnimatePresence>
            {users.map((user) => {
              const ActivityIcon = getActivityIcon(user.activity.type)
              const DeviceIcon = getDeviceIcon(user.device)
              const ConnectionIcon = getConnectionIcon(user.connection)
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar with status */}
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-green" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-gray-800`} />
                      </div>
                      
                      {/* User info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <Badge className={`${getRoleColor(user.role)} text-xs`}>
                            {user.role}
                          </Badge>
                        </div>
                        
                        {!compactView && (
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-white/60">
                              <ActivityIcon className="h-3 w-3" />
                              <span className="capitalize">{user.activity.type}</span>
                              {user.activity.location && (
                                <>
                                  <span>in</span>
                                  <span className="text-primary-green">{user.activity.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Device and connection indicators */}
                    <div className="flex items-center space-x-2">
                      {!compactView && (
                        <>
                          <DeviceIcon className="h-4 w-4 text-white/60" />
                          <ConnectionIcon className={`h-4 w-4 ${user.connection === 'strong' ? 'text-green-400' : user.connection === 'weak' ? 'text-yellow-400' : 'text-red-400'}`} />
                          
                          {/* Preference indicators */}
                          <div className="flex items-center space-x-1">
                            {user.preferences.notifications && (
                              <Bell className="h-3 w-3 text-blue-400" />
                            )}
                            {user.preferences.soundEnabled ? (
                              <Volume2 className="h-3 w-3 text-green-400" />
                            ) : (
                              <VolumeX className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </>
                      )}
                      
                      <span className="text-xs text-white/50">{user.activity.timestamp}</span>
                    </div>
                  </div>
                  
                  {/* Activity progress bar for editing */}
                  {user.activity.type === 'editing' && !compactView && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Actively editing</span>
                        <span>Live</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <motion.div
                          className="bg-primary-green h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Activity Feed */}
        {showActivityFeed && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <h4 className="text-md font-medium text-white">Live Activity</h4>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {activityFeed.map((item) => {
                  const FeedIcon = getFeedIcon(item.type)
                  const user = getUserById(item.userId)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start space-x-3 p-3 glass rounded-lg"
                    >
                      <FeedIcon className="h-4 w-4 text-primary-green flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">
                          <span className="font-medium">{user?.name || 'Unknown user'}</span>
                          <span className="text-white/80"> {item.content}</span>
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-white/60">{item.timestamp}</span>
                          {item.location && (
                            <>
                              <span className="text-xs text-white/40">•</span>
                              <span className="text-xs text-primary-green">{item.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}