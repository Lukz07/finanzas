import { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/config/urls'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const formattedBaseUrl = baseUrl.replace(/\/$/, '');

  return {
    rules: [
      // Regla general para todos los robots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/auth/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/*?*',
          '/*.json$',
          '/*.js$',
          '/*.css$'
        ],
        crawlDelay: 1
      },
      // Reglas específicas para Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/$',
          '/blog/',
          '/tools/'
        ],
        crawlDelay: 1
      },
      // Reglas para Googlebot-Image
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/images/',
          '/public/images/'
        ]
      },
      // Reglas para Googlebot-Mobile
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/$'
      }
    ],
    sitemap: `${formattedBaseUrl}/sitemap.xml`,
    host: formattedBaseUrl.replace('https://', '')
  }
} 