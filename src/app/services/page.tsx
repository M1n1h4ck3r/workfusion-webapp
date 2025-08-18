'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const serviceDetails = [
    {
      title: "AI Chatbots",
      description: "Advanced conversational AI powered by GPT-4 and custom models",
      features: [
        "24/7 customer support automation",
        "Multi-language support",
        "Custom personality training",
        "Integration with existing systems",
        "Analytics and insights"
      ],
      benefits: [
        "Reduce support costs by 70%",
        "Instant response times",
        "Scalable to any volume",
        "Consistent service quality"
      ]
    },
    {
      title: "WhatsApp Automation",
      description: "Complete WhatsApp Business API integration and automation",
      features: [
        "Bulk messaging campaigns",
        "Automated responses",
        "Media sharing capabilities",
        "Contact management",
        "Campaign analytics"
      ],
      benefits: [
        "Reach customers directly",
        "98% open rate",
        "Automated follow-ups",
        "Personalized messaging"
      ]
    },
    {
      title: "Voice AI Solutions",
      description: "Natural text-to-speech and voice call automation",
      features: [
        "Multiple voice options",
        "Natural language processing",
        "Call routing automation",
        "Voice analytics",
        "Real-time transcription"
      ],
      benefits: [
        "Human-like conversations",
        "24/7 availability",
        "Cost-effective calling",
        "Multilingual support"
      ]
    },
    {
      title: "Content Generation",
      description: "AI-powered content creation for blogs, social media, and marketing",
      features: [
        "SEO-optimized content",
        "Multiple content formats",
        "Brand voice customization",
        "Automated publishing",
        "Content calendar management"
      ],
      benefits: [
        "10x faster content creation",
        "Consistent brand voice",
        "SEO improvement",
        "Increased engagement"
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          <div className="container mx-auto relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-primary-green/20 text-primary-green border-primary-green/30">
                Our Services
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Solutions That{' '}
                <span className="gradient-text">Drive Results</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Comprehensive AI services designed to automate, optimize, and scale your business operations
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/playground">
                  <Button size="lg" className="btn-primary">
                    Try Our AI Tools
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Services Section */}
        <ServicesSection />

        {/* Detailed Service Information */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Service <span className="gradient-text">Details</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Everything you need to know about our AI solutions
              </p>
            </motion.div>

            <div className="space-y-12">
              {serviceDetails.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="glass-strong p-8 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                      <p className="text-white/80 mb-6">{service.description}</p>
                      
                      <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-white/70">
                            <CheckCircle className="h-5 w-5 text-primary-green mr-2 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="glass p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                        <ul className="space-y-3">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-white/80">
                              <div className="w-2 h-2 bg-primary-green rounded-full mr-3" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              className="glass-strong p-12 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Seamless <span className="gradient-text">Integrations</span>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Our services integrate with your existing tools and workflows
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {['Slack', 'WhatsApp', 'Telegram', 'Discord', 'Shopify', 'WordPress', 'Zapier', 'Google'].map((tool, index) => (
                  <motion.div
                    key={tool}
                    className="glass p-4 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-white/80 font-medium">{tool}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/contact">
                <Button size="lg" className="btn-primary">
                  Discuss Integration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              className="gradient-border p-12 rounded-2xl text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Start with 500 free tokens and experience the power of AI automation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="btn-primary">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}