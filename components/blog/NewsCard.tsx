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

dayjs.locale('es');

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
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
  
  // Imprimir para depurar
  // console.log('🔗 NewsCard - news:', news);

  return (
    <Link href={newsUrl} className="block">
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative aspect-[16/9]">
          <NewsImage
            src={news?.imageUrl || null}
            alt={news.title}
            title={news.title}
            category={news.category.name}
            className="w-full h-full"
          />
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
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-finance-green-600 transition-colors">
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
    </Link>
  );
} 