"use client"

import type { NewsItem, NewsFilters } from '../types/blog'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export class NewsService {
  private static instance: NewsService
  private lastFetchTime: Date | null = null
  private lastErrorTime: Date | null = null
  private cachedNews: NewsItem[] = []
  private readonly ERROR_RETRY_DELAY = 5 * 60 * 1000 // 5 minutos en milisegundos
  private readonly CACHE_DURATION = 15 * 60 * 1000 // 15 minutos en milisegundos
  private readonly STALE_WHILE_REVALIDATE_DURATION = 30 * 60 * 1000 // 30 minutos en milisegundos
  private isRefreshing = false

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  async getNews(filters: NewsFilters = {}): Promise<NewsItem[]> {
    // Implementar stale-while-revalidate
    const shouldRefresh = this.shouldRefreshCache()
    const isStale = this.isStaleCache()

    // Si hay noticias en caché y no están obsoletas, retornarlas
    if (this.cachedNews.length > 0 && !isStale) {
      return this.applyFilters(this.cachedNews, filters)
    }

    // Si necesitamos actualizar pero tenemos caché, iniciar actualización en background
    if (shouldRefresh && this.cachedNews.length > 0) {
      this.refreshCache().catch(console.error)
      return this.applyFilters(this.cachedNews, filters)
    }

    // Si no hay caché o está obsoleta, esperar la actualización
    await this.refreshCache()
    return this.applyFilters(this.cachedNews, filters)
  }

  private shouldRefreshCache(): boolean {
    if (!this.lastFetchTime) return true
    const now = new Date()
    return now.getTime() - this.lastFetchTime.getTime() > this.CACHE_DURATION
  }

  private isStaleCache(): boolean {
    if (!this.lastFetchTime) return true
    const now = new Date()
    return now.getTime() - this.lastFetchTime.getTime() > this.STALE_WHILE_REVALIDATE_DURATION
  }

  private async refreshCache(): Promise<void> {
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    try {
      // Verificar si estamos en el navegador
      if (typeof window === 'undefined') {
        console.log('Saltando actualización de caché en el servidor');
        return;
      }
      
      // Usar URL absoluta en lugar de relativa
      const url = new URL('/api/news/refresh', window.location.origin);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Error refreshing news: ${response.status}`);
      }

      const freshNews = await response.json();
      this.cachedNews = freshNews;
      this.lastFetchTime = new Date();
      this.lastErrorTime = null;
    } catch (error) {
      console.error('Error refreshing news cache:', error);
      this.lastErrorTime = new Date();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private applyFilters(news: NewsItem[], filters: NewsFilters): NewsItem[] {
    let filteredNews = [...news]

    // Filtrar por término de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm)
      )
    }

    // Filtrar por categoría
    if (filters.category) {
      filteredNews = filteredNews.filter(item => 
        item.category.id === filters.category
      )
    }

    // Filtrar por fuente
    if (filters.source) {
      filteredNews = filteredNews.filter(item => 
        item.source.id === filters.source
      )
    }

    // Filtrar por rango de fechas
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      filteredNews = filteredNews.filter(item => {
        const date = new Date(item.publishedAt)
        return date >= start && date <= end
      })
    }

    // Ordenar resultados
    if (filters.sortBy) {
      filteredNews.sort((a, b) => {
        const order = filters.sortOrder === 'asc' ? 1 : -1
        
        switch (filters.sortBy) {
          case 'date':
            return order * (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
          case 'views':
            return order * ((a.metrics?.views || 0) - (b.metrics?.views || 0))
          case 'engagement':
            const getEngagement = (item: NewsItem) =>
              (item.metrics?.engagement.likes || 0) +
              (item.metrics?.engagement.comments || 0) +
              (item.metrics?.engagement.saves || 0)
            return order * (getEngagement(a) - getEngagement(b))
          default:
            return 0
        }
      })
    }

    return filteredNews
  }
} 