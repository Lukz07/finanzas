import { NewsItem } from '@/lib/types/blog';
import Script from 'next/script';

interface NewsSchemaProps {
  news: NewsItem | NewsItem[];
}

export function NewsSchema({ news }: NewsSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com';

  const generateNewsSchema = (newsItem: NewsItem) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: newsItem.title,
      description: newsItem.description,
      image: newsItem.imageUrl || `${baseUrl}/default-news-image.jpg`,
      datePublished: newsItem.publishedAt,
      dateModified: newsItem.publishedAt,
      author: {
        '@type': 'Organization',
        name: newsItem.source.name,
        url: newsItem.source.url
      },
      publisher: {
        '@type': 'Organization',
        name: 'Tu Empresa',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${newsItem.slug}`
      },
      articleBody: newsItem.content,
      keywords: newsItem.tags.join(', '),
      articleSection: newsItem.category.name,
      inLanguage: 'es',
      url: newsItem.url
    };
  };

  const schema = Array.isArray(news) 
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: news.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: generateNewsSchema(item)
        }))
      }
    : generateNewsSchema(news);

  return (
    <Script id="news-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  );
} 