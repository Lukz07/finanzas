import { Metadata } from 'next';
import { getBaseUrl, createUrl } from '@/lib/config/urls';

export function generateMetadata(): Metadata {
  const baseUrl = getBaseUrl();
  
  return {
    title: 'Blog Financiero | Últimas Noticias del Mercado',
    description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
    keywords: 'finanzas, noticias financieras, mercados, economía, inversiones',
    authors: [{ name: 'Tu Empresa' }],
    creator: 'Tu Empresa',
    publisher: 'Tu Empresa',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'Blog Financiero | Últimas Noticias del Mercado',
      description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
      type: 'website',
      url: `${baseUrl}/blog`,
      siteName: 'Tu Empresa',
      images: [
        {
          url: createUrl('og-image.jpg'),
          width: 1200,
          height: 630,
          alt: 'Blog Financiero'
        }
      ],
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog Financiero | Últimas Noticias del Mercado',
      description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
      images: [createUrl('og-image.jpg')],
      creator: '@tuempresa',
      site: '@tuempresa',
    }
  };
} 