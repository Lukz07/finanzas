import { MetadataRoute } from 'next';
import { GoogleSheetsService } from '@/lib/services/google-sheets-service';

// Configurar el sitemap como dinámico
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Obtener URLs de análisis
  const sheetsService = GoogleSheetsService.getInstance();
  const analysisUrls = await sheetsService.getAnalysisUrls();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
    // Agregar URLs de análisis
    ...analysisUrls.map(item => ({
      url: `${baseUrl}${item.url}`,
      lastModified: new Date(item.lastmod),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
} 