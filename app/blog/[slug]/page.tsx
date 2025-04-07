import { Metadata } from 'next';
import { newsService } from '@/lib/server/news-service';
import { NewsSchema } from '@/components/blog/NewsSchema';
import { formatDate } from '@/lib/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import type { NewsItem } from '@/lib/types/blog';

dayjs.locale('es');

// Forzar renderizado dinámico para evitar problemas con la generación estática
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidar cada minuto durante desarrollo

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

// Generación de metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const news = await getArticleData(resolvedParams.slug);
  
  if (!news) {
    return {
      title: 'Noticia no encontrada',
      description: 'La noticia solicitada no existe o ha sido eliminada.'
    };
  }

  return {
    title: news.title,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      type: 'article',
      publishedTime: news.publishedAt,
      authors: [news.source.name],
      images: news.imageUrl ? [news.imageUrl] : []
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const news = await getArticleData(resolvedParams.slug);
  
  if (!news) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <NewsSchema news={news} />
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time dateTime={news.publishedAt}>
            {dayjs(news.publishedAt).format('DD/MM/YYYY')}
          </time>
          <span>•</span>
          <span>{news.source.name}</span>
          <span>•</span>
          <span>{news.readTime} min de lectura</span>
        </div>
      </header>

      {news.imageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.content) }} />
      </div>

      <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {news.metrics.views} vistas
            </span>
            <span>•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {news.metrics.engagement.likes} me gusta
            </span>
            <span>•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {news.metrics.engagement.comments} comentarios
            </span>
          </div>
          <div className="flex items-center gap-2">
            {news.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
} 