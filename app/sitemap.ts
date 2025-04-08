import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import type { NewsItem } from '@/lib/types/blog';
import { newsService } from '@/lib/server/news-service';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

// Función auxiliar para obtener noticias de forma segura durante el build
async function getSafeNews(): Promise<NewsItem[]> {
  try {
    // Usar directamente rssNewsService
    console.log('📊 Obteniendo noticias para sitemap...');
    const news = await newsService.getNews();
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
        internalUrl: 'example-news-1',
        slug: 'ejemplo-de-noticia-1'
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
        internalUrl: 'example-news-2',
        slug: 'ejemplo-de-noticia-2'
      }
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('🗺️ Generando sitemap usando sitemap.ts');
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}` : 
    'https://mifinanzas.com';
  
  const formattedBaseUrl = baseUrl.replace(/\/$/, '');

  // Rutas estáticas base
  const baseStaticPaths = [
    '',
    '/blog',
    '/about',
    '/contact',
  ];

  // Generar rutas estáticas para cada idioma
  const staticRoutes = Object.values(SUPPORTED_LANGUAGES).flatMap(lang => {
    return baseStaticPaths.map(path => ({
      url: `${formattedBaseUrl}${lang.path}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    }));
  });

  try {
    // Obtener noticias de forma segura para generar rutas dinámicas
    const news = await getSafeNews();
    
    // Generar rutas para cada noticia en cada idioma
    const newsRoutes = Object.values(SUPPORTED_LANGUAGES).flatMap(lang => 
      news.map((item) => ({
        url: `${formattedBaseUrl}${lang.path}/blog/${item.slug}`,
        lastModified: new Date(item.publishedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    );

    // Categorías base
    const baseCategories = [
      'markets',
      'economy',
      'crypto',
      'technology',
      'companies',
    ];

    // Rutas de categorías para cada idioma
    const categoryRoutes = Object.values(SUPPORTED_LANGUAGES).flatMap(lang =>
      baseCategories.map((category) => ({
        url: `${formattedBaseUrl}${lang.path}/blog/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    );

    console.log(`🗺️ Sitemap generado con ${staticRoutes.length + newsRoutes.length + categoryRoutes.length} URLs`);
    return [...staticRoutes, ...newsRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    // En caso de error, devolver solo las rutas estáticas
    return staticRoutes;
  }
} 