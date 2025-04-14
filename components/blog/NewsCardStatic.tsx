'use client';

import { useRef, useEffect } from 'react';
import { NewsItem } from '@/lib/types/blog';
import { NewsCard } from './NewsCard';

interface NewsCardStaticProps {
  news: NewsItem[];
  sourceName: string;
  onItemInteraction?: (newsId: string, action: 'click' | 'view') => void;
}

export function NewsCardStatic({ news, sourceName, onItemInteraction }: NewsCardStaticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Usar IntersectionObserver para detectar cuando las noticias son visibles
  useEffect(() => {
    if (!containerRef.current || !onItemInteraction) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const newsId = entry.target.getAttribute('data-news-id');
            if (newsId) {
              onItemInteraction(newsId, 'view');
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px' }
    );
    
    // Observar cada card de noticia
    const newsCards = containerRef.current.querySelectorAll('[data-news-id]');
    newsCards.forEach(card => observer.observe(card));
    
    return () => {
      newsCards.forEach(card => observer.unobserve(card));
    };
  }, [news, onItemInteraction]);
  
  // Si no hay noticias, no renderizar nada
  if (news.length === 0) return null;
  
  // Debug: Mostrar en consola la cantidad de noticias
  console.log(`[Debug] Renderizando ${news.length} noticias para ${sourceName}`);
  
  return (
    <>    
      <div 
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full"
        data-source={sourceName}
        data-variant="static"
        itemScope
        itemType="https://schema.org/ItemList"
        aria-label={`Noticias de ${sourceName}`}
        style={{ minHeight: '200px' }}
      >
        <meta itemProp="name" content={`Noticias de ${sourceName}`} />
        {news.map((item, index) => (
          <div 
            key={`static-${sourceName}-${index}-${item.id || ''}`} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            data-news-id={item.id}
            data-index={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            onClick={() => onItemInteraction?.(item.id, 'click')}
          >
            <meta itemProp="position" content={String(index + 1)} />
            <link itemProp="url" href={`/blog/${item.slug}`} />
            <NewsCard news={item} />
          </div>
        ))}
      </div>
    </>
  );
} 