'use client';

import Script from 'next/script';
import { useAdSense } from './blog/AdSenseContext';

export function AdSenseScript() {
  const { setScriptLoaded } = useAdSense();

  return (
    <>
      <Script
        id="adsbygoogle-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.adsbygoogle = window.adsbygoogle || [];
          `
        }}
      />
      <Script
        id="adsbygoogle-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8473965589607250"
        crossOrigin="anonymous"
        onLoad={() => {
          setScriptLoaded(true);
          
          // Configurar el manejo del consentimiento
          window.googlefc = window.googlefc || {};
          window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

          window.googlefc.callbackQueue.push({
            'CONSENT_DATA_READY': () => {
              // No necesitamos hacer nada especial aquí
            },
            'USER_CONSENT_ACCEPTED': () => {
              // El usuario aceptó la personalización
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: 'ca-pub-8473965589607250',
                enable_page_level_ads: true,
                nonPersonalizedAds: false
              });
            },
            'USER_CONSENT_DENIED': () => {
              // El usuario rechazó la personalización
              (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: 'ca-pub-8473965589607250',
                enable_page_level_ads: true,
                nonPersonalizedAds: true
              });
            }
          });
        }}
      />
    </>
  );
} 