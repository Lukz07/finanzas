import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/config/urls';
import { getSafeNews } from '@/lib/services/news-service';

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