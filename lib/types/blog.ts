import type { LucideIcon } from 'lucide-react';

export interface NewsItem {
  id: string
  title: string
  description: string
  content: string
  url: string
  internalUrl?: string
  imageUrl?: string
  publishedAt: string
  source: NewsSource
  category: NewsCategory
  sentiment: 'positive' | 'negative' | 'neutral'
  readTime: number
  metrics: {
    views: number
    engagement: {
      likes: number
      comments: number
      saves: number
    }
  }
  tags: string[]
  slug: string
}

export interface NewsCategory {
  id: string
  name: string
  slug?: string
  description?: string
  icon?: LucideIcon
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
  feedUrl?: string
  credentials?: {
    apiKey?: string
    [key: string]: string | undefined
  }
}

export interface NewsFilters {
  search?: string
  category?: string
  source?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  sortBy?: 'date' | 'views' | 'engagement'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    start: Date
    end: Date
  }
  limit?: number
  offset?: number
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

export interface Category {
  id: string
  name: string
  icon: LucideIcon
  description: string
  color: string
} 