import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Rutas de ejemplo para noticias (en lugar de obtenerlas dinámicamente)
  // Esto evita el error de NewsService durante el build
  const newsRoutes = [
    {
      url: `${baseUrl}/blog/example-news-1`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/example-news-2`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }
  ];

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