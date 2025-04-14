"use client"

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsImage } from './NewsImage';
import { CalendarDays, Clock } from 'lucide-react';
import type { NewsItem } from '@/lib/types/blog';
import { getCountryFlag } from '@/lib/config/countries';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Link from 'next/link';
import { memo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProxiedImage } from '@/components/ui/proxied-image';

dayjs.locale('es');

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard = memo(function NewsCard({ news }: NewsCardProps) {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  
  if (!news) {
    return null;
  }

  // Comprobar si slug está disponible
  const getValidNewsUrl = () => {
    if (!news.slug) {
      console.error('NewsCard: Noticia sin slug', news.title);
      return '/blog';
    }
    
    return `/blog/${news.slug}`;
  };
  
  const newsUrl = getValidNewsUrl();
  const countryFlag = getCountryFlag(news.source.country || 'global');
  
  // Manejar navegación manualmente para mejor control
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push(newsUrl);
  }, [router, newsUrl]);
  
  // Optimizar eventos de hover
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Renderizar imagen con ProxiedImage que maneja fallbacks automáticamente
  const renderImage = () => {
    if (!news.imageUrl) {
      return (
        <div className="relative flex items-center justify-center bg-finance-green-100/60 dark:bg-finance-green-900/20 w-full h-full">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-xs font-medium text-finance-green-800 dark:text-finance-green-200 mb-2">
              {news.category.name}
            </span>
            <h3 className="text-sm font-semibold text-finance-gray-900 dark:text-white line-clamp-2">
              {news.title}
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <ProxiedImage
          src={news.imageUrl}
          alt={news.title}
          fill
          className="object-cover"
          priority={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={65}
        />
      </div>
    );
  };

  return (
    <a 
      href={newsUrl} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`block cursor-pointer ${isHovering ? 'cursor-pointer' : ''}`}
      aria-label={`Ver noticia: ${news.title}`}
    >
      <Card className={`overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full ${isHovering ? 'shadow-lg' : ''}`}>
        <div className="relative aspect-[16/9]">
          {renderImage()}
          <div className="absolute top-2 right-2">
            {news.url === news.source.url && (
              <Badge 
                variant="secondary" 
                className="bg-finance-green-500/90 text-white dark:text-finance-gray-900 flex items-center gap-1"
              >
                <span>{countryFlag}</span>
                <span>{news.source.name}</span>
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className={`font-semibold text-lg line-clamp-2 transition-colors ${isHovering ? 'text-finance-green-600' : ''}`}>
            {news.title}
          </h3>
          <p className="text-finance-gray-600 dark:text-finance-gray-300 text-sm line-clamp-3">
            {news.description}
          </p>
          <div className="flex items-center justify-between pt-2 text-sm text-finance-gray-500 dark:text-finance-gray-400">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{dayjs(news.publishedAt).format('D MMM YYYY')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{news.readTime} min</span>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}); 