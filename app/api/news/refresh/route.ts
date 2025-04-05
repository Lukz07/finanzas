import { NextResponse } from 'next/server';
import { rssNewsService } from '@/lib/server/rss-news-service';

export const revalidate = 3600; // Revalidar cada hora

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