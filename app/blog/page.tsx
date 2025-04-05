import React from 'react';
import { ServerNewsService } from '@/lib/server/news-service';
import BlogContent from '../../components/blog/BlogContent';
import { metadata } from './metadata';

export { metadata };

const newsService = ServerNewsService.getInstance();

export default async function BlogPage() {
  const initialNews = await newsService.getNews();
  
  return <BlogContent initialNews={initialNews} />;
} 