'use client';

import { useEffect, useRef } from 'react';
import { useAdSense } from './blog/AdSenseContext';

export function AdSenseAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const { isScriptLoaded, initializedSlots } = useAdSense();
  const slotId = useRef(`ad-${Math.random().toString(36).substring(2, 15)}`);

  useEffect(() => {
    // Solo intentar inicializar si el script de AdSense está cargado
    if (!isScriptLoaded || !adRef.current) return;
    
    // Evitar inicializar el mismo slot múltiples veces
    if (initializedSlots.has(slotId.current)) return;

    try {
      // Esperar a que el contenedor tenga dimensiones
      const observer = new ResizeObserver(() => {
        try {
          // Solo inicializar si el contenedor tiene dimensiones y no se ha inicializado antes
          if (
            adRef.current?.offsetWidth && 
            adRef.current?.offsetHeight && 
            !initializedSlots.has(slotId.current)
          ) {
            // Marcar este slot como inicializado
            initializedSlots.add(slotId.current);
            
            // Inicializar el anuncio
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            
            // Desconectar el observer después de inicializar
            observer.disconnect();
            console.log('AdSense ad initialized in slot:', slotId.current);
          }
        } catch (err) {
          console.error('Error loading ad:', err);
        }
      });

      observer.observe(adRef.current);

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error('Error setting up ad observer:', error);
    }
  }, [isScriptLoaded, initializedSlots]);

  return (
    <div 
      ref={adRef}
      id={slotId.current}
      className="w-full min-h-[250px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
    >
      {isScriptLoaded ? (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '250px',
            minWidth: '300px'
          }}
          data-ad-client="ca-pub-8473965589607250"
          data-ad-slot="7862229446"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">Cargando anuncio...</div>
      )}
    </div>
  );
} 