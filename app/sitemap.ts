import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import type { NewsItem } from '@/lib/types/blog';
import { rssNewsService } from '@/lib/server/rss-news-service';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

// Función auxiliar para obtener noticias de forma segura durante el build
async function getSafeNews(): Promise<NewsItem[]> {
  try {
    // Usar directamente rssNewsService
    console.log('📊 Obteniendo noticias para sitemap...');
    const news = await rssNewsService.getNews();
    console.log(`📊 Obtenidas ${news.length} noticias para sitemap`);
    return news;
  } catch (error) {
    console.log('❌ Error al obtener noticias RSS para el sitemap:', error);
    console.log('⚠️ Usando noticias de ejemplo para el sitemap en build');
    
    // Durante el build, intentar leer el archivo de noticias prealmacenadas
    try {
      const rawNewsPath = path.join(process.cwd(), 'data', 'raw-news.json');
      if (fs.existsSync(rawNewsPath)) {
        const rawNews = JSON.parse(fs.readFileSync(rawNewsPath, 'utf8')) as NewsItem[];
        return rawNews;
      }
    } catch (fileError) {
      console.log('❌ No se pudo leer raw-news.json:', fileError);
    }
    
    // Caer en respaldo a noticias de ejemplo si todo lo demás falla
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
        internalUrl: 'example-news-1'
      },
      {
        id: 'example-news-2',
        title: 'Ejemplo de noticia 2',
        publishedAt: new Date().toISOString(),
        description: '',
        content: '',
        category: { id: '', name: '' },
        source: { id: '', name: '', url: '' },
        readTime: 0,
        sentiment: 'neutral',
        metrics: { views: 0, engagement: { likes: 0, comments: 0, saves: 0 } },
        tags: [],
        url: 'https://example.com/news-2',
        internalUrl: 'example-news-2'
      }
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('🗺️ Generando sitemap usando sitemap.ts');
  
  // Usar directamente la URL base desde las variables de entorno
  // Esto funciona tanto en tiempo de ejecución como durante el build
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';
  console.log('🔗 URL base para sitemap:', baseUrl);
  
  // Asegurar que la URL base tiene el protocolo
  const formattedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  console.log('🔗 URL base formateada:', formattedBaseUrl);
  
  // Rutas estáticas
  const staticRoutes = [
    {
      url: formattedBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${formattedBaseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
  ];

  try {
    // Obtener noticias de forma segura para generar rutas dinámicas
    const news = await getSafeNews();
    
    // Generar rutas para cada noticia
    const newsRoutes = news.map((article: NewsItem) => ({
      url: `${formattedBaseUrl}/blog/${article.internalUrl || article.id}`,
      lastModified: new Date(article.publishedAt || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Rutas de categorías
    const categoryRoutes = [
      'markets',
      'economy',
      'crypto',
      'technology',
      'companies',
    ].map((category) => ({
      url: `${formattedBaseUrl}/blog/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    console.log(`🗺️ Sitemap generado con ${staticRoutes.length + newsRoutes.length + categoryRoutes.length} URLs`);
    return [...staticRoutes, ...newsRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    // En caso de error, devolver solo las rutas estáticas
    return staticRoutes;
  }
} 