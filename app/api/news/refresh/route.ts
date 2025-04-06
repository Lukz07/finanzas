import { NextResponse } from 'next/server';
import { rssNewsService } from '@/lib/server/rss-news-service';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

// Permitir tanto POST como GET para facilitar la construcción estática
export async function POST() {
  try {
    const news = await rssNewsService.getNews();
    
    return NextResponse.json(news, {
      headers: {
        // Cambiamos a una política de caché que permita la construcción estática
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error refreshing news:', error);
    return NextResponse.json(
      { error: 'Error refreshing news' },
      { status: 500 }
    );
  }
}

// Añadimos el método GET para facilitar las operaciones durante el build
export async function GET() {
  try {
    console.log('Obteniendo noticias a través de GET /api/news/refresh');
    const news = await rssNewsService.getNews();
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error obteniendo noticias vía GET:', error);
    return NextResponse.json(
      { error: 'Error obteniendo noticias', details: String(error) },
      { status: 500 }
    );
  }
} 