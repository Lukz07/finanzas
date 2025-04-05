import type { LucideIcon } from 'lucide-react';

export type NewsItem = {
  id: string
  title: string
  description: string
  content: string
  category: NewsCategory
  source: NewsSource
  publishedAt: string
  readTime: number
  sentiment: 'positive' | 'negative' | 'neutral'
  imageUrl?: string
  url: string
  metrics: {
    views: number
    engagement: {
      likes: number
      comments: number
      saves: number
    }
  }
  tags: string[]
}

export interface NewsCategory {
  id: string
  name: string
  icon?: LucideIcon
  description?: string
  slug?: string
}

export interface NewsSource {
  id: string
  name: string
  icon?: string
  url: string
  reliability?: number
  description?: string
  type?: 'rss' | 'api' | 'scraper'
  priority?: number
  category?: string
  language?: string
  country?: string
  updateFrequency?: number
  credentials?: {
    apiKey?: string
    [key: string]: any
  }
}

export interface NewsFilters {
  search?: string
  category?: string
  source?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  author?: string
  language?: string
  country?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'views' | 'engagement'
  sortOrder?: 'asc' | 'desc'
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscribedAt: Date
  preferences: {
    categories: string[]
    frequency: 'daily' | 'weekly' | 'monthly'
    format: 'html' | 'text'
  }
  status: 'active' | 'unsubscribed' | 'bounced'
  lastEmailSent?: Date
}

export interface ContentMetrics {
  id: string
  newsId: string
  views: number
  uniqueVisitors: number
  averageTimeOnPage: number
  bounceRate: number
  shares: {
    total: number
    byPlatform: {
      twitter: number
      facebook: number
      linkedin: number
      whatsapp: number
    }
  }
  engagement: {
    likes: number
    comments: number
    saves: number
  }
  seoMetrics: {
    position: number
    clicks: number
    impressions: number
    ctr: number
  }
} 