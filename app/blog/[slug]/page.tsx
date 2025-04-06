import { Metadata } from 'next';
import { NewsService } from '@/lib/services/news-service';
import { rssNewsService } from '@/lib/server/rss-news-service';
import { NewsSchema } from '@/components/blog/NewsSchema';
import { formatDate } from '../../../lib/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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
async function getArticleData(slug: string) {
  // Decodificar el slug por si tiene caracteres especiales codificados en la URL
  const decodedSlug = decodeURIComponent(slug);
  console.log('Slug original:', slug);
  console.log('Slug decodificado:', decodedSlug);
  
  // Usar el servicio RSS en lugar de NewsService ya que estamos en el servidor
  const news = await rssNewsService.getNews();
  
  // Obtener todas las internalUrls para depuración
  const allUrls = news.map(item => ({
    id: item.id,
    title: item.title,
    internalUrl: item.internalUrl
  }));
  console.log('InternalUrls disponibles:', JSON.stringify(allUrls, null, 2));
  
  // Intentar encontrar la noticia de varias maneras
  const exactMatch = news.find(item => 
    item.internalUrl === decodedSlug ||
    item.id === decodedSlug
  );
  
  // Si no hay coincidencia exacta, buscar si el slug está contenido en alguna internalUrl
  // Esto ayuda en caso de que la URL se haya truncado
  const partialMatch = !exactMatch ? 
    news.find(item => item.internalUrl?.includes(decodedSlug)) : 
    null;
    
  const article = exactMatch || partialMatch;
  
  if (article) {
    console.log('Artículo encontrado:', article.title);
    console.log('Coincidencia:', exactMatch ? 'exacta' : 'parcial');
  } else {
    console.log('No se encontró artículo con slug:', decodedSlug);
  }
  
  return article;
}

// Generación de metadata
export async function generateMetadata(
  props: { params: { slug: string } }
): Promise<Metadata> {
  // Asegurarnos de que params.slug está disponible
  const slug = props.params.slug;
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
export default async function Page(props: { params: { slug: string } }) {
  // Asegurarnos de que params.slug está disponible
  const slug = props.params.slug;
  const article = await getArticleData(slug);

  if (!article) {
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
} 