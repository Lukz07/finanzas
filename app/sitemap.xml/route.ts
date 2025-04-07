import { MetadataRoute } from 'next';
import { NextResponse } from 'next/server';
import { newsService } from '@/lib/server/news-service';
import type { NewsItem } from '@/lib/types/blog';

// Revalidar cada hora
export const revalidate = 3600;

// Función auxiliar para obtener noticias de forma segura
async function getSafeNews(): Promise<NewsItem[]> {
  try {
    const news = await newsService.getNews();
    return news;
  } catch (error) {
    console.error('Error obteniendo noticias para sitemap.xml:', error);
    return [];
  }
}

export async function GET() {
  // Usar directamente la URL base desde las variables de entorno
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';
  
  // Rutas estáticas
  const staticRoutes = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'hourly',
      priority: 0.9,
    },
  ];

  // Obtener noticias de forma segura para generar rutas dinámicas
  const news = await getSafeNews();
  
  // Generar rutas para cada noticia
  const newsRoutes = news.map((article: NewsItem) => ({
    url: `${baseUrl}/blog/${article.internalUrl || article.id}`,
    lastmod: new Date(article.publishedAt || new Date()).toISOString(),
    changefreq: 'daily',
    priority: 0.8,
  }));

  // Rutas de categorías
  // const categoryRoutes = [
  //   'markets',
  //   'economy',
  //   'crypto',
  //   'technology',
  //   'companies',
  // ].map((category) => ({
  //   url: `${baseUrl}/blog/category/${category}`,
  //   lastmod: new Date().toISOString(),
  //   changefreq: 'daily',
  //   priority: 0.7,
  // }));

  // Combinar todas las rutas
  const allRoutes = [...staticRoutes, ...newsRoutes];

  // Generar el XML del sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

  // Retornar el XML con el tipo de contenido correcto
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
} 