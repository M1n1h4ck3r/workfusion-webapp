'use client'

import dynamic from 'next/dynamic'

// Dynamic import to prevent SSR issues
const AIModelsPageContent = dynamic(() => import('./AIModelsPageContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-green mx-auto mb-4"></div>
        <p className="text-white/80">Loading AI Models...</p>
      </div>
    </div>
  )
})

export default function AIModelsPage() {
  return <AIModelsPageContent />
}