'use client';

import { useEffect, useRef } from 'react';

export function AdSenseAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Esperar a que el contenedor tenga dimensiones
    if (!adRef.current) return;

    const observer = new ResizeObserver(() => {
      try {
        // Solo inicializar si el contenedor tiene dimensiones
        if (adRef.current?.offsetWidth && adRef.current?.offsetHeight) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          // Desconectar el observer después de inicializar
          observer.disconnect();
        }
      } catch (err) {
        console.error('Error loading ad:', err);
      }
    });

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={adRef}
      className="w-full min-h-[250px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '250px',
          minWidth: '300px'
        }}
        data-ad-client="ca-pub-8473965589607250"
        data-ad-slot=""
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
} 