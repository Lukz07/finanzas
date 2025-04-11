import { Metadata } from 'next';
import { newsService } from '@/lib/workers/news-service';
import { NewsSchema } from '@/components/blog/NewsSchema';
import { formatDate } from '@/lib/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import type { NewsItem } from '@/lib/types/blog';
import { BlogPost } from '@/components/blog/BlogPost';

dayjs.locale('es');

// Forzar renderizado dinámico para evitar problemas con la generación estática
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

// Función para sanitizar HTML potencialmente peligroso
function sanitizeHtml(html: string): string {
  // Extraer y mejorar las imágenes para que sean responsivas
  const improvedHtml = html
    // Mejorar las imágenes añadiendo clases para responsividad
    .replace(/<img\s+([^>]*)src="([^"]+)"([^>]*)>/gi, (match, prefix, src, suffix) => {
      // Asegurarse de que la imagen tenga clases para responsividad
      return `<img ${prefix}src="${src}"${suffix} class="max-w-full h-auto rounded-lg shadow-lg">`;
    })
    // Asegurar que los párrafos tengan buen espaciado
    .replace(/<p>/gi, '<p class="mb-4">')
    // Mejorar el estilo de las listas
    .replace(/<ul>/gi, '<ul class="list-disc pl-5 mb-4">')
    .replace(/<ol>/gi, '<ol class="list-decimal pl-5 mb-4">')
    // Evitar que divs o tablas rompan el diseño
    .replace(/<div/gi, '<div style="max-width: 100%; overflow-x: auto;"')
    .replace(/<table/gi, '<div style="max-width: 100%; overflow-x: auto;"><table class="w-full border-collapse"')
    .replace(/<\/table>/gi, '</table></div>');

  return improvedHtml;
}

// Función para obtener datos compartida entre metadata y page
async function getArticleData(slug: string, retryCount = 0, maxRetries = 2): Promise<NewsItem | null> {
  try {
    // Decodificar el slug por si tiene caracteres especiales codificados en la URL
    const decodedSlug = decodeURIComponent(slug);
    console.log(`🔍 Debug - Obteniendo artículo [intento ${retryCount+1}/${maxRetries+1}] - Slug: ${decodedSlug}`);
    
    // Obtener todas las noticias y filtrar por slug
    console.log('🔍 Debug - Obteniendo noticias desde newsService...');
    const allNews = await newsService.getNews();
    const news = allNews.find(item => item.slug === decodedSlug);
    
    if (!news) {
      console.log('❌ No se encontró la noticia');
      if (retryCount < maxRetries) {
        console.log('🔄 Reintentando...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getArticleData(slug, retryCount + 1, maxRetries);
      }
      return null;
    }

    return news;
  } catch (error) {
    console.error('❌ Error al obtener el artículo:', error);
    if (retryCount < maxRetries) {
      console.log('🔄 Reintentando...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getArticleData(slug, retryCount + 1, maxRetries);
    }
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsService.getNews();
  const post = news.find(item => item.slug === slug);

  if (!post) {
    return {
      title: 'Noticia no encontrada',
      description: 'La noticia que buscas no existe'
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.source.name],
      images: post.imageUrl ? [post.imageUrl] : []
    }
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const newsItems: NewsItem[] = await newsService.getNews()
    if (!Array.isArray(newsItems)) {
      console.error('❌ Error: getNews no devolvió un array')
      return []
    }
    return newsItems.map(item => ({
      slug: item.slug
    }))
  } catch (error) {
    console.error('❌ Error al generar parámetros estáticos:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await newsService.getNews();
  const post = news.find(item => item.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
} 