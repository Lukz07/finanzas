import { NextResponse } from 'next/server';
import { newsService } from '@/lib/workers/news-service';
import { track } from '@vercel/analytics/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cachear

export async function POST() {
  try {
    console.log('🔄 Forzando actualización de noticias...');
    const news = await newsService.getNews();
    
    await track('news_refresh_api_POST_cache_updated', {
      news_count: news.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('❌ Error forzando actualización:', error);
    await track('news_refresh_api_POST_error', {
      error: String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Error al forzar actualización', details: String(error) },
      { status: 500 }
    );
  }
}

// Endpoint para actualización normal con caché
export async function GET() {
  try {
    console.log('🔄 Obteniendo noticias...');
    const news = await newsService.getNews();
    
  await track('news_get_api_GET_cache_updated', {
      news_count: news.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('❌ Error obteniendo noticias:', error);
    await track('news_get_api_GET_error', {
      error: String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Error al obtener noticias', details: String(error) },
      { status: 500 }
    );
  }
} 