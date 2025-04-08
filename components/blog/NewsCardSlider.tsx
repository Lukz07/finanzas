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
  const delayRef = useRef(Math.random() * 4000); // Delay aleatorio entre 0 y 2 segundos

  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 8500 + delayRef.current); // 4.5s base + delay aleatorio

    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {news.map((item, index) => (
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