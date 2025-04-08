"use client"

import { NewsItem } from '@/lib/types/blog';
import { NewsCardSlider } from './NewsCardSlider';
import { NewsCardSliderSkeleton } from './NewsCardSliderSkeleton';
import { AdCard } from './AdCard';

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

  // Convertir el objeto de fuentes en un array y agregar AdCards
  const sourcesWithAds = Object.entries(newsBySource).reduce((acc, [sourceId, { sourceName, news }], index) => {
    acc.push({ type: 'source', id: sourceId, sourceName, news });
    
    // Insertar AdCard cada 3 fuentes y si es la ultima fuente no insertar nada
    if ((index + 1) % 3 === 0) {
      acc.push({ 
        type: 'ad', 
        id: `ad-${index/2}`, 
        adSlot: `YOUR-AD-SLOT-ID-${index/2}` 
      });
    }
    
    return acc;
  }, [] as Array<{
    type: 'source' | 'ad';
    id: string;
    sourceName?: string;
    news?: NewsItem[];
    adSlot?: string;
  }>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {sourcesWithAds.map((item) => (
        <div key={item.id} className="space-y-2">
          {item.type === 'source' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.sourceName}</h2>
              <NewsCardSlider news={item.news || []} sourceName={item.sourceName || ''} />
            </>
          ) : (
            <AdCard adSlot={item.adSlot || ''} />
          )}
        </div>
      ))}
    </div>
  );
} 