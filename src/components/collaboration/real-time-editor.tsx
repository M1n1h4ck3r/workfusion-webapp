'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Save, Users, MessageCircle, History, Settings,
  Bold, Italic, Underline, List, AlignLeft, AlignCenter,
  AlignRight, Link, Image, Code, Quote, Undo, Redo,
  Eye, Edit3, Share2, Download, Copy, Crown, Zap
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  avatar?: string
  color: string
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number }
}

interface Change {
  id: string
  user: string
  action: string
  timestamp: string
  content: string
}

interface Comment {
  id: string
  user: string
  content: string
  timestamp: string
  resolved: boolean
  position: { line: number; char: number }
}

export default function RealTimeEditor() {
  const [content, setContent] = useState(`# Project Documentation

## Overview
Welcome to our collaborative workspace. This document serves as the central hub for project information and team coordination.

## Current Objectives
- [ ] Complete Q1 marketing strategy
- [ ] Implement new AI features
- [ ] Review team performance metrics
- [x] Setup collaboration tools

## Team Notes
Please add your updates and feedback here. All changes are automatically saved and synchronized across the team.

### Recent Updates
- Sarah updated the brand guidelines document
- Mike added new customer templates
- Alex completed the technical review

## Resources
- [Brand Guidelines](link)
- [Technical Specs](link)
- [Meeting Notes](link)`)
  
  const [activeUsers, setActiveUsers] = useState<User[]>([
    {
      id: '1',
      name: 'You',
      color: '#10B981',
      cursor: { x: 0, y: 0 }
    },
    {
      id: '2', 
      name: 'Sarah Johnson',
      color: '#3B82F6',
      cursor: { x: 150, y: 200 }
    },
    {
      id: '3',
      name: 'Mike Wilson', 
      color: '#F59E0B',
      cursor: { x: 300, y: 150 }
    }
  ])
  
  const [recentChanges, setRecentChanges] = useState<Change[]>([
    {
      id: '1',
      user: 'Sarah Johnson',
      action: 'Added section "Team Notes"',
      timestamp: '2 minutes ago',
      content: 'Added collaborative notes section for team updates'
    },
    {
      id: '2',
      user: 'Mike Wilson',
      action: 'Updated task list',
      timestamp: '5 minutes ago', 
      content: 'Marked collaboration tools setup as complete'
    },
    {
      id: '3',
      user: 'You',
      action: 'Created document',
      timestamp: '10 minutes ago',
      content: 'Initial document structure and content'
    }
  ])
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Sarah Johnson',
      content: 'We should add more details about the brand guidelines implementation',
      timestamp: '3 minutes ago',
      resolved: false,
      position: { line: 15, char: 20 }
    },
    {
      id: '2',
      user: 'Mike Wilson',
      content: 'Great progress on the technical specs!',
      timestamp: '8 minutes ago',
      resolved: true,
      position: { line: 25, char: 10 }
    }
  ])
  
  const [isEditing, setIsEditing] = useState(true)
  const [showComments, setShowComments] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState('Just now')
  const [newComment, setNewComment] = useState('')
  const [selectedText, setSelectedText] = useState('')
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cursorsRef = useRef<HTMLDivElement>(null)

  // Simulate real-time cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => {
        if (user.id !== '1') {
          return {
            ...user,
            cursor: {
              x: Math.random() * 600 + 50,
              y: Math.random() * 400 + 100
            }
          }
        }
        return user
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Auto-save simulation
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved('Just now')
      }, 1000)
    }, 2000)

    return () => clearTimeout(saveTimer)
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    
    // Simulate adding a change to history
    if (Math.random() > 0.8) {
      const newChange: Change = {
        id: Date.now().toString(),
        user: 'You',
        action: 'Modified content',
        timestamp: 'Just now',
        content: 'Made edits to document content'
      }
      setRecentChanges(prev => [newChange, ...prev.slice(0, 4)])
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: 'You',
      content: newComment,
      timestamp: 'Just now',
      resolved: false,
      position: { line: 10, char: 0 }
    }
    
    setComments(prev => [comment, ...prev])
    setNewComment('')
    toast.success('Comment added')
  }

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ))
    toast.success('Comment resolved')
  }

  const formatText = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    let formattedText = selectedText
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        break
      case 'quote':
        formattedText = `> ${selectedText}`
        break
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
    
    toast.success(`Applied ${format} formatting`)
  }

  const shareDocument = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Share link copied to clipboard')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">Project Documentation</h1>
          <Badge className={`${isSaving ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'} border-current/30`}>
            {isSaving ? 'Saving...' : `Saved ${lastSaved}`}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Active Users */}
          <div className="flex items-center -space-x-2">
            {activeUsers.map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xs">+2</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="glass text-white border-white/20"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comments ({comments.filter(c => !c.resolved).length})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="glass text-white border-white/20"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareDocument}
            className="glass text-white border-white/20"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button size="sm" className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/10">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('bold')}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('italic')}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('code')}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => formatText('quote')}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Quote className="h-4 w-4" />
              </Button>
              
              <div className="w-px h-6 bg-white/20 mx-2" />
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={`${isEditing ? 'text-white bg-white/10' : 'text-white/60'} hover:text-white hover:bg-white/10`}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className={`${!isEditing ? 'text-white bg-white/10' : 'text-white/60'} hover:text-white hover:bg-white/10`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
          
          {/* Editor Area */}
          <div className="flex-1 relative">
            {/* Real-time cursors */}
            <div ref={cursorsRef} className="absolute inset-0 pointer-events-none z-10">
              {activeUsers.filter(user => user.id !== '1').map((user) => (
                <motion.div
                  key={user.id}
                  className="absolute"
                  animate={{
                    x: user.cursor?.x || 0,
                    y: user.cursor?.y || 0
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div
                    className="w-0.5 h-5 relative"
                    style={{ backgroundColor: user.color }}
                  >
                    <div
                      className="absolute -top-6 -left-1 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="w-full h-full p-6 bg-transparent text-white resize-none focus:outline-none font-mono text-sm leading-relaxed"
                placeholder="Start typing your document..."
              />
            ) : (
              <div className="w-full h-full p-6 text-white font-mono text-sm leading-relaxed overflow-auto">
                <div className="prose prose-invert max-w-none">
                  {content.split('\n').map((line, index) => (
                    <div key={index} className="min-h-[1.5em]">
                      {line || <br />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {(showComments || showHistory) && (
          <div className="w-80 border-l border-white/10 bg-black/20">
            {showComments && (
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
                
                {/* Add Comment */}
                <div className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-primary-green"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="mt-2 btn-primary"
                  >
                    Add Comment
                  </Button>
                </div>
                
                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${comment.resolved ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5 border border-white/10'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-white font-medium text-sm">{comment.user}</span>
                        <span className="text-white/60 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-white/80 text-sm mb-2">{comment.content}</p>
                      {!comment.resolved && (
                        <Button
                          onClick={() => handleResolveComment(comment.id)}
                          size="sm"
                          variant="outline"
                          className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                        >
                          Resolve
                        </Button>
                      )}
                      {comment.resolved && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Resolved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {showHistory && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Changes</h3>
                <div className="space-y-3">
                  {recentChanges.map((change) => (
                    <div key={change.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-white font-medium text-sm">{change.user}</span>
                        <span className="text-white/60 text-xs">{change.timestamp}</span>
                      </div>
                      <p className="text-primary-green text-sm font-medium mb-1">{change.action}</p>
                      <p className="text-white/70 text-xs">{change.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}