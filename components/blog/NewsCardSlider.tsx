'use client';

import { useEffect, useState, useRef } from 'react';
import { NewsItem } from '@/lib/types/blog';
import { NewsCard } from './NewsCard';

interface NewsCardSliderProps {
  news: NewsItem[];
  sourceName: string;
}

export function NewsCardSlider({ news, sourceName }: NewsCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const delayRef = useRef(Math.random() * 7000);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Función para precargar la siguiente imagen
  const preloadNextImage = (nextIndex: number) => {
    const imageUrl = news[nextIndex]?.imageUrl;
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      setPreloadedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(imageUrl);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (news.length <= 1) return;

    // Precargar la siguiente imagen
    const nextIndex = (currentIndex + 1) % news.length;
    preloadNextImage(nextIndex);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % news.length;
        // Precargar la siguiente imagen antes de cambiar
        preloadNextImage((newIndex + 1) % news.length);
        return newIndex;
      });
    }, 8500 + delayRef.current);

    return () => clearInterval(interval);
  }, [news.length, currentIndex]);

  if (news.length === 0) return null;

  // Determinar qué noticias mostrar
  const getVisibleNews = () => {
    const visibleIndices = new Set<number>();
    
    // Siempre mostrar la actual
    visibleIndices.add(currentIndex);
    
    // Mostrar la siguiente
    visibleIndices.add((currentIndex + 1) % news.length);
    
    // Mostrar la anterior (para transiciones suaves)
    visibleIndices.add((currentIndex - 1 + news.length) % news.length);

    return Array.from(visibleIndices).map(index => ({
      index,
      news: news[index]
    }));
  };

  const visibleNews = getVisibleNews();

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {visibleNews.map(({ index, news: item }) => (
          <div 
            key={`${item.id}-${item.slug}-${index}`} 
            className="absolute w-full h-full"
            style={{ top: `${index * 100}%` }}
          >
            <NewsCard news={item} />
          </div>
        ))}
      </div>
      {/* {news.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {news.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a noticia ${index + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
} 