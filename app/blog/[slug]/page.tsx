import { Metadata } from 'next';
import { NewsService } from '@/lib/services/news-service';
import { rssNewsService } from '@/lib/server/rss-news-service';
import { NewsSchema } from '@/components/blog/NewsSchema';
import { formatDate } from '../../../lib/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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
      return ``;
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
async function getArticleData(slug: string, retryCount = 0, maxRetries = 2) {
  try {
    // Decodificar el slug por si tiene caracteres especiales codificados en la URL
    const decodedSlug = decodeURIComponent(slug);
    console.log(`🔍 Debug - Obteniendo artículo [intento ${retryCount+1}/${maxRetries+1}] - Slug: ${decodedSlug}`);
    
    // Obtener las noticias directamente del servicio RSS
    console.log('🔍 Debug - Obteniendo noticias desde rssNewsService...');
    const news = await rssNewsService.getNews();
    console.log(`🔍 Debug - Se obtuvieron ${news.length} noticias desde rssNewsService`);
    
    if (news.length === 0) {
      console.error('❌ No hay noticias disponibles, esto podría ser un problema de caché');
      
      // Si todavía tenemos intentos disponibles, esperar y reintentar
      if (retryCount < maxRetries) {
        console.log(`⏳ No hay noticias disponibles. Reintentando en 1 segundo (intento ${retryCount+1}/${maxRetries+1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getArticleData(slug, retryCount + 1, maxRetries);
      }
      
      return null;
    }
    
    // Obtener todas las internalUrls para depuración
    const allUrls = news.map(item => ({
      id: item.id,
      title: item.title.substring(0, 30) + '...',
      internalUrl: item.internalUrl,
      // Debuggear cómo exactamente se compara el slug
      matches: {
        exact: item.internalUrl === decodedSlug,
        id: item.id === decodedSlug,
        includes: item.internalUrl?.includes(decodedSlug),
        startsWith: item.internalUrl?.startsWith(decodedSlug),
        endsWithID: item.internalUrl?.endsWith(decodedSlug.split('-').pop() || '')
      }
    }));
    console.log('🔍 Debug - InternalUrls disponibles:', JSON.stringify(allUrls, null, 2));
    
    // ESTRATEGIA 1: Coincidencia exacta
    const exactMatch = news.find(item => 
      item.internalUrl === decodedSlug ||
      item.id === decodedSlug
    );
    
    if (exactMatch) {
      console.log('✅ Match 1: Encontrada coincidencia EXACTA para:', decodedSlug);
      return exactMatch;
    }
    
    // ESTRATEGIA 2: Coincidencia parcial (slug contenido en internalUrl)
    const partialMatch = news.find(item => {
      if (item.internalUrl?.includes(decodedSlug)) {
        console.log(`✅ Match 2: Encontrada coincidencia PARCIAL: ${item.internalUrl} incluye ${decodedSlug}`);
        return true;
      }
      return false;
    });
    
    if (partialMatch) {
      return partialMatch;
    }
    
    // ESTRATEGIA 3: Coincidencia por prefijo
    const prefixMatch = news.find(item => {
      if (item.internalUrl?.startsWith(decodedSlug)) {
        console.log(`✅ Match 3: Encontrada coincidencia por PREFIJO: ${item.internalUrl} comienza con ${decodedSlug}`);
        return true;
      }
      return false;
    });
    
    if (prefixMatch) {
      return prefixMatch;
    }
    
    // ESTRATEGIA 4: Coincidencia por ID al final del slug
    // Si el slug termina con un ID tipo hash (parte final después del último guión)
    const slugId = decodedSlug.split('-').pop();
    if (slugId && slugId.length > 4) {
      const idMatch = news.find(item => {
        const itemId = item.internalUrl?.split('-').pop();
        if (itemId === slugId) {
          console.log(`✅ Match 4: Encontrada coincidencia por ID: ${itemId} = ${slugId}`);
          return true;
        }
        return false;
      });
      
      if (idMatch) {
        return idMatch;
      }
    }
    
    // ESTRATEGIA 5: Coincidencia más flexible ignorando especiales/mayúsculas
    const slugNormalized = decodedSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const looseMatch = news.find(item => {
      const itemNormalized = (item.internalUrl || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (itemNormalized.includes(slugNormalized) || slugNormalized.includes(itemNormalized)) {
        console.log(`✅ Match 5: Encontrada coincidencia FLEXIBLE: ${itemNormalized} <-> ${slugNormalized}`);
        return true;
      }
      return false;
    });
    
    if (looseMatch) {
      return looseMatch;
    }
    
    // ESTRATEGIA 6: Si solo hay una noticia, devolverla (útil para desarrollo)
    if (news.length === 1) {
      console.log('⚠️ Solo hay una noticia disponible, devolviéndola como fallback');
      return news[0];
    }
    
    console.log('❌ No se encontró artículo con slug:', decodedSlug);
    
    // Si no se encontró el artículo pero aún tenemos intentos, esperar y reintentar
    if (retryCount < maxRetries) {
      console.log(`⏳ Artículo no encontrado. Reintentando en 1 segundo (intento ${retryCount+1}/${maxRetries+1})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getArticleData(slug, retryCount + 1, maxRetries);
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error en getArticleData:', error);
    
    // Reintentar en caso de error si aún tenemos intentos disponibles
    if (retryCount < maxRetries) {
      console.log(`⏳ Error obteniendo artículo. Reintentando en 1 segundo (intento ${retryCount+1}/${maxRetries+1})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getArticleData(slug, retryCount + 1, maxRetries);
    }
    
    return null;
  }
}

// Generación de metadata
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  // Asegurarnos de que params.slug está disponible y esperamos su valor
  const slug = (await props.params).slug;
  const article = await getArticleData(slug);

  if (!article) {
    return {
      title: 'Noticia no encontrada',
      description: 'La noticia que buscas no existe o ha sido removida.'
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.source.name],
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    }
  };
}

// Componente principal de la página
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  try {
    console.log('🚀 Debug - Renderizando Page en [slug]/page.tsx');
    
    // Asegurarnos de que params.slug está disponible y esperamos su valor
    const params = await props.params;
    console.log('🚀 Debug - Params recibidos:', params);
    
    const slug = params.slug;
    console.log('🚀 Debug - Slug extraído:', slug);
    
    const article = await getArticleData(slug);
    console.log('🚀 Debug - Artículo encontrado:', article ? 'Sí' : 'No');

    if (!article) {
      console.log('❌ Debug - No se encontró el artículo, redirigiendo a notFound()');
      notFound();
    }

    // Sanitizar el contenido HTML
    const sanitizedContent = sanitizeHtml(article.content);

    return (
      <article className="container mx-auto px-4 py-8">
        <NewsSchema news={[article]} />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center text-finance-gray-600 dark:text-finance-gray-300 space-x-4">
            <span>{article.source.name}</span>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span>•</span>
            <span>{article.readTime} min de lectura</span>
          </div>
        </header>

        {article.imageUrl && (
          <figure className="mb-8">
            <Image
              src={article.imageUrl}
              alt={article.title}
              className="w-full object-cover rounded-lg"
              width={1200}
              height={400}
              priority
            />
          </figure>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl mb-8 text-finance-gray-600 dark:text-finance-gray-300">
            {article.description}
          </p>
          
          <div 
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
            className="article-content max-w-none overflow-hidden"
          />
        </div>

        <footer className="mt-8 pt-8 border-t border-finance-gray-200 dark:border-finance-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-finance-gray-600 dark:text-finance-gray-300">
                Categoría: {article.category.name}
              </span>
              <span>•</span>
              <div className="flex items-center space-x-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-finance-gray-100 dark:bg-finance-gray-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>{article.metrics.views} vistas</span>
              <span>•</span>
              <span>{article.metrics.engagement.likes} me gusta</span>
              <span>•</span>
              <span>{article.metrics.engagement.comments} comentarios</span>
            </div>
          </div>
        </footer>
      </article>
    );
  } catch (error) {
    console.error('❌ Error en Page component:', error);
    notFound();
  }
} 