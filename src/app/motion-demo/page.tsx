import { MotionShowcase } from '@/components/ui/motion-showcase'

export default function MotionDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-green-900/20">
      <div className="container mx-auto px-4 py-12">
        <MotionShowcase />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Motion.dev Demo | WorkFusion',
  description: 'Showcasing the unified Motion library with advanced animations and performance optimizations'
}