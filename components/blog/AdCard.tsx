'use client';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { Card } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { useAdSense } from './AdSenseContext';

interface AdCardProps {
  adSlot: string;
}

export function AdCard({ adSlot }: AdCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const { initializedSlots } = useAdSense();

  useEffect(() => {
    const currentAd = adRef.current;
    
    if (typeof window === 'undefined' || !currentAd || initializedSlots.has(adSlot)) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initializedSlots.add(adSlot);
    } catch (err) {
      console.error('Error loading ad:', err);
    }

    return () => {
      initializedSlots.delete(adSlot);
    };
  }, [adSlot, initializedSlots]);

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