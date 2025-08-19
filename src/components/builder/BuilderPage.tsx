'use client'

import { useEffect, useState } from 'react'
import { builder, BuilderComponent, useIsPreviewing } from '@builder.io/react'
import { builderConfig } from '@/lib/builder-config'
import '@/lib/builder-registry' // Import to register components
import { toast } from 'sonner'

interface BuilderPageProps {
  model?: string
  content?: any
  url?: string
  options?: any
}

export function BuilderPage({ 
  model = 'page', 
  content, 
  url = '', 
  options = {} 
}: BuilderPageProps) {
  const [builderContent, setBuilderContent] = useState(content)
  const [isLoading, setIsLoading] = useState(!content)
  const [error, setError] = useState<string | null>(null)
  const isPreviewing = useIsPreviewing()

  useEffect(() => {
    // If content is already provided, don't fetch
    if (content) {
      setBuilderContent(content)
      setIsLoading(false)
      return
    }

    // Fetch content from Builder.io
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const builderContent = await builder
          .get(model, {
            url: url || window.location.pathname,
            ...options
          })
          .toPromise()

        if (!builderContent && !isPreviewing) {
          setError('Page not found')
          return
        }

        setBuilderContent(builderContent)
      } catch (err) {
        console.error('Error fetching Builder content:', err)
        setError('Failed to load content')
        toast.error('Failed to load page content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [model, url, content, options, isPreviewing])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-white/80">Loading page content...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !isPreviewing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Render Builder content
  return (
    <BuilderComponent
      model={model}
      content={builderContent}
      options={{
        includeRefs: true,
        ...options
      }}
      data={{
        // Pass any additional data to Builder components
        theme: 'dark',
        platform: 'workfusion',
        timestamp: Date.now()
      }}
    />
  )
}

// Higher-order component for Builder.io integration
export function withBuilder<T extends object>(
  Component: React.ComponentType<T>,
  model: string = 'page'
) {
  return function BuilderWrappedComponent(props: T & { builderContent?: any }) {
    const { builderContent, ...componentProps } = props

    if (builderContent) {
      return <BuilderPage model={model} content={builderContent} />
    }

    return <Component {...(componentProps as T)} />
  }
}

// Hook for Builder.io content
export function useBuilderContent(model: string, url?: string) {
  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const builderContent = await builder
          .get(model, {
            url: url || window.location.pathname
          })
          .toPromise()

        setContent(builderContent)
      } catch (err) {
        console.error('Error fetching Builder content:', err)
        setError('Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [model, url])

  return { content, isLoading, error }
}

export default BuilderPage