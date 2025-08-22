'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  MoreVertical,
  Settings,
  Ban,
  Trash2,
  Shield,
  Eye,
  CheckCircle,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

// User type
type User = {
  id: string
  name: string
  email: string
  avatar: null
  role: string
  status: string
  tokens: number
  tokensUsed: number
  plan: string
  createdAt: string
  lastActive: string
  verified: boolean
}

type SelectedUserState = (User & { isNew?: boolean; isEdit?: boolean }) | { isNew: true } | null

// Mock data for users
const generateMockUsers = (): User[] => {
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

export default function AdminDashboard() {
  const [users, setUsers] = useState(generateMockUsers())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<SelectedUserState>(null)
  const itemsPerPage = 10

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const verifiedUsers = users.filter(u => u.verified).length
  const totalTokens = users.reduce((sum, u) => sum + u.tokens, 0)
  const totalTokensUsed = users.reduce((sum, u) => sum + u.tokensUsed, 0)
  const adminUsers = users.filter(u => u.role === 'admin').length

  // Filter users
  let filteredUsers = users

  if (searchQuery) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (selectedRole !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === selectedRole)
  }

  if (selectedStatus !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === selectedStatus)
  }

  if (selectedPlan !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.plan === selectedPlan)
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleUserAction = (userId: string, action: string) => {
    toast.success(`Action "${action}" executed for user ${userId}`)
  }

  const handleAddTokens = (userId: string, amount: number) => {
    setUsers(users.map(user => 
      user.id === userId
        ? { ...user, tokens: user.tokens + amount }
        : user
    ))
    toast.success(`Added ${amount} tokens to user`)
  }

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Plan', 'Tokens', 'Verified', 'Created At', 'Last Active'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.plan,
        user.tokens.toString(),
        user.verified ? 'Yes' : 'No',
        user.createdAt,
        user.lastActive
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Users exported successfully')
  }

  // Type guard helper
  const isFullUser = (user: SelectedUserState): user is User & { isNew?: boolean; isEdit?: boolean } => {
    return user !== null && !('isNew' in user && user.isNew === true && Object.keys(user).length === 1)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Users</span>
            <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
              All Time
            </Badge>
          </div>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
          <p className="text-xs text-primary-green">+15% from last month</p>
        </Card>

        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Active Users</span>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activeUsers}</p>
          <Progress value={(activeUsers / totalUsers) * 100} className="mt-2" />
        </Card>

        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Verified</span>
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{verifiedUsers}</p>
          <p className="text-xs text-blue-400">{((verifiedUsers / totalUsers) * 100).toFixed(1)}% verified</p>
        </Card>

        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Admins</span>
            <Shield className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{adminUsers}</p>
          <p className="text-xs text-purple-400">System administrators</p>
        </Card>

        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Tokens</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalTokens.toLocaleString()}</p>
          <p className="text-xs text-yellow-400">Available</p>
        </Card>

        <Card className="glass-strong p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Tokens Used</span>
            <Zap className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalTokensUsed.toLocaleString()}</p>
          <p className="text-xs text-orange-400">Consumed</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-strong p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="input-glass pl-10"
              />
            </div>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input-glass px-4"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-glass px-4"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="input-glass px-4"
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
      </Card>

      {/* Users Table */}
      <Card className="glass-strong overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-white/60 font-medium">User</th>
                <th className="text-left p-4 text-white/60 font-medium">Role</th>
                <th className="text-left p-4 text-white/60 font-medium">Status</th>
                <th className="text-left p-4 text-white/60 font-medium">Plan</th>
                <th className="text-left p-4 text-white/60 font-medium">Tokens</th>
                <th className="text-left p-4 text-white/60 font-medium">Verified</th>
                <th className="text-left p-4 text-white/60 font-medium">Last Active</th>
                <th className="text-left p-4 text-white/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center">
                        <span className="text-primary-green font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      user.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : user.status === 'suspended'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={
                      user.plan === 'pro'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : user.plan === 'starter'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{user.tokens.toLocaleString()}</p>
                      <p className="text-white/60 text-xs">Used: {user.tokensUsed.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-white/20" />
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-white/60 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4">
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
                        <Settings className="h-4 w-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/60 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="glass text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  className={
                    currentPage === pageNumber
                      ? 'btn-primary'
                      : 'glass text-white border-white/20 hover:bg-white/10'
                  }
                >
                  {pageNumber}
                </Button>
              )
            })}
            {totalPages > 5 && <span className="text-white/60">...</span>}
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="glass text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {'isNew' in selectedUser && selectedUser.isNew && Object.keys(selectedUser).length === 1 
                  ? 'Add New User' 
                  : isFullUser(selectedUser) && selectedUser.isEdit 
                    ? 'Edit User' 
                    : 'User Details'}
              </h3>
              
              {isFullUser(selectedUser) && !selectedUser.isEdit && !selectedUser.isNew ? (
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
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Status</p>
                      <Badge className={
                        selectedUser.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : selectedUser.status === 'suspended'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
                      <p className="text-white/60 text-sm">Created At</p>
                      <p className="text-white">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Last Active</p>
                      <p className="text-white">{new Date(selectedUser.lastActive).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <div className="space-x-2">
                      {selectedUser.role !== 'admin' && (
                        <Button
                          onClick={() => handleUserAction(selectedUser.id, 'makeAdmin')}
                          variant="outline"
                          className="glass text-white border-white/20 hover:bg-white/10"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </Button>
                      )}
                      <Button
                        onClick={() => handleAddTokens(selectedUser.id, 1000)}
                        variant="outline"
                        className="glass text-white border-white/20 hover:bg-white/10"
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
                        defaultValue={isFullUser(selectedUser) ? selectedUser.name : ''}
                        className="input-glass mt-1"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Email</label>
                      <Input
                        defaultValue={isFullUser(selectedUser) ? selectedUser.email : ''}
                        className="input-glass mt-1"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Role</label>
                      <select
                        defaultValue={isFullUser(selectedUser) ? selectedUser.role : 'user'}
                        className="input-glass mt-1 w-full"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Status</label>
                      <select
                        defaultValue={isFullUser(selectedUser) ? selectedUser.status : 'active'}
                        className="input-glass mt-1 w-full"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Plan</label>
                      <select
                        defaultValue={isFullUser(selectedUser) ? selectedUser.plan : 'free'}
                        className="input-glass mt-1 w-full"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Tokens</label>
                      <Input
                        type="number"
                        defaultValue={isFullUser(selectedUser) ? selectedUser.tokens : 0}
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
                        toast.success('isNew' in selectedUser && selectedUser.isNew && Object.keys(selectedUser).length === 1 ? 'User created successfully' : 'User updated successfully')
                        setSelectedUser(null)
                      }}
                      className="btn-primary"
                    >
                      {'isNew' in selectedUser && selectedUser.isNew && Object.keys(selectedUser).length === 1 ? 'Create User' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}