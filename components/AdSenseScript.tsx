'use client';

import Script from 'next/script';

export function AdSenseScript() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8473965589607250"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
} 