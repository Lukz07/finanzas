"use client"

import { useState } from 'react';
import { NewsGrid } from '@/components/blog/NewsGrid';
import type { NewsItem } from '@/lib/types/blog';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface BlogContentProps {
  initialNews: NewsItem[];
}

export default function BlogContent({ initialNews }: BlogContentProps) {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [news] = useState<NewsItem[]>(initialNews);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <NewsGrid
        news={news}
        loading={loading}
        error={error || undefined}
      />
    </div>
  );
} 