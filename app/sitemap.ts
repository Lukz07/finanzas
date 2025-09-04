import { MetadataRoute } from 'next';
import { GoogleSheetsService } from '@/app/api/google-sheets/google-sheets-service';
import { getSafeNews } from '@/lib/workers/news-service';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Obtener URLs de análisis
  const sheetsService = GoogleSheetsService.getInstance();
  const analysisUrls = await sheetsService.getAnalysisUrls();

  // Obtener URLs de noticias
  const news = await getSafeNews();
  const newsUrls = news.map(item => ({
    url: `${baseUrl}/blog/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tools/investment-planner`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/analysis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/stocks-heatmap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guias/inversiones-principiantes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Agregar URLs de análisis
    ...analysisUrls.map(item => ({
      url: `${baseUrl}${item.url}`,
      lastModified: new Date(item.lastmod),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Agregar URLs de noticias
    ...newsUrls,
  ];
} 