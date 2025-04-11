import React from 'react';
import BlogContent from '../../components/blog/BlogContent';
import { metadata } from './metadata';
import { newsService } from '@/lib/workers/news-service';

// Indicar a Next.js que esta página debe renderizarse dinámicamente
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

export { metadata };

export default async function BlogPage() {
  const initialNews = await newsService.getNews();
  
  return <BlogContent initialNews={initialNews} />;
} 