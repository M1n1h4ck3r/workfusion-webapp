'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Zap, 
  Star, 
  Globe,
  Target,
  BarChart3,
  Clock,
  Shield
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: "Business Growth",
    description: "AI-driven insights to accelerate your business growth",
    progress: 95,
    metric: "95%",
    label: "Efficiency Boost"
  },
  {
    icon: Users,
    title: "Customer Engagement",
    description: "Enhanced customer interactions through intelligent automation",
    progress: 88,
    metric: "88%",
    label: "Satisfaction Rate"
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Seamless multi-channel communication platform",
    progress: 92,
    metric: "92%",
    label: "Response Rate"
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Automate repetitive tasks and focus on what matters",
    progress: 97,
    metric: "97%",
    label: "Time Saved"
  }
]

const stats = [
  {
    icon: Star,
    number: 4.9,
    suffix: "/5",
    label: "Customer Rating",
    description: "Based on 1000+ reviews"
  },
  {
    icon: Globe,
    number: 50,
    suffix: "+",
    label: "Countries Served",
    description: "Global reach and support"
  },
  {
    icon: Target,
    number: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Reliable 24/7 service"
  },
  {
    icon: BarChart3,
    number: 500,
    suffix: "+",
    label: "Free Tokens",
    description: "Start testing immediately"
  }
]

function AnimatedCounter({ 
  target, 
  suffix = "", 
  duration = 2000 
}: { 
  target: number; 
  suffix?: string; 
  duration?: number 
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 mesh-gradient" />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            📊 Performance Metrics
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Proven Results with{' '}
            <span className="gradient-text">AI Technology</span>
          </h2>
          <p className="text-xl text-white/85 max-w-3xl mx-auto">
            Our AI solutions deliver measurable improvements across all key business metrics,
            helping companies achieve unprecedented growth and efficiency.
          </p>
        </motion.div>

        {/* Features Grid with Progress Bars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-white/80 text-sm mb-4">
                {feature.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 text-xs">{feature.label}</span>
                  <span className="text-emerald-400 font-semibold text-sm">{feature.metric}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Progress 
                    value={feature.progress} 
                    className="h-2 bg-white/10"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="glass-strong p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Trusted by <span className="gradient-text">Thousands</span>
            </h3>
            <p className="text-white/85 max-w-2xl mx-auto">
              Join the growing community of businesses leveraging AI for competitive advantage.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </h4>
                
                <p className="text-white/80 text-sm">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: Clock,
              title: "Real-time Processing",
              description: "Lightning-fast AI responses with sub-2 second processing times"
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level security with GDPR/LGPD compliance and data encryption"
            },
            {
              icon: Globe,
              title: "Global Scale",
              description: "Multi-region deployment with 99.9% uptime guarantee worldwide"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <item.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-white/60 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}