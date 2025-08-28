'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Target, Award, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize our customers' success and satisfaction in everything we do."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously pushing boundaries to deliver cutting-edge AI solutions."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Committed to delivering the highest quality in our products and services."
    },
    {
      icon: Award,
      title: "Integrity",
      description: "Building trust through transparency, honesty, and ethical practices."
    }
  ]

  const team = [
    {
      name: "Alex Thompson",
      role: "CEO & Founder",
      image: "/team/alex.jpg",
      bio: "15+ years in AI and automation"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image: "/team/sarah.jpg",
      bio: "Former Google AI researcher"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Product",
      image: "/team/marcus.jpg",
      bio: "10+ years in product innovation"
    },
    {
      name: "Emily Watson",
      role: "Head of Customer Success",
      image: "/team/emily.jpg",
      bio: "Expert in customer experience"
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
                About WorkFusion
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transforming Businesses with{' '}
                <span className="gradient-text">AI Innovation</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                We're on a mission to democratize AI technology, making it accessible and 
                powerful for businesses of all sizes. Our platform combines cutting-edge AI 
                with intuitive design to deliver transformative solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                className="glass-strong p-8 rounded-2xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-white/80 leading-relaxed">
                  To empower businesses worldwide with accessible, powerful AI tools that 
                  automate complex tasks, enhance customer interactions, and drive growth. 
                  We believe in making AI technology simple, affordable, and effective for everyone.
                </p>
              </motion.div>

              <motion.div
                className="glass-strong p-8 rounded-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-white/80 leading-relaxed">
                  To be the global leader in AI-powered business automation, creating a future 
                  where every business, regardless of size, can leverage AI to achieve 
                  extraordinary results and compete on a global scale.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
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
                Our Core <span className="gradient-text">Values</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="glass p-6 rounded-xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
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
                Meet Our <span className="gradient-text">Team</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Passionate experts dedicated to your success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="glass p-6 rounded-xl text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-primary-green text-sm mb-2">{member.role}</p>
                  <p className="text-white/60 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already using WorkFusion to automate their workflows
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="btn-primary">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="glass text-white border-white/20 hover:bg-white/10">
                    Contact Sales
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