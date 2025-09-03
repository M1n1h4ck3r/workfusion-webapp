'use client'

import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-400 mb-4">Error</h1>
              <h2 className="text-2xl font-semibold text-white mb-4">Something went wrong</h2>
              <p className="text-white/80 mb-8">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                className="btn-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button asChild variant="outline" className="glass text-white border-white/20">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}