"use client"

import { NewsItem } from '@/lib/types/blog';
import { NewsCardSlider } from './NewsCardSlider';
import { NewsCardSliderSkeleton } from './NewsCardSliderSkeleton';

interface NewsGridProps {
  news: NewsItem[];
  isLoading?: boolean;
}

export function NewsGrid({ news, isLoading = false }: NewsGridProps) {
  // Agrupar noticias por fuente
  const newsBySource = news.reduce((acc, item) => {
    const sourceId = item.source.id;
    if (!acc[sourceId]) {
      acc[sourceId] = {
        sourceName: item.source.name,
        news: []
      };
    }
    acc[sourceId].news.push(item);
    return acc;
  }, {} as Record<string, { sourceName: string; news: NewsItem[] }>);

  // Si está cargando, mostrar skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 dark:bg-finance-green-900 rounded animate-pulse" />
            <NewsCardSliderSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {Object.entries(newsBySource).map(([sourceId, { sourceName, news }]) => (
        <div key={sourceId} className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{sourceName}</h2>
          <NewsCardSlider news={news} sourceName={sourceName} />
        </div>
      ))}
    </div>
  );
} 