import type { NewsItem, NewsFilters } from '@/lib/types/blog'

export class FrontendNewsService {
  private static instance: FrontendNewsService
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

  private constructor() {}

  public static getInstance(): FrontendNewsService {
    if (!FrontendNewsService.instance) {
      FrontendNewsService.instance = new FrontendNewsService()
    }
    return FrontendNewsService.instance
  }

  async getNews(filters?: NewsFilters): Promise<NewsItem[]> {
    try {
      const url = new URL('/api/news', this.API_BASE_URL)
      
      // Agregar filtros como parámetros de consulta
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Revalidar cada minuto
      })

      if (!response.ok) {
        throw new Error(`Error al obtener noticias: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error al obtener noticias:', error)
      return []
    }
  }

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    try {
      const url = new URL(`/api/news/${slug}`, this.API_BASE_URL)
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Error al obtener noticia por slug: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error al obtener noticia por slug:', error)
      return null
    }
  }
} 