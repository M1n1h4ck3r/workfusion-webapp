'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Users,
  Activity,
  DollarSign,
  Search,
  Filter,
  Shield,
  Ban,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Download,
  Eye,
  CheckCircle,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

// Mock data for users
const generateMockUsers = () => {
  const users = []
  const names = [
    'John Doe', 'Jane Smith', 'Alex Johnson', 'Maria Garcia', 'David Wilson',
    'Emily Brown', 'Michael Davis', 'Sarah Miller', 'James Anderson', 'Lisa Taylor',
    'Robert Martinez', 'Jennifer Moore', 'William Jackson', 'Linda White', 'Christopher Lee'
  ]
  
  for (let i = 0; i < 50; i++) {
    const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    const lastActiveDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    users.push({
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: names[i % names.length],
      email: `${names[i % names.length].toLowerCase().replace(' ', '.')}${i}@example.com`,
      avatar: null,
      role: Math.random() > 0.95 ? 'admin' : 'user',
      status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'suspended' : 'inactive'),
      tokens: Math.floor(Math.random() * 5000),
      tokensUsed: Math.floor(Math.random() * 10000),
      plan: Math.random() > 0.7 ? 'pro' : (Math.random() > 0.5 ? 'starter' : 'free'),
      createdAt: createdDate.toISOString(),
      lastActive: lastActiveDate.toISOString(),
      verified: Math.random() > 0.2
    })
  }
  
  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const mockUsers = generateMockUsers()

export default function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null)
  const itemsPerPage = 10

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalRevenue = users.filter(u => u.plan !== 'free').length * 29.99
  const totalTokensUsed = users.reduce((sum, u) => sum + u.tokensUsed, 0)

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
    
    return matchesSearch && matchesRole && matchesStatus && matchesPlan
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete' | 'makeAdmin') => {
    switch(action) {
      case 'suspend':
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u))
        toast.success('User suspended successfully')
        break
      case 'activate':
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u))
        toast.success('User activated successfully')
        break
      case 'delete':
        if (confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== userId))
          toast.success('User deleted successfully')
        }
        break
      case 'makeAdmin':
        setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' } : u))
        toast.success('User promoted to admin')
        break
    }
  }

  const handleAddTokens = (userId: string, amount: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, tokens: u.tokens + amount } : u))
    toast.success(`Added ${amount} tokens to user`)
  }

  const exportUsers = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Role', 'Status', 'Plan', 'Tokens', 'Created At', 'Last Active'].join(','),
      ...filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.status,
        user.plan,
        user.tokens,
        new Date(user.createdAt).toLocaleDateString(),
        new Date(user.lastActive).toLocaleDateString()
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    toast.success('Users exported successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/80">Manage users and monitor platform activity</p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={() => setSelectedUser({ isNew: true })}
              className="btn-primary"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <Button
              onClick={exportUsers}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/60 text-sm">Total</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">{totalUsers}</div>
              <p className="text-white/60 text-sm">Registered users</p>
            </div>
          </motion.div>

          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/60 text-sm">Active</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">{activeUsers}</div>
              <p className="text-white/60 text-sm">Active users</p>
            </div>
          </motion.div>

          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/60 text-sm">Revenue</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(0)}</div>
              <p className="text-white/60 text-sm">Monthly revenue</p>
            </div>
          </motion.div>

          <motion.div
            className="glass-strong p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/60 text-sm">Usage</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl font-bold text-white">{(totalTokensUsed / 1000).toFixed(1)}k</div>
              <p className="text-white/60 text-sm">Tokens used</p>
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
                  placeholder="Search by name or email..."
                  className="input-glass pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-glass px-4 py-2 rounded-lg"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-glass px-4 py-2 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="input-glass px-4 py-2 rounded-lg"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
            
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedRole('all')
                setSelectedStatus('all')
                setSelectedPlan('all')
                setCurrentPage(1)
              }}
              variant="outline"
              className="glass text-white border-white/20 hover:bg-white/10"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Users Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Tokens</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{user.name}</p>
                            {user.verified && (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-white/10 text-white/80 border-white/20'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : user.status === 'suspended'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={
                        user.plan === 'pro'
                          ? 'bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30'
                          : user.plan === 'starter'
                          ? 'bg-primary-green/20 text-primary-green border-primary-green/30'
                          : 'bg-white/10 text-white/80 border-white/20'
                      }>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-primary-yellow" />
                        <span className="text-white/80">{user.tokens}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1 text-white/60 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedUser({ ...user, isEdit: true })}
                          className="p-1 text-white/60 hover:text-white transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Suspend User"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            title="Activate User"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <div className="text-sm text-white/60">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

        {/* User Detail/Edit Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {selectedUser.isNew ? 'Add New User' : selectedUser.isEdit ? 'Edit User' : 'User Details'}
              </h3>
              
              {!selectedUser.isNew && !selectedUser.isEdit ? (
                // View mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Name</p>
                      <p className="text-white">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Email</p>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Role</p>
                      <Badge className={
                        selectedUser.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1'
                          : 'bg-white/10 text-white/80 border-white/20 mt-1'
                      }>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Status</p>
                      <Badge className={
                        selectedUser.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 mt-1'
                          : selectedUser.status === 'suspended'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30 mt-1'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mt-1'
                      }>
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Plan</p>
                      <p className="text-white capitalize">{selectedUser.plan}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Tokens</p>
                      <p className="text-white">{selectedUser.tokens}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Tokens Used</p>
                      <p className="text-white">{selectedUser.tokensUsed}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Verified</p>
                      <p className="text-white">{selectedUser.verified ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Joined</p>
                      <p className="text-white">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Last Active</p>
                      <p className="text-white">{new Date(selectedUser.lastActive).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="space-x-2">
                      {selectedUser.role !== 'admin' && (
                        <Button
                          onClick={() => handleUserAction(selectedUser.id, 'makeAdmin')}
                          className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </Button>
                      )}
                      <Button
                        onClick={() => handleAddTokens(selectedUser.id, 1000)}
                        className="bg-primary-green/20 text-primary-green border-primary-green/30 hover:bg-primary-green/30"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Add 1000 Tokens
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => setSelectedUser(null)}
                      variant="outline"
                      className="glass text-white border-white/20 hover:bg-white/10"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                // Edit/Create mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm">Name</label>
                      <Input
                        defaultValue={selectedUser.name || ''}
                        className="input-glass mt-1"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Email</label>
                      <Input
                        type="email"
                        defaultValue={selectedUser.email || ''}
                        className="input-glass mt-1"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Role</label>
                      <select className="input-glass mt-1 w-full" defaultValue={selectedUser.role || 'user'}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Status</label>
                      <select className="input-glass mt-1 w-full" defaultValue={selectedUser.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Plan</label>
                      <select className="input-glass mt-1 w-full" defaultValue={selectedUser.plan || 'free'}>
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Tokens</label>
                      <Input
                        type="number"
                        defaultValue={selectedUser.tokens || 500}
                        className="input-glass mt-1"
                        placeholder="Enter tokens"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => setSelectedUser(null)}
                      variant="outline"
                      className="glass text-white border-white/20 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success(selectedUser.isNew ? 'User created successfully' : 'User updated successfully')
                        setSelectedUser(null)
                      }}
                      className="btn-primary"
                    >
                      {selectedUser.isNew ? 'Create User' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}