'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Search, Filter, Grid, List, Star, Download, TrendingUp,
  Shield, Clock, DollarSign, Code, Zap, Database, MessageSquare,
  BarChart3, Mail, FileText, Globe, Lock, CheckCircle2, XCircle,
  AlertTriangle, Plus, Settings, ExternalLink, ChevronRight,
  Package, Layers, Users, Activity, Award, Sparkles, Info,
  CreditCard, Tag, Calendar, ArrowUp, ArrowDown, Heart
} from 'lucide-react'
import { toast } from 'sonner'
import { integrationMarketplace, Integration, MarketplaceFilters } from '@/services/integration-marketplace'

type ViewMode = 'grid' | 'list'
type SortBy = 'popular' | 'recent' | 'rating' | 'name'

export default function MarketplacePage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [filteredIntegrations, setFilteredIntegrations] = useState<Integration[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('popular')
  const [filters, setFilters] = useState<MarketplaceFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMarketplace()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [integrations, filters, sortBy, searchQuery, selectedCategory])

  const loadMarketplace = async () => {
    try {
      const [marketplaceStats, allIntegrations] = await Promise.all([
        integrationMarketplace.getMarketplaceStats(),
        integrationMarketplace.searchIntegrations({})
      ])
      
      setStats(marketplaceStats)
      setIntegrations(allIntegrations)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load marketplace:', error)
      toast.error('Failed to load marketplace')
      setIsLoading(false)
    }
  }

  const applyFiltersAndSort = async () => {
    const currentFilters: MarketplaceFilters = {
      ...filters,
      search: searchQuery || undefined,
      category: selectedCategory || undefined
    }

    let filtered = await integrationMarketplace.searchIntegrations(currentFilters)

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.metrics.installs - a.metrics.installs)
        break
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        filtered.sort((a, b) => b.metrics.rating - a.metrics.rating)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredIntegrations(filtered)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      communication: MessageSquare,
      productivity: Zap,
      analytics: BarChart3,
      crm: Users,
      marketing: Mail,
      development: Code,
      finance: CreditCard,
      ai: Sparkles
    }
    return icons[category] || Package
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      api: Globe,
      webhook: Zap,
      oauth: Lock,
      database: Database,
      file_storage: FileText,
      messaging: MessageSquare,
      analytics: BarChart3
    }
    return icons[type] || Package
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'beta': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'deprecated': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'coming_soon': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleInstall = async (integration: Integration) => {
    try {
      // In a real app, this would open a configuration dialog
      toast.success(`Installing ${integration.name}...`)
      // Simulate installation
      setTimeout(() => {
        toast.success(`${integration.name} installed successfully!`)
      }, 2000)
    } catch (error) {
      toast.error('Failed to install integration')
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const categories = [
    { id: 'communication', name: 'Communication', count: stats?.categoryCounts?.communication || 0 },
    { id: 'productivity', name: 'Productivity', count: stats?.categoryCounts?.productivity || 0 },
    { id: 'analytics', name: 'Analytics', count: stats?.categoryCounts?.analytics || 0 },
    { id: 'crm', name: 'CRM', count: stats?.categoryCounts?.crm || 0 },
    { id: 'marketing', name: 'Marketing', count: stats?.categoryCounts?.marketing || 0 },
    { id: 'development', name: 'Development', count: stats?.categoryCounts?.development || 0 },
    { id: 'finance', name: 'Finance', count: stats?.categoryCounts?.finance || 0 },
    { id: 'ai', name: 'AI & ML', count: stats?.categoryCounts?.ai || 0 }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-white/80">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Integration Marketplace</h1>
          <p className="text-white/80">Discover and connect powerful integrations to enhance your workflows</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button className="bg-gradient-primary hover:opacity-90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Submit Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Integrations</p>
              <p className="text-2xl font-bold text-white mt-1">{stats?.totalIntegrations || 0}</p>
            </div>
            <Package className="h-8 w-8 text-primary-green" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Installs</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatNumber(stats?.totalInstalls || 0)}
              </p>
            </div>
            <Download className="h-8 w-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Connections</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatNumber(stats?.activeConnections || 0)}
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg Rating</p>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-bold text-white mr-2">
                  {stats?.averageRating?.toFixed(1) || '0.0'}
                </p>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <Award className="h-8 w-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="glass-strong p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setViewMode('grid')}
              variant="outline"
              size="icon"
              className={`glass text-white border-white/20 ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant="outline"
              size="icon"
              className={`glass text-white border-white/20 ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/10'}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="outline"
            size="sm"
            className={`glass text-white border-white/20 ${!selectedCategory ? 'bg-white/10' : 'hover:bg-white/10'}`}
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.id)
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant="outline"
                size="sm"
                className={`glass text-white border-white/20 ${selectedCategory === category.id ? 'bg-white/10' : 'hover:bg-white/10'}`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name} ({category.count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Integrations Grid/List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredIntegrations.map((integration, index) => {
          const CategoryIcon = getCategoryIcon(integration.category.primary)
          const TypeIcon = getTypeIcon(integration.type)

          return (
            <motion.div
              key={integration.id}
              className={`glass-strong rounded-xl ${viewMode === 'grid' ? 'p-6' : 'p-6'} hover:bg-white/5 transition-colors cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedIntegration(integration)
                setShowDetails(true)
              }}
            >
              <div className={viewMode === 'list' ? 'flex items-start space-x-4' : ''}>
                {/* Logo/Icon */}
                <div className={`${viewMode === 'list' ? '' : 'mb-4'}`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-green/20 to-primary-blue/20 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="h-8 w-8 text-primary-green" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                      <p className="text-white/60 text-sm mt-1">{integration.provider}</p>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>

                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {integration.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">{integration.metrics.rating.toFixed(1)}</span>
                      <span className="text-white/40 text-sm">({integration.metrics.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4 text-white/40" />
                      <span className="text-white/60 text-sm">{formatNumber(integration.metrics.installs)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TypeIcon className="h-4 w-4 text-white/40" />
                      <span className="text-white/60 text-sm">{integration.type}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {integration.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} className="bg-white/5 text-white/70 border-white/10 text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 3 && (
                      <Badge className="bg-white/5 text-white/70 border-white/10 text-xs">
                        +{integration.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {integration.pricing.model === 'free' ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Free
                        </Badge>
                      ) : integration.pricing.model === 'freemium' ? (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Freemium
                        </Badge>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-white/40" />
                          <span className="text-white text-sm">
                            {integration.pricing.price}
                            {integration.pricing.billingCycle && `/${integration.pricing.billingCycle}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleInstall(integration)
                      }}
                      size="sm"
                      className="bg-primary-green hover:bg-primary-green/90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Install
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Integration Details Modal */}
      <AnimatePresence>
        {showDetails && selectedIntegration && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="glass-strong rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-green/20 to-primary-blue/20 rounded-xl flex items-center justify-center">
                    {(() => {
                      const Icon = getCategoryIcon(selectedIntegration.category.primary)
                      return <Icon className="h-10 w-10 text-primary-green" />
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedIntegration.name}</h2>
                    <p className="text-white/60 mt-1">{selectedIntegration.provider}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={getStatusColor(selectedIntegration.status)}>
                        {selectedIntegration.status}
                      </Badge>
                      <Badge className="bg-white/5 text-white/70 border-white/10">
                        v{selectedIntegration.version}
                      </Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Description */}
              <p className="text-white/80 mb-6">{selectedIntegration.description}</p>

              {/* Metrics Bar */}
              <div className="glass p-4 rounded-lg mb-6">
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xl font-bold text-white">
                        {selectedIntegration.metrics.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs">{selectedIntegration.metrics.reviewCount} reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-1">
                      {formatNumber(selectedIntegration.metrics.installs)}
                    </p>
                    <p className="text-white/40 text-xs">Installs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-1">
                      {selectedIntegration.metrics.uptime}%
                    </p>
                    <p className="text-white/40 text-xs">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-1">
                      {selectedIntegration.metrics.responseTime}ms
                    </p>
                    <p className="text-white/40 text-xs">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-white mb-1">
                      {selectedIntegration.metrics.successRate}%
                    </p>
                    <p className="text-white/40 text-xs">Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedIntegration.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Pricing</h3>
                {selectedIntegration.pricing.tiers ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {selectedIntegration.pricing.tiers.map((tier, index) => (
                      <div key={index} className="glass p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">{tier.name}</h4>
                        <p className="text-2xl font-bold text-white mb-3">
                          ${tier.price}
                          <span className="text-sm text-white/60">/month</span>
                        </p>
                        <div className="space-y-2">
                          {tier.features.map((feature, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="text-white/70 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass p-4 rounded-lg">
                    <p className="text-white">
                      {selectedIntegration.pricing.model === 'free' ? 'Free to use' :
                       selectedIntegration.pricing.model === 'usage_based' ? 
                       `$${selectedIntegration.pricing.price} per ${selectedIntegration.pricing.billingCycle}` :
                       `$${selectedIntegration.pricing.price}/${selectedIntegration.pricing.billingCycle}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                    onClick={() => window.open(selectedIntegration.documentation.quickStart, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button
                    variant="outline"
                    className="glass text-white border-white/20 hover:bg-white/10"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                </div>
                <Button
                  onClick={() => handleInstall(selectedIntegration)}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Install Integration
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}