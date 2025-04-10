import { NextResponse } from 'next/server';
import { newsService } from '@/lib/workers/news-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // No cachear

export async function POST() {
  try {
    console.log('🔄 Forzando actualización de noticias...');
    const news = await newsService.getNews();
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('❌ Error forzando actualización:', error);
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
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('❌ Error obteniendo noticias:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias', details: String(error) },
      { status: 500 }
    );
  }
} 