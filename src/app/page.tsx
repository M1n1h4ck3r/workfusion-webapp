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
          {/* Clean Background */}
          <div className="absolute inset-0 mesh-gradient" />

          <div className="container mx-auto text-center relative z-10">
            {/* Animated Logo */}
            <LogoAnimation />
            
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/30">
              🚀 AI Platform Now Live
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
              <Link href="/playground">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/services">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700 text-lg px-8 py-4 rounded-lg transition-colors"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm">
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
                  <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
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
