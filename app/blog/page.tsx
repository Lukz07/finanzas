import React from 'react';
import { ServerNewsService } from '@/lib/server/news-service';
import BlogContent from '../../components/blog/BlogContent';
import { metadata } from './metadata';
import { rssNewsService } from '@/lib/server/rss-news-service';

// Indicar a Next.js que esta página debe renderizarse dinámicamente
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

export { metadata };

export default async function BlogPage() {
  // Usar directamente rssNewsService para evitar llamadas a la API durante el build
  const initialNews = await rssNewsService.getNews();
  
  return <BlogContent initialNews={initialNews} />;
} 