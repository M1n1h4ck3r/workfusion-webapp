'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Zap,
  TrendingUp,
  Package,
  Check,
  Clock,
  Download,
  Shield,
  Sparkles,
  Gift,
  AlertCircle,
  PaypalIcon as Paypal,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  Repeat,
  Crown
} from 'lucide-react'
import { toast } from 'sonner'

const tokenPackages = [
  {
    id: 'pack-1',
    name: 'Starter Pack',
    tokens: 1000,
    price: 9.99,
    savings: 0,
    popular: false,
    color: 'green'
  },
  {
    id: 'pack-2',
    name: 'Growth Pack',
    tokens: 5000,
    price: 39.99,
    savings: 10,
    bonus: 500,
    popular: true,
    color: 'yellow'
  },
  {
    id: 'pack-3',
    name: 'Pro Pack',
    tokens: 10000,
    price: 69.99,
    savings: 30,
    bonus: 1500,
    popular: false,
    color: 'orange'
  },
  {
    id: 'pack-4',
    name: 'Enterprise Pack',
    tokens: 25000,
    price: 149.99,
    savings: 100,
    bonus: 5000,
    popular: false,
    color: 'red'
  }
]

const subscriptionPlans = [
  {
    id: 'sub-1',
    name: 'Starter',
    tokens: 2500,
    price: 19.99,
    period: 'month',
    tier: 'Basic',
    features: [
      '2,500 tokens per month',
      'Email support',
      'Basic analytics',
      'Standard AI models'
    ]
  },
  {
    id: 'sub-2',
    name: 'Professional',
    tokens: 10000,
    price: 49.99,
    period: 'month',
    tier: 'Pro',
    popular: true,
    features: [
      '10,000 tokens per month',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Voice cloning'
    ]
  },
  {
    id: 'sub-3',
    name: 'Business',
    tokens: 50000,
    price: 199.99,
    period: 'month',
    tier: 'Business',
    features: [
      '50,000 tokens per month',
      'Dedicated support',
      'Custom AI models',
      'Team collaboration',
      'White-label options',
      'Advanced voice synthesis',
      'Priority processing'
    ]
  },
  {
    id: 'sub-4',
    name: 'Enterprise',
    tokens: -1,
    price: 'Custom',
    period: 'month',
    tier: 'Enterprise',
    features: [
      'Unlimited tokens',
      '24/7 dedicated support',
      'Custom AI training',
      'Multi-tenant architecture',
      'SLA guarantees',
      'On-premise deployment',
      'Custom integrations'
    ]
  }
]

const paymentMethods = [
  {
    id: 'card-1',
    type: 'Credit Card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true
  },
  {
    id: 'card-2',
    type: 'Credit Card', 
    brand: 'MasterCard',
    last4: '8888',
    expiry: '08/25',
    isDefault: false
  }
]

const billingAnalytics = {
  monthlySpend: 149.97,
  tokensUsed: 12847,
  averageDaily: 415,
  projectedMonthly: 187.50,
  savings: 29.99
}

const paymentHistory = [
  { id: 1, date: '2024-01-15', description: 'Growth Pack', amount: 39.99, tokens: 5500, status: 'completed' },
  { id: 2, date: '2024-01-08', description: 'Starter Pack', amount: 9.99, tokens: 1000, status: 'completed' },
  { id: 3, date: '2023-12-28', description: 'Pro Pack', amount: 69.99, tokens: 11500, status: 'completed' },
  { id: 4, date: '2023-12-15', description: 'Monthly Pro', amount: 29.99, tokens: 5000, status: 'completed' },
  { id: 5, date: '2023-12-01', description: 'Growth Pack', amount: 39.99, tokens: 5500, status: 'completed' }
]

