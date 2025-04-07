'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import { NewsItem } from '@/lib/types/blog';
import { NewsSchema } from './NewsSchema';
import { sanitizeHtml } from '@/lib/utils/sanitize';

interface BlogPostProps {
  post: NewsItem;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="container mx-auto px-4 py-8">
      <NewsSchema news={post} />
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <time dateTime={post.publishedAt}>
            {dayjs(post.publishedAt).format('DD/MM/YYYY')}
          </time>
          <span>•</span>
          <span>{post.source.name}</span>
          <span>•</span>
          <span>{post.readTime} min de lectura</span>
        </div>
      </header>

      {post.imageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      </div>

      <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              {post.metrics.views} vistas
            </span>
            <span>•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {post.metrics.engagement.likes} me gusta
            </span>
            <span>•</span>
            <span className="text-gray-600 dark:text-gray-400">
              {post.metrics.engagement.comments} comentarios
            </span>
          </div>
          <div className="flex items-center gap-2">
            {post.tags.map((tag: string) => (
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