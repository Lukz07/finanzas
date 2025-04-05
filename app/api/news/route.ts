import { NextRequest, NextResponse } from 'next/server'
import { rssNewsService } from '@/lib/server/rss-news-service'
import type { NewsFilters } from '@/lib/types/blog'

export async function GET(request: NextRequest) {
  try {
    // Obtener los parámetros de la URL
    const searchParams = request.nextUrl.searchParams
    
    // Verificar si hay algún filtro en la solicitud
    const hasFilters = Array.from(searchParams.keys()).length > 0;
    
    // Si no hay filtros, devolver directamente las últimas 10 noticias de la media hora
    if (!hasFilters) {
      const news = await rssNewsService.getNews();
      return NextResponse.json(news);
    }
    
    // Si hay filtros, procesarlos como antes
    const filters: NewsFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      source: searchParams.get('source') || undefined,
      sentiment: (searchParams.get('sentiment') as NewsFilters['sentiment']) || undefined,
      sortBy: (searchParams.get('sortBy') as NewsFilters['sortBy']) || undefined,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    }

    // Agregar dateRange si están presentes los parámetros
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      }
    }

    // Obtener las noticias del servicio RSS
    const news = await rssNewsService.getNews()
    
    // Aplicar filtros en el backend (para simplificar, el servicio RSS no implementa filtrado)
    let filteredNews = [...news]
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredNews = filteredNews.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.category) {
      filteredNews = filteredNews.filter(item => 
        item.category.id === filters.category
      )
    }

    if (filters.source) {
      filteredNews = filteredNews.filter(item => 
        item.source.id === filters.source
      )
    }

    if (filters.sentiment) {
      filteredNews = filteredNews.filter(item => 
        item.sentiment === filters.sentiment
      )
    }

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
            const getEngagement = (item: any) =>
              (item.metrics?.engagement.likes || 0) +
              (item.metrics?.engagement.comments || 0) +
              (item.metrics?.engagement.saves || 0)
            return order * (getEngagement(a) - getEngagement(b))
          default:
            return 0
        }
      })
    }
    
    return NextResponse.json(filteredNews)
  } catch (error: any) {
    console.error('Error en el endpoint de noticias:', error)
    return NextResponse.json(
      { error: 'Error al obtener las noticias', details: error.message },
      { status: 500 }
    )
  }
} 