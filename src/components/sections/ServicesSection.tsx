'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, MessageSquare, Phone, Mic, Brain, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Bot,
    title: "AI Chatbots",
    description: "Intelligent conversational AI trained on expert knowledge from Alex Hormozi, Jordan Peterson, and specialized domains.",
    features: ["Natural conversations", "Expert knowledge", "24/7 availability"],
    badge: "4 Experts",
    color: "green",
    href: "/playground/chatbots"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Automation",
    description: "Send messages, audio, and media directly to WhatsApp with our powerful automation system.",
    features: ["Text & Voice messages", "Media support", "Bulk messaging"],
    badge: "New",
    color: "yellow",
    href: "/playground/whatsapp"
  },
  {
    icon: Phone,
    title: "Voice Calls",
    description: "Test AI-powered phone calls with natural conversation capabilities and voice recognition.",
    features: ["Natural speech", "Real-time responses", "Call recording"],
    badge: "Beta",
    color: "orange",
    href: "/playground/calls"
  },
  {
    icon: Mic,
    title: "Text to Speech",
    description: "Convert text to natural-sounding speech with multiple voice options and languages.",
    features: ["Multiple voices", "Multi-language", "High quality audio"],
    badge: "Pro",
    color: "green",
    href: "/playground/tts"
  }
]

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Leverage cutting-edge AI models for superior performance"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-2 second response times for all AI interactions"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "GDPR/LGPD compliant with enterprise-grade security"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock service with 99.9% uptime guarantee"
  }
]

export function ServicesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
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
            🚀 AI Services
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Powerful AI Tools for{' '}
            <span className="gradient-text">Every Business</span>
          </h2>
          <p className="text-xl text-white/85 max-w-3xl mx-auto">
            From intelligent chatbots to automated communications, our AI-powered services 
            help you streamline operations and enhance customer experiences.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="glass p-6 rounded-2xl h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-white/10 hover:border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      service.color === 'green' ? 'bg-emerald-600' :
                      service.color === 'yellow' ? 'bg-blue-600' :
                      'bg-slate-600'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <service.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      service.color === 'green' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      service.color === 'yellow' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {service.badge}
                  </Badge>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:gradient-text transition-all">
                  {service.title}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-white/80">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={service.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full text-white hover:bg-white/10 group/btn"
                  >
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          className="glass-strong p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose <span className="gradient-text">Workfusion</span>?
            </h3>
            <p className="text-white/85 max-w-2xl mx-auto">
              Built with enterprise-grade technology and designed for businesses of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
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
                  <benefit.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-white/80 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}