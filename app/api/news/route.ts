import { NextRequest, NextResponse } from 'next/server'
import { newsService } from '@/lib/workers/news-service'
import type { NewsFilters } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidar cada hora

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters: NewsFilters = {}

    // Extraer filtros de los parámetros de consulta
    if (searchParams.has('category')) {
      filters.category = searchParams.get('category') || undefined
    }
    if (searchParams.has('source')) {
      filters.source = searchParams.get('source') || undefined
    }
    if (searchParams.has('search')) {
      filters.search = searchParams.get('search') || undefined
    }
    if (searchParams.has('limit')) {
      filters.limit = parseInt(searchParams.get('limit') || '0')
    }
    if (searchParams.has('offset')) {
      filters.offset = parseInt(searchParams.get('offset') || '0')
    }
    if (searchParams.has('sentiment')) {
      const sentiment = searchParams.get('sentiment')
      if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'neutral') {
        filters.sentiment = sentiment
      }
    }
    if (searchParams.has('sortBy')) {
      const sortBy = searchParams.get('sortBy')
      if (sortBy === 'date' || sortBy === 'views' || sortBy === 'engagement') {
        filters.sortBy = sortBy
      }
    }
    if (searchParams.has('sortOrder')) {
      const sortOrder = searchParams.get('sortOrder')
      if (sortOrder === 'asc' || sortOrder === 'desc') {
        filters.sortOrder = sortOrder
      }
    }
    if (searchParams.has('startDate') && searchParams.has('endDate')) {
      const startDate = searchParams.get('startDate')
      const endDate = searchParams.get('endDate')
      if (startDate && endDate) {
        filters.dateRange = {
          start: new Date(startDate),
          end: new Date(endDate)
        }
      }
    }

    const news = await newsService.getNews(filters)
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('❌ Error obteniendo noticias:', error)
    return NextResponse.json(
      { error: 'Error al obtener noticias', details: String(error) },
      { status: 500 }
    )
  }
} 