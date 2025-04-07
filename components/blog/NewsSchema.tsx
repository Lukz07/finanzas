'use client';

import { NewsItem } from '@/lib/types/blog';

interface NewsSchemaProps {
  news: NewsItem;
}

export function NewsSchema({ news }: NewsSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.description,
    image: news.imageUrl ? [news.imageUrl] : [],
    datePublished: news.publishedAt,
    author: {
      '@type': 'Organization',
      name: news.source.name,
      url: news.source.url
    },
    publisher: {
      '@type': 'Organization',
      name: news.source.name,
      url: news.source.url
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': news.url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 