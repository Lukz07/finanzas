"use client"

import { useState, useEffect } from 'react';
import { NewsGrid } from '@/components/blog/NewsGrid';
import type { NewsItem } from '@/lib/types/blog';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface BlogContentProps {
  initialNews: NewsItem[];
}

export default function BlogContent({ initialNews }: BlogContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>(initialNews);

  useEffect(() => {
    // Simular un pequeño retraso para mostrar el skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full py-8 space-y-8">
      <NewsGrid
        news={news}
        isLoading={isLoading}
      />
    </div>
  );
} 