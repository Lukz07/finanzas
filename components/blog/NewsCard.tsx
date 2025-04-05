"use client"

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsImage } from './NewsImage';
import { CalendarDays, Clock, ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import type { NewsItem } from '@/lib/types/blog';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  if (!news) {
    return null;
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <NewsImage
          src={news?.imageUrl || null}
          alt={news?.title || ''}
          title={news?.title || ''}
          category={news?.category?.name || ''}
          className="w-full transition-transform duration-300 group-hover:scale-105"
        />
        <Badge 
          variant={news?.sentiment === 'positive' ? 'default' : news?.sentiment === 'negative' ? 'destructive' : 'secondary'}
          className="absolute top-2 right-2"
        >
          {news?.sentiment === 'positive' ? 'Positivo' : news?.sentiment === 'negative' ? 'Negativo' : 'Neutral'}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {news?.category?.name || 'Sin categoría'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {news?.source?.name || 'Sin fuente'}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold line-clamp-2">
            {news?.title || 'Sin título'}
          </h3>
          <p className="text-sm text-finance-gray-600 dark:text-finance-gray-300 line-clamp-3">
            {news?.description || 'Sin descripción'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-finance-gray-500 dark:text-finance-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {news?.publishedAt ? dayjs(news.publishedAt).format('D MMM, YYYY') : 'Fecha no disponible'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {news?.readTime || 0} min
            </span>
          </div>
          
          {/* {news?.metrics && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {news.metrics.engagement.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {news.metrics.engagement.comments}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                {news.metrics.engagement.saves}
              </span>
            </div>
          )} */}
        </div>
      </div>
    </Card>
  );
} 