import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-4">Page Not Found</h2>
          <p className="text-white/70 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Go Home
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}