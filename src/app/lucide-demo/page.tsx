import { LucideShowcase } from '@/components/ui/lucide-showcase'

export default function LucideDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20">
      <div className="container mx-auto px-4 py-12">
        <LucideShowcase />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Lucide Icons Demo | WorkFusion',
  description: 'Showcasing the latest Lucide.dev integration with optimized React components'
}