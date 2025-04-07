import { NextRequest, NextResponse } from 'next/server'
import { newsService } from '@/lib/server/news-service'
import type { NewsItem } from '@/lib/types/blog'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const news = await newsService.getNews()
    const newsItem = news.find((item: NewsItem) => item.slug === params.slug)
    
    if (!newsItem) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(newsItem)
  } catch (error) {
    console.error('Error en el endpoint de noticia:', error)
    return NextResponse.json(
      { error: 'Error al obtener la noticia' },
      { status: 500 }
    )
  }
} 