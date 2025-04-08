import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Usar la misma URL base que en el sitemap.ts
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';
  const formattedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', 
        '/admin/',
      ],
    },
    sitemap: `${formattedBaseUrl}/sitemap.xml`,
  }
} 