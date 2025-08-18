'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, Calendar, Clock, User, ArrowRight, 
  TrendingUp, BookOpen
} from 'lucide-react'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'All', 'AI Technology', 'Business Automation', 'Case Studies', 
    'Tutorials', 'Industry News', 'Product Updates'
  ]

  const featuredPost = {
    id: 1,
    title: "How AI is Revolutionizing Customer Service in 2024",
    excerpt: "Discover how businesses are leveraging AI chatbots and automation to provide 24/7 customer support while reducing costs by up to 70%.",
    author: "Sarah Chen",
    date: "January 15, 2024",
    readTime: "8 min read",
    category: "AI Technology",
    image: "/blog/featured.jpg",
    featured: true
  }

  const blogPosts = [
    {
      id: 2,
      title: "10 Ways to Automate Your WhatsApp Business Communication",
      excerpt: "Learn practical strategies to streamline your WhatsApp messaging and improve customer engagement.",
      author: "Marcus Rodriguez",
      date: "January 12, 2024",
      readTime: "5 min read",
      category: "Tutorials",
      trending: true
    },
    {
      id: 3,
      title: "Case Study: How TechCorp Increased Sales by 300% with AI",
      excerpt: "A deep dive into how one company transformed their sales process using our AI tools.",
      author: "Alex Thompson",
      date: "January 10, 2024",
      readTime: "10 min read",
      category: "Case Studies"
    },
    {
      id: 4,
      title: "The Future of Voice AI: What to Expect in 2024",
      excerpt: "Exploring the latest developments in voice technology and natural language processing.",
      author: "Emily Watson",
      date: "January 8, 2024",
      readTime: "6 min read",
      category: "AI Technology"
    },
    {
      id: 5,
      title: "Getting Started with WorkFusion: A Complete Guide",
      excerpt: "Everything you need to know to start automating your business with our platform.",
      author: "David Kim",
      date: "January 5, 2024",
      readTime: "12 min read",
      category: "Tutorials"
    },
    {
      id: 6,
      title: "5 Common Automation Mistakes and How to Avoid Them",
      excerpt: "Learn from others' experiences and set up your automation strategy for success.",
      author: "Lisa Martinez",
      date: "January 3, 2024",
      readTime: "7 min read",
      category: "Business Automation"
    },
    {
      id: 7,
      title: "New Feature: Multi-Language Support for AI Chatbots",
      excerpt: "Announcing our latest update that enables chatbots to communicate in 50+ languages.",
      author: "Product Team",
      date: "December 28, 2023",
      readTime: "3 min read",
      category: "Product Updates"
    },
    {
      id: 8,
      title: "AI Ethics: Building Responsible Automation Systems",
      excerpt: "Our commitment to ethical AI development and what it means for your business.",
      author: "Jordan Lee",
      date: "December 25, 2023",
      readTime: "9 min read",
      category: "AI Technology"
    },
    {
      id: 9,
      title: "ROI of AI: Measuring the Impact of Automation",
      excerpt: "A data-driven approach to understanding and maximizing your automation investment.",
      author: "Michael Chen",
      date: "December 20, 2023",
      readTime: "11 min read",
      category: "Business Automation"
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                            post.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          <div className="container mx-auto relative z-10">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-primary-green/20 text-primary-green border-primary-green/30">
                <BookOpen className="mr-1 h-3 w-3" />
                Blog & Resources
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Insights on <span className="gradient-text">AI & Automation</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Stay updated with the latest trends, tutorials, and success stories from the world of AI
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="input-glass pl-12 pr-4 py-3 text-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.toLowerCase()
                      ? 'bg-primary-green text-white'
                      : 'glass text-white/80 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="container mx-auto">
            <motion.div
              className="glass-strong rounded-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-3 mb-4">
                    <Badge className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30">
                      Featured
                    </Badge>
                    <Badge className="bg-white/10 text-white/80 border-white/20">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-white/80 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-white/60 text-sm mb-6">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  
                  <div>
                    <Button className="btn-primary">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gradient-primary rounded-xl h-64 md:h-auto flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-white/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="glass rounded-xl p-6 hover:border-white/20 transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                      {post.category}
                    </Badge>
                    {post.trending && (
                      <TrendingUp className="h-4 w-4 text-primary-green" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-green transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <div className="flex items-center space-x-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">No articles found matching your criteria.</p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="glass text-white border-white/20 hover:bg-white/10"
                >
                  Load More Articles
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              className="gradient-border p-12 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Get the latest AI insights and tutorials delivered to your inbox
              </p>
              
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="input-glass flex-1"
                />
                <Button className="btn-primary">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-white/60 text-sm mt-4">
                Join 10,000+ subscribers. No spam, unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}