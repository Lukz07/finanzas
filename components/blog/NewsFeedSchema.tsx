'use client';

import { NewsItem } from '@/lib/types/blog';

interface NewsFeedSchemaProps {
  news: {
    [source: string]: {
      sourceName: string;
      news: NewsItem[];
    };
  };
  variant: 'slider' | 'static';
}

export function NewsFeedSchema({ news, variant }: NewsFeedSchemaProps) {
  // Convertir todas las noticias en un array plano
  const allNews = Object.values(news).flatMap(source => source.news);
  
  // Esquema ItemList para SEO
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: allNews.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/blog/${item.slug}`,
      item: {
        '@type': 'NewsArticle',
        headline: item.title,
        description: item.description,
        image: item.imageUrl ? [item.imageUrl] : [],
        datePublished: item.publishedAt,
        author: {
          '@type': 'Organization',
          name: item.source.name,
          url: item.source.url
        },
        publisher: {
          '@type': 'Organization',
          name: item.source.name,
          url: item.source.url
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${process.env.NEXT_PUBLIC_BASE_URL || ''}/blog/${item.slug}`
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 