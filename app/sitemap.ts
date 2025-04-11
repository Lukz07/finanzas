import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/config/urls';
import { ServerNewsService } from '@/lib/services/server-news-service';
import type { NewsItem } from '@/lib/types/blog';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('🗺️ Generando sitemap usando sitemap.ts');
  
  const baseUrl = getBaseUrl();
  const formattedBaseUrl = baseUrl.replace(/\/$/, '');

  // Solo la página principal
  const homeRoute = {
    url: formattedBaseUrl,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 1.0,
  };

  try {
    // Obtener noticias del servicio del servidor
    const newsService = ServerNewsService.getInstance();
    const news = await newsService.getNews();
    
    // Generar rutas para cada noticia
    const newsRoutes = news.map((item: NewsItem) => ({
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