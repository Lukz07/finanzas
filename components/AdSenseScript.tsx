'use client';

import Script from 'next/script';
import { useAdSense } from './blog/AdSenseContext';
import { useEffect } from 'react';

export function AdSenseScript() {
  const { setScriptLoaded } = useAdSense();

  useEffect(() => {
    // Configuración básica de AdSense
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];

    // Configurar las callbacks de consentimiento
    const fc = ((window as any).googlefc = (window as any).googlefc || {});
    fc.callbackQueue = fc.callbackQueue || [];

    // Variable para controlar la inicialización
    let isInitialized = false;

    function initializeAds(nonPersonalized = false) {
      if (isInitialized) return;
      try {
        (window as any).adsbygoogle.push({
          google_ad_client: 'ca-pub-8473965589607250',
          enable_page_level_ads: true,
          nonPersonalizedAds: nonPersonalized
        });
        isInitialized = true;
        console.log('AdSense inicializado:', nonPersonalized ? 'anuncios no personalizados' : 'anuncios personalizados');
      } catch (error) {
        console.error('Error inicializando AdSense:', error);
      }
    }

    // Configurar callbacks
    fc.callbackQueue.push({
      'LOADED': function() {
        console.log('Datos de consentimiento listos');
      },
      'USER_CONSENT_ACCEPTED': function() {
        console.log('Usuario aceptó el consentimiento - inicializando anuncios personalizados');
        initializeAds(false);
      },
      'USER_CONSENT_DENIED': function() {
        console.log('Usuario rechazó el consentimiento - inicializando anuncios no personalizados');
        initializeAds(true);
      }
    });
  }, []);

  return (
    <Script
      id="adsbygoogle-script"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8473965589607250"
      crossOrigin="anonymous"
      onLoad={() => {
        console.log('Script de AdSense cargado');
        setScriptLoaded(true);
      }}
    />
  );
} 