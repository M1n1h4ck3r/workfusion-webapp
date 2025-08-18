import { getAIService } from './ai-service'

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  publishDate?: Date
  lastModified: Date
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  imageUrl?: string
  readTime: number // in minutes
  views?: number
  likes?: number
  aiGenerated: boolean
}

export interface BlogTopic {
  id: string
  topic: string
  keywords: string[]
  targetAudience: string
  tone: 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative'
  length: 'short' | 'medium' | 'long' // 300-500, 800-1200, 1500-2000 words
  includeImages: boolean
  includeSEO: boolean
}

export interface ContentCalendar {
  id: string
  month: number
  year: number
  posts: Array<{
    date: Date
    topic: string
    status: 'planned' | 'in-progress' | 'completed'
    postId?: string
  }>
}

export interface BlogAnalytics {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  scheduledPosts: number
  totalViews: number
  totalLikes: number
  averageReadTime: number
  topCategories: Array<{ category: string; count: number }>
  topTags: Array<{ tag: string; count: number }>
  postsThisMonth: number
  engagementRate: number
}

class BlogAutomationService {
  private posts: Map<string, BlogPost> = new Map()
  private topics: Map<string, BlogTopic> = new Map()
  private calendar: Map<string, ContentCalendar> = new Map()
  private aiService = getAIService()
  private isGenerating: boolean = false

  constructor() {
    this.loadSamplePosts()
    this.loadSampleTopics()
  }

  private loadSamplePosts() {
    const samplePosts: BlogPost[] = [
      {
        id: 'post-1',
        title: '10 Ways AI is Revolutionizing Customer Service',
        content: 'Artificial Intelligence is transforming how businesses interact with customers...',
        excerpt: 'Discover how AI chatbots, voice assistants, and predictive analytics are reshaping customer service.',
        category: 'AI & Technology',
        tags: ['AI', 'Customer Service', 'Automation', 'Chatbots'],
        author: 'AI Assistant',
        status: 'published',
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastModified: new Date(),
        readTime: 5,
        views: 234,
        likes: 45,
        aiGenerated: true
      },
      {
        id: 'post-2',
        title: 'The Future of WhatsApp Business Automation',
        content: 'WhatsApp Business API opens new possibilities for automated customer engagement...',
        excerpt: 'Learn how to leverage WhatsApp Business API for automated messaging and customer support.',
        category: 'Marketing',
        tags: ['WhatsApp', 'Automation', 'Marketing', 'Business'],
        author: 'Marketing Team',
        status: 'published',
        publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastModified: new Date(),
        readTime: 7,
        views: 189,
        likes: 32,
        aiGenerated: false
      }
    ]

    samplePosts.forEach(post => this.posts.set(post.id, post))
  }

  private loadSampleTopics() {
    const sampleTopics: BlogTopic[] = [
      {
        id: 'topic-1',
        topic: 'AI in Business',
        keywords: ['artificial intelligence', 'machine learning', 'automation', 'efficiency'],
        targetAudience: 'Business owners and decision makers',
        tone: 'professional',
        length: 'medium',
        includeImages: true,
        includeSEO: true
      },
      {
        id: 'topic-2',
        topic: 'Digital Marketing Trends',
        keywords: ['marketing', 'social media', 'SEO', 'content marketing'],
        targetAudience: 'Marketing professionals',
        tone: 'friendly',
        length: 'long',
        includeImages: true,
        includeSEO: true
      }
    ]

    sampleTopics.forEach(topic => this.topics.set(topic.id, topic))
  }

