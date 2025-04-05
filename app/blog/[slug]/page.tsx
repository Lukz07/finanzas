import { Metadata } from 'next';
import { NewsService } from '@/lib/services/news-service';
import { NewsSchema } from '@/components/blog/NewsSchema';
import { formatDate } from '../../../lib/utils/date';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Función para obtener datos compartida entre metadata y page
async function getArticleData(slug: string) {
  const newsService = NewsService.getInstance();
  const news = await newsService.getNews();
  return news.find(item => item.id === slug);
}

// Generación de metadata
export async function generateMetadata(
  props: { params: any }
): Promise<Metadata> {
  const { params } = props;
  const article = await getArticleData(params.slug);

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
export default async function Page(props: { params: any }) {
  const { params } = props;
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

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
        
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
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