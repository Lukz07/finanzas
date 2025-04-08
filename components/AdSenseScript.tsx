'use client';

import Script from 'next/script';
import { useAdSense } from './blog/AdSenseContext';

export function AdSenseScript() {
  const { setScriptLoaded } = useAdSense();

  return (
    <Script
      id="adsbygoogle-script"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8473965589607250"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        setScriptLoaded(true);
        console.log('AdSense script loaded correctly');
      }}
      onError={(e) => {
        console.error('Error loading AdSense script:', e);
        setScriptLoaded(false);
      }}
    />
  );
} 