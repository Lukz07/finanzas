import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import type { NewsItem } from '@/lib/types/blog';
import { newsService } from '@/lib/workers/news-service';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

// Función auxiliar para obtener noticias de forma segura durante el build
async function getSafeNews(): Promise<NewsItem[]> {
  try {
    console.log('📊 Obteniendo noticias para sitemap...');
    const news = await newsService.getNews();
    console.log(`📊 Obtenidas ${news.length} noticias para sitemap`);
    return news;
  } catch (error) {
    console.log('❌ Error al obtener noticias RSS para el sitemap:', error);
    console.log('⚠️ Usando noticias de ejemplo para el sitemap en build');
    
    try {
      const rawNewsPath = path.join(process.cwd(), 'data', 'raw-news.json');
      if (fs.existsSync(rawNewsPath)) {
        const rawNews = JSON.parse(fs.readFileSync(rawNewsPath, 'utf8')) as NewsItem[];
        return rawNews;
      }
    } catch (fileError) {
      console.log('❌ No se pudo leer raw-news.json:', fileError);
    }
    
    return [
      {
        id: 'example-news-1',
        title: 'Ejemplo de noticia 1',
        publishedAt: new Date().toISOString(),
        description: '',
        content: '',
        category: { id: '', name: '' },
        source: { id: '', name: '', url: '' },
        readTime: 0,
        sentiment: 'neutral',
        metrics: { views: 0, engagement: { likes: 0, comments: 0, saves: 0 } },
        tags: [],
        url: 'https://example.com/news-1',
        internalUrl: 'example-news-1',
        slug: 'ejemplo-de-noticia-1'
      }
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('🗺️ Generando sitemap usando sitemap.ts');
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.VERCEL_URL ? 
    `https://${process.env.NEXT_PUBLIC_SITE_URL}` : 
    `https://${process.env.VERCEL_URL}`;
  
  const formattedBaseUrl = baseUrl.replace(/\/$/, '');

  // Solo la página principal
  const homeRoute = {
    url: formattedBaseUrl,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1.0,
  };

  try {
    // Obtener noticias de forma segura para generar rutas dinámicas
    const news = await getSafeNews();
    
    // Generar rutas para cada noticia
    const newsRoutes = news.map((item) => ({
      url: `${formattedBaseUrl}/blog/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    console.log(`🗺️ Sitemap generado con ${1 + newsRoutes.length} URLs`);
    return [homeRoute, ...newsRoutes];
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    return [homeRoute];
  }
} 