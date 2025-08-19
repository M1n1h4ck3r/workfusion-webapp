'use client'

import { useEffect } from 'react'
import { aiMetricsTracker } from '@/lib/ai-metrics-tracker'
import { aiPerformanceMonitor } from '@/services/ai-performance-monitor'

export function MonitoringInitializer() {
  useEffect(() => {
    // Start the performance monitor
    aiPerformanceMonitor.startMonitoring()
    
    // Start metrics simulation for demo purposes
    aiMetricsTracker.startSimulation()
    
    return () => {
      // Cleanup on unmount
      aiPerformanceMonitor.stopMonitoring()
    }
  }, [])

  // This component doesn't render anything
  return null
}