  async generateBlogPost(topic: BlogTopic): Promise<BlogPost> {
    if (this.isGenerating) {
      throw new Error('Another post is already being generated')
    }

    this.isGenerating = true

    try {
      // Generate title
      const titlePrompt = `Create a compelling blog post title about "${topic.topic}" targeting ${topic.targetAudience}. Keywords: ${topic.keywords.join(', ')}`
      const title = await this.generateContent(titlePrompt, 50)

      // Generate content based on length
      const wordCount = topic.length === 'short' ? 400 : topic.length === 'medium' ? 1000 : 1750
      const contentPrompt = `Write a ${topic.tone} blog post about "${topic.topic}" for ${topic.targetAudience}. 
        Include these keywords naturally: ${topic.keywords.join(', ')}. 
        Target word count: ${wordCount} words.
        Structure: Introduction, 3-4 main points with subheadings, conclusion with call to action.`
      
      const content = await this.generateContent(contentPrompt, wordCount * 2)

      // Generate excerpt
      const excerptPrompt = `Create a 2-sentence excerpt for a blog post titled "${title}"`
      const excerpt = await this.generateContent(excerptPrompt, 100)

      // Generate SEO metadata if requested
      let seoTitle = title
      let seoDescription = excerpt
      let seoKeywords = topic.keywords

      if (topic.includeSEO) {
        const seoPrompt = `Create SEO metadata for a blog post about "${topic.topic}". Include: title (60 chars), description (160 chars), and 5-7 keywords.`
        const seoData = await this.generateContent(seoPrompt, 200)
        // Parse SEO data (in production, this would be more sophisticated)
        seoTitle = title.substring(0, 60)
        seoDescription = excerpt.substring(0, 160)
        seoKeywords = [...topic.keywords, 'blog', 'article', 'guide']
      }

      const post: BlogPost = {
        id: 'post-' + Date.now(),
        title,
        content,
        excerpt,
        category: this.determineCategory(topic.topic),
        tags: topic.keywords,
        author: 'AI Assistant',
        status: 'draft',
        lastModified: new Date(),
        seoTitle,
        seoDescription,
        seoKeywords,
        readTime: Math.ceil(wordCount / 200), // Average reading speed
        aiGenerated: true
      }

      this.posts.set(post.id, post)
      return post

    } finally {
      this.isGenerating = false
    }
  }

  private async generateContent(prompt: string, maxTokens: number = 500): Promise<string> {
    try {
      const response = await this.aiService.sendMessage(
        [{ role: 'user', content: prompt }]
      )
      return response
    } catch (error) {
      // Fallback to demo content if AI service fails
      return this.generateDemoContent(prompt, maxTokens)
    }
  }

  private generateDemoContent(prompt: string, maxTokens: number): string {
    // Generate demo content based on prompt
    if (prompt.includes('title')) {
      const titles = [
        'Revolutionizing Business with AI: A Complete Guide',
        'The Future of Digital Transformation in 2024',
        'Mastering Marketing Automation: Tips and Strategies',
        'How AI is Changing Customer Experience Forever',
        'Building Scalable Business Solutions with Technology'
      ]
      return titles[Math.floor(Math.random() * titles.length)]
    }

    if (prompt.includes('excerpt')) {
      return 'Discover the latest trends and strategies in digital transformation. Learn how leading companies are leveraging technology to drive growth and innovation.'
    }

    // Generate lorem ipsum style content for body
    const sentences = [
      'Artificial intelligence is revolutionizing the way businesses operate.',
      'Digital transformation has become essential for modern enterprises.',
      'Automation technologies are streamlining workflows and improving efficiency.',
      'Data-driven insights are enabling better decision-making across industries.',
      'Customer experience is at the forefront of business strategy.',
      'Cloud computing provides scalability and flexibility for growing businesses.',
      'Machine learning algorithms are uncovering patterns in complex data.',
      'The integration of AI and human expertise creates powerful synergies.'
    ]

    const paragraphs = []
    const numParagraphs = Math.ceil(maxTokens / 100)
    
    for (let i = 0; i < numParagraphs; i++) {
      const paragraphSentences = []
      for (let j = 0; j < 4; j++) {
        paragraphSentences.push(sentences[Math.floor(Math.random() * sentences.length)])
      }
      paragraphs.push(paragraphSentences.join(' '))
    }

    return paragraphs.join('\n\n')
  }

  private determineCategory(topic: string): string {
    const topicLower = topic.toLowerCase()
    if (topicLower.includes('ai') || topicLower.includes('technology')) {
      return 'AI & Technology'
    } else if (topicLower.includes('marketing') || topicLower.includes('social')) {
      return 'Marketing'
    } else if (topicLower.includes('business') || topicLower.includes('strategy')) {
      return 'Business Strategy'
    } else if (topicLower.includes('customer') || topicLower.includes('service')) {
      return 'Customer Service'
    } else {
      return 'General'
    }
  }

