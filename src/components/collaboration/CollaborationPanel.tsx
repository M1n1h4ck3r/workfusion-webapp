'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaboration } from './CollaborationProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users, Circle, Wifi, WifiOff, Eye, Edit3, MessageSquare,
  Video, Mic, MicOff, Share2, UserPlus, Settings, X
} from 'lucide-react'

export function CollaborationPanel() {
  const { users, isConnected, updatePresence } = useCollaboration()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle className="h-2 w-2 fill-green-400 text-green-400" />
      case 'away':
        return <Circle className="h-2 w-2 fill-yellow-400 text-yellow-400" />
      case 'busy':
        return <Circle className="h-2 w-2 fill-red-400 text-red-400" />
      default:
        return <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
    }
  }

  return (
    <>
      {/* Floating Collaboration Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative h-14 w-14 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all"
        >
          <Users className="h-6 w-6 text-white" />
          {users.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              {users.length}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Collaboration Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 glass-strong rounded-2xl shadow-2xl z-40"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-white font-semibold">Collaboration</h3>
                  {isConnected ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Wifi className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active Users */}
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <motion.div
                    key={user.id}
                    className="flex items-center justify-between p-2 glass rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          {getStatusIcon(user.status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        {user.cursor && (
                          <p className="text-white/60 text-xs">Active</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {user.cursor && (
                        <Eye className="h-3 w-3 text-white/40" />
                      )}
                      {user.selection && (
                        <Edit3 className="h-3 w-3 text-white/40" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">No active collaborators</p>
                  <Button
                    onClick={() => setShowInvite(true)}
                    size="sm"
                    className="mt-3 bg-primary-green hover:bg-primary-green/90"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite Team
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass text-white border-white/20 hover:bg-white/10"
                  onClick={() => updatePresence('online')}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass text-white border-white/20 hover:bg-white/10"
                  onClick={() => {/* Start video call */}}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass text-white border-white/20 hover:bg-white/10"
                  onClick={() => {/* Share screen */}}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass text-white border-white/20 hover:bg-white/10"
                  onClick={() => setShowInvite(true)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>

              {/* Status Selector */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-white/60 text-sm">Your status:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => updatePresence('online')}
                    className="p-1.5 glass rounded hover:bg-white/10 transition-colors"
                    title="Online"
                  >
                    <Circle className="h-3 w-3 fill-green-400 text-green-400" />
                  </button>
                  <button
                    onClick={() => updatePresence('away')}
                    className="p-1.5 glass rounded hover:bg-white/10 transition-colors"
                    title="Away"
                  >
                    <Circle className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </button>
                  <button
                    onClick={() => updatePresence('busy')}
                    className="p-1.5 glass rounded hover:bg-white/10 transition-colors"
                    title="Busy"
                  >
                    <Circle className="h-3 w-3 fill-red-400 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Invite Team Members</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Email addresses</label>
                  <input
                    type="text"
                    placeholder="Enter email addresses separated by commas"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary-green"
                  />
                </div>
                
                <div>
                  <label className="block text-white/60 text-sm mb-2">Share link</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/collaborate/${Math.random().toString(36).substr(2, 9)}`}
                      readOnly
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/collaborate/...`)
                        // Show toast
                      }}
                      className="bg-primary-green hover:bg-primary-green/90"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowInvite(false)}
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Send invites
                      setShowInvite(false)
                    }}
                    className="bg-primary-green hover:bg-primary-green/90"
                  >
                    Send Invites
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}