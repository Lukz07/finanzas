import { NextResponse } from 'next/server';
import { rssNewsService } from '@/lib/server/rss-news-service';

export async function POST() {
  try {
    const news = await rssNewsService.getNews();
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store',
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