export default function BillingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'tokens' | 'subscription' | 'history' | 'analytics' | 'methods'>('tokens')
  const [currentPlan, setCurrentPlan] = useState<string>('sub-2')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)

  const currentTokens = 482
  const totalTokensUsed = 1892
  const averageDaily = Math.round(totalTokensUsed / 30)

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId)
    setIsProcessing(true)

    try {
      // TODO: Implement Stripe checkout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Purchase successful! Tokens have been added to your account.')
      setSelectedPackage(null)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    setIsUpgrading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCurrentPlan(planId)
      toast.success('Subscription updated successfully!')
    } catch (error) {
      toast.error('Subscription update failed. Please try again.')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleAddPaymentMethod = () => {
    setShowAddPayment(true)
    // TODO: Open Stripe payment method setup
    setTimeout(() => {
      setShowAddPayment(false)
      toast.success('Payment method added successfully!')
    }, 2000)
  }

  const handleRemovePaymentMethod = (methodId: string) => {
    toast.success('Payment method removed')
  }

  const handleSetDefaultPayment = (methodId: string) => {
    toast.success('Default payment method updated')
  }

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === currentPlan)
  }

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'Pro': return 'bg-primary-green/20 text-primary-green border-primary-green/30'
      case 'Business': return 'bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30'
      case 'Enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }


  const downloadInvoice = (paymentId: number) => {
    // TODO: Implement invoice download
    toast.success(`Downloading invoice #${paymentId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Tokens</h1>
          <p className="text-white/80">Manage your tokens and subscription</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            {currentTokens} tokens available
          </Badge>
        </div>
      </div>

      {/* Current Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-white/60 text-sm">Current Balance</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">{currentTokens}</span>
                <span className="text-white/60">tokens</span>
              </div>
              <Progress value={(currentTokens / 500) * 100} className="h-2 mt-2" />
            </div>
            
            <p className="text-white/60 text-sm">
              Estimated {Math.round(currentTokens / averageDaily)} days remaining
            </p>
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-white/60 text-sm">This Month</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">{totalTokensUsed}</span>
              <span className="text-white/60">used</span>
            </div>
            <p className="text-white/60 text-sm">
              Average {averageDaily} tokens/day
            </p>
          </div>
        </motion.div>

        <motion.div
          className="glass-strong p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-white/60 text-sm">Next Renewal</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">Feb 15</span>
            </div>
            <p className="text-white/60 text-sm">
              Monthly Pro subscription
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 p-1 glass rounded-lg">
        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'tokens' 
              ? 'bg-primary-green text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Package className="inline-block mr-2 h-4 w-4" />
          Token Packages
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'subscription' 
              ? 'bg-primary-green text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <CreditCard className="inline-block mr-2 h-4 w-4" />
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'history' 
              ? 'bg-primary-green text-white' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          <Clock className="inline-block mr-2 h-4 w-4" />
          Payment History
        </button>
      </div>

      {/* Token Packages */}
      {activeTab === 'tokens' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className={`glass-strong p-6 rounded-2xl relative ${
                  pkg.popular ? 'border-2 border-primary-yellow/50' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary-yellow text-black font-semibold px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${
                    pkg.color === 'green' ? 'from-green-400 to-emerald-500' :
                    pkg.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                    pkg.color === 'orange' ? 'from-orange-400 to-red-500' :
                    'from-red-400 to-pink-500'
                  } rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{pkg.name}</h3>
                  
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-white">{pkg.tokens.toLocaleString()}</span>
                    <span className="text-white/60 ml-1">tokens</span>
                  </div>
                  
                  {pkg.bonus && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-3">
                      <Gift className="mr-1 h-3 w-3" />
                      +{pkg.bonus.toLocaleString()} bonus
                    </Badge>
                  )}
                  
                  <div className="text-2xl font-bold gradient-text mb-1">
                    ${pkg.price}
                  </div>
                  
                  {pkg.savings > 0 && (
                    <p className="text-green-400 text-sm">
                      Save ${pkg.savings}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isProcessing && selectedPackage === pkg.id}
                  className={pkg.popular ? 'w-full btn-primary' : 'w-full glass text-white border-white/20 hover:bg-white/10'}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Purchase Now'
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Secure Payment Notice */}
          <motion.div
            className="glass p-4 rounded-xl mt-6 flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Shield className="h-5 w-5 text-primary-green" />
            <p className="text-white/80 text-sm">
              Secure payment powered by Stripe. Your payment information is never stored on our servers.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Subscriptions */}
      {activeTab === 'subscription' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className="glass-strong p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-3xl font-bold gradient-text">${plan.price}</span>
                    <span className="text-white/60">/ {plan.period}</span>
                  </div>
                  <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30">
                    {plan.tokens.toLocaleString()} tokens/month
                  </Badge>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/80">
                      <Check className="h-5 w-5 text-primary-green mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className="w-full btn-primary"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Current Subscription */}
          <motion.div
            className="glass-strong p-6 rounded-2xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Current Subscription</h3>
                <p className="text-white/80">Monthly Pro - $29.99/month</p>
                <p className="text-white/60 text-sm">Next billing date: February 15, 2024</p>
              </div>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  Change Plan
                </Button>
                <Button
                  variant="outline"
                  className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payment History */}
      {activeTab === 'history' && (
        <motion.div
          className="glass-strong rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Payment History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Tokens</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/80">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white/80">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      +{payment.tokens.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadInvoice(payment.id)}
                        className="text-white/60 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Low Balance Alert */}
      {currentTokens < 100 && (
        <motion.div
          className="glass-strong p-6 rounded-2xl border-yellow-500/20 bg-yellow-500/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Low Token Balance</h3>
              <p className="text-white/80 mb-4">
                You have only {currentTokens} tokens remaining. Purchase more tokens to continue using our AI services without interruption.
              </p>
              <Button className="btn-primary">
                Buy Tokens Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}