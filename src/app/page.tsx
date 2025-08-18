'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogoAnimation } from '@/components/animations/LogoAnimation'
import { TypewriterText } from '@/components/animations/TypewriterText'
import { FloatingParticles } from '@/components/animations/FloatingParticles'
import { ScrollIndicator } from '@/components/animations/ScrollIndicator'
import { GradientBackground } from '@/components/animations/GradientBackground'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { DemoSection } from '@/components/sections/DemoSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { PricingSection } from '@/components/sections/PricingSection'

export default function Home() {
  const stats = [
    { number: "500+", label: "Free Tokens" },
    { number: "4", label: "AI Experts" },
    { number: "24/7", label: "Availability" },
    { number: "< 2s", label: "Response Time" }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
          {/* Animated Background */}
          <GradientBackground />
          <FloatingParticles />

          <div className="container mx-auto text-center relative z-10">
            {/* Animated Logo */}
            <LogoAnimation />
            
            <Badge className="mb-6 bg-primary-green/20 text-primary-green border-primary-green/30 animate-pulse">
              🚀 AI Playground Now Live
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Transform Your Business with{' '}
              <TypewriterText 
                text="AI Automation" 
                className="gradient-text"
                delay={1}
              />
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of automation, chatbots, and data analysis. 
              Test our AI tools with 500 free tokens and discover how AI can revolutionize your workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/playground" className="group">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  {/* Glowing background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-primary rounded-lg blur-xl opacity-60"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <Button 
                    size="lg" 
                    className="relative btn-primary text-lg px-8 py-4 group overflow-hidden"
                  >
                    {/* Animated background shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    />
                    
                    <span className="relative z-10 flex items-center">
                      Start Free Trial
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/services" className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  {/* Subtle glow for secondary button */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-30"
                    whileHover={{
                      scale: 1.05,
                      opacity: 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="relative text-lg px-8 py-4 glass text-white border-white/30 hover:bg-white/15 hover:border-white/50 transition-all duration-300"
                  >
                    <span className="relative z-10">Learn More</span>
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <ScrollIndicator />
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Demo Section */}
        <DemoSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="glass-strong p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using AI to automate workflows, 
                improve customer service, and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="btn-primary text-lg px-8 py-4">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10 text-lg px-8 py-4">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
