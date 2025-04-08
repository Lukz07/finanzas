'use client';

declare global {
  interface Window {
    adsbygoogle: {
      push: (params: any) => void;
    }[] & {
      push: (params: any) => void;
    };
  }
}

import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { useAdSense } from './AdSenseContext';

interface AdCardProps {
  adSlot: string;
}

export function AdCard({ adSlot }: AdCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const { initializedSlots, isScriptLoaded } = useAdSense();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const currentAd = adRef.current;
    
    if (
      typeof window === 'undefined' || 
      !currentAd || 
      !isScriptLoaded ||
      isInitialized ||
      initializedSlots.has(adSlot)
    ) {
      return;
    }

    try {
      // Verificar si el elemento ya tiene un anuncio
      if (currentAd.getAttribute('data-adsbygoogle-status') === 'done') {
        setIsInitialized(true);
        return;
      }

      // Inicializar el anuncio
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedSlots.add(adSlot);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error loading ad:', err);
    }

    return () => {
      // No limpiamos el slot aquí para evitar problemas de re-inicialización
      // initializedSlots.delete(adSlot);
    };
  }, [adSlot, initializedSlots, isScriptLoaded, isInitialized]);

  return (
    <Card className="overflow-hidden h-[400px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', height: '100%' }}
        data-ad-client="ca-pub-8473965589607250"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        ref={adRef}
      />
    </Card>
  );
} 