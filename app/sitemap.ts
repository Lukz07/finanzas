import { MetadataRoute } from 'next';
import { NewsService } from '@/lib/services/news-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';
  const newsService = NewsService.getInstance();

  // Obtener todas las noticias
  const news = await newsService.getNews();

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

  // Rutas dinámicas basadas en noticias
  const newsRoutes = news.map((item) => ({
    url: `${baseUrl}/blog/${item.id}`,
    lastModified: new Date(item.publishedAt),
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