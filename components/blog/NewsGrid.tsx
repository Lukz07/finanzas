"use client"

import { NewsItem } from '@/lib/types/blog';
import { NewsCardSliderSkeleton } from './NewsCardSliderSkeleton';
import { NewsFeed } from './NewsFeed';

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

  // Transformar a formato esperado por NewsFeed
  const sourceNewsMap: Record<string, { sourceName: string; news: NewsItem[] }> = {};
  Object.entries(newsBySource).forEach(([sourceId, { sourceName, news }]) => {
    sourceNewsMap[sourceId] = { sourceName, news };
  });

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

  // Usar la variable de entorno para controlar la variante
  // Valores válidos: 'auto', 'slider', 'static'
  const variant = (process.env.NEXT_PUBLIC_UI_VARIANT || 'auto') as 'auto' | 'slider' | 'static';

  return (
    <div className="w-full">
      {/* Utilizar el componente NewsFeed que implementa A/B testing */}
      <NewsFeed news={sourceNewsMap} variant={variant} />
    </div>
  );
} 