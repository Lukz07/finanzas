'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { NewsItem } from '@/lib/types/blog';
import { NewsCard } from './NewsCard';
import { usePathname } from 'next/navigation';

interface NewsCardSliderProps {
  news: NewsItem[];
  sourceName: string;
  onItemInteraction?: (newsId: string, action: 'click' | 'view') => void;
}

export function NewsCardSlider({ news, sourceName, onItemInteraction }: NewsCardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const delayRef = useRef(Math.random() * 5000);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Debug: mostrar cantidad de noticias
  console.log(`[Debug Slider] Mostrando ${news.length} noticias para ${sourceName}, índice actual: ${currentIndex}`);

  // Reportar vista cuando cambia el slide actual
  useEffect(() => {
    if (onItemInteraction && news[currentIndex]?.id) {
      onItemInteraction(news[currentIndex].id, 'view');
    }
  }, [currentIndex, news, onItemInteraction]);

  // Simplificar la función para precargar imágenes
  const preloadNextImage = useCallback((nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < news.length) {
      const imageUrl = news[nextIndex]?.imageUrl;
      if (imageUrl && !preloadedImages.has(imageUrl)) {
        const img = new window.Image();
        img.src = imageUrl;
        setPreloadedImages(prev => {
          const newSet = new Set(prev);
          newSet.add(imageUrl);
          return newSet;
        });
      }
    }
  }, [news, preloadedImages]);

  // Detener el slider cuando no es visible
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const sliderElement = document.getElementById(`slider-${sourceName}`);
    if (sliderElement) {
      observer.observe(sliderElement);
    }

    return () => {
      if (sliderElement) {
        observer.unobserve(sliderElement);
      }
    };
  }, [sourceName]);

  // Pausar el slider al interactuar
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Manejar click en el slide actual
  const handleClick = useCallback(() => {
    if (onItemInteraction && news[currentIndex]?.id) {
      onItemInteraction(news[currentIndex].id, 'click');
    }
  }, [currentIndex, news, onItemInteraction]);

  // Iniciar/detener la rotación automática
  useEffect(() => {
    // Limpiar cualquier intervalo anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Si no tenemos suficientes slides, estamos pausados o no somos visibles, no hacer nada
    if (news.length <= 1 || isPaused || !isVisible) return;

    // Iniciar después de un retraso aleatorio para evitar que todos los sliders se muevan simultáneamente
    const initialDelay = setTimeout(() => {
      // Configurar la rotación automática
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % news.length);
      }, 6000);
    }, delayRef.current);

    // Precargar la siguiente imagen
    const nextIndex = (currentIndex + 1) % news.length;
    preloadNextImage(nextIndex);

    // Limpiar al desmontar
    return () => {
      clearTimeout(initialDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [news.length, isPaused, isVisible, currentIndex, preloadNextImage]);

  // Limpiar en cambios de ruta
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pathname]);

  if (news.length === 0) return null;
  
  // Optimizar para mostrar solo lo necesario
  const getVisibleNews = () => {
    if (news.length === 1) {
      return [{ index: 0, news: news[0] }];
    }
    
    if (news.length === 2) {
      return [
        { index: 0, news: news[0] },
        { index: 1, news: news[1] }
      ];
    }
    
    // Mostrar todas las noticias, no solo la actual
    return news.map((item, index) => ({ 
      index, 
      news: item 
    }));
  };

  const visibleNews = getVisibleNews();

  return (
    <>
      {/* Debug info (solo para desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="py-1 px-2 mb-2 bg-gray-100 dark:bg-gray-800 text-xs rounded">
          Slider: {news.length} noticias, índice actual: {currentIndex + 1}/{news.length}
        </div>
      )}

      <div 
        id={`slider-${sourceName}`}
        className="relative w-full aspect-[3/4] overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={slideContainerRef}
        data-variant="slider"
        itemScope
        itemType="https://schema.org/ItemList"
        aria-label={`Noticias en carrusel de ${sourceName}`}
      >
        <meta itemProp="name" content={`Noticias de ${sourceName}`} />
        
        <div 
          className="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out will-change-transform"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          onClick={handleClick}
          role="region"
          aria-label={`Noticias de ${sourceName}`}
        >
          {visibleNews.map(({ index, news: item }) => (
            <div 
              key={`news-${index}-${item.id || String(index)}`} 
              className="absolute w-full h-full"
              style={{ top: `${index * 100}%` }}
              data-news-id={item.id}
              data-index={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(index + 1)} />
              <link itemProp="url" href={`/blog/${item.slug}`} />
              <NewsCard news={item} />
              
              {/* Indicador de posición (solo para desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
                  {index + 1}/{news.length}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Indicadores de posición */}
        {news.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {news.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex 
                    ? 'bg-finance-green-500' 
                    : 'bg-finance-gray-300 dark:bg-finance-gray-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
} 