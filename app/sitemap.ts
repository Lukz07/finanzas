import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import type { NewsItem } from '@/lib/types/blog';

// Función auxiliar para obtener noticias de forma segura durante el build
async function getSafeNews(): Promise<NewsItem[]> {
  try {
    // Intentar importar el servicio de noticias del servidor
    // Esta importación dinámica asegura que no falle durante el build
    const serverNewsModule = await import('@/lib/server/news-service');
    const ServerNewsService = serverNewsModule.ServerNewsService;
    const newsService = ServerNewsService.getInstance();
    const news = await newsService.getNews();
    return news;
  } catch (error) {
    console.log('Usando noticias de ejemplo para el sitemap en build');
    
    // Durante el build, intentar leer el archivo de noticias prealmacenadas
    try {
      const rawNewsPath = path.join(process.cwd(), 'data', 'raw-news.json');
      if (fs.existsSync(rawNewsPath)) {
        const rawNews = JSON.parse(fs.readFileSync(rawNewsPath, 'utf8')) as NewsItem[];
        return rawNews;
      }
    } catch (fileError) {
      console.log('No se pudo leer raw-news.json:', fileError);
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
        url: 'https://example.com/news-1'
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
        url: 'https://example.com/news-2'
      }
    ];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Usar directamente la URL base desde las variables de entorno
  // Esto funciona tanto en tiempo de ejecución como durante el build
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';
  
  // Rutas estáticas
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
  ];

  // Obtener noticias de forma segura para generar rutas dinámicas
  const news = await getSafeNews();
  
  // Generar rutas para cada noticia
  const newsRoutes = news.map((article: NewsItem) => ({
    url: `${baseUrl}/blog/${article.internalUrl || article.id}`,
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
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes, ...categoryRoutes];
} 