  async scheduleBlogPost(postId: string, publishDate: Date): Promise<void> {
    const post = this.posts.get(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    post.status = 'scheduled'
    post.publishDate = publishDate
    post.lastModified = new Date()

    // Add to content calendar
    const month = publishDate.getMonth() + 1
    const year = publishDate.getFullYear()
    const calendarKey = `${year}-${month}`
    
    if (!this.calendar.has(calendarKey)) {
      this.calendar.set(calendarKey, {
        id: calendarKey,
        month,
        year,
        posts: []
      })
    }

    const calendar = this.calendar.get(calendarKey)!
    calendar.posts.push({
      date: publishDate,
      topic: post.title,
      status: 'planned',
      postId
    })
  }

  async publishBlogPost(postId: string): Promise<void> {
    const post = this.posts.get(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    post.status = 'published'
    post.publishDate = new Date()
    post.lastModified = new Date()
  }

  async updateBlogPost(postId: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const post = this.posts.get(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    Object.assign(post, updates)
    post.lastModified = new Date()
    
    return post
  }

  async deleteBlogPost(postId: string): Promise<void> {
    if (!this.posts.delete(postId)) {
      throw new Error('Post not found')
    }
  }

  getBlogPosts(filter?: { 
    status?: BlogPost['status']
    category?: string
    tag?: string 
  }): BlogPost[] {
    let posts = Array.from(this.posts.values())

    if (filter?.status) {
      posts = posts.filter(p => p.status === filter.status)
    }
    if (filter?.category) {
      posts = posts.filter(p => p.category === filter.category)
    }
    if (filter?.tag) {
      posts = posts.filter(p => p.tags.includes(filter.tag))
    }

    return posts.sort((a, b) => 
      (b.publishDate?.getTime() || b.lastModified.getTime()) - 
      (a.publishDate?.getTime() || a.lastModified.getTime())
    )
  }

  getBlogPost(postId: string): BlogPost | null {
    return this.posts.get(postId) || null
  }

  getTopics(): BlogTopic[] {
    return Array.from(this.topics.values())
  }

  addTopic(topic: BlogTopic): void {
    this.topics.set(topic.id, topic)
  }

  getContentCalendar(month: number, year: number): ContentCalendar | null {
    return this.calendar.get(`${year}-${month}`) || null
  }

  getAnalytics(): BlogAnalytics {
    const posts = Array.from(this.posts.values())
    const publishedPosts = posts.filter(p => p.status === 'published')
    
    const categoryCount = new Map<string, number>()
    const tagCount = new Map<string, number>()
    
    posts.forEach(post => {
      categoryCount.set(post.category, (categoryCount.get(post.category) || 0) + 1)
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    })

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const postsThisMonth = posts.filter(p => {
      const postDate = p.publishDate || p.lastModified
      return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear
    }).length

    return {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      totalViews: publishedPosts.reduce((sum, p) => sum + (p.views || 0), 0),
      totalLikes: publishedPosts.reduce((sum, p) => sum + (p.likes || 0), 0),
      averageReadTime: posts.length > 0 
        ? posts.reduce((sum, p) => sum + p.readTime, 0) / posts.length 
        : 0,
      topCategories: Array.from(categoryCount.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topTags: Array.from(tagCount.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      postsThisMonth,
      engagementRate: publishedPosts.length > 0 
        ? ((publishedPosts.reduce((sum, p) => sum + (p.likes || 0), 0) / 
           publishedPosts.reduce((sum, p) => sum + (p.views || 1), 0)) * 100)
        : 0
    }
  }

  async generateContentIdeas(topic: string, count: number = 5): Promise<string[]> {
    const prompt = `Generate ${count} blog post ideas about "${topic}". Return as a numbered list.`
    const response = await this.generateContent(prompt, 200)
    
    // Parse response into array (in production, this would be more sophisticated)
    const ideas = response.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .slice(0, count)

    return ideas.length > 0 ? ideas : [
      `The Complete Guide to ${topic}`,
      `10 Ways ${topic} Can Transform Your Business`,
      `${topic}: Best Practices and Common Mistakes`,
      `How to Get Started with ${topic}`,
      `The Future of ${topic}: Trends and Predictions`
    ]
  }
}

export const blogAutomationService = new BlogAutomationService()