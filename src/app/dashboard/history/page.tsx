'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  Calendar,
  Bot,
  MessageSquare,
  Phone,
  Mic,
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  FileDown
} from 'lucide-react'
import { toast } from 'sonner'

// Mock data - replace with real API data
const generateMockHistory = () => {
  const tools = [
    { name: 'AI Chatbot', icon: Bot, color: 'green' },
    { name: 'WhatsApp', icon: MessageSquare, color: 'yellow' },
    { name: 'Voice Call', icon: Phone, color: 'orange' },
    { name: 'Text to Speech', icon: Mic, color: 'green' }
  ]
  
  const actions = [
    'Chat with Alex Hormozi',
    'Chat with Jordan Peterson',
    'Sent bulk message',
    'Generated audio',
    'Test call completed',
    'Created voice message',
    'Analyzed document',
    'Generated report'
  ]
  
  const history = []
  const now = new Date()
  
  for (let i = 0; i < 50; i++) {
    const tool = tools[Math.floor(Math.random() * tools.length)]
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    history.push({
      id: `hist-${i + 1}`,
      tool: tool.name,
      icon: tool.icon,
      color: tool.color,
      action: actions[Math.floor(Math.random() * actions.length)],
      tokens: Math.floor(Math.random() * 20) + 1,
      status: Math.random() > 0.1 ? 'success' : 'failed',
      duration: `${Math.floor(Math.random() * 60) + 1}s`,
      date: date.toISOString(),
      details: {
        request: 'Sample request content...',
        response: 'Sample response content...',
        metadata: {
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 150
        }
      }
    })
  }
  
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const mockHistory = generateMockHistory()

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState<string>('all')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<typeof mockHistory[0] | null>(null)
  const itemsPerPage = 10

  // Filter history based on search and filters
  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tool.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTool = selectedTool === 'all' || item.tool === selectedTool
    
    let matchesDate = true
    if (selectedDateRange !== 'all') {
      const itemDate = new Date(item.date)
      const now = new Date()
      
      switch (selectedDateRange) {
        case 'today':
          matchesDate = itemDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = itemDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = itemDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesTool && matchesDate
  })

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredHistory.slice(startIndex, endIndex)

  // Calculate statistics
  const totalTokens = filteredHistory.reduce((sum, item) => sum + item.tokens, 0)
  const successRate = (filteredHistory.filter(item => item.status === 'success').length / filteredHistory.length * 100) || 0

  const handleExport = (format: 'csv' | 'json') => {
    try {
      if (format === 'csv') {
        const headers = ['Date', 'Tool', 'Action', 'Tokens', 'Status', 'Duration']
        const rows = filteredHistory.map(item => [
          new Date(item.date).toLocaleString(),
          item.tool,
          item.action,
          item.tokens,
          item.status,
          item.duration
        ])
        
        const csv = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n')
        
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `usage-history-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
      } else {
        const json = JSON.stringify(filteredHistory, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `usage-history-${new Date().toISOString().split('T')[0]}.json`
        a.click()
      }
      
      toast.success(`Exported ${filteredHistory.length} records as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Usage History</h1>
          <p className="text-white/80">Track and analyze your AI tool usage</p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport('json')}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="glass-strong p-4 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Records</p>
              <p className="text-2xl font-bold text-white">{filteredHistory.length}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-4 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Tokens Used</p>
              <p className="text-2xl font-bold text-white">{totalTokens}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-4 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-4 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg. Tokens/Day</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(totalTokens / 30)}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="glass-strong p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by action or tool..."
                className="input-glass pl-10"
              />
            </div>
          </div>
          
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="input-glass px-4 py-2 rounded-lg"
          >
            <option value="all">All Tools</option>
            <option value="AI Chatbot">AI Chatbot</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Voice Call">Voice Call</option>
            <option value="Text to Speech">Text to Speech</option>
          </select>
          
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="input-glass px-4 py-2 rounded-lg"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          
          <Button
            onClick={() => {
              setSearchQuery('')
              setSelectedTool('all')
              setSelectedDateRange('all')
              setCurrentPage(1)
            }}
            variant="outline"
            className="glass text-white border-white/20 hover:bg-white/10"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div
        className="glass-strong rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Tool</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Action</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Tokens</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.tr
                    key={item.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4 text-sm text-white/80">
                      {new Date(item.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 bg-gradient-to-r ${
                          item.color === 'green' ? 'from-green-400 to-emerald-500' :
                          item.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                          'from-orange-400 to-red-500'
                        } rounded-lg flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-white/90">{item.tool}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {item.action}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-primary-yellow" />
                        <span className="text-sm text-white/80">{item.tokens}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {item.duration}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${
                        item.status === 'success' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/60 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItem(item)
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <div className="text-sm text-white/60">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} records
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum 
                      ? 'btn-primary' 
                      : 'glass text-white border-white/20 hover:bg-white/10'
                    }
                  >
                    {pageNum}
                  </Button>
                )
              })}
              
              {totalPages > 5 && <span className="text-white/60">...</span>}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="glass text-white border-white/20 hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Usage Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm">Tool</p>
                  <p className="text-white">{selectedItem.tool}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Action</p>
                  <p className="text-white">{selectedItem.action}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Date & Time</p>
                  <p className="text-white">{new Date(selectedItem.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Tokens Used</p>
                  <p className="text-white">{selectedItem.tokens}</p>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm mb-2">Request</p>
                <div className="glass p-3 rounded-lg">
                  <code className="text-white/80 text-sm">{selectedItem.details.request}</code>
                </div>
              </div>
              
              <div>
                <p className="text-white/60 text-sm mb-2">Response</p>
                <div className="glass p-3 rounded-lg">
                  <code className="text-white/80 text-sm">{selectedItem.details.response}</code>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setSelectedItem(null)}
                  variant="outline"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}