'use client';

import { useEffect, useState } from 'react';
import { NewsItem } from '@/lib/types/blog';
import { NewsCardSlider } from './NewsCardSlider';
import { NewsCardStatic } from './NewsCardStatic';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import { NewsFeedSchema } from './NewsFeedSchema';

interface NewsFeedProps {
  news: {
    [source: string]: {
      sourceName: string;
      news: NewsItem[];
    };
  };
  variant?: 'slider' | 'static' | 'auto';
}

// Nombres ofuscados para evitar manipulación fácil
const _xVs = 'news_display_variant';
const _uId = 'user_experiment_id';

// Función hash simple para generar variante basada en ID de usuario
const _genVarFromId = (id: string): 'slider' | 'static' => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0 ? 'slider' : 'static';
};

// Función para detectar si el usuario es un bot
const isBot = () => {
  if (typeof window === 'undefined') return false;
  const botPattern = /bot|googlebot|crawler|spider|robot|crawling/i;
  return botPattern.test(navigator.userAgent);
};

export function NewsFeed({ news, variant = 'auto' }: NewsFeedProps) {
  // Estado para controlar la variante del experimento
  const [activeVariant, setActiveVariant] = useState<'slider' | 'static'>(
    variant !== 'auto' ? variant : Math.random() > 0.5 ? 'slider' : 'static'
  );
  
  // Almacenar ID único para el usuario (ofuscado)
  const [userId] = useLocalStorage(_uId, uuidv4());
  
  // Mantener la variante consistente para el mismo usuario
  useEffect(() => {
    // Si es un bot, siempre usar la variante estática para mejor indexación
    if (isBot()) {
      setActiveVariant('static');
      return;
    }
    
    // Si la variante es específica, usarla
    if (variant !== 'auto') {
      setActiveVariant(variant);
      return;
    }
    
    try {
      // Recuperar variante guardada
      const savedVariant = localStorage.getItem(_xVs);
      if (savedVariant === 'slider' || savedVariant === 'static') {
        setActiveVariant(savedVariant);
      } else {
        // Asignar variante basada en el ID de usuario para consistencia
        const newVariant = _genVarFromId(userId);
        setActiveVariant(newVariant);
        localStorage.setItem(_xVs, newVariant);
      }
    } catch (e) {
      // Si hay algún problema, usar una variante determinista
      setActiveVariant('static');
    }
  }, [variant, userId]);

  // Enviar evento de visualización para análisis
  useEffect(() => {
    // Enviar análisis cuando el componente se monta
    if (typeof window !== 'undefined') {
      // Ofuscar datos de tracking
      const _encodeData = (data: any) => {
        // Versión simple de ofuscación, en producción usar algo más robusto
        return btoa(JSON.stringify(data));
      };
      
      const analyticsData = {
        e: 'experiment_view', // event nombre corto
        x: 'news_display', // experiment nombre corto
        v: activeVariant,
        u: userId.substring(0, 8), // Solo usar parte del ID para privacidad
        t: Date.now()
      };
      
      // Enviar a Vercel Analytics
      if (window.va) {
        window.va('event', {
          name: 'exp_view',
          data: _encodeData(analyticsData)
        });
      }
      
      // Alternativa: enviar a un endpoint propio
      fetch('/api/analytics/experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ d: _encodeData(analyticsData) }),
        keepalive: true
      }).catch(() => {}); // Silenciar errores para no exponer problemas
    }
  }, [activeVariant, userId]);

  // Capturar eventos de interacción con las noticias
  const trackInteraction = (source: string, newsId: string, action: 'click' | 'view') => {
    if (typeof window !== 'undefined') {
      // Ofuscar datos de tracking
      const _encodeData = (data: any) => {
        return btoa(JSON.stringify(data));
      };
      
      const analyticsData = {
        e: `news_${action}`,
        x: 'news_display',
        v: activeVariant,
        u: userId.substring(0, 8),
        s: source,
        n: newsId,
        t: Date.now()
      };
      
      // Enviar a Vercel Analytics
      if (window.va) {
        window.va('event', {
          name: `n_${action}`,
          data: _encodeData(analyticsData)
        });
      }
      
      // Enviar a endpoint propio
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ d: _encodeData(analyticsData) }),
        keepalive: true
      }).catch(() => {}); // Silenciar errores
    }
  };

  // Debug: verificar las fuentes y cantidad de noticias
  if (process.env.NODE_ENV === 'development') {
    console.log(`[NewsFeed] Total de fuentes: ${Object.keys(news).length}`);
    console.log(`[NewsFeed] Variante activa: ${activeVariant}`);
    Object.entries(news).forEach(([source, items]) => {
      console.log(`[NewsFeed] Fuente ${source}: ${items.news.length} noticias`);
    });
  }

  // URLs canónicas para todas las noticias en este feed
  const canonicalUrls = Object.entries(news).flatMap(([_, { news: newsItems }]) => 
    newsItems.map(item => ({
      newsId: item.id,
      url: `/blog/${item.slug}`
    }))
  );

  // Renderizar la variante activa
  return (
    <>
      {/* Etiquetas canónicas para ayudar a motores de búsqueda */}
      <Head>
        {canonicalUrls.map(({ newsId, url }) => (
          <link key={newsId} rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}${url}`} />
        ))}
      </Head>

      {/* Agregar schema.org datos estructurados para SEO */}
      <NewsFeedSchema news={news} variant={activeVariant} />

      <div 
        className="space-y-12 my-6"
        data-testid="news-feed"
        data-variant={activeVariant}
      >
        {activeVariant === 'slider' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Object.entries(news).map(([sourceId, { sourceName, news }]) => (
              <div key={sourceId} className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{sourceName}</h2>
                <NewsCardSlider 
                  news={news} 
                  sourceName={sourceName} 
                  onItemInteraction={(newsId, action) => trackInteraction(sourceId, newsId, action)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(news).map(([sourceId, { sourceName, news }]) => (
              <div key={sourceId} className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{sourceName}</h2>
                <NewsCardStatic 
                  news={news} 
                  sourceName={sourceName}
                  onItemInteraction={(newsId, action) => trackInteraction(sourceId, newsId, action)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 