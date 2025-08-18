'use client'

import { motion } from 'framer-motion'
import { Loader2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'pulse'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const variantClasses = {
    default: 'text-white',
    gradient: 'text-primary-green',
    pulse: 'text-primary-yellow'
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        className={cn('relative', sizeClasses[size], className)}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-75" />
        <div className="absolute inset-1 bg-dark-bg rounded-full" />
        <Zap className="absolute inset-0 w-full h-full p-1 text-white" />
      </motion.div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(sizeClasses[size], className)}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Loader2 className={cn('w-full h-full animate-spin', variantClasses[variant])} />
      </motion.div>
    )
  }

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], variantClasses[variant], className)} />
  )
}

interface LoadingStateProps {
  message?: string
  submessage?: string
  variant?: 'default' | 'card' | 'fullscreen'
  className?: string
}

export function LoadingState({ 
  message = 'Loading...', 
  submessage,
  variant = 'default',
  className 
}: LoadingStateProps) {
  if (variant === 'fullscreen') {
    return (
      <motion.div
        className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass-strong p-8 rounded-3xl text-center max-w-sm mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LoadingSpinner size="lg" variant="gradient" className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
          {submessage && (
            <p className="text-white/60 text-sm">{submessage}</p>
          )}
        </motion.div>
      </motion.div>
    )
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={cn('glass p-8 rounded-2xl text-center', className)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <LoadingSpinner size="lg" variant="gradient" className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{message}</h3>
        {submessage && (
          <p className="text-white/60 text-sm">{submessage}</p>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn('flex items-center justify-center space-x-3 py-8', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner variant="gradient" />
      <div>
        <div className="text-white font-medium">{message}</div>
        {submessage && (
          <div className="text-white/60 text-sm">{submessage}</div>
        )}
      </div>
    </motion.div>
  )
}

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white/10 rounded-md',
        animate && 'animate-pulse',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-8 w-full rounded" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}