import { Metadata } from 'next';

// Función para obtener el dominio base de la aplicación
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://mifinanzas.com'; // Dominio de producción por defecto
};

// Función para crear URLs absolutas
const createUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const metadata: Metadata = {
  title: 'Blog Financiero | Últimas Noticias del Mercado',
  description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
  openGraph: {
    title: 'Blog Financiero | Últimas Noticias del Mercado',
    description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
    type: 'website',
    url: createUrl('blog'),
    images: [
      {
        url: createUrl('og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Blog Financiero'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Financiero | Últimas Noticias del Mercado',
    description: 'Mantente informado sobre las últimas noticias financieras, análisis de mercados y tendencias económicas.',
    images: [createUrl('og-image.jpg')]
  }
}; 