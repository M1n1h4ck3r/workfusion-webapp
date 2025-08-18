'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "Workfusion's AI tools transformed our customer service completely. We saw a 300% increase in response efficiency and our customers love the instant, intelligent responses.",
    rating: 5,
    metrics: {
      improvement: "300%",
      metric: "Response Efficiency"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Marketing Director",
    company: "Digital Solutions Co.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "The WhatsApp automation feature is incredible. We can now reach thousands of customers instantly while maintaining personalization. Our conversion rate doubled in just 2 months.",
    rating: 5,
    metrics: {
      improvement: "200%",
      metric: "Conversion Rate"
    }
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Operations Manager",
    company: "Global Retail Corp",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "The AI chatbots are amazing! They handle complex customer queries 24/7, and the expert knowledge base helps our team make better decisions. ROI was positive within weeks.",
    rating: 5,
    metrics: {
      improvement: "24/7",
      metric: "Availability"
    }
  },
  {
    id: 4,
    name: "David Park",
    role: "CTO",
    company: "Innovation Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "The text-to-speech quality is outstanding. We use it for training materials and customer communications. The voice options are natural and our engagement metrics improved significantly.",
    rating: 5,
    metrics: {
      improvement: "150%",
      metric: "Engagement"
    }
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Sales Director",
    company: "Enterprise Solutions",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    content: "Workfusion's AI playground gave our sales team superpowers. We can now handle complex client questions instantly and our closing rate has never been higher.",
    rating: 5,
    metrics: {
      improvement: "85%",
      metric: "Closing Rate"
    }
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-green/5 via-primary-yellow/5 to-primary-orange/5" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
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
          <Badge className="mb-4 bg-primary-orange/20 text-primary-orange border-primary-orange/30">
            💬 Customer Stories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their businesses with our AI solutions.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div 
            className="glass-strong p-8 md:p-12 rounded-3xl min-h-[400px] flex flex-col justify-center"
            layout
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Quote Icon */}
                <motion.div
                  className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Quote className="h-8 w-8 text-white" />
                </motion.div>

                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium">
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </blockquote>

                {/* Metrics */}
                <motion.div 
                  className="glass p-4 rounded-xl mb-8 inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold gradient-text">
                    {testimonials[currentIndex].metrics.improvement}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonials[currentIndex].metrics.metric}
                  </div>
                </motion.div>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white/20">
                    <AvatarImage 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name}
                    />
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-white text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-white/60">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-primary-green text-sm font-medium">
                      {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass text-white hover:bg-white/10 z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass text-white hover:bg-white/10 z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-green w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-12 grid grid-cols-5 gap-4 max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                index === currentIndex 
                  ? 'glass-strong scale-105 border-primary-green border' 
                  : 'glass hover:glass-strong'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-white text-xs font-medium truncate">
                {testimonial.name}
              </div>
              <div className="text-white/60 text-xs truncate">
                {testimonial.company}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-sm px-4 py-2 rounded-full transition-all ${
              isAutoPlaying 
                ? 'text-primary-green bg-primary-green/20 border border-primary-green/30' 
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {isAutoPlaying ? 'Auto-play ON' : 'Auto-play OFF'}
          </button>
        </div>
      </div>
    </section>
  